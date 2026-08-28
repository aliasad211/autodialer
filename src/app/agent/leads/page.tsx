import { requireAgent } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/format";
import type { LeadStatus, Prisma } from "@/generated/prisma";
import AgentLeadsTable from "./AgentLeadsTable";

type SearchParams = { q?: string; status?: string; page?: string };

export default async function AgentLeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await requireAgent();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const where: Prisma.LeadWhereInput = { agentId: session.userId };

  if (params.q) {
    where.OR = [
      { customerName: { contains: params.q, mode: "insensitive" } },
      { phone: { contains: params.q } },
      { vehicleInterest: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.status) where.status = params.status as LeadStatus;

  const [user, leads, filteredTotal, totalLeads, newLeads, pendingFollowUps] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { region: { select: { name: true } } },
    }),
    prisma.lead.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
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
    prisma.lead.count({ where }),
    prisma.lead.count({ where: { agentId: session.userId } }),
    prisma.lead.count({ where: { agentId: session.userId, status: "NEW" } }),
    prisma.followUp.count({ where: { agentId: session.userId, status: "PENDING" } }),
  ]);

  return (
    <AgentLeadsTable
      leads={leads}
      regionName={user?.region?.name ?? "Unassigned"}
      pagination={{ page, total: filteredTotal, pageSize: PAGE_SIZE }}
      filters={{ q: params.q ?? "", status: params.status ?? "" }}
      stats={{ total: totalLeads, newLeads, pendingFollowUps }}
    />
  );
}
