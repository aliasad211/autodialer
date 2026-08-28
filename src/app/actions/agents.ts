"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import type { UserStatus } from "@/generated/prisma";

export type AgentFormState = { error?: string; success?: string } | undefined;

export async function createAgent(
  _state: AgentFormState,
  formData: FormData
): Promise<AgentFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const regionId = String(formData.get("regionId") ?? "").trim();

  if (!name || !email) {
    return { error: "Name and email are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "AGENT",
      regionId: regionId || null,
    },
  });

  revalidatePath("/admin/agents");
  revalidatePath("/admin/dashboard");
  return { success: "Agent created." };
}

export async function updateAgent(
  agentId: string,
  _state: AgentFormState,
  formData: FormData
): Promise<AgentFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const regionId = String(formData.get("regionId") ?? "").trim();
  const status = String(formData.get("status") ?? "ACTIVE") as UserStatus;

  if (!name || !email) {
    return { error: "Name and email are required." };
  }

  const existing = await prisma.user.findFirst({
    where: { email, NOT: { id: agentId } },
  });
  if (existing) {
    return { error: "Another account already uses this email." };
  }

  await prisma.user.update({
    where: { id: agentId },
    data: { name, email, regionId: regionId || null, status },
  });

  revalidatePath(`/admin/agents/${agentId}`);
  revalidatePath("/admin/agents");
  revalidatePath("/admin/dashboard");
  return { success: "Agent updated." };
}
