import { prisma } from "@/lib/prisma";
import { resolveDateRange, startOfDay } from "@/lib/format";
import PeriodSelect from "./PeriodSelect";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const rangeKey = range ?? "30";
  const { start, end, label } = resolveDateRange(rangeKey);

  const [
    totalCalls,
    interestedCalls,
    convertedCalls,
    leadStatusCounts,
    totalLeads,
    regions,
    agents,
    dailyBuckets,
  ] = await Promise.all([
    prisma.callLog.count({ where: { startedAt: { gte: start, lt: end } } }),
    prisma.callLog.count({
      where: { startedAt: { gte: start, lt: end }, outcome: "INTERESTED" },
    }),
    prisma.callLog.count({
      where: { startedAt: { gte: start, lt: end }, outcome: "CONVERTED" },
    }),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.count(),
    prisma.region.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.user.findMany({
      where: { role: "AGENT" },
      orderBy: { name: "asc" },
      include: { region: { select: { name: true } } },
    }),
    getDailyCallCounts(),
  ]);

  const conversionRate = totalCalls > 0 ? (convertedCalls / totalCalls) * 100 : 0;

  const statusMap = Object.fromEntries(leadStatusCounts.map((s) => [s.status, s._count._all]));
  const statusOrder = ["NEW", "INTERESTED", "FOLLOW_UP", "CONVERTED", "NOT_INTERESTED"] as const;
  const statusLabels: Record<string, string> = {
    NEW: "New",
    INTERESTED: "Interested",
    FOLLOW_UP: "Follow-up",
    CONVERTED: "Converted",
    NOT_INTERESTED: "Not Interested",
  };

  const agentPerformance = await Promise.all(
    agents.map(async (agent) => {
      const [calls, interested, followUps, converted] = await Promise.all([
        prisma.callLog.count({
          where: { agentId: agent.id, startedAt: { gte: start, lt: end } },
        }),
        prisma.callLog.count({
          where: { agentId: agent.id, startedAt: { gte: start, lt: end }, outcome: "INTERESTED" },
        }),
        prisma.followUp.count({
          where: { agentId: agent.id, createdAt: { gte: start, lt: end } },
        }),
        prisma.callLog.count({
          where: { agentId: agent.id, startedAt: { gte: start, lt: end }, outcome: "CONVERTED" },
        }),
      ]);

      return {
        name: agent.name,
        region: agent.region?.name ?? "Unassigned",
        calls,
        interested,
        followUps,
        converted,
        conversion: calls > 0 ? ((converted / calls) * 100).toFixed(1) : "0.0",
      };
    })
  );

  const regionPerformance = await Promise.all(
    regions.map(async (region) => ({
      name: region.name,
      calls: await prisma.callLog.count({
        where: { lead: { regionId: region.id }, startedAt: { gte: start, lt: end } },
      }),
    }))
  );

  const maxRegionCalls = Math.max(1, ...regionPerformance.map((r) => r.calls));
  const maxDailyCalls = Math.max(1, ...dailyBuckets.map((d) => d.count));

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track sales activity and agent performance.
          </p>
        </div>

        <PeriodSelect value={rangeKey} />
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Calls</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{totalCalls}</p>
          <p className="mt-1 text-xs text-gray-400">{label}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Interested Calls</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{interestedCalls}</p>
          <p className="mt-1 text-xs text-gray-400">{label}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Converted</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{convertedCalls}</p>
          <p className="mt-1 text-xs text-gray-400">{label}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
          <p className="mt-1 text-xs text-gray-400">Converted / total calls</p>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Call Performance */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-semibold text-gray-900">Call Performance</h2>
            <p className="mt-1 text-sm text-gray-500">Calls made over the last 14 days.</p>
          </div>

          <div className="mt-8">
            <div className="flex h-48 items-end gap-3">
              {dailyBuckets.map(({ day, count }) => (
                <div
                  key={day.toISOString()}
                  className="flex flex-1 flex-col items-center justify-end gap-2"
                >
                  <div
                    className="w-full max-w-8 rounded-t-md bg-gray-900"
                    style={{ height: `${Math.max(4, (count / maxDailyCalls) * 100)}%` }}
                    title={`${count} calls`}
                  />

                  <span className="text-[10px] text-gray-400">{day.getDate()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Status */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Lead Status</h2>
          <p className="mt-1 text-sm text-gray-500">Current status distribution of leads.</p>

          <div className="mt-7 space-y-5">
            {statusOrder.map((status) => {
              const value = statusMap[status] ?? 0;
              const percentage = totalLeads > 0 ? Math.round((value / totalLeads) * 100) : 0;

              return (
                <StatusBar
                  key={status}
                  label={statusLabels[status]}
                  value={String(value)}
                  percentage={percentage}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">Agent Performance</h2>
          <p className="mt-1 text-sm text-gray-500">
            Compare agent calling and conversion performance for {label.toLowerCase()}.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Agent
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Region
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Calls
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Interested
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Follow-ups
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Converted
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Conversion
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {agentPerformance.map((agent) => (
                <tr key={agent.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
                        {agent.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">{agent.region}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{agent.calls}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{agent.interested}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{agent.followUps}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {agent.converted}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      {agent.conversion}%
                    </span>
                  </td>
                </tr>
              ))}

              {agentPerformance.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-400">
                    No agents yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Region Performance */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">Region Performance</h2>
        <p className="mt-1 text-sm text-gray-500">
          Call volume by region for {label.toLowerCase()}.
        </p>

        <div className="mt-6 space-y-6">
          {regionPerformance.map((region) => (
            <RegionBar
              key={region.name}
              region={region.name}
              calls={region.calls.toLocaleString()}
              percentage={Math.round((region.calls / maxRegionCalls) * 100)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

async function getDailyCallCounts() {
  const today = startOfDay(new Date());

  return Promise.all(
    Array.from({ length: 14 }).map(async (_, index) => {
      const dayStart = new Date(today);
      dayStart.setDate(dayStart.getDate() - (13 - index));
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const count = await prisma.callLog.count({
        where: { startedAt: { gte: dayStart, lt: dayEnd } },
      });

      return { day: dayStart, count };
    })
  );
}

function StatusBar({
  label,
  value,
  percentage,
}: {
  label: string;
  value: string;
  percentage: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-medium text-gray-900">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-gray-900" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function RegionBar({
  region,
  calls,
  percentage,
}: {
  region: string;
  calls: string;
  percentage: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-gray-900">{region}</span>
          <span className="ml-2 text-xs text-gray-400">{calls} calls</span>
        </div>

        <span className="text-sm font-medium text-gray-900">{percentage}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-gray-900" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
