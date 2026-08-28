import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/format";
import AgentsTable from "./AgentsTable";

export default async function AgentsPage() {
  const today = startOfDay(new Date());

  const [agents, regions, totalAgents, activeAgents] = await Promise.all([
    prisma.user.findMany({
      where: { role: "AGENT" },
      orderBy: { name: "asc" },
      include: {
        region: { select: { name: true } },
        _count: { select: { assignedLeads: true } },
      },
    }),
    prisma.region.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.user.count({ where: { role: "AGENT" } }),
    prisma.user.count({ where: { role: "AGENT", status: "ACTIVE" } }),
  ]);

  const agentsWithCalls = await Promise.all(
    agents.map(async (agent) => ({
      ...agent,
      callsToday: await prisma.callLog.count({
        where: { agentId: agent.id, startedAt: { gte: today } },
      }),
    }))
  );

  return (
    <AgentsTable
      agents={agentsWithCalls}
      regions={regions}
      stats={{ total: totalAgents, active: activeAgents, inactive: totalAgents - activeAgents }}
    />
  );
}
