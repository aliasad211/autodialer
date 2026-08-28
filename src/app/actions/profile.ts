"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export type ProfileActionState = { error?: string; success?: string } | undefined;

export async function updateProfileName(
  _state: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await verifySession();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return { error: "Name cannot be empty." };
  }

  await prisma.user.update({ where: { id: session.userId }, data: { name } });

  revalidatePath("/agent/profile");
  revalidatePath("/admin/dashboard");
  return { success: "Profile updated." };
}

export async function changePassword(
  _state: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await verifySession();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New password and confirmation do not match." };
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return { error: "User not found." };
  }

  const matches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!matches) {
    return { error: "Current password is incorrect." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return { success: "Password changed successfully." };
}
