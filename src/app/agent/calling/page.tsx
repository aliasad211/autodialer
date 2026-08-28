import Link from "next/link";
import { requireAgent } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { initials } from "@/lib/format";

export default async function CallingQueuePage() {
  const session = await requireAgent();

  const [queue, pendingFollowUps] = await Promise.all([
    prisma.lead.findMany({
      where: { agentId: session.userId, status: "NEW" },
      orderBy: { createdAt: "asc" },
      take: 20,
    }),
    prisma.followUp.findMany({
      where: { agentId: session.userId, status: "PENDING" },
      orderBy: { scheduledAt: "asc" },
      take: 10,
      include: { lead: { select: { id: true, customerName: true, phone: true } } },
    }),
  ]);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Call Queue</h1>
        <p className="mt-1 text-sm text-gray-500">
          New leads waiting to be called and upcoming follow-ups.
        </p>
      </div>

      {/* New Leads Queue */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="font-semibold text-gray-900">Next Up</h2>
            <p className="mt-1 text-sm text-gray-500">
              New leads assigned to you, oldest first.
            </p>
          </div>

          <span className="text-sm font-medium text-gray-500">{queue.length} waiting</span>
        </div>

        <div className="divide-y">
          {queue.map((lead) => (
            <div
              key={lead.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700">
                  {initials(lead.customerName)}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">{lead.customerName}</p>
                  <p className="text-xs text-gray-500">
                    {lead.phone} · {lead.city ?? "—"}
                    {lead.vehicleInterest ? ` · ${lead.vehicleInterest}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`tel:${lead.phone}`}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  📞 Call
                </a>

                <Link
                  href={`/agent/leads/${lead.id}`}
                  className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Open
                </Link>
              </div>
            </div>
          ))}

          {queue.length === 0 && (
            <p className="p-6 text-sm text-gray-400">
              No new leads waiting. Check{" "}
              <Link href="/agent/leads" className="underline">
                My Leads
              </Link>{" "}
              for the full list.
            </p>
          )}
        </div>
      </div>

      {/* Upcoming Follow-ups */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">Upcoming Follow-ups</h2>
          <p className="mt-1 text-sm text-gray-500">Leads you scheduled to call back.</p>
        </div>

        <div className="divide-y">
          {pendingFollowUps.map((followUp) => (
            <div
              key={followUp.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {followUp.lead.customerName}
                </p>
                <p className="text-xs text-gray-500">
                  {followUp.lead.phone} · Scheduled{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(followUp.scheduledAt)}
                </p>
              </div>

              <Link
                href={`/agent/leads/${followUp.lead.id}`}
                className="w-fit rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Open
              </Link>
            </div>
          ))}

          {pendingFollowUps.length === 0 && (
            <p className="p-6 text-sm text-gray-400">No pending follow-ups.</p>
          )}
        </div>
      </div>
    </div>
  );
}
