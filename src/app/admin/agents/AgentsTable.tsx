"use client";

import { useState } from "react";
import Link from "next/link";
import { initials } from "@/lib/format";
import { useFilterParams } from "@/hooks/useFilterParams";
import Pagination from "@/components/ui/Pagination";
import AddAgentModal from "./AddAgentModal";

type AgentRow = {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
  region: { name: string } | null;
  _count: { assignedLeads: number };
  callsToday: number;
};

type Props = {
  agents: AgentRow[];
  regions: { id: string; name: string }[];
  pagination: { page: number; total: number; pageSize: number };
  filters: { q: string; region: string; status: string };
  stats: { total: number; active: number; inactive: number };
};

export default function AgentsTable({ agents, regions, pagination, filters, stats }: Props) {
  const { setDebounced, setImmediate } = useFilterParams();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your call center agents and their regions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Add Agent
        </button>
      </div>

      {showAddModal && (
        <AddAgentModal regions={regions} onClose={() => setShowAddModal(false)} />
      )}

      {/* Search & Filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search agents..."
          defaultValue={filters.q}
          onChange={(e) => setDebounced("q", e.target.value)}
          className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-400 sm:max-w-sm"
        />

        <select
          value={filters.region}
          onChange={(e) => setImmediate("region", e.target.value)}
          className="rounded-lg border bg-white px-4 py-2.5 text-sm outline-none"
        >
          <option value="">All Regions</option>
          {regions.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setImmediate("status", e.target.value)}
          className="rounded-lg border bg-white px-4 py-2.5 text-sm outline-none"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Total Agents</p>
          <p className="mt-2 text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Active</p>
          <p className="mt-2 text-2xl font-bold">{stats.active}</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Inactive</p>
          <p className="mt-2 text-2xl font-bold">{stats.inactive}</p>
        </div>
      </div>

      {/* Agents Table */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white">
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
                  Leads
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Calls Today
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
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700">
                        {initials(agent.name)}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                        <p className="text-xs text-gray-500">{agent.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {agent.region?.name ?? "Unassigned"}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {agent._count.assignedLeads}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">{agent.callsToday}</td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          agent.status === "ACTIVE" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />

                      <span className="text-sm text-gray-600">
                        {agent.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/agents/${agent.id}`}
                      className="text-sm font-medium text-gray-900 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {agents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                    No agents match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          itemLabel="agents"
        />
      </div>
    </div>
  );
}
