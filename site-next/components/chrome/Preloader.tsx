"use client";
import { useEffect, useRef, useState } from "react";
import { pad2 } from "@/lib/cn";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * "Need a guy for <skill>… You found him." intro. Cycles `skills` with a decaying cadence, then splits open.
 * While mounted, site.css pauses hero animations and locks page scroll (html:has(.pre:not([data-open]))).
 */
export function Preloader({ skills }: { skills: string[] }) {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLSpanElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setDone(true);
    let n = 0;
    let timer = 0;
    const weights = skills.map((_, i) => Math.max(0.12, 0.8 ** i));
    const unit = Math.min(700, 3300 / weights.reduce((a, b) => a + b, 0));
    const dur = (i: number) => weights[i]! * unit * (i < 3 ? 0.75 : 1);
    let at = performance.now();
    const after = (ms: number) => {
      at += ms;
      timer = window.setTimeout(step, Math.max(0, at - performance.now()));
    };
    const swap = (text: string, ms: number) => {
      const host = slot.current;
      if (!host) return;
      const d = Math.min(420, 0.9 * ms);
      const old = host.lastElementChild as HTMLElement | null;
      old?.animate(
        { opacity: 0, filter: "blur(6px)", transform: "translate3d(0, -0.55em, 0)" },
        { duration: d, easing: EASE, fill: "forwards" },
      ).finished.then(() => old.remove(), () => {});
      const next = document.createElement("span");
      next.textContent = text;
      host.append(next);
      next.animate(
        { opacity: [0, 1], filter: ["blur(6px)", "blur(0)"], transform: ["translate3d(0, 0.55em, 0)", "none"] },
        { duration: d, easing: EASE },
      );
    };
    const step = () => {
      n += 1;
      if (n < skills.length) {
        const ms = dur(n);
        swap(skills[n]!, ms);
        if (count.current) count.current.textContent = pad2(n + 1);
        return after(ms);
      }
      el.dataset.found = "";
      timer = window.setTimeout(() => {
        el.dataset.open = "";
        timer = window.setTimeout(() => setDone(true), 900);
      }, 1500);
    };
    after(dur(0));
    return () => window.clearTimeout(timer);
  }, [skills]);

  if (done || !skills.length) return null;
  const width = `${((skills.reduce((a, s) => a + s.length, 0) / skills.length) * 0.5).toFixed(2)}em`;
  return (
    <div ref={root} className="pre" role="status" aria-label="Loading" data-lenis-prevent>
      <div aria-hidden="true" className="pre-half pre-half-top" />
      <div aria-hidden="true" className="pre-half pre-half-bottom" />
      <div aria-hidden="true" className="pre-stage">
        <p className="pre-ask">
          <span className="pre-lead">Need a guy for</span>
          <span ref={slot} className="pre-slot" style={{ width }}><span>{skills[0]}</span></span>
        </p>
        <p className="pre-found">You found <span className="pre-him">Punya.</span></p>
      </div>
      <p aria-hidden="true" className="pre-count text-meta tabular-nums">
        (<span ref={count}>01</span>/{pad2(skills.length)})
      </p>
      <noscript>
        <style>{".pre{display:none}html{overflow:auto!important}.hero-section *,.hero-mark-rail *{animation-play-state:running!important}"}</style>
      </noscript>
    </div>
  );
}
