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

export async function logCallAndUpdateLead(leadId: string, formData: FormData) {
  const session = await requireAgent();

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead || lead.agentId !== session.userId) {
    throw new Error("You are not authorized to update this lead.");
  }

  const callStatus = String(formData.get("callStatus") ?? "COMPLETED") as CallStatus;
  const status = String(formData.get("status") ?? lead.status) as LeadStatus;
  const notes = String(formData.get("notes") ?? "").trim();
  const durationInput = String(formData.get("duration") ?? "").trim();
  const followUpInput = String(formData.get("followUpAt") ?? "").trim();

  const duration = callStatus === "COMPLETED" ? parseDurationToSeconds(durationInput) : null;
  const outcome = callStatus === "COMPLETED" ? LEAD_STATUS_TO_OUTCOME[status] : null;
  const startedAt = new Date();

  await prisma.$transaction(async (tx) => {
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
