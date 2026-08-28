"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { CallStatus, LeadStatus } from "@/generated/prisma";
import { formatDateTime, formatDuration, leadStatusLabels, leadStatusStyles } from "@/lib/format";
import { logCallAndUpdateLead } from "@/app/actions/leads";
import CallButton from "@/components/dialer/CallButton";

type LeadDetail = {
  id: string;
  customerName: string;
  phone: string;
  city: string | null;
  country: string | null;
  vehicleInterest: string | null;
  status: LeadStatus;
  notes: string | null;
  region: { name: string };
  callLogs: {
    id: string;
    startedAt: Date;
    duration: number | null;
    callStatus: CallStatus;
    outcome: string | null;
    notes: string | null;
  }[];
  followUps: { id: string; scheduledAt: Date }[];
};

const callStatusOptions: { value: CallStatus; label: string }[] = [
  { value: "COMPLETED", label: "Completed" },
  { value: "NO_ANSWER", label: "No Answer" },
  { value: "BUSY", label: "Busy" },
  { value: "FAILED", label: "Failed" },
  { value: "REJECTED", label: "Rejected" },
];

export default function LeadWorkspace({ lead, agentId }: { lead: LeadDetail; agentId: string }) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [callStatus, setCallStatus] = useState<CallStatus>("COMPLETED");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const totalCalls = lead.callLogs.length;
  const lastCall = lead.callLogs[0];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/agent/leads" className="text-sm text-gray-500 hover:text-gray-900">
            ← Back to My Leads
          </Link>

          <h1 className="mt-3 text-2xl font-bold text-gray-900">{lead.customerName}</h1>

          <p className="mt-1 text-sm text-gray-500">
            Customer lead details and call activity.
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${leadStatusStyles[lead.status]}`}
        >
          {leadStatusLabels[lead.status]}
        </span>
      </div>

      {/* Main Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="lg:col-span-2">
          {/* Customer Information */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">Customer Information</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <InfoItem label="Customer Name" value={lead.customerName} />
              <InfoItem label="Phone Number" value={lead.phone} />
              <InfoItem label="City" value={lead.city ?? "—"} />
              <InfoItem label="Region" value={lead.region.name} />
              <InfoItem label="Interested Vehicle" value={lead.vehicleInterest ?? "—"} />
              <InfoItem label="Country" value={lead.country ?? "—"} />
            </div>
          </div>

          {/* Calling Card */}
          <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Call Customer</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Call from the app, then log the outcome below.
                </p>
              </div>

              <CallButton phone={lead.phone} leadId={lead.id} agentId={agentId} />
            </div>

            <a
              href={`tel:${lead.phone}`}
              className="mt-4 inline-block text-xs text-gray-400 hover:text-gray-600 hover:underline"
            >
              Or call {lead.phone} from your own phone instead
            </a>
          </div>

          {/* Log Call */}
          <form
            action={(formData) => {
              startTransition(async () => {
                await logCallAndUpdateLead(lead.id, formData);
                setSaved(true);
              });
            }}
            className="mt-6 rounded-xl border bg-white p-6 shadow-sm"
          >
            <h2 className="font-semibold text-gray-900">Log This Call</h2>
            <p className="mt-1 text-sm text-gray-500">
              If you called through the app, the result and duration were already recorded
              automatically &mdash; just set the outcome and notes below. Fill in Call Result
              and Duration yourself only if you called from your own phone.
            </p>

            <div className="mt-5">
              <label className="text-sm font-medium text-gray-700">Call Result</label>

              <select
                name="callStatus"
                value={callStatus}
                onChange={(e) => setCallStatus(e.target.value as CallStatus)}
                className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
              >
                {callStatusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {callStatus === "COMPLETED" && (
              <div className="mt-5">
                <label className="text-sm font-medium text-gray-700">
                  Call Duration (mm:ss)
                </label>

                <input
                  name="duration"
                  type="text"
                  placeholder="04:32"
                  pattern="^\d{1,3}:[0-5]?\d$"
                  className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
                />
              </div>
            )}

            <div className="mt-5">
              <label className="text-sm font-medium text-gray-700">Lead Status</label>

              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
              >
                {Object.entries(leadStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {status === "FOLLOW_UP" && (
              <div className="mt-5">
                <label className="text-sm font-medium text-gray-700">Follow-up Date</label>

                <input
                  name="followUpAt"
                  type="datetime-local"
                  className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
                />
              </div>
            )}

            <div className="mt-5">
              <label className="text-sm font-medium text-gray-700">Call Notes</label>

              <textarea
                name="notes"
                rows={5}
                placeholder="Write what the customer said..."
                className="mt-2 w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Save Call & Update Lead"}
              </button>

              {saved && !isPending && (
                <span className="text-sm text-green-600">Saved.</span>
              )}
            </div>
          </form>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Lead Summary */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">Lead Summary</h2>

            <div className="mt-5 space-y-4">
              <SummaryItem label="Total Calls" value={String(totalCalls)} />
              <SummaryItem
                label="Last Call"
                value={lastCall ? formatDateTime(lastCall.startedAt) : "Never"}
              />
              <SummaryItem label="Last Duration" value={formatDuration(lastCall?.duration)} />
              <SummaryItem label="Pending Follow-ups" value={String(lead.followUps.length)} />
            </div>
          </div>

          {/* Pending Follow-ups */}
          {lead.followUps.length > 0 && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900">Pending Follow-ups</h2>

              <div className="mt-4 space-y-3">
                {lead.followUps.map((followUp) => (
                  <div
                    key={followUp.id}
                    className="rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800"
                  >
                    {formatDateTime(followUp.scheduledAt)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Call */}
          {lastCall && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900">Most Recent Call</h2>

              <div className="mt-5 border-l-2 border-gray-200 pl-4">
                <p className="text-sm font-medium text-gray-900">
                  {formatDateTime(lastCall.startedAt)}
                </p>

                {lastCall.duration != null && (
                  <p className="mt-1 text-xs text-gray-400">
                    Duration: {formatDuration(lastCall.duration)}
                  </p>
                )}

                <span className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {lastCall.callStatus}
                </span>

                {lastCall.notes && (
                  <p className="mt-3 text-sm leading-6 text-gray-500">{lastCall.notes}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
