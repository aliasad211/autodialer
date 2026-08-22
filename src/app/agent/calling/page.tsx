"use client";

import Link from "next/link";
import { useState } from "react";

const calls = [
  {
    id: 1,
    customer: "Ahmed Khan",
    phone: "0300-1234567",
    vehicle: "Toyota Aqua",
    date: "Today",
    time: "10:42 AM",
    duration: "04:32",
    callStatus: "Completed",
    outcome: "Interested",
  },
  {
    id: 2,
    customer: "Usman Ali",
    phone: "0312-7654321",
    vehicle: "Toyota Vitz",
    date: "Today",
    time: "10:15 AM",
    duration: "02:18",
    callStatus: "Completed",
    outcome: "Follow-up",
  },
  {
    id: 3,
    customer: "Bilal Ahmed",
    phone: "0333-9876543",
    vehicle: "Honda Vezel",
    date: "Today",
    time: "09:50 AM",
    duration: "00:42",
    callStatus: "Completed",
    outcome: "Not Interested",
  },
  {
    id: 4,
    customer: "Hamza Khan",
    phone: "0345-4567890",
    vehicle: "Toyota Prius",
    date: "Today",
    time: "09:25 AM",
    duration: "00:00",
    callStatus: "No Answer",
    outcome: "-",
  },
  {
    id: 5,
    customer: "Saad Ahmed",
    phone: "0301-5556677",
    vehicle: "Toyota Corolla",
    date: "Yesterday",
    time: "04:30 PM",
    duration: "06:12",
    callStatus: "Completed",
    outcome: "Interested",
  },
  {
    id: 6,
    customer: "Fahad Khan",
    phone: "0321-4445566",
    vehicle: "Suzuki Swift",
    date: "Yesterday",
    time: "03:45 PM",
    duration: "00:00",
    callStatus: "Busy",
    outcome: "-",
  },
];

const outcomeStyles: Record<string, string> = {
  Interested: "bg-green-50 text-green-700",
  "Follow-up": "bg-yellow-50 text-yellow-700",
  "Not Interested": "bg-red-50 text-red-700",
  Converted: "bg-purple-50 text-purple-700",
  "-": "bg-gray-100 text-gray-500",
};

const callStatusStyles: Record<string, string> = {
  Completed: "bg-green-50 text-green-700",
  "No Answer": "bg-gray-100 text-gray-600",
  Busy: "bg-yellow-50 text-yellow-700",
  Failed: "bg-red-50 text-red-700",
};

export default function AgentCallsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Calls");

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.customer.toLowerCase().includes(search.toLowerCase()) ||
      call.phone.includes(search) ||
      call.vehicle.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "All Calls" ||
      call.callStatus === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Call History
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your previous customer calls and outcomes.
          </p>
        </div>

        <Link
          href="/agent/leads"
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800"
        >
          Call a Lead
        </Link>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Calls"
          value="42"
          description="Today"
        />

        <StatCard
          title="Completed"
          value="34"
          description="81% completion"
        />

        <StatCard
          title="No Answer"
          value="5"
          description="Today"
        />

        <StatCard
          title="Interested"
          value="9"
          description="Customers"
        />
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <input
            type="text"
            placeholder="Search customer, phone or vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-gray-400"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border px-4 py-2.5 text-sm outline-none"
          >
            <option>All Calls</option>
            <option>Completed</option>
            <option>No Answer</option>
            <option>Busy</option>
            <option>Failed</option>
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
            Your latest calling activity.
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
                  Vehicle
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Date & Time
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Duration
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Call Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Outcome
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
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
                        {call.customer.charAt(0)}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {call.customer}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {call.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Vehicle */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {call.vehicle}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      {call.date}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {call.time}
                    </p>
                  </td>

                  {/* Duration */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {call.duration}
                    </span>
                  </td>

                  {/* Call Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        callStatusStyles[call.callStatus]
                      }`}
                    >
                      {call.callStatus}
                    </span>
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

                  {/* Action */}
                  <td className="px-6 py-4">
                    <Link
                      href={`/agent/leads/${call.id}`}
                      className="text-sm font-medium text-gray-900 hover:underline"
                    >
                      View Lead
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredCalls.length} calls
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

      {/* Call Outcome Guide */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">
          Call Outcome Guide
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OutcomeGuide
            title="Interested"
            description="Customer wants more information or wants to buy."
            className="bg-green-50 text-green-700"
          />

          <OutcomeGuide
            title="Follow-up"
            description="Customer asked you to contact them later."
            className="bg-yellow-50 text-yellow-700"
          />

          <OutcomeGuide
            title="Converted"
            description="Customer completed the purchase."
            className="bg-purple-50 text-purple-700"
          />

          <OutcomeGuide
            title="Not Interested"
            description="Customer is not interested in the vehicle."
            className="bg-red-50 text-red-700"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}

function OutcomeGuide({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}
      >
        {title}
      </span>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}