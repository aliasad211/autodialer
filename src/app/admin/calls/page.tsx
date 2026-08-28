import { prisma } from "@/lib/prisma";
import { PAGE_SIZE, startOfDay } from "@/lib/format";
import type { CallOutcome, Prisma } from "@/generated/prisma";
import CallLogsTable from "./CallLogsTable";

type SearchParams = { q?: string; region?: string; agent?: string; outcome?: string; page?: string };

export default async function CallsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const today = startOfDay(new Date());

  const where: Prisma.CallLogWhereInput = {};

  if (params.q) {
    where.OR = [
      { lead: { customerName: { contains: params.q, mode: "insensitive" } } },
      { lead: { phone: { contains: params.q } } },
      { agent: { name: { contains: params.q, mode: "insensitive" } } },
    ];
  }
  if (params.region) where.lead = { region: { name: params.region } };
  if (params.agent) where.agent = { name: params.agent };
  if (params.outcome) where.outcome = params.outcome as CallOutcome;

  const [calls, filteredTotal, regions, agents, totalCalls, callsToday, interestedToday, avgDurationAgg] =
    await Promise.all([
      prisma.callLog.findMany({
        where,
        orderBy: { startedAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          lead: { select: { customerName: true, phone: true, region: { select: { name: true } } } },
          agent: { select: { name: true } },
        },
      }),
      prisma.callLog.count({ where }),
      prisma.region.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      prisma.user.findMany({
        where: { role: "AGENT" },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.callLog.count(),
      prisma.callLog.count({ where: { startedAt: { gte: today } } }),
      prisma.callLog.count({ where: { startedAt: { gte: today }, outcome: "INTERESTED" } }),
      prisma.callLog.aggregate({ _avg: { duration: true }, where: { duration: { not: null } } }),
    ]);

  return (
    <CallLogsTable
      calls={calls}
      regions={regions}
      agents={agents}
      pagination={{ page, total: filteredTotal, pageSize: PAGE_SIZE }}
      filters={{
        q: params.q ?? "",
        region: params.region ?? "",
        agent: params.agent ?? "",
        outcome: params.outcome ?? "",
      }}
      stats={{
        totalCalls,
        callsToday,
        interestedToday,
        avgDuration: Math.round(avgDurationAgg._avg.duration ?? 0),
      }}
    />
  );
}
