"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useGsap } from "@/lib/gsap";

/** <section> that publishes its scroll progress as --p (0..1) and to onProgress. */
export function ScrollScene({ children, id, className, style, tone, range = "pinned", onProgress }: {
  children?: ReactNode; id?: string; className?: string; style?: CSSProperties; tone?: string;
  range?: "pinned" | "pass"; onProgress?: (p: number) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const cb = useRef(onProgress);
  cb.current = onProgress;
  useGsap(ref, ({ ScrollTrigger }, cond, el) => {
    if (cond.reduce) return;
    const set = (p: number) => { el.style.setProperty("--p", p.toFixed(4)); cb.current?.(p); };
    const st = ScrollTrigger.create({
      trigger: el,
      start: range === "pinned" ? "top top" : "top bottom",
      end: range === "pinned" ? "bottom bottom" : "bottom top",
      onUpdate: (s) => set(s.progress),
      onRefresh: (s) => set(s.progress),
    });
    return () => st.kill();
  });
  return <section ref={ref} id={id} data-tone={tone} style={style} className={className}>{children}</section>;
}
