"use client";

import { useState } from "react";
import Link from "next/link";
import type { CallOutcome, CallStatus } from "@/generated/prisma";
import {
  callOutcomeLabels,
  callOutcomeStyles,
  callStatusLabels,
  callStatusStyles,
  formatDateTime,
  formatDuration,
  initials,
} from "@/lib/format";

type CallRow = {
  id: string;
  leadId: string;
  startedAt: Date;
  duration: number | null;
  callStatus: CallStatus;
  outcome: CallOutcome | null;
  lead: { customerName: string; phone: string; vehicleInterest: string | null };
};

type Props = {
  calls: CallRow[];
  stats: {
    totalToday: number;
    completedToday: number;
    noAnswerToday: number;
    interestedToday: number;
    completionRate: number;
  };
};

export default function CallHistoryTable({ calls, stats }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Calls");

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.lead.customerName.toLowerCase().includes(search.toLowerCase()) ||
      call.lead.phone.includes(search) ||
      (call.lead.vehicleInterest ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === "All Calls" || call.callStatus === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call History</h1>
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
        <StatCard title="Total Calls" value={String(stats.totalToday)} description="Today" />
        <StatCard
          title="Completed"
          value={String(stats.completedToday)}
          description={`${stats.completionRate}% completion`}
        />
        <StatCard title="No Answer" value={String(stats.noAnswerToday)} description="Today" />
        <StatCard
          title="Interested"
          value={String(stats.interestedToday)}
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
            {Object.entries(callStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calls Table */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">Recent Calls</h2>
          <p className="mt-1 text-sm text-gray-500">Your latest calling activity.</p>
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
                <tr key={call.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
                        {initials(call.lead.customerName)}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {call.lead.customerName}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">{call.lead.phone}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {call.lead.vehicleInterest ?? "—"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDateTime(call.startedAt)}
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {formatDuration(call.duration)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${callStatusStyles[call.callStatus]}`}
                    >
                      {callStatusLabels[call.callStatus]}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {call.outcome ? (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${callOutcomeStyles[call.outcome]}`}
                      >
                        {callOutcomeLabels[call.outcome]}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      href={`/agent/leads/${call.leadId}`}
                      className="text-sm font-medium text-gray-900 hover:underline"
                    >
                      View Lead
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredCalls.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-400">
                    No calls match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">Showing {filteredCalls.length} calls</p>

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
        <h2 className="font-semibold text-gray-900">Call Outcome Guide</h2>

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
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{description}</p>
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
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}>{title}</span>
      <p className="mt-3 text-sm leading-6 text-gray-500">{description}</p>
    </div>
  );
}
