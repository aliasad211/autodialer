import { requireAgent } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/format";
import CallHistoryTable from "./CallHistoryTable";

export default async function AgentCallsPage() {
  const session = await requireAgent();
  const today = startOfDay(new Date());

  const [calls, totalToday, completedToday, noAnswerToday, interestedToday] = await Promise.all([
    prisma.callLog.findMany({
      where: { agentId: session.userId },
      orderBy: { startedAt: "desc" },
      take: 100,
      include: { lead: { select: { customerName: true, phone: true, vehicleInterest: true } } },
    }),
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
      stats={{ totalToday, completedToday, noAnswerToday, interestedToday, completionRate }}
    />
  );
}
