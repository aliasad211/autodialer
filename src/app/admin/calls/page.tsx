"use client";

import { useState } from "react";

const calls = [
  {
    id: 1,
    customer: "Ahmed Khan",
    phone: "0300-1234567",
    agent: "Ali Khan",
    region: "Islamabad",
    duration: "04:32",
    outcome: "Interested",
    time: "10:42 AM",
    date: "Today",
  },
  {
    id: 2,
    customer: "Usman Ali",
    phone: "0312-7654321",
    agent: "Ahmed Raza",
    region: "Rawalpindi",
    duration: "03:18",
    outcome: "Follow-up",
    time: "10:15 AM",
    date: "Today",
  },
  {
    id: 3,
    customer: "Bilal Ahmed",
    phone: "0333-9876543",
    agent: "Usman Malik",
    region: "Lahore",
    duration: "00:12",
    outcome: "No Answer",
    time: "09:50 AM",
    date: "Today",
  },
  {
    id: 4,
    customer: "Hamza Khan",
    phone: "0345-4567890",
    agent: "Ali Khan",
    region: "Islamabad",
    duration: "05:06",
    outcome: "Converted",
    time: "09:25 AM",
    date: "Today",
  },
  {
    id: 5,
    customer: "Saad Ahmed",
    phone: "0301-5556677",
    agent: "Hamza Ali",
    region: "Peshawar",
    duration: "01:45",
    outcome: "Not Interested",
    time: "04:30 PM",
    date: "Yesterday",
  },
  {
    id: 6,
    customer: "Fahad Khan",
    phone: "0321-4445566",
    agent: "Usman Malik",
    region: "Lahore",
    duration: "03:52",
    outcome: "Interested",
    time: "03:55 PM",
    date: "Yesterday",
  },
];

const outcomeStyles: Record<string, string> = {
  Interested: "bg-green-50 text-green-700",
  "Follow-up": "bg-yellow-50 text-yellow-700",
  Converted: "bg-purple-50 text-purple-700",
  "Not Interested": "bg-red-50 text-red-700",
  "No Answer": "bg-gray-100 text-gray-600",
};

export default function CallsPage() {
  const [search, setSearch] = useState("");

  const filteredCalls = calls.filter(
    (call) =>
      call.customer.toLowerCase().includes(search.toLowerCase()) ||
      call.phone.includes(search) ||
      call.agent.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Call Logs
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor all calls made by your agents.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Calls
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            8,420
          </p>

          <p className="mt-1 text-xs text-green-600">
            +12.4% this month
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Calls Today
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            328
          </p>

          <p className="mt-1 text-xs text-green-600">
            +8.2% today
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Interested
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            86
          </p>

          <p className="mt-1 text-xs text-gray-500">
            From today&apos;s calls
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Avg. Duration
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            03:42
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Per call
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-xl border bg-white p-4">
        <div className="flex flex-col gap-3 xl:flex-row">
          <input
            type="text"
            placeholder="Search customer, phone or agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-gray-400"
          />

          <select className="rounded-lg border px-4 py-2.5 text-sm outline-none">
            <option>All Regions</option>
            <option>Islamabad</option>
            <option>Rawalpindi</option>
            <option>Lahore</option>
            <option>Peshawar</option>
          </select>

          <select className="rounded-lg border px-4 py-2.5 text-sm outline-none">
            <option>All Agents</option>
            <option>Ali Khan</option>
            <option>Ahmed Raza</option>
            <option>Usman Malik</option>
            <option>Hamza Ali</option>
          </select>

          <select className="rounded-lg border px-4 py-2.5 text-sm outline-none">
            <option>All Outcomes</option>
            <option>Interested</option>
            <option>Follow-up</option>
            <option>Converted</option>
            <option>Not Interested</option>
            <option>No Answer</option>
          </select>

          <select className="rounded-lg border px-4 py-2.5 text-sm outline-none">
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Calls Table */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">
            Recent Calls
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Complete record of recent calls.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Agent
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Region
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Duration
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Outcome
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Date / Time
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredCalls.map((call) => (
                <tr
                  key={call.id}
                  className="hover:bg-gray-50"
                >
                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {call.customer}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {call.phone}
                      </p>
                    </div>
                  </td>

                  {/* Agent */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {call.agent}
                  </td>

                  {/* Region */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {call.region}
                  </td>

                  {/* Duration */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {call.duration}
                  </td>

                  {/* Outcome */}
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        outcomeStyles[call.outcome]
                      }`}
                    >
                      {call.outcome}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {call.date}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {call.time}
                    </p>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <button className="text-sm font-medium text-gray-900 hover:underline">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing 1–6 of 8,420 calls
          </p>

          <div className="flex gap-2">
            <button className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
              Previous
            </button>

            <button className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}