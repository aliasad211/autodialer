"use client";

import Link from "next/link";
import { useState } from "react";

export default function LeadDetailPage() {
  const [status, setStatus] = useState("Interested");
  const [notes, setNotes] = useState("");

  const customer = {
    name: "Ahmed Khan",
    phone: "0300-1234567",
    city: "Islamabad",
    region: "Islamabad",
    vehicle: "Toyota Aqua",
    year: "2021",
    source: "Imported CSV",
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/agent/leads"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to My Leads
          </Link>

          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            {customer.name}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Customer lead details and call activity.
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${
            status === "Interested"
              ? "bg-green-50 text-green-700"
              : status === "Follow-up"
                ? "bg-yellow-50 text-yellow-700"
                : status === "Converted"
                  ? "bg-purple-50 text-purple-700"
                  : "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Main Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Customer Information */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">
              Customer Information
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <InfoItem
                label="Customer Name"
                value={customer.name}
              />

              <InfoItem
                label="Phone Number"
                value={customer.phone}
              />

              <InfoItem
                label="City"
                value={customer.city}
              />

              <InfoItem
                label="Region"
                value={customer.region}
              />

              <InfoItem
                label="Interested Vehicle"
                value={customer.vehicle}
              />

              <InfoItem
                label="Vehicle Year"
                value={customer.year}
              />

              <InfoItem
                label="Lead Source"
                value={customer.source}
              />
            </div>
          </div>

          {/* Calling Card */}
          <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Call Customer
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Contact the customer using the calling system.
                </p>
              </div>

              <button className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700">
                <span>📞</span>
                Call {customer.phone}
              </button>
            </div>

            {/* Call Status */}
            <div className="mt-6 rounded-lg bg-gray-50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Call Status
                </span>

                <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                  Ready to call
                </span>
              </div>
            </div>
          </div>

          {/* Call Outcome */}
          <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">
              Update Lead
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select the customer&apos;s response after the call.
            </p>

            <div className="mt-5">
              <label className="text-sm font-medium text-gray-700">
                Lead Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
              >
                <option value="New">New</option>
                <option value="Interested">Interested</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Converted">Converted</option>
                <option value="Not Interested">
                  Not Interested
                </option>
              </select>
            </div>

            {/* Follow-up */}
            {status === "Follow-up" && (
              <div className="mt-5">
                <label className="text-sm font-medium text-gray-700">
                  Follow-up Date
                </label>

                <input
                  type="datetime-local"
                  className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
                />
              </div>
            )}

            {/* Notes */}
            <div className="mt-5">
              <label className="text-sm font-medium text-gray-700">
                Call Notes
              </label>

              <textarea
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write what the customer said..."
                className="mt-2 w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <button className="mt-5 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800">
              Save Lead Update
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">
              Quick Actions
            </h2>

            <div className="mt-5 space-y-3">
              <button className="flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm hover:bg-gray-50">
                <span>📞</span>
                Call Customer
              </button>

              <button className="flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm hover:bg-gray-50">
                <span>📅</span>
                Schedule Follow-up
              </button>

              <button className="flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm hover:bg-gray-50">
                <span>📝</span>
                Add Note
              </button>
            </div>
          </div>

          {/* Lead Summary */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">
              Lead Summary
            </h2>

            <div className="mt-5 space-y-4">
              <SummaryItem
                label="Total Calls"
                value="3"
              />

              <SummaryItem
                label="Last Call"
                value="Today, 10:42 AM"
              />

              <SummaryItem
                label="Last Duration"
                value="04:32"
              />

              <SummaryItem
                label="Follow-ups"
                value="1"
              />
            </div>
          </div>

          {/* Call History */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">
              Recent Call
            </h2>

            <div className="mt-5 border-l-2 border-gray-200 pl-4">
              <p className="text-sm font-medium text-gray-900">
                Today, 10:42 AM
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Duration: 04:32
              </p>

              <span className="mt-3 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                Interested
              </span>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Customer is interested in Toyota Aqua and
                wants more details about the vehicle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
}