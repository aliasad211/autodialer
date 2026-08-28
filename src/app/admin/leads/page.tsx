import { prisma } from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/format";
import type { Prisma } from "@/generated/prisma";
import LeadsTable from "./LeadsTable";

type SearchParams = {
  q?: string;
  region?: string;
  agent?: string;
  status?: string;
  page?: string;
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const where: Prisma.LeadWhereInput = {};

  if (params.q) {
    where.OR = [
      { customerName: { contains: params.q, mode: "insensitive" } },
      { phone: { contains: params.q } },
      { vehicleInterest: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.region) where.region = { name: params.region };
  if (params.agent) where.agent = { name: params.agent };
  if (params.status) where.status = params.status as Prisma.EnumLeadStatusFilter["equals"];

  const [
    leads,
    filteredTotal,
    regions,
    agents,
    grandTotal,
    newCount,
    interestedCount,
    followUpCount,
    convertedCount,
  ] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        region: { select: { name: true } },
        agent: { select: { name: true } },
      },
    }),
    prisma.lead.count({ where }),
    prisma.region.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.user.findMany({
      where: { role: "AGENT" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { status: "INTERESTED" } }),
    prisma.lead.count({ where: { status: "FOLLOW_UP" } }),
    prisma.lead.count({ where: { status: "CONVERTED" } }),
  ]);

  return (
    <LeadsTable
      leads={leads}
      regions={regions}
      agents={agents}
      pagination={{ page, total: filteredTotal, pageSize: PAGE_SIZE }}
      filters={{
        q: params.q ?? "",
        region: params.region ?? "",
        agent: params.agent ?? "",
        status: params.status ?? "",
      }}
      stats={{ total: grandTotal, newCount, interestedCount, followUpCount, convertedCount }}
    />
  );
}
