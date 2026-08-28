import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime, formatDuration, initials, startOfDay } from "@/lib/format";
import EditAgentButton from "./EditAgentButton";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const today = startOfDay(new Date());

  const agent = await prisma.user.findUnique({
    where: { id, role: "AGENT" },
    include: {
      region: { select: { name: true } },
      _count: { select: { assignedLeads: true } },
    },
  });

  if (!agent) {
    notFound();
  }

  const regions = await prisma.region.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const [callsToday, interestedLeads, convertedLeads, recentCalls] = await Promise.all([
    prisma.callLog.count({ where: { agentId: id, startedAt: { gte: today } } }),
    prisma.lead.count({ where: { agentId: id, status: "INTERESTED" } }),
    prisma.lead.count({ where: { agentId: id, status: "CONVERTED" } }),
    prisma.callLog.findMany({
      where: { agentId: id },
      orderBy: { startedAt: "desc" },
      take: 8,
      include: { lead: { select: { customerName: true, phone: true } } },
    }),
  ]);

  const totalLeads = agent._count.assignedLeads;
  const interestedRate = callsToday > 0 ? Math.round((interestedLeads / callsToday) * 100) : 0;
  const conversionRate =
    interestedLeads > 0 ? Math.round((convertedLeads / interestedLeads) * 100) : 0;

  return (
    <div className="p-6 lg:p-8">
      {/* Back */}
      <Link href="/admin/agents" className="text-sm font-medium text-gray-500 hover:text-gray-900">
        ← Back to Agents
      </Link>

      {/* Header */}
      <div className="mt-5 flex flex-col gap-5 rounded-xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-700">
            {initials(agent.name)}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>

              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  agent.status === "ACTIVE"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    agent.status === "ACTIVE" ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {agent.status === "ACTIVE" ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">{agent.email}</p>
            <p className="mt-1 text-sm text-gray-500">
              Region: {agent.region?.name ?? "Unassigned"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <EditAgentButton agent={agent} regions={regions} />

          <Link
            href="/admin/leads"
            className="w-fit rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            View Leads
          </Link>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{totalLeads}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Calls Today</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{callsToday}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Interested</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{interestedLeads}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Converted</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{convertedLeads}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Performance */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Performance</h2>
          <p className="mt-1 text-sm text-gray-500">Agent performance overview</p>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">Interested / Calls Today</span>
                <span className="font-medium">
                  {interestedLeads} / {callsToday}
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-gray-900"
                  style={{ width: `${Math.min(100, interestedRate)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">Converted / Interested</span>
                <span className="font-medium">
                  {convertedLeads} / {interestedLeads}
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-gray-900"
                  style={{ width: `${Math.min(100, conversionRate)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Agent Information */}
        <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-semibold text-gray-900">Agent Information</h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{agent.name}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{agent.email}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Region</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {agent.region?.name ?? "Unassigned"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Joined</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(agent.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Current Status</p>
              <p
                className={`mt-1 text-sm font-medium ${
                  agent.status === "ACTIVE" ? "text-green-600" : "text-gray-500"
                }`}
              >
                {agent.status === "ACTIVE" ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Calls */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">Recent Calls</h2>
          <p className="mt-1 text-sm text-gray-500">Latest calls made by this agent</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Phone
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Outcome
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Duration
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Time
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {recentCalls.map((call) => (
                <tr key={call.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {call.lead.customerName}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">{call.lead.phone}</td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {call.outcome ?? call.callStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDuration(call.duration)}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDateTime(call.startedAt)}
                  </td>
                </tr>
              ))}

              {recentCalls.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                    No calls logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
