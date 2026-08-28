"use client";

import { useState } from "react";
import type { CallOutcome, CallStatus } from "@/generated/prisma";
import {
  callOutcomeLabels,
  callOutcomeStyles,
  formatDateTime,
  formatDuration,
} from "@/lib/format";

type CallRow = {
  id: string;
  startedAt: Date;
  duration: number | null;
  callStatus: CallStatus;
  outcome: CallOutcome | null;
  lead: { customerName: string; phone: string; region: { name: string } };
  agent: { name: string };
};

type Props = {
  calls: CallRow[];
  regions: { id: string; name: string }[];
  agents: { id: string; name: string }[];
  stats: { totalCalls: number; callsToday: number; interestedToday: number; avgDuration: number };
};

export default function CallLogsTable({ calls, regions, agents, stats }: Props) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [agent, setAgent] = useState("All Agents");
  const [outcome, setOutcome] = useState("All Outcomes");

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.lead.customerName.toLowerCase().includes(search.toLowerCase()) ||
      call.lead.phone.includes(search) ||
      call.agent.name.toLowerCase().includes(search.toLowerCase());

    const matchesRegion = region === "All Regions" || call.lead.region.name === region;
    const matchesAgent = agent === "All Agents" || call.agent.name === agent;
    const matchesOutcome = outcome === "All Outcomes" || call.outcome === outcome;

    return matchesSearch && matchesRegion && matchesAgent && matchesOutcome;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Call Logs</h1>
        <p className="mt-1 text-sm text-gray-500">Monitor all calls made by your agents.</p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Calls</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.totalCalls}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Calls Today</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.callsToday}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Interested</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.interestedToday}</p>
          <p className="mt-1 text-xs text-gray-500">From today&apos;s calls</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Avg. Duration</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatDuration(stats.avgDuration)}
          </p>
          <p className="mt-1 text-xs text-gray-500">Per call</p>
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

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-lg border px-4 py-2.5 text-sm outline-none"
          >
            <option>All Regions</option>
            {regions.map((r) => (
              <option key={r.id}>{r.name}</option>
            ))}
          </select>

          <select
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            className="rounded-lg border px-4 py-2.5 text-sm outline-none"
          >
            <option>All Agents</option>
            {agents.map((a) => (
              <option key={a.id}>{a.name}</option>
            ))}
          </select>

          <select
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            className="rounded-lg border px-4 py-2.5 text-sm outline-none"
          >
            <option>All Outcomes</option>
            {Object.entries(callOutcomeLabels).map(([value, label]) => (
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
          <p className="mt-1 text-sm text-gray-500">Complete record of recent calls.</p>
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
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredCalls.map((call) => (
                <tr key={call.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {call.lead.customerName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{call.lead.phone}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">{call.agent.name}</td>

                  <td className="px-6 py-4 text-sm text-gray-600">{call.lead.region.name}</td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatDuration(call.duration)}
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

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDateTime(call.startedAt)}
                  </td>
                </tr>
              ))}

              {filteredCalls.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                    No calls match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredCalls.length} of {stats.totalCalls} calls
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
