"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { updateAgent } from "@/app/actions/agents";

type Agent = {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
  regionId: string | null;
};

type Props = {
  agent: Agent;
  regions: { id: string; name: string }[];
};

export default function EditAgentButton({ agent, regions }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateAgent(agent.id, undefined, formData);
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
        className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Edit Agent
      </button>

      {open && (
        <Modal title="Edit Agent" onClose={() => setOpen(false)}>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                name="name"
                required
                defaultValue={agent.name}
                className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                required
                defaultValue={agent.email}
                className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Region</label>
                <select
                  name="regionId"
                  defaultValue={agent.regionId ?? ""}
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

              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  defaultValue={agent.status}
                  className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
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
