"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { createAgent } from "@/app/actions/agents";

type Props = {
  regions: { id: string; name: string }[];
  onClose: () => void;
};

export default function AddAgentModal({ regions, onClose }: Props) {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createAgent(undefined, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
      onClose();
    });
  }

  return (
    <Modal title="Add Agent" onClose={onClose}>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            name="name"
            required
            className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Initial Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
          />
          <p className="mt-1 text-xs text-gray-400">At least 8 characters. Share this with the agent securely.</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Region</label>
          <select
            name="regionId"
            className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
          >
            <option value="">Unassigned</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
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
            {pending ? "Creating..." : "Create Agent"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
