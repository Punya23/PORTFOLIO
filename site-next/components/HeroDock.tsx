"use client";
import { useEffect } from "react";

/**
 * Shrinks the hero wordmark ("Punya®") into the nav bar as you scroll: uses native
 * scroll-driven animation when supported, otherwise drives scale/translate from scroll.
 */
export function HeroDock() {
  useEffect(() => {
    const mark = document.getElementById("hero-mark");
    const rail = mark?.parentElement;
    if (!mark || !rail || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const native = typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()");
    let raf = 0;
    let end = 1; // final scale
    let dy = 0; // final translateY
    let width = window.innerWidth;
    const RANGE = 220;

    const measure = () => {
      const fs = parseFloat(getComputedStyle(mark).fontSize);
      const h = mark.offsetHeight;
      const wide = window.innerWidth >= 640;
      const target = wide ? 28 : 24;
      end = target / fs;
      dy = (wide ? 44 : 38) - (h * end) / 2 + 0.2 * target - (rail.getBoundingClientRect().top + mark.offsetTop);
      mark.style.setProperty("--mark-end", end.toFixed(4));
      mark.style.setProperty("--mark-dy", `${dy.toFixed(2)}px`);
      mark.style.setProperty("--mark-range", `${RANGE}px`);
    };
    const frame = () => {
      raf = 0;
      const y = window.scrollY;
      if (!native) {
        const t = Math.min(y / RANGE, 1);
        const eased = 1 - (1 - t) * (1 - t);
        mark.style.scale = (1 + (end - 1) * eased).toFixed(4);
        mark.style.translate = `0 ${(dy * eased).toFixed(2)}px`;
      }
      const docked = y >= 215.6 ? "1" : "0";
      if (mark.dataset.docked !== docked) mark.dataset.docked = docked;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onResize = () => { if (window.innerWidth !== width) { width = window.innerWidth; measure(); onScroll(); } };

    if (native) mark.classList.add("native");
    measure();
    frame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mark.classList.remove("native");
      mark.style.scale = "";
      mark.style.translate = "";
      mark.dataset.docked = "0";
    };
  }, []);
  return null;
}
