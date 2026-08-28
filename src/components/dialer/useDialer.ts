"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Call, Device } from "@twilio/voice-sdk";

export type DialerState = "idle" | "connecting" | "ringing" | "in-call" | "error";

export function useDialer() {
  const deviceRef = useRef<Device | null>(null);
  const callRef = useRef<Call | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [state, setState] = useState<DialerState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const ensureDevice = useCallback(async () => {
    if (deviceRef.current) return deviceRef.current;

    const res = await fetch("/api/voice/token", { method: "POST" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}) as { error?: string });
      throw new Error(body.error ?? "Could not start the dialer.");
    }
    const { token } = (await res.json()) as { token: string };

    const { Device: DeviceClass } = await import("@twilio/voice-sdk");
    const device = new DeviceClass(token, { logLevel: "error" });
    deviceRef.current = device;
    return device;
  }, []);

  const call = useCallback(
    async (to: string, params: Record<string, string> = {}) => {
      setError(null);
      setState("connecting");

      try {
        const device = await ensureDevice();
        const twilioCall = await device.connect({ params: { To: to, ...params } });
        callRef.current = twilioCall;

        twilioCall.on("ringing", () => setState("ringing"));

        twilioCall.on("accept", () => {
          setState("in-call");
          setSeconds(0);
          stopTimer();
          timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
        });

        const onEnd = () => {
          stopTimer();
          setState("idle");
          callRef.current = null;
        };

        twilioCall.on("disconnect", onEnd);
        twilioCall.on("cancel", onEnd);

        twilioCall.on("error", (err: Error) => {
          setError(err.message);
          setState("error");
          stopTimer();
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Call failed.");
        setState("error");
      }
    },
    [ensureDevice, stopTimer]
  );

  const hangUp = useCallback(() => {
    callRef.current?.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      stopTimer();
      callRef.current?.disconnect();
      deviceRef.current?.destroy();
    };
  }, [stopTimer]);

  return { state, error, seconds, call, hangUp };
}
