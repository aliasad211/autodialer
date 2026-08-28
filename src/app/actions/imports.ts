"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAgent } from "@/lib/dal";

export type ImportRow = {
  name: string;
  phone: string;
  city?: string;
  vehicle?: string;
  notes?: string;
};

export type ImportResult = { imported: number; skipped: number; error?: string };

export async function importLeads(rows: ImportRow[]): Promise<ImportResult> {
  const session = await requireAgent();

  const agent = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { regionId: true },
  });

  if (!agent?.regionId) {
    return { imported: 0, skipped: 0, error: "You must be assigned to a region before importing leads." };
  }

  const validRows = rows.filter((row) => row.name?.trim() && row.phone?.trim());

  if (validRows.length === 0) {
    return { imported: 0, skipped: 0, error: "No valid rows found in the file." };
  }

  const phones = validRows.map((row) => row.phone.trim());
  const existing = await prisma.lead.findMany({
    where: { phone: { in: phones } },
    select: { phone: true },
  });
  const existingPhones = new Set(existing.map((l) => l.phone));

  const toCreate = validRows.filter((row) => !existingPhones.has(row.phone.trim()));
  const seen = new Set<string>();
  const deduped = toCreate.filter((row) => {
    const phone = row.phone.trim();
    if (seen.has(phone)) return false;
    seen.add(phone);
    return true;
  });

  if (deduped.length > 0) {
    await prisma.lead.createMany({
      data: deduped.map((row) => ({
        customerName: row.name.trim(),
        phone: row.phone.trim(),
        city: row.city?.trim() || null,
        vehicleInterest: row.vehicle?.trim() || null,
        notes: row.notes?.trim() || null,
        regionId: agent.regionId!,
        agentId: session.userId,
        createdById: session.userId,
      })),
    });
  }

  revalidatePath("/agent/leads");
  revalidatePath("/agent/dashboard");
  revalidatePath("/agent/import");

  return { imported: deduped.length, skipped: validRows.length - deduped.length };
}
