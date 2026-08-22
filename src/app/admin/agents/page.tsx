"use client";

import { useState } from "react";

const agents = [
  {
    id: 1,
    name: "Ali Khan",
    email: "ali@example.com",
    region: "Islamabad",
    leads: 245,
    calls: 82,
    status: "Available",
  },
  {
    id: 2,
    name: "Ahmed Raza",
    email: "ahmed@example.com",
    region: "Rawalpindi",
    leads: 198,
    calls: 76,
    status: "On Call",
  },
  {
    id: 3,
    name: "Usman Malik",
    email: "usman@example.com",
    region: "Lahore",
    leads: 312,
    calls: 91,
    status: "Available",
  },
  {
    id: 4,
    name: "Hamza Ali",
    email: "hamza@example.com",
    region: "Islamabad",
    leads: 156,
    calls: 64,
    status: "Offline",
  },
];

export default function AgentsPage() {
  const [search, setSearch] = useState("");

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Agents
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your call center agents and their regions.
          </p>
        </div>

        <button className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
          + Add Agent
        </button>
      </div>

      {/* Search & Filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-400 sm:max-w-sm"
        />

        <select className="rounded-lg border bg-white px-4 py-2.5 text-sm outline-none">
          <option>All Regions</option>
          <option>Islamabad</option>
          <option>Rawalpindi</option>
          <option>Lahore</option>
        </select>

        <select className="rounded-lg border bg-white px-4 py-2.5 text-sm outline-none">
          <option>All Status</option>
          <option>Available</option>
          <option>On Call</option>
          <option>Offline</option>
        </select>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Total Agents</p>
          <p className="mt-2 text-2xl font-bold">24</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Available</p>
          <p className="mt-2 text-2xl font-bold">12</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">On Call</p>
          <p className="mt-2 text-2xl font-bold">7</p>
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
              {filteredAgents.map((agent) => (
                <tr
                  key={agent.id}
                  className="hover:bg-gray-50"
                >
                  {/* Agent */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700">
                        {agent.name.charAt(0)}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {agent.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {agent.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Region */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {agent.region}
                  </td>

                  {/* Leads */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {agent.leads}
                  </td>

                  {/* Calls */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {agent.calls}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          agent.status === "Available"
                            ? "bg-green-500"
                            : agent.status === "On Call"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                        }`}
                      />

                      <span className="text-sm text-gray-600">
                        {agent.status}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <button className="text-sm font-medium text-gray-900 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <p className="text-sm text-gray-500">
            Showing 1–4 of 24 agents
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