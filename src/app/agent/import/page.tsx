import { requireAgent } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import ImportForm from "./ImportForm";

export default async function ImportLeadsPage() {
  const session = await requireAgent();

  const [user, recentLeads] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { region: { select: { name: true } } },
    }),
    prisma.lead.findMany({
      where: { createdById: session.userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, customerName: true, phone: true, createdAt: true },
    }),
  ]);

  return <ImportForm regionName={user?.region?.name ?? "Unassigned"} recentLeads={recentLeads} />;
}
