"use client";

import { useTransition } from "react";
import type { LeadStatus } from "@/generated/prisma";
import { leadStatusLabels } from "@/lib/format";
import { adminUpdateLeadStatus } from "@/app/actions/leads";

export default function LeadStatusActions({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: LeadStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {Object.entries(leadStatusLabels).map(([value, label]) => {
        const isActive = value === currentStatus;

        return (
          <button
            key={value}
            disabled={isPending || isActive}
            onClick={() =>
              startTransition(() => adminUpdateLeadStatus(leadId, value as LeadStatus))
            }
            className={`rounded-lg px-4 py-2 text-sm disabled:cursor-default ${
              isActive
                ? "bg-green-50 font-medium text-green-700"
                : "border text-gray-700 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
