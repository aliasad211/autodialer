import { prisma } from "@/lib/prisma";
import LeadsTable from "./LeadsTable";

export default async function LeadsPage() {
  const [leads, regions, agents, total, newCount, interestedCount, followUpCount, convertedCount] =
    await Promise.all([
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          region: { select: { name: true } },
          agent: { select: { name: true } },
        },
      }),
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
      stats={{ total, newCount, interestedCount, followUpCount, convertedCount }}
    />
  );
}
