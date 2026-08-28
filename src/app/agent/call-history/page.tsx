import { requireAgent } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PAGE_SIZE, startOfDay } from "@/lib/format";
import type { CallStatus, Prisma } from "@/generated/prisma";
import CallHistoryTable from "./CallHistoryTable";

type SearchParams = { q?: string; status?: string; page?: string };

export default async function AgentCallsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await requireAgent();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const today = startOfDay(new Date());

  const where: Prisma.CallLogWhereInput = { agentId: session.userId };

  if (params.q) {
    where.OR = [
      { lead: { customerName: { contains: params.q, mode: "insensitive" } } },
      { lead: { phone: { contains: params.q } } },
      { lead: { vehicleInterest: { contains: params.q, mode: "insensitive" } } },
    ];
  }
  if (params.status) where.callStatus = params.status as CallStatus;

  const [calls, filteredTotal, totalToday, completedToday, noAnswerToday, interestedToday] =
    await Promise.all([
      prisma.callLog.findMany({
        where,
        orderBy: { startedAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: { lead: { select: { customerName: true, phone: true, vehicleInterest: true } } },
      }),
      prisma.callLog.count({ where }),
      prisma.callLog.count({ where: { agentId: session.userId, startedAt: { gte: today } } }),
      prisma.callLog.count({
        where: { agentId: session.userId, startedAt: { gte: today }, callStatus: "COMPLETED" },
      }),
      prisma.callLog.count({
        where: { agentId: session.userId, startedAt: { gte: today }, callStatus: "NO_ANSWER" },
      }),
      prisma.callLog.count({
        where: { agentId: session.userId, startedAt: { gte: today }, outcome: "INTERESTED" },
      }),
    ]);

  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  return (
    <CallHistoryTable
      calls={calls}
      pagination={{ page, total: filteredTotal, pageSize: PAGE_SIZE }}
      filters={{ q: params.q ?? "", status: params.status ?? "" }}
      stats={{ totalToday, completedToday, noAnswerToday, interestedToday, completionRate }}
    />
  );
}
