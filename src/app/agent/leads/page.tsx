import { requireAgent } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import AgentLeadsTable from "./AgentLeadsTable";

export default async function AgentLeadsPage() {
  const session = await requireAgent();

  const [user, leads, totalLeads, newLeads, pendingFollowUps] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { region: { select: { name: true } } },
    }),
    prisma.lead.findMany({
      where: { agentId: session.userId },
      orderBy: { updatedAt: "desc" },
      include: {
        callLogs: { orderBy: { startedAt: "desc" }, take: 1, select: { startedAt: true } },
        followUps: {
          where: { status: "PENDING" },
          orderBy: { scheduledAt: "asc" },
          take: 1,
          select: { scheduledAt: true },
        },
      },
    }),
    prisma.lead.count({ where: { agentId: session.userId } }),
    prisma.lead.count({ where: { agentId: session.userId, status: "NEW" } }),
    prisma.followUp.count({ where: { agentId: session.userId, status: "PENDING" } }),
  ]);

  return (
    <AgentLeadsTable
      leads={leads}
      regionName={user?.region?.name ?? "Unassigned"}
      stats={{ total: totalLeads, newLeads, pendingFollowUps }}
    />
  );
}
