"use client";

import { useState } from "react";
import Link from "next/link";
import type { LeadStatus } from "@/generated/prisma";
import { formatDateTime, initials, leadStatusLabels, leadStatusStyles } from "@/lib/format";

type LeadRow = {
  id: string;
  customerName: string;
  phone: string;
  city: string | null;
  vehicleInterest: string | null;
  status: LeadStatus;
  callLogs: { startedAt: Date }[];
  followUps: { scheduledAt: Date }[];
};

type Props = {
  leads: LeadRow[];
  regionName: string;
  stats: { total: number; newLeads: number; pendingFollowUps: number };
};

export default function AgentLeadsTable({ leads, regionName, stats }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.customerName.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      (lead.vehicleInterest ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === "All Status" || lead.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Leads</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your assigned customer leads.</p>
        </div>

        <Link
          href="/agent/import"
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800"
        >
          + Import Leads
        </Link>
      </div>

      {/* Region Info */}
      <div className="mt-6 flex flex-col gap-3 rounded-xl border bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-gray-400">Your Region</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{regionName}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-gray-400">Total Leads</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{stats.total}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-gray-400">New Leads</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{stats.newLeads}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-gray-400">Follow-ups</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{stats.pendingFollowUps}</p>
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
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">Assigned Leads</h2>
          <p className="mt-1 text-sm text-gray-500">
            These leads are available for you to contact.
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
                  Phone
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Last Call
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Follow-up
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

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {lead.customerName}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">{lead.city ?? "—"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">{lead.phone}</td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {lead.vehicleInterest ?? "—"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${leadStatusStyles[lead.status]}`}
                    >
                      {leadStatusLabels[lead.status]}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {lead.callLogs[0] ? formatDateTime(lead.callLogs[0].startedAt) : "Never"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.followUps[0] ? formatDateTime(lead.followUps[0].scheduledAt) : "—"}
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      href={`/agent/leads/${lead.id}`}
                      className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-400">
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
