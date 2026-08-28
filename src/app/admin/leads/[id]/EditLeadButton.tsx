"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { updateLead } from "@/app/actions/leads";

type Lead = {
  id: string;
  customerName: string;
  phone: string;
  city: string | null;
  vehicleInterest: string | null;
  notes: string | null;
  regionId: string;
  agentId: string | null;
};

type Props = {
  lead: Lead;
  regions: { id: string; name: string }[];
  agents: { id: string; name: string }[];
};

export default function EditLeadButton({ lead, regions, agents }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateLead(lead.id, undefined, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
      setOpen(false);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-fit rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Edit Lead
      </button>

      {open && (
        <Modal title="Edit Lead" onClose={() => setOpen(false)}>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Customer Name</label>
              <input
                name="customerName"
                required
                defaultValue={lead.customerName}
                className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                name="phone"
                required
                defaultValue={lead.phone}
                className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">City</label>
                <input
                  name="city"
                  defaultValue={lead.city ?? ""}
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Vehicle Interest</label>
                <input
                  name="vehicleInterest"
                  defaultValue={lead.vehicleInterest ?? ""}
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Region</label>
                <select
                  name="regionId"
                  required
                  defaultValue={lead.regionId}
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Assign Agent</label>
                <select
                  name="agentId"
                  defaultValue={lead.agentId ?? ""}
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                >
                  <option value="">Unassigned</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                rows={3}
                defaultValue={lead.notes ?? ""}
                className="mt-1.5 w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {pending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
