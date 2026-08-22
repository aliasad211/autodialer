"use client";

import Link from "next/link";

const recentLeads = [
  {
    id: 1,
    name: "Ahmed Khan",
    phone: "0300-1234567",
    vehicle: "Toyota Aqua",
    status: "Interested",
  },
  {
    id: 2,
    name: "Usman Ali",
    phone: "0312-7654321",
    vehicle: "Toyota Vitz",
    status: "Follow-up",
  },
  {
    id: 3,
    name: "Bilal Ahmed",
    phone: "0333-9876543",
    vehicle: "Honda Vezel",
    status: "New",
  },
  {
    id: 4,
    name: "Hamza Khan",
    phone: "0345-4567890",
    vehicle: "Toyota Prius",
    status: "New",
  },
];

const statusStyles: Record<string, string> = {
  New: "bg-blue-50 text-blue-700",
  Interested: "bg-green-50 text-green-700",
  "Follow-up": "bg-yellow-50 text-yellow-700",
};

export default function AgentDashboard() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good Evening, Ali 👋
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Here&apos;s your calling activity for today.
          </p>
        </div>

        <button className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
          + Import Leads
        </button>
      </div>

      {/* Agent Info */}
      <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">
              Assigned Region
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              Islamabad
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-gray-400">
              Agent Status
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

              <span className="text-sm font-medium text-green-700">
                Online
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-gray-400">
              Today
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              August 22, 2026
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Calls Today
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            42
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Target: 60
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            New Leads
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            28
          </p>

          <p className="mt-1 text-xs text-blue-600">
            Ready to call
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Interested
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            9
          </p>

          <p className="mt-1 text-xs text-green-600">
            Today
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Follow-ups
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            7
          </p>

          <p className="mt-1 text-xs text-yellow-600">
            Need attention
          </p>
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

          <h2 className="mt-4 font-semibold text-gray-900">
            My Leads
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View and manage your assigned leads.
          </p>
        </Link>

        <Link
          href="/agent/import"
          className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-gray-400"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
            📄
          </div>

          <h2 className="mt-4 font-semibold text-gray-900">
            Import Leads
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Import your customer numbers using CSV.
          </p>
        </Link>

        <Link
          href="/agent/calls"
          className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-gray-400"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
            📞
          </div>

          <h2 className="mt-4 font-semibold text-gray-900">
            Call History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View your previous calls and outcomes.
          </p>
        </Link>
      </div>

      {/* Recent Leads */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="font-semibold text-gray-900">
              Recent Leads
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Leads recently assigned or imported by you.
            </p>
          </div>

          <Link
            href="/agent/leads"
            className="text-sm font-medium text-gray-900 hover:underline"
          >
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
              {recentLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {lead.name}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.phone}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.vehicle}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        statusStyles[lead.status]
                      }`}
                    >
                      {lead.status}
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
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Progress */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Daily Call Target
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Keep going! You are almost there.
            </p>
          </div>

          <span className="text-sm font-semibold text-gray-900">
            42 / 60
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gray-900"
            style={{ width: "70%" }}
          />
        </div>

        <p className="mt-2 text-xs text-gray-400">
          70% of your daily target completed
        </p>
      </div>
    </div>
  );
}