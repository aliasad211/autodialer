import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  formatDate,
  formatDateTime,
  formatDuration,
  initials,
  leadStatusLabels,
  leadStatusStyles,
} from "@/lib/format";
import LeadStatusActions from "./LeadStatusActions";
import EditLeadButton from "./EditLeadButton";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [lead, regions, agents] = await Promise.all([
    prisma.lead.findUnique({
      where: { id },
      include: {
        region: { select: { name: true } },
        agent: { select: { name: true } },
        createdBy: { select: { name: true } },
        callLogs: {
          orderBy: { startedAt: "desc" },
          include: { agent: { select: { name: true } } },
        },
      },
    }),
    prisma.region.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.user.findMany({
      where: { role: "AGENT" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!lead) {
    notFound();
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Back */}
      <Link href="/admin/leads" className="text-sm font-medium text-gray-500 hover:text-gray-900">
        ← Back to All Leads
      </Link>

      {/* Header */}
      <div className="mt-5 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-700">
              {initials(lead.customerName)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{lead.customerName}</h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${leadStatusStyles[lead.status]}`}
                >
                  {leadStatusLabels[lead.status]}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">{lead.phone}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <EditLeadButton lead={lead} regions={regions} agents={agents} />

            <a
              href={`tel:${lead.phone}`}
              className="w-fit rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Call Customer
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Customer Information */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Customer Information</h2>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{lead.customerName}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Phone Number</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{lead.phone}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">City</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{lead.city ?? "—"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Region</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{lead.region.name}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Interest */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Vehicle Interest</h2>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs text-gray-500">Vehicle</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {lead.vehicleInterest ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Country</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{lead.country ?? "—"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Source</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {lead.createdBy?.name ?? "System"}
              </p>
            </div>
          </div>
        </div>

        {/* Lead Assignment */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Lead Assignment</h2>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs text-gray-500">Assigned Agent</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {lead.agent?.name ?? "Unassigned"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Region</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{lead.region.name}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Current Status</p>
              <span
                className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${leadStatusStyles[lead.status]}`}
              >
                {leadStatusLabels[lead.status]}
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-500">Created</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(lead.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {lead.notes && (
        <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Latest Note</h2>

          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <p className="text-sm leading-6 text-gray-600">{lead.notes}</p>
          </div>
        </div>
      )}

      {/* Call History */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">Call History</h2>
          <p className="mt-1 text-sm text-gray-500">Complete calling history for this lead.</p>
        </div>

        <div className="divide-y">
          {lead.callLogs.length === 0 && (
            <p className="p-6 text-sm text-gray-400">No calls logged yet.</p>
          )}

          {lead.callLogs.map((call) => (
            <div key={call.id} className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatDateTime(call.startedAt)}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {call.callStatus}
                    </span>

                    {call.outcome && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        {call.outcome}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-gray-500">Agent: {call.agent.name}</p>

                  {call.notes && (
                    <p className="mt-3 text-sm leading-6 text-gray-600">{call.notes}</p>
                  )}
                </div>

                {call.duration != null && (
                  <div className="text-sm text-gray-500">
                    Duration:{" "}
                    <span className="font-medium text-gray-900">
                      {formatDuration(call.duration)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Actions */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">Lead Status</h2>
        <p className="mt-1 text-sm text-gray-500">
          Admin can update the lead status if required.
        </p>

        <LeadStatusActions leadId={lead.id} currentStatus={lead.status} />
      </div>
    </div>
  );
}
