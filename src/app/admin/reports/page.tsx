"use client";

const agents = [
  {
    name: "Ali Khan",
    region: "Islamabad",
    calls: 342,
    interested: 82,
    followUps: 45,
    converted: 18,
    conversion: "5.3%",
  },
  {
    name: "Ahmed Raza",
    region: "Rawalpindi",
    calls: 298,
    interested: 67,
    followUps: 38,
    converted: 15,
    conversion: "5.0%",
  },
  {
    name: "Usman Malik",
    region: "Lahore",
    calls: 421,
    interested: 94,
    followUps: 51,
    converted: 22,
    conversion: "5.2%",
  },
  {
    name: "Hamza Ali",
    region: "Peshawar",
    calls: 256,
    interested: 48,
    followUps: 29,
    converted: 11,
    conversion: "4.3%",
  },
];

export default function ReportsPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track sales activity and agent performance.
          </p>
        </div>

        <select className="rounded-lg border bg-white px-4 py-2.5 text-sm outline-none">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Calls
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            12,480
          </p>

          <p className="mt-1 text-xs text-green-600">
            +14.8% from previous period
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Interested Leads
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            2,184
          </p>

          <p className="mt-1 text-xs text-green-600">
            +9.4% from previous period
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Converted
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            486
          </p>

          <p className="mt-1 text-xs text-green-600">
            +12.2% from previous period
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Conversion Rate
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            3.9%
          </p>

          <p className="mt-1 text-xs text-green-600">
            +0.6% from previous period
          </p>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Call Performance */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Call Performance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Calls made during the selected period.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex h-48 items-end gap-3">
              {[45, 60, 52, 72, 58, 80, 68, 92, 75, 88, 70, 96].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div
                      className="w-full max-w-8 rounded-t-md bg-gray-900"
                      style={{ height: `${height}%` }}
                    />

                    <span className="text-[10px] text-gray-400">
                      {index + 1}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Lead Status */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Lead Status
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current status distribution of leads.
          </p>

          <div className="mt-7 space-y-5">
            <StatusBar
              label="New"
              value="840"
              percentage={65}
            />

            <StatusBar
              label="Interested"
              value="420"
              percentage={42}
            />

            <StatusBar
              label="Follow-up"
              value="315"
              percentage={31}
            />

            <StatusBar
              label="Converted"
              value="128"
              percentage={18}
            />

            <StatusBar
              label="Not Interested"
              value="96"
              percentage={10}
            />
          </div>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">
            Agent Performance
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Compare agent calling and conversion performance.
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
              {agents.map((agent) => (
                <tr
                  key={agent.name}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
                        {agent.name.charAt(0)}
                      </div>

                      <span className="text-sm font-medium text-gray-900">
                        {agent.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {agent.region}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {agent.calls}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {agent.interested}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {agent.followUps}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {agent.converted}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      {agent.conversion}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Region Performance */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">
          Region Performance
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Performance comparison between regions.
        </p>

        <div className="mt-6 space-y-6">
          <RegionBar
            region="Islamabad"
            calls="3,420"
            percentage={82}
          />

          <RegionBar
            region="Lahore"
            calls="4,180"
            percentage={74}
          />

          <RegionBar
            region="Rawalpindi"
            calls="2,860"
            percentage={61}
          />

          <RegionBar
            region="Peshawar"
            calls="2,020"
            percentage={48}
          />
        </div>
      </div>
    </div>
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
        <span className="text-sm text-gray-600">
          {label}
        </span>

        <span className="text-sm font-medium text-gray-900">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gray-900"
          style={{ width: `${percentage}%` }}
        />
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
          <span className="text-sm font-medium text-gray-900">
            {region}
          </span>

          <span className="ml-2 text-xs text-gray-400">
            {calls} calls
          </span>
        </div>

        <span className="text-sm font-medium text-gray-900">
          {percentage}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gray-900"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}