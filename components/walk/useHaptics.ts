"use client";

export function useHaptics() {
  const tap = (duration = 12) => {
    if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
    navigator.vibrate(duration);
  };

  return { tap };
}
