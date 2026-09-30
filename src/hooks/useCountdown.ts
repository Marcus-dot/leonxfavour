// src/hooks/useCountdown.ts
// SSR-safe countdown. Returns em-dashes until mounted (prevents hydration
// mismatch — server and first client render must agree) and if the date is
// unset/invalid. Never renders NaN.
"use client";

import { useEffect, useState } from "react";

export interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isPast: boolean;
  valid: boolean;
}

const DASH: TimeLeft = {
  days: "—", hours: "—", minutes: "—", seconds: "—", isPast: false, valid: false,
};

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export function useCountdown(targetISO: string): TimeLeft {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(targetISO).getTime();
  if (now === null || Number.isNaN(target)) return DASH;

  const diff = target - now;
  if (diff <= 0) {
    return { days: "0", hours: "00", minutes: "00", seconds: "00", isPast: true, valid: true };
  }

  return {
    days: String(Math.floor(diff / 86_400_000)),
    hours: pad(Math.floor((diff % 86_400_000) / 3_600_000)),
    minutes: pad(Math.floor((diff % 3_600_000) / 60_000)),
    seconds: pad(Math.floor((diff % 60_000) / 1000)),
    isPast: false,
    valid: true,
  };
}
