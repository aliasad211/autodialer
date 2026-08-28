"use client";

import { useState } from "react";
import Link from "next/link";
import type { LeadStatus } from "@/generated/prisma";
import { formatDayLabel, initials, leadStatusLabels, leadStatusStyles } from "@/lib/format";

type LeadRow = {
  id: string;
  customerName: string;
  phone: string;
  city: string | null;
  vehicleInterest: string | null;
  status: LeadStatus;
  createdAt: Date;
  region: { name: string };
  agent: { name: string } | null;
};

type Props = {
  leads: LeadRow[];
  regions: { id: string; name: string }[];
  agents: { id: string; name: string }[];
  stats: {
    total: number;
    newCount: number;
    interestedCount: number;
    followUpCount: number;
    convertedCount: number;
  };
};

export default function LeadsTable({ leads, regions, agents, stats }: Props) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [agent, setAgent] = useState("All Agents");
  const [status, setStatus] = useState("All Status");

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.customerName.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      (lead.vehicleInterest ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesRegion = region === "All Regions" || lead.region.name === region;
    const matchesAgent = agent === "All Agents" || lead.agent?.name === agent;
    const matchesStatus = status === "All Status" || lead.status === status;

    return matchesSearch && matchesRegion && matchesAgent && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Leads</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor all customer leads.
          </p>
        </div>

        <button className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
          + Add Lead
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="mt-2 text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">New</p>
          <p className="mt-2 text-2xl font-bold">{stats.newCount}</p>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Interested</p>
          <p className="mt-2 text-2xl font-bold">{stats.interestedCount}</p>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Follow-up</p>
          <p className="mt-2 text-2xl font-bold">{stats.followUpCount}</p>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Converted</p>
          <p className="mt-2 text-2xl font-bold">{stats.convertedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-xl border bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <input
            type="text"
            placeholder="Search name, phone or vehicle..."
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
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border px-4 py-2.5 text-sm outline-none"
          >
            <option>All Status</option>
            {Object.entries(leadStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Phone
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  City
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Agent
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
                        {initials(lead.customerName)}
                      </div>

                      <span className="text-sm font-medium text-gray-900">
                        {lead.customerName}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">{lead.phone}</td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.city ?? "—"}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {lead.vehicleInterest ?? "—"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.agent?.name ?? "Unassigned"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${leadStatusStyles[lead.status]}`}
                    >
                      {leadStatusLabels[lead.status]}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDayLabel(lead.createdAt)}
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="text-sm font-medium text-gray-900 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-400">
                    No leads match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredLeads.length} of {stats.total} leads
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
