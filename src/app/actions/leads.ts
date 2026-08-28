"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAgent } from "@/lib/dal";
import type { CallOutcome, CallStatus, LeadStatus } from "@/generated/prisma";

const LEAD_STATUS_TO_OUTCOME: Record<LeadStatus, CallOutcome> = {
  NEW: "NO_RESPONSE",
  INTERESTED: "INTERESTED",
  FOLLOW_UP: "FOLLOW_UP",
  CONVERTED: "CONVERTED",
  NOT_INTERESTED: "NOT_INTERESTED",
};

function parseDurationToSeconds(value: string) {
  const match = value.trim().match(/^(\d{1,3}):([0-5]?\d)$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

const UNANNOTATED_CALL_WINDOW_MS = 15 * 60 * 1000;

export async function logCallAndUpdateLead(leadId: string, formData: FormData) {
  const session = await requireAgent();

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead || lead.agentId !== session.userId) {
    throw new Error("You are not authorized to update this lead.");
  }

  const status = String(formData.get("status") ?? lead.status) as LeadStatus;
  const notes = String(formData.get("notes") ?? "").trim();
  const followUpInput = String(formData.get("followUpAt") ?? "").trim();

  // If the in-app dialer just logged a call for this lead and it hasn't been
  // annotated yet, attach this outcome to it instead of creating a duplicate.
  const pendingCall = await prisma.callLog.findFirst({
    where: {
      leadId,
      agentId: session.userId,
      outcome: null,
      notes: null,
      startedAt: { gte: new Date(Date.now() - UNANNOTATED_CALL_WINDOW_MS) },
    },
    orderBy: { startedAt: "desc" },
  });

  const callStatus = pendingCall?.callStatus ?? (String(formData.get("callStatus") ?? "COMPLETED") as CallStatus);
  const outcome = callStatus === "COMPLETED" ? LEAD_STATUS_TO_OUTCOME[status] : null;

  await prisma.$transaction(async (tx) => {
    if (pendingCall) {
      await tx.callLog.update({
        where: { id: pendingCall.id },
        data: { outcome, notes: notes || null },
      });
    } else {
      const durationInput = String(formData.get("duration") ?? "").trim();
      const duration = callStatus === "COMPLETED" ? parseDurationToSeconds(durationInput) : null;
      const startedAt = new Date();

      await tx.callLog.create({
        data: {
          leadId,
          agentId: session.userId,
          startedAt,
          endedAt: duration ? new Date(startedAt.getTime() + duration * 1000) : startedAt,
          duration,
          callStatus,
          outcome,
          notes: notes || null,
        },
      });
    }

    await tx.lead.update({
      where: { id: leadId },
      data: { status, notes: notes || lead.notes },
    });

    if (status === "FOLLOW_UP" && followUpInput) {
      await tx.followUp.create({
        data: {
          leadId,
          agentId: session.userId,
          scheduledAt: new Date(followUpInput),
          status: "PENDING",
        },
      });
    }
  });

  revalidatePath(`/agent/leads/${leadId}`);
  revalidatePath("/agent/leads");
  revalidatePath("/agent/dashboard");
  revalidatePath("/agent/call-history");
}

export async function adminUpdateLeadStatus(leadId: string, status: LeadStatus) {
  await requireAdmin();

  await prisma.lead.update({ where: { id: leadId }, data: { status } });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin/dashboard");
}

export type LeadFormState = { error?: string; success?: string } | undefined;

function leadDataFromForm(formData: FormData) {
  const customerName = String(formData.get("customerName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const vehicleInterest = String(formData.get("vehicleInterest") ?? "").trim();
  const regionId = String(formData.get("regionId") ?? "").trim();
  const agentId = String(formData.get("agentId") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  return { customerName, phone, city, vehicleInterest, regionId, agentId, notes };
}

export async function createLead(_state: LeadFormState, formData: FormData): Promise<LeadFormState> {
  await requireAdmin();

  const { customerName, phone, city, vehicleInterest, regionId, agentId, notes } =
    leadDataFromForm(formData);

  if (!customerName || !phone) {
    return { error: "Customer name and phone are required." };
  }

  if (!regionId) {
    return { error: "Select a region for this lead." };
  }

  await prisma.lead.create({
    data: {
      customerName,
      phone,
      city: city || null,
      vehicleInterest: vehicleInterest || null,
      regionId,
      agentId: agentId || null,
      notes: notes || null,
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin/dashboard");
  return { success: "Lead created." };
}

export async function updateLead(
  leadId: string,
  _state: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  await requireAdmin();

  const { customerName, phone, city, vehicleInterest, regionId, agentId, notes } =
    leadDataFromForm(formData);

  if (!customerName || !phone) {
    return { error: "Customer name and phone are required." };
  }

  if (!regionId) {
    return { error: "Select a region for this lead." };
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      customerName,
      phone,
      city: city || null,
      vehicleInterest: vehicleInterest || null,
      regionId,
      agentId: agentId || null,
      notes: notes || null,
    },
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  return { success: "Lead updated." };
}
