import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  return session;
});

export const requireAdmin = cache(async () => {
  const session = await verifySession();

  if (session.role !== "ADMIN") {
    redirect("/agent/dashboard");
  }

  return session;
});

export const requireAgent = cache(async () => {
  const session = await verifySession();

  if (session.role !== "AGENT") {
    redirect("/admin/dashboard");
  }

  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session?.userId) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      regionId: true,
      region: { select: { id: true, name: true } },
    },
  });
});
