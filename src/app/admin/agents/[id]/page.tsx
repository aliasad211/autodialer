"use client";

import Link from "next/link";

const calls = [
  {
    customer: "Ahmed Khan",
    phone: "0300-1234567",
    outcome: "Interested",
    duration: "04:32",
    time: "10:42 AM",
  },
  {
    customer: "Usman Ali",
    phone: "0312-7654321",
    outcome: "Follow-up",
    duration: "03:18",
    time: "10:15 AM",
  },
  {
    customer: "Bilal Ahmed",
    phone: "0333-9876543",
    outcome: "No Answer",
    duration: "00:12",
    time: "09:50 AM",
  },
  {
    customer: "Hamza Khan",
    phone: "0345-4567890",
    outcome: "Interested",
    duration: "05:06",
    time: "09:25 AM",
  },
];

export default function AgentDetailPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Back */}
      <Link
        href="/admin/agents"
        className="text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        ← Back to Agents
      </Link>

      {/* Header */}
      <div className="mt-5 flex flex-col gap-5 rounded-xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-700">
            A
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Ali Khan
              </h1>

              <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Available
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              ali@example.com
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Region: Islamabad
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Edit Agent
          </button>

          <button className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
            View Leads
          </button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            245
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Calls Today</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            82
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Interested</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            18
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Converted</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            6
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Performance */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Performance
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Agent performance overview
          </p>

          <div className="mt-6 space-y-5">
            {/* Calls */}
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">
                  Calls
                </span>

                <span className="font-medium">
                  82 / 100
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-gray-900"
                  style={{ width: "82%" }}
                />
              </div>
            </div>

            {/* Interested */}
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">
                  Interested
                </span>

                <span className="font-medium">
                  18 / 82
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-gray-900"
                  style={{ width: "22%" }}
                />
              </div>
            </div>

            {/* Conversion */}
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">
                  Conversion
                </span>

                <span className="font-medium">
                  6 / 18
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-gray-900"
                  style={{ width: "33%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Agent Information */}
        <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-semibold text-gray-900">
            Agent Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500">
                Full Name
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                Ali Khan
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Email
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                ali@example.com
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Region
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                Islamabad
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Joined
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                August 10, 2026
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Phone
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                0300-1112233
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Current Status
              </p>

              <p className="mt-1 text-sm font-medium text-green-600">
                Available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Calls */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">
            Recent Calls
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest calls made by this agent
          </p>
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
              {calls.map((call) => (
                <tr
                  key={call.phone}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {call.customer}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {call.phone}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        call.outcome === "Interested"
                          ? "bg-green-50 text-green-700"
                          : call.outcome === "Follow-up"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {call.outcome}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {call.duration}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {call.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}