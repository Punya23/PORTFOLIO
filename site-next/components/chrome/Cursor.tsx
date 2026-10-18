"use client";
import { useEffect, useRef } from "react";

const LABELS: Record<string, string> = { View: "View project", All: "All work" };
const SOFT = "input, textarea, select, [contenteditable], [data-cursor-dot]";
const CLICKABLE = "a, button, [role='button'], [data-cursor-morph]";

/** Custom cursor: a disc that follows the pointer, morphs onto button-like targets, or shows a label. */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current, disc = discRef.current, label = labelRef.current;
    if (!root || !disc || !label) return;
    const html = document.documentElement;

    let x = -100, y = -100;          // rendered position
    let mx = -100, my = -100;        // pointer
    let raf = 0, started = false;
    let morph: Element | null = null;
    let cx = 0, cy = 0;              // morph target centre

    const setState = (state: string, text = "") => {
      if (state !== "morph" && morph) {
        morph = null;
        for (const p of ["--w", "--h", "--r"]) disc.style.removeProperty(p);
      }
      if (disc.dataset.state !== state) disc.dataset.state = state;
      if (label.textContent !== text) label.textContent = text;
    };
    const setPx = (name: string, v: number) => {
      const s = `${Math.round(v * 2) / 2}px`;
      if (disc.style.getPropertyValue(name) !== s) disc.style.setProperty(name, s);
    };

    const loop = () => {
      if (morph) {
        const r = morph.isConnected ? morph.getBoundingClientRect() : null;
        if (!r || !r.width || mx < r.left - 8 || mx > r.right + 8 || my < r.top - 8 || my > r.bottom + 8) {
          setState("dot");
        } else {
          const nx = r.left + r.width / 2, ny = r.top + r.height / 2;
          x += nx - cx; y += ny - cy; cx = nx; cy = ny;
          x += (cx + (mx - cx) * 0.08 - x) * 0.24;
          y += (cy + (my - cy) * 0.08 - y) * 0.24;
          setPx("--w", r.width + 12);
          setPx("--h", r.height + 12);
        }
      }
      if (disc.dataset.state === "label") {
        const flip = mx > window.innerWidth - 240;
        if (flip !== ("flip" in disc.dataset)) {
          if (flip) disc.dataset.flip = ""; else delete disc.dataset.flip;
        }
      }
      if (!morph) { x += (mx - x) * 0.24; y += (my - y) * 0.24; }
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mx = e.clientX; my = e.clientY;
      if (!started) {
        started = true; x = mx; y = my;
        html.classList.add("has-cursor");
        root.style.opacity = "1";
        raf = requestAnimationFrame(loop);
      }
    };

    /** Only button-like things (filled / bordered / explicitly marked) get the morph; plain links stay a link-disc. */
    const morphable = (el: Element) => {
      if (el.hasAttribute("data-cursor-morph")) return true;
      const r = el.getBoundingClientRect();
      if (r.height > 96 || r.width > 520) return false;
      const cs = getComputedStyle(el);
      const filled = !/^(transparent|rgba\(0, 0, 0, 0\))$/.test(cs.backgroundColor);
      const bordered = parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.borderLeftWidth) > 0;
      return filled || bordered;
    };
    const startMorph = (el: Element) => {
      const r = el.getBoundingClientRect();
      morph = el; cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      const radius = (e: Element) => {
        const v = getComputedStyle(e).borderTopLeftRadius;
        return v.endsWith("%") ? (parseFloat(v) / 100) * Math.min(r.width, r.height) : parseFloat(v) || 0;
      };
      setPx("--r", Math.min(radius(el) || (el.parentElement ? radius(el.parentElement) : 0) || 8, r.height / 2) + 6);
      setState("morph");
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest) return;
      if (t.closest("[data-native-cursor]")) return setState("off");
      if (t.closest(SOFT)) return setState("dot");
      const c = t.closest(CLICKABLE);
      if (c && !c.matches(":disabled") && morphable(c)) {
        if (c !== morph) startMorph(c);
        return;
      }
      const tagged = t.closest<HTMLElement>("[data-cursor]");
      if (tagged?.dataset.cursor) return setState("label", LABELS[tagged.dataset.cursor] ?? tagged.dataset.cursor);
      if (t.closest("a, button, [role='button'], summary, label")) return setState("link");
      setState("dot");
    };

    const down = () => { disc.dataset.pressed = "1"; };
    const up = () => { delete disc.dataset.pressed; };
    const hide = () => { root.style.opacity = "0"; };
    const show = () => { if (started) root.style.opacity = "1"; };
    const lower = () => { try { root.hidePopover(); } catch {} };
    const raise = () => { lower(); try { root.showPopover(); } catch {} };

    window.addEventListener("cursor:raise", raise);
    window.addEventListener("cursor:lower", lower);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    html.addEventListener("pointerleave", hide);
    html.addEventListener("pointerenter", show);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("cursor:raise", raise);
      window.removeEventListener("cursor:lower", lower);
      lower();
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      html.removeEventListener("pointerleave", hide);
      html.removeEventListener("pointerenter", show);
    };
  }, []);

  return (
    <div ref={rootRef} popover="manual" aria-hidden className="cursor-root pointer-events-none fixed left-0 top-0 z-[300] opacity-0 transition-opacity duration-300">
      <div ref={discRef} data-state="dot" className="cursor-disc">
        <svg viewBox="0 0 16 16" className="cursor-arrow" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
        </svg>
        <span ref={labelRef} />
      </div>
    </div>
  );
}
