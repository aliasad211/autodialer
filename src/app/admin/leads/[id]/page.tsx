"use client";

import Link from "next/link";

const callHistory = [
  {
    date: "Today",
    time: "10:42 AM",
    agent: "Ali Khan",
    duration: "04:32",
    outcome: "Interested",
    note: "Customer is interested in Toyota Aqua. Wants price details.",
  },
  {
    date: "Yesterday",
    time: "03:15 PM",
    agent: "Ali Khan",
    duration: "02:48",
    outcome: "Follow-up",
    note: "Customer asked to call again tomorrow.",
  },
  {
    date: "Aug 19, 2026",
    time: "11:20 AM",
    agent: "Ahmed Raza",
    duration: "01:12",
    outcome: "No Answer",
    note: "Customer did not answer the call.",
  },
];

export default function LeadDetailPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Back */}
      <Link
        href="/admin/leads"
        className="text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        ← Back to All Leads
      </Link>

      {/* Header */}
      <div className="mt-5 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-700">
              A
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  Ahmed Khan
                </h1>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  Interested
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Lead #1001
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Edit Lead
            </button>

            <button className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
              Call Customer
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Customer Information */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Customer Information
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs text-gray-500">
                Full Name
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                Ahmed Khan
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Phone Number
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                0300-1234567
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                City
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                Islamabad
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Region
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                Islamabad
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Interest */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Vehicle Interest
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs text-gray-500">
                Vehicle
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                Toyota Aqua
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Model Year
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                2021
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Budget
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                4,500,000 PKR
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Source
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                Agent Import
              </p>
            </div>
          </div>
        </div>

        {/* Lead Assignment */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Lead Assignment
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs text-gray-500">
                Assigned Agent
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                Ali Khan
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Region
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                Islamabad
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Current Status
              </p>

              <span className="mt-1 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                Interested
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Created
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                August 20, 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">
          Latest Note
        </h2>

        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="text-sm leading-6 text-gray-600">
            Customer is interested in Toyota Aqua and wants
            complete price details. Customer requested another
            call regarding final price and availability.
          </p>
        </div>
      </div>

      {/* Call History */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">
            Call History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Complete calling history for this lead.
          </p>
        </div>

        <div className="divide-y">
          {callHistory.map((call, index) => (
            <div
              key={index}
              className="p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">
                      {call.date}
                    </span>

                    <span className="text-sm text-gray-400">
                      {call.time}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        call.outcome === "Interested"
                          ? "bg-green-50 text-green-700"
                          : call.outcome === "Follow-up"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {call.outcome}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Agent: {call.agent}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {call.note}
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  Duration:{" "}
                  <span className="font-medium text-gray-900">
                    {call.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Actions */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">
          Lead Status
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Admin can update the lead status if required.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
            New
          </button>

          <button className="rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            Interested
          </button>

          <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
            Follow-up
          </button>

          <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
            Converted
          </button>

          <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
            Not Interested
          </button>
        </div>
      </div>
    </div>
  );
}