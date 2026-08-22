"use client";

import { useState } from "react";

const regions = [
  {
    id: 1,
    name: "Islamabad",
    agents: 8,
    leads: 620,
    callsToday: 184,
    status: "Active",
  },
  {
    id: 2,
    name: "Rawalpindi",
    agents: 6,
    leads: 480,
    callsToday: 142,
    status: "Active",
  },
  {
    id: 3,
    name: "Lahore",
    agents: 10,
    leads: 850,
    callsToday: 265,
    status: "Active",
  },
  {
    id: 4,
    name: "Peshawar",
    agents: 4,
    leads: 310,
    callsToday: 97,
    status: "Active",
  },
];

export default function RegionsPage() {
  const [search, setSearch] = useState("");

  const filteredRegions = regions.filter((region) =>
    region.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Regions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage regions and monitor their activity.
          </p>
        </div>

        <button className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
          + Add Region
        </button>
      </div>

      {/* Search */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search regions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-400 sm:max-w-sm"
        />
      </div>

      {/* Region Cards */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {filteredRegions.map((region) => (
          <div
            key={region.id}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {region.name}
                </h2>

                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-xs text-green-600">
                    {region.status}
                  </span>
                </div>
              </div>

              <button className="text-gray-400 hover:text-gray-900">
                ⋮
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Agents
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  {region.agents}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Leads
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  {region.leads}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Calls Today
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  {region.callsToday}
                </span>
              </div>
            </div>

            <button className="mt-6 w-full rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              View Region
            </button>
          </div>
        ))}
      </div>

      {/* Region Table */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">
            Region Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Overview of agents and leads by region.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Region
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Agents
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
              {filteredRegions.map((region) => (
                <tr
                  key={region.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {region.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {region.agents}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {region.leads}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {region.callsToday}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      {region.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button className="text-sm font-medium text-gray-900 hover:underline">
                      Manage
                    </button>
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