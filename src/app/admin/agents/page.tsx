import { prisma } from "@/lib/prisma";
import { PAGE_SIZE, startOfDay } from "@/lib/format";
import type { Prisma, UserStatus } from "@/generated/prisma";
import AgentsTable from "./AgentsTable";

type SearchParams = { q?: string; region?: string; status?: string; page?: string };

export default async function AgentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const today = startOfDay(new Date());

  const where: Prisma.UserWhereInput = { role: "AGENT" };

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { email: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.region) where.region = { name: params.region };
  if (params.status) where.status = params.status as UserStatus;

  const [agents, filteredTotal, regions, totalAgents, activeAgents] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        region: { select: { name: true } },
        _count: { select: { assignedLeads: true } },
      },
    }),
    prisma.user.count({ where }),
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
      pagination={{ page, total: filteredTotal, pageSize: PAGE_SIZE }}
      filters={{ q: params.q ?? "", region: params.region ?? "", status: params.status ?? "" }}
      stats={{ total: totalAgents, active: activeAgents, inactive: totalAgents - activeAgents }}
    />
  );
}
