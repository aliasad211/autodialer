import Link from "next/link";
import { requireAgent } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { formatDate, leadStatusLabels, leadStatusStyles, startOfDay } from "@/lib/format";

const DAILY_CALL_TARGET = 60;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

async function getAgentDashboard(agentId: string) {
  const today = startOfDay(new Date());

  const [user, callsToday, newLeads, interestedLeads, pendingFollowUps, recentLeads] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: agentId },
        select: { name: true, region: { select: { name: true } } },
      }),
      prisma.callLog.count({ where: { agentId, startedAt: { gte: today } } }),
      prisma.lead.count({ where: { agentId, status: "NEW" } }),
      prisma.lead.count({ where: { agentId, status: "INTERESTED" } }),
      prisma.followUp.count({ where: { agentId, status: "PENDING" } }),
      prisma.lead.findMany({
        where: { agentId },
        orderBy: { updatedAt: "desc" },
        take: 4,
      }),
    ]);

  return { user, callsToday, newLeads, interestedLeads, pendingFollowUps, recentLeads };
}

export default async function AgentDashboard() {
  const session = await requireAgent();
  const data = await getAgentDashboard(session.userId);

  const progress = Math.min(100, Math.round((data.callsToday / DAILY_CALL_TARGET) * 100));

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting()}, {session.name}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Here&apos;s your calling activity for today.
          </p>
        </div>

        <Link
          href="/agent/import"
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800"
        >
          + Import Leads
        </Link>
      </div>

      {/* Agent Info */}
      <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Assigned Region</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {data.user?.region?.name ?? "Unassigned"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Agent Status</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-green-700">Online</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Today</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {formatDate(new Date())}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Calls Today</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{data.callsToday}</p>
          <p className="mt-1 text-xs text-gray-400">Target: {DAILY_CALL_TARGET}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">New Leads</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{data.newLeads}</p>
          <p className="mt-1 text-xs text-blue-600">Ready to call</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Interested</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{data.interestedLeads}</p>
          <p className="mt-1 text-xs text-green-600">Total</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Follow-ups</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{data.pendingFollowUps}</p>
          <p className="mt-1 text-xs text-yellow-600">Need attention</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link
          href="/agent/leads"
          className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-gray-400"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
            👥
          </div>
          <h2 className="mt-4 font-semibold text-gray-900">My Leads</h2>
          <p className="mt-1 text-sm text-gray-500">View and manage your assigned leads.</p>
        </Link>

        <Link
          href="/agent/import"
          className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-gray-400"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
            📄
          </div>
          <h2 className="mt-4 font-semibold text-gray-900">Import Leads</h2>
          <p className="mt-1 text-sm text-gray-500">Import your customer numbers using CSV.</p>
        </Link>

        <Link
          href="/agent/call-history"
          className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-gray-400"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
            📞
          </div>
          <h2 className="mt-4 font-semibold text-gray-900">Call History</h2>
          <p className="mt-1 text-sm text-gray-500">View your previous calls and outcomes.</p>
        </Link>
      </div>

      {/* Recent Leads */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="font-semibold text-gray-900">Recent Leads</h2>
            <p className="mt-1 text-sm text-gray-500">
              Leads recently assigned or imported by you.
            </p>
          </div>

          <Link href="/agent/leads" className="text-sm font-medium text-gray-900 hover:underline">
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Phone
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {data.recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{lead.customerName}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lead.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.vehicleInterest ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${leadStatusStyles[lead.status]}`}
                    >
                      {leadStatusLabels[lead.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/agent/leads/${lead.id}`}
                      className="text-sm font-medium text-gray-900 hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}

              {data.recentLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                    No leads assigned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Progress */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Daily Call Target</h2>
            <p className="mt-1 text-sm text-gray-500">Keep going! You are almost there.</p>
          </div>

          <span className="text-sm font-semibold text-gray-900">
            {data.callsToday} / {DAILY_CALL_TARGET}
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-gray-900" style={{ width: `${progress}%` }} />
        </div>

        <p className="mt-2 text-xs text-gray-400">
          {progress}% of your daily target completed
        </p>
      </div>
    </div>
  );
}
