"use client";

import { useDialer } from "./useDialer";

function formatTimer(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function CallButton({
  phone,
  leadId,
  agentId,
}: {
  phone: string;
  leadId: string;
  agentId: string;
}) {
  const { state, error, seconds, call, hangUp } = useDialer();

  if (state === "idle" || state === "error") {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={() => call(phone, { leadId, agentId })}
          className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
        >
          <span>📞</span>
          Call {phone}
        </button>

        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  const label =
    state === "connecting" ? "Connecting…" : state === "ringing" ? "Ringing…" : formatTimer(seconds);

  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-900 px-5 py-3">
      <span className="flex items-center gap-2 text-sm font-medium text-white">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
        {label}
      </span>

      <button
        onClick={hangUp}
        className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
      >
        Hang Up
      </button>
    </div>
  );
}
