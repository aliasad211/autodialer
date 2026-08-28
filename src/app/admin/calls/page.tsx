import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/format";
import CallLogsTable from "./CallLogsTable";

export default async function CallsPage() {
  const today = startOfDay(new Date());

  const [calls, regions, agents, totalCalls, callsToday, interestedToday, avgDurationAgg] =
    await Promise.all([
      prisma.callLog.findMany({
        orderBy: { startedAt: "desc" },
        take: 150,
        include: {
          lead: { select: { customerName: true, phone: true, region: { select: { name: true } } } },
          agent: { select: { name: true } },
        },
      }),
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
      stats={{
        totalCalls,
        callsToday,
        interestedToday,
        avgDuration: Math.round(avgDurationAgg._avg.duration ?? 0),
      }}
    />
  );
}
