import { notFound } from "next/navigation";
import { requireAgent } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import LeadWorkspace from "./LeadWorkspace";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAgent();
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      region: { select: { name: true } },
      callLogs: { orderBy: { startedAt: "desc" } },
      followUps: {
        where: { status: "PENDING" },
        orderBy: { scheduledAt: "asc" },
      },
    },
  });

  if (!lead || lead.agentId !== session.userId) {
    notFound();
  }

  return <LeadWorkspace lead={lead} agentId={session.userId} />;
}
