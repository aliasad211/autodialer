"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type PlivoBrowserSdk from "plivo-browser-sdk";

export type DialerState = "idle" | "connecting" | "ringing" | "in-call" | "error";

type PlivoInstance = InstanceType<typeof PlivoBrowserSdk>;

export function useDialer() {
  const plivoRef = useRef<PlivoInstance | null>(null);
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

  const ensureClient = useCallback(async () => {
    if (plivoRef.current) return plivoRef.current;

    const res = await fetch("/api/voice/token", { method: "POST" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}) as { error?: string });
      throw new Error(body.error ?? "Could not start the dialer.");
    }
    const { token } = (await res.json()) as { token: string };

    const { default: Plivo } = await import("plivo-browser-sdk");
    const plivo = new Plivo({ permOnClick: true });

    plivo.client.on("onCallRemoteRinging", () => setState("ringing"));
    plivo.client.on("onCallAnswered", () => {
      setState("in-call");
      setSeconds(0);
      stopTimer();
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    });
    plivo.client.on("onCallTerminated", () => {
      stopTimer();
      setState("idle");
    });
    plivo.client.on("onLoginFailed", () => {
      setError("Could not connect the dialer. Check your Plivo setup.");
      setState("error");
    });

    plivo.client.loginWithAccessToken(token);
    plivoRef.current = plivo;
    return plivo;
  }, [stopTimer]);

  const call = useCallback(
    async (to: string, params: Record<string, string> = {}) => {
      setError(null);
      setState("connecting");

      try {
        const plivo = await ensureClient();
        const extraHeaders = Object.fromEntries(
          Object.entries(params).map(([key, value]) => [`X-PH-${key}`, value])
        );
        plivo.client.call(to, extraHeaders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Call failed.");
        setState("error");
      }
    },
    [ensureClient]
  );

  const hangUp = useCallback(() => {
    plivoRef.current?.client.hangup();
  }, []);

  useEffect(() => {
    return () => {
      stopTimer();
      plivoRef.current?.client.hangup();
      plivoRef.current?.client.logout();
    };
  }, [stopTimer]);

  return { state, error, seconds, call, hangUp };
}
