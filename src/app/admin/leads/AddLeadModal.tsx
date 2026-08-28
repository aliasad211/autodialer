"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { createLead } from "@/app/actions/leads";

type Props = {
  regions: { id: string; name: string }[];
  agents: { id: string; name: string }[];
  onClose: () => void;
};

export default function AddLeadModal({ regions, agents, onClose }: Props) {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createLead(undefined, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
      onClose();
    });
  }

  return (
    <Modal title="Add Lead" onClose={onClose}>
      <form action={handleSubmit} className="space-y-4">
        <Field label="Customer Name" name="customerName" required />
        <Field label="Phone Number" name="phone" required />

        <div className="grid grid-cols-2 gap-4">
          <Field label="City" name="city" />
          <Field label="Vehicle Interest" name="vehicleInterest" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Region</label>
            <select
              name="regionId"
              required
              className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
            >
              <option value="">Select region</option>
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
            className="mt-1.5 w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {pending ? "Creating..." : "Create Lead"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        name={name}
        required={required}
        className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
      />
    </div>
  );
}
