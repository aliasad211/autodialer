const stats = [
  {
    title: "Total Leads",
    value: "2,450",
    change: "+12.5%",
  },
  {
    title: "Calls Today",
    value: "328",
    change: "+8.2%",
  },
  {
    title: "Interested",
    value: "86",
    change: "+5.4%",
  },
  {
    title: "Converted",
    value: "24",
    change: "+3.1%",
  },
];

const agents = [
  {
    name: "Ali",
    region: "Islamabad",
    calls: 82,
    status: "Available",
  },
  {
    name: "Ahmed",
    region: "Rawalpindi",
    calls: 76,
    status: "On Call",
  },
  {
    name: "Usman",
    region: "Lahore",
    calls: 91,
    status: "Available",
  },
  {
    name: "Hamza",
    region: "Islamabad",
    calls: 64,
    status: "Offline",
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome back. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        <div className="hidden rounded-lg border bg-white px-4 py-2 text-sm text-gray-600 sm:block">
          August 22, 2026
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              {stat.title}
            </p>

            <div className="mt-3 flex items-end justify-between">
              <h2 className="text-3xl font-bold text-gray-900">
                {stat.value}
              </h2>

              <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                {stat.change}
              </span>
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
              <h2 className="font-semibold text-gray-900">
                Call Activity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Calls made during the week
              </p>
            </div>

            <select className="rounded-lg border px-3 py-2 text-sm outline-none">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          {/* Simple chart */}
          <div className="mt-8 flex h-64 items-end justify-between gap-3">
            {[45, 65, 50, 80, 60, 90, 70].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full max-w-12 rounded-t-md bg-gray-900"
                    style={{ height: `${height}%` }}
                  />

                  <span className="text-xs text-gray-400">
                    {
                      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                        index
                      ]
                    }
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Agent Status */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Agent Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current agent activity
              </p>
            </div>

            <span className="text-sm font-medium text-gray-500">
              12 Agents
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700">
                    {agent.name.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {agent.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {agent.region}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {agent.calls} calls
                  </p>

                  <div className="mt-1 flex items-center gap-1">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        agent.status === "Available"
                          ? "bg-green-500"
                          : agent.status === "On Call"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    />

                    <span className="text-xs text-gray-600">
                      {agent.status}
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
          <h2 className="font-semibold text-gray-900">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest activity from your team
          </p>
        </div>

        <div className="divide-y">
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Ali imported 120 leads
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Islamabad region
              </p>
            </div>

            <span className="text-xs text-gray-400">
              2 min ago
            </span>
          </div>

          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Ahmed completed a call
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Customer marked as Interested
              </p>
            </div>

            <span className="text-xs text-gray-400">
              10 min ago
            </span>
          </div>

          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-gray-900">
                New lead converted
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Toyota Aqua inquiry
              </p>
            </div>

            <span className="text-xs text-gray-400">
              25 min ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}