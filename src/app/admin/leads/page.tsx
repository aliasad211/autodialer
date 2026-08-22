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
    agent: "Ali Khan",
    status: "Interested",
    date: "Today",
  },
  {
    id: 2,
    name: "Usman Ali",
    phone: "0312-7654321",
    city: "Rawalpindi",
    vehicle: "Toyota Vitz",
    agent: "Ahmed Raza",
    status: "Follow-up",
    date: "Today",
  },
  {
    id: 3,
    name: "Bilal Ahmed",
    phone: "0333-9876543",
    city: "Lahore",
    vehicle: "Honda Vezel",
    agent: "Usman Malik",
    status: "New",
    date: "Today",
  },
  {
    id: 4,
    name: "Hamza Khan",
    phone: "0345-4567890",
    city: "Islamabad",
    vehicle: "Toyota Prius",
    agent: "Ali Khan",
    status: "Converted",
    date: "Yesterday",
  },
  {
    id: 5,
    name: "Saad Ahmed",
    phone: "0301-5556677",
    city: "Peshawar",
    vehicle: "Toyota Corolla",
    agent: "Hamza Ali",
    status: "Not Interested",
    date: "Yesterday",
  },
  {
    id: 6,
    name: "Fahad Khan",
    phone: "0321-4445566",
    city: "Lahore",
    vehicle: "Suzuki Swift",
    agent: "Usman Malik",
    status: "Interested",
    date: "Yesterday",
  },
];

const statusStyles: Record<string, string> = {
  New: "bg-blue-50 text-blue-700",
  Interested: "bg-green-50 text-green-700",
  "Follow-up": "bg-yellow-50 text-yellow-700",
  Converted: "bg-purple-50 text-purple-700",
  "Not Interested": "bg-red-50 text-red-700",
};

export default function LeadsPage() {
  const [search, setSearch] = useState("");

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.vehicle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            All Leads
          </h1>

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
          <p className="text-sm text-gray-500">
            Total
          </p>

          <p className="mt-2 text-2xl font-bold">
            2,450
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">
            New
          </p>

          <p className="mt-2 text-2xl font-bold">
            840
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">
            Interested
          </p>

          <p className="mt-2 text-2xl font-bold">
            420
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">
            Follow-up
          </p>

          <p className="mt-2 text-2xl font-bold">
            315
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">
            Converted
          </p>

          <p className="mt-2 text-2xl font-bold">
            128
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
            <option>All Status</option>
            <option>New</option>
            <option>Interested</option>
            <option>Follow-up</option>
            <option>Converted</option>
            <option>Not Interested</option>
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

                      <span className="text-sm font-medium text-gray-900">
                        {lead.name}
                      </span>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.phone}
                  </td>

                  {/* City */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.city}
                  </td>

                  {/* Vehicle */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {lead.vehicle}
                  </td>

                  {/* Agent */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.agent}
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

                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {lead.date}
                  </td>

                  {/* Action */}
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
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing 1–6 of 2,450 leads
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