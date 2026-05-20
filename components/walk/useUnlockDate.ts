"use client";

import { useMemo } from "react";

export function useUnlockDate(targetIsoDate: string) {
  return useMemo(() => {
    const now = new Date();
    const target = new Date(targetIsoDate);
    const ms = target.getTime() - now.getTime();
    const daysUntil = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));

    return {
      locked: ms > 0,
      daysUntil,
    };
  }, [targetIsoDate]);
}
