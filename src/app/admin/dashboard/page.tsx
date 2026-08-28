import { prisma } from "@/lib/prisma";
import { formatDate, formatDayLabel, initials, startOfDay } from "@/lib/format";

async function getDashboardData() {
  const today = startOfDay(new Date());

  const [
    totalLeads,
    callsToday,
    interestedLeads,
    convertedLeads,
    agents,
    recentLeads,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.callLog.count({ where: { startedAt: { gte: today } } }),
    prisma.lead.count({ where: { status: "INTERESTED" } }),
    prisma.lead.count({ where: { status: "CONVERTED" } }),
    prisma.user.findMany({
      where: { role: "AGENT" },
      include: { region: true },
      orderBy: { name: "asc" },
      take: 6,
    }),
    prisma.lead.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { region: true, agent: { select: { name: true } } },
    }),
  ]);

  const agentsWithCallCounts = await Promise.all(
    agents.map(async (agent) => ({
      ...agent,
      callsToday: await prisma.callLog.count({
        where: { agentId: agent.id, startedAt: { gte: today } },
      }),
    }))
  );

  const weekActivity = await Promise.all(
    Array.from({ length: 7 }).map(async (_, index) => {
      const dayStart = new Date(today);
      dayStart.setDate(dayStart.getDate() - (6 - index));
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const count = await prisma.callLog.count({
        where: { startedAt: { gte: dayStart, lt: dayEnd } },
      });

      return { day: dayStart, count };
    })
  );

  const totalAgents = await prisma.user.count({ where: { role: "AGENT" } });

  return {
    totalLeads,
    callsToday,
    interestedLeads,
    convertedLeads,
    agents: agentsWithCallCounts,
    recentLeads,
    weekActivity,
    totalAgents,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const stats = [
    { title: "Total Leads", value: data.totalLeads.toLocaleString() },
    { title: "Calls Today", value: data.callsToday.toLocaleString() },
    { title: "Interested", value: data.interestedLeads.toLocaleString() },
    { title: "Converted", value: data.convertedLeads.toLocaleString() },
  ];

  const maxCalls = Math.max(1, ...data.weekActivity.map((d) => d.count));

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome back. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        <div className="hidden rounded-lg border bg-white px-4 py-2 text-sm text-gray-600 sm:block">
          {formatDate(new Date())}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>

            <div className="mt-3 flex items-end justify-between">
              <h2 className="text-3xl font-bold text-gray-900">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Call Activity */}
        <div className="rounded-xl border bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Call Activity</h2>

              <p className="mt-1 text-sm text-gray-500">Calls made during the week</p>
            </div>
          </div>

          <div className="mt-8 flex h-64 items-end justify-between gap-3">
            {data.weekActivity.map(({ day, count }) => (
              <div key={day.toISOString()} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full max-w-12 rounded-t-md bg-gray-900"
                  style={{ height: `${Math.max(4, (count / maxCalls) * 100)}%` }}
                  title={`${count} calls`}
                />

                <span className="text-xs text-gray-400">
                  {new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(day)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Status */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Agent Status</h2>

              <p className="mt-1 text-sm text-gray-500">Current agent activity</p>
            </div>

            <span className="text-sm font-medium text-gray-500">
              {data.totalAgents} Agents
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {data.agents.length === 0 && (
              <p className="text-sm text-gray-400">No agents yet.</p>
            )}

            {data.agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700">
                    {initials(agent.name)}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">{agent.name}</p>

                    <p className="text-xs text-gray-500">
                      {agent.region?.name ?? "Unassigned"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">{agent.callsToday} calls</p>

                  <div className="mt-1 flex items-center gap-1">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        agent.status === "ACTIVE" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />

                    <span className="text-xs text-gray-600">
                      {agent.status === "ACTIVE" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">Recent Activity</h2>

          <p className="mt-1 text-sm text-gray-500">Latest leads across your team</p>
        </div>

        <div className="divide-y">
          {data.recentLeads.length === 0 && (
            <p className="p-5 text-sm text-gray-400">No recent activity yet.</p>
          )}

          {data.recentLeads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {lead.customerName}
                  {lead.agent ? ` — ${lead.agent.name}` : ""}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {lead.region.name} · {leadStatusLabel(lead.status)}
                </p>
              </div>

              <span className="text-xs text-gray-400">
                {formatDayLabel(lead.updatedAt)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function leadStatusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
