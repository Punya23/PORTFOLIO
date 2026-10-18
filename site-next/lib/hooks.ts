"use client";
import { useCallback, useSyncExternalStore } from "react";

export function useMedia(query: string, server = false) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => server);
}
export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)", false);
export const useHoverFine = () => useMedia("(hover: hover) and (pointer: fine)", false);
