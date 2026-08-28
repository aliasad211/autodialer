"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }),
  password: z.string().min(1, { error: "Password is required." }),
});

export type LoginState =
  | {
      error?: string;
    }
  | undefined;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { error: "Enter a valid email and password." };
  }

  const { email, password } = validatedFields.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "Invalid email or password." };
  }

  if (user.status === "INACTIVE") {
    return { error: "This account has been deactivated." };
  }

  const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordsMatch) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    userId: user.id,
    role: user.role,
    name: user.name,
  });

  redirect(user.role === "ADMIN" ? "/admin/dashboard" : "/agent/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
