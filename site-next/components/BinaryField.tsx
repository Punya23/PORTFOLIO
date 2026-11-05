"use client";
import { useEffect, useRef } from "react";

/** A decorative field of 0s and 1s that flips as the page scrolls. Fills its (positioned) parent. */
export function BinaryField({ color = "rgba(217,164,65,0.13)" }: { color?: string }) {
  const pre = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const el = pre.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const CH = 8.4, LH = 16; // monospace glyph box at 14px
    let cols = 0, rows = 0, cells: string[] = [];
    const render = () => { el.textContent = Array.from({ length: rows }, (_, r) => cells.slice(r * cols, (r + 1) * cols).join("")).join("\n"); };
    const build = () => {
      const p = el.parentElement;
      if (!p) return;
      cols = Math.ceil(p.clientWidth / CH); rows = Math.ceil(p.clientHeight / LH);
      cells = Array.from({ length: cols * rows }, () => (Math.random() < 0.5 ? "0" : "1"));
      render();
    };
    build();
    const ro = new ResizeObserver(build);
    if (el.parentElement) ro.observe(el.parentElement);
    if (reduce) return () => ro.disconnect();

    let last = window.scrollY, acc = 0, raf = 0;
    const onScroll = () => {
      acc += Math.abs(window.scrollY - last); last = window.scrollY;
      if (raf || acc < 24) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const flips = Math.min(cells.length, Math.floor(acc * 6)); acc = 0;
        for (let i = 0; i < flips; i++) { const j = (Math.random() * cells.length) | 0; cells[j] = cells[j] === "0" ? "1" : "0"; }
        render();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <pre ref={pre} aria-hidden="true"
      style={{ position: "absolute", inset: 0, margin: 0, overflow: "hidden", color, fontFamily: "var(--font-mono)", fontSize: 14, lineHeight: "16px", userSelect: "none", pointerEvents: "none",
        maskImage: "radial-gradient(70% 80% at 50% 50%, #000 20%, transparent 78%)", WebkitMaskImage: "radial-gradient(70% 80% at 50% 50%, #000 20%, transparent 78%)" }} />
  );
}
