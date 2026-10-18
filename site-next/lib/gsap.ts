"use client";
import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export type GsapCtx = { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger };
export type Conditions = { motion: boolean; reduce: boolean; desktop: boolean; mobile: boolean };

/** Original `a()`: resolves gsap + ScrollTrigger (registered). */
export const loadGsap = (): Promise<GsapCtx> => Promise.resolve({ gsap, ScrollTrigger });

/**
 * Original `n()` hook: runs `setup` inside gsap.matchMedia scoped to `ref`, re-running when
 * the motion / breakpoint conditions flip. `setup` may return a cleanup function.
 */
export function useGsap(
  ref: RefObject<HTMLElement | null>,
  setup: (g: GsapCtx, cond: Conditions, el: HTMLElement) => void | (() => void),
  deps: unknown[] = [],
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
        desktop: "(min-width: 900px)",
        mobile: "(max-width: 899.98px)",
      },
      (ctx) => setup({ gsap, ScrollTrigger }, ctx.conditions as unknown as Conditions, el),
    );
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
