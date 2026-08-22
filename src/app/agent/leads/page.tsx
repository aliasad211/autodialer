"use client";

import { useState } from "react";
import Link from "next/link";

const leads = [
  {
    id: 1,
    name: "Ahmed Khan",
    phone: "0300-1234567",
    city: "Islamabad",
    vehicle: "Toyota Aqua",
    status: "Interested",
    lastCall: "Today, 10:42 AM",
    followUp: "Today",
  },
  {
    id: 2,
    name: "Usman Ali",
    phone: "0312-7654321",
    city: "Islamabad",
    vehicle: "Toyota Vitz",
    status: "Follow-up",
    lastCall: "Yesterday, 03:15 PM",
    followUp: "Today",
  },
  {
    id: 3,
    name: "Bilal Ahmed",
    phone: "0333-9876543",
    city: "Islamabad",
    vehicle: "Honda Vezel",
    status: "New",
    lastCall: "Never",
    followUp: "-",
  },
  {
    id: 4,
    name: "Hamza Khan",
    phone: "0345-4567890",
    city: "Rawalpindi",
    vehicle: "Toyota Prius",
    status: "New",
    lastCall: "Never",
    followUp: "-",
  },
  {
    id: 5,
    name: "Saad Ahmed",
    phone: "0301-5556677",
    city: "Islamabad",
    vehicle: "Toyota Corolla",
    status: "Interested",
    lastCall: "Yesterday, 04:30 PM",
    followUp: "Tomorrow",
  },
  {
    id: 6,
    name: "Fahad Khan",
    phone: "0321-4445566",
    city: "Rawalpindi",
    vehicle: "Suzuki Swift",
    status: "New",
    lastCall: "Never",
    followUp: "-",
  },
];

const statusStyles: Record<string, string> = {
  New: "bg-blue-50 text-blue-700",
  Interested: "bg-green-50 text-green-700",
  "Follow-up": "bg-yellow-50 text-yellow-700",
  Converted: "bg-purple-50 text-purple-700",
  "Not Interested": "bg-red-50 text-red-700",
};

export default function AgentLeadsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.vehicle.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "All Status" || lead.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Leads
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your assigned customer leads.
          </p>
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
          <p className="text-xs font-medium uppercase text-gray-400">
            Your Region
          </p>

          <p className="mt-1 text-lg font-semibold text-gray-900">
            Islamabad
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-gray-400">
            Total Leads
          </p>

          <p className="mt-1 text-lg font-semibold text-gray-900">
            284
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-gray-400">
            New Leads
          </p>

          <p className="mt-1 text-lg font-semibold text-gray-900">
            96
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-gray-400">
            Follow-ups
          </p>

          <p className="mt-1 text-lg font-semibold text-gray-900">
            24
          </p>
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
            <option>New</option>
            <option>Interested</option>
            <option>Follow-up</option>
            <option>Converted</option>
            <option>Not Interested</option>
          </select>

          <select className="rounded-lg border px-4 py-2.5 text-sm outline-none">
            <option>All Cities</option>
            <option>Islamabad</option>
            <option>Rawalpindi</option>
          </select>

          <select className="rounded-lg border px-4 py-2.5 text-sm outline-none">
            <option>Sort: Latest</option>
            <option>Sort: Oldest</option>
            <option>Sort: Follow-up</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">
            Assigned Leads
          </h2>

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
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50"
                >
                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
                        {lead.name.charAt(0)}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {lead.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {lead.city}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.phone}
                  </td>

                  {/* Vehicle */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {lead.vehicle}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        statusStyles[lead.status]
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>

                  {/* Last Call */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {lead.lastCall}
                  </td>

                  {/* Follow-up */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.followUp}
                  </td>

                  {/* Action */}
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
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredLeads.length} of 284 leads
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