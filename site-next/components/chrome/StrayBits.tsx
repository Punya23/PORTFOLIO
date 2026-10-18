"use client";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { cn, pad2 } from "@/lib/cn";
import { useContact } from "./ContactProvider";
import { NavLink } from "./NavLink";

/** The 16 bits spell "hi" in ASCII; each stray bit on the page is one of them. */
const BITS = Array.from("hi", (c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join("");

/**
 * The reference splits the 16 bits across 4 pages (7/3/4/2). This is a single page, so the same split is kept
 * as sections: bits are laid out top to bottom in that order.
 */
const GROUPS = [
  { href: "/", label: "Home", count: 7 },
  { href: "#work", label: "Work", count: 3 },
  { href: "#desktop", label: "About", count: 4 },
  { href: "#contact-section", label: "Contact", count: 2 },
].map((g, i, all) => ({ ...g, start: all.slice(0, i).reduce((n, x) => n + x.count, 0) }));

const KEY = "stray-bits";
const KEY_OFF = "stray-bits-off";

// Tiny external store over localStorage so HUD + field stay in sync (and survive reloads).
const subs = new Set<() => void>();
const subscribe = (cb: () => void) => { subs.add(cb); return () => void subs.delete(cb); };
const emit = () => subs.forEach((cb) => cb());
let caughtRaw: string | null = null;
let offRaw: boolean | null = null;

const getCaught = () => {
  if (caughtRaw === null) {
    try { caughtRaw = localStorage.getItem(KEY) ?? ""; } catch { caughtRaw = ""; }
  }
  return caughtRaw;
};
const parse = (raw: string) =>
  new Set(raw ? raw.split(",").map(Number).filter((n) => n >= 0 && n < BITS.length) : []);
const writeCaught = (ids: number[]) => {
  caughtRaw = ids.join(",");
  try { localStorage.setItem(KEY, caughtRaw); } catch {}
  emit();
};
const useCaught = () => {
  const raw = useSyncExternalStore(subscribe, getCaught, () => "");
  return useMemo(() => parse(raw), [raw]);
};
const catchBit = (i: number) => {
  const set = parse(getCaught());
  if (!set.has(i)) writeCaught([...set.add(i)].sort((a, b) => a - b));
};
const reset = () => writeCaught([]);

const getOff = () => {
  if (offRaw === null) {
    try { offRaw = localStorage.getItem(KEY_OFF) === "1"; } catch { offRaw = false; }
  }
  return offRaw;
};
const useOff = () => useSyncExternalStore(subscribe, getOff, () => false);
const setOff = (v: boolean) => {
  offRaw = v;
  try { v ? localStorage.setItem(KEY_OFF, "1") : localStorage.removeItem(KEY_OFF); } catch {}
  emit();
};

/** Deterministic pseudo-random in [0,1) so bit placement is stable between renders. */
const rnd = (i: number, k: number) => {
  const r = Math.sin((i + 1) * 12.9898 + 78.233 * k) * 43758.5453;
  return r - Math.floor(r);
};

/** Drop the clicked bit into the HUD (flies there), then record it. */
function fly(btn: HTMLButtonElement, i: number) {
  const hud = document.getElementById("stray-hud");
  if (!hud || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !btn.animate) return catchBit(i);
  const a = btn.getBoundingClientRect(), h = hud.getBoundingClientRect();
  const dx = h.left + h.width / 2 - (a.left + a.width / 2);
  const dy = h.top + h.height / 2 - (a.top + a.height / 2);
  btn.disabled = true;
  const anim = btn.animate(
    [
      { transform: "translate(-50%, -50%) scale(1)" },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.4)`, opacity: 0.4 },
    ],
    { duration: 560, easing: "cubic-bezier(0.32, 0.72, 0, 1)", fill: "forwards" },
  );
  anim.onfinish = anim.oncancel = () => catchBit(i);
}

/** Scattered clickable bits. Render as the LAST child of `<main id="main">` (it fills `main` absolutely). */
export function BitField() {
  const caught = useCaught();
  const off = useOff();
  const ref = useRef<HTMLDivElement>(null);
  const [bits, setBits] = useState<Array<{ i: number; top: number; x: number }>>([]);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (off || !host) return setBits([]);
    const ro = new ResizeObserver(() => {
      const heroH = Math.max(160, document.getElementById("hero")?.offsetHeight ?? 0);
      const span = host.offsetHeight - 96 - heroH;
      if (span <= 0) return setBits([]);
      setBits(Array.from({ length: BITS.length }, (_, i) => ({
        i,
        top: Math.round(heroH + ((i + 0.2 + 0.6 * rnd(i, 1)) / BITS.length) * span),
        x: i % 2 ? 92 + 5 * rnd(i, 2) : 3 + 5 * rnd(i, 2),
      })));
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, [off]);

  return (
    <div ref={ref} className="stray-field">
      {bits.filter((b) => !caught.has(b.i)).map((b) => (
        <button
          key={b.i}
          type="button"
          className="stray-bit"
          data-native-cursor
          data-side={b.i % 2 ? "right" : "left"}
          aria-label="Catch a stray bit"
          style={{
            top: b.top,
            left: `clamp(24px, ${b.x.toFixed(2)}%, calc(100% - 24px))`,
            "--d": `${(-3 * rnd(b.i, 3)).toFixed(2)}s`,
          } as React.CSSProperties}
          onClick={(e) => fly(e.currentTarget, b.i)}
        >
          <span aria-hidden="true">{BITS[b.i]}</span>
        </button>
      ))}
    </div>
  );
}

/** Bottom-left "Catch the stray bits 00/16" counter + decoder panel. Hidden while the hero is on screen. */
export function BitHud() {
  const caught = useCaught();
  const off = useOff();
  const { openContact } = useContact();
  const root = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const total = BITS.length;
  const done = caught.size >= total;

  useEffect(() => {
    const on = () => setHeroVisible(window.scrollY < 0.6 * (document.getElementById("hero")?.offsetHeight ?? window.innerHeight));
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);

  // Open the panel automatically when the last bit lands.
  const prev = useRef(caught.size);
  useEffect(() => {
    if (caught.size === total && prev.current === total - 1) setPanel(true);
    prev.current = caught.size;
  }, [caught.size, total]);

  // Dismiss on Escape / outside press.
  useEffect(() => {
    if (!panel) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setPanel(false);
    const press = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (root.current?.contains(t) || t?.closest?.(".stray-bit")) return;
      setPanel(false);
    };
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", press);
    return () => { window.removeEventListener("keydown", key); window.removeEventListener("pointerdown", press); };
  }, [panel]);

  return (
    <div
      ref={root}
      inert={heroVisible}
      className={cn(
        "fixed bottom-4 left-[var(--margin)] z-[58] text-white transition-[opacity,translate] duration-500 ease-[var(--ease-expo)] sm:bottom-5",
        heroVisible && "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      {panel && !off && (
        <div
          id="stray-panel"
          role="group"
          aria-label="Stray bits"
          className="stray-panel absolute bottom-full left-0 mb-2 w-[min(19rem,calc(100vw-2*var(--margin)))] rounded-[16px] border border-white/12 bg-ink/90 p-4 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-meta uppercase text-ember">Stray bits</p>
            <button
              type="button"
              className="-my-1 -mr-1.5 h-6 rounded-pill border border-white/15 px-2 font-mono text-[0.625rem] uppercase text-white/60 transition-colors [--tracking:0.04em] hover:border-white/40 hover:text-white"
              onClick={() => { setPanel(false); setOff(true); }}
            >
              Turn off
            </button>
          </div>
          <p className="mt-3 text-[0.875rem] leading-[1.4] text-white/70">
            {done
              ? "Every bit is back where it belongs. They were spelling something the whole time."
              : `${total} bits slipped out of the hero and scattered across the site. Catch them all to decode the message.`}
          </p>
          <div className="mt-4 grid gap-1.5 font-mono text-[0.9375rem] [--tracking:0.12em]">
            {Array.from("hi", (ch, row) => (
              <p key={row} className="flex items-center justify-between">
                <span>
                  {Array.from({ length: 8 }, (_, col) => {
                    const i = 8 * row + col;
                    return <span key={col} className={caught.has(i) ? "text-white" : "text-white/25"}>{caught.has(i) ? BITS[i] : "·"}</span>;
                  })}
                </span>
                <span className={done ? "text-ember" : "text-white/25"}>{done ? ch : "?"}</span>
              </p>
            ))}
          </div>
          {done ? (
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-pill bg-white px-4 text-[0.875rem] font-medium text-ink transition-colors hover:bg-ember hover:text-white"
                onClick={() => { setPanel(false); openContact(); }}
              >
                Say hi back
              </button>
              <button type="button" className="h-9 px-2 text-[0.875rem] text-white/60 transition-colors hover:text-white" onClick={reset}>
                Play again
              </button>
            </div>
          ) : (
            <ul className="mt-4 border-t border-white/12 pt-2 text-[0.875rem]">
              {GROUPS.map((g) => {
                const n = Array.from({ length: g.count }, (_, k) => g.start + k).filter((i) => caught.has(i)).length;
                return (
                  <li key={g.label}>
                    <NavLink href={g.href} className="flex h-8 items-center justify-between text-white/60 transition-colors hover:text-ember">
                      <span>{g.label}</span>
                      <span className={cn("text-meta", n === g.count && "text-ember")}>{n}/{g.count}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
      {off ? (
        <button
          type="button"
          aria-label="Turn the stray bits game back on"
          title="Turn the stray bits game back on"
          className="text-meta flex h-8 items-center gap-2 rounded-pill border border-white/12 bg-ink/70 px-3 uppercase text-white/50 backdrop-blur-xl transition-colors hover:text-white"
          onClick={() => setOff(false)}
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-white/30" />
          Game off
        </button>
      ) : (
        <button
          id="stray-hud"
          type="button"
          aria-expanded={panel}
          aria-controls="stray-panel"
          className="text-meta flex h-10 items-center gap-2.5 rounded-pill border border-white/12 bg-ink/80 pl-3 pr-3.5 uppercase backdrop-blur-xl"
          onClick={() => setPanel((p) => !p)}
        >
          <span className="sr-only">Stray bits: {caught.size} of {total} caught</span>
          <span aria-hidden="true" className={cn("stray-dot", done && "stray-dot-done")} />
          {caught.size === 0 && <span aria-hidden="true" className="max-xs:hidden">Catch the stray bits</span>}
          {done && <span aria-hidden="true">Decoded</span>}
          <span aria-hidden="true" className="stray-count" key={caught.size}>
            {pad2(caught.size)}<span className="text-white/60">/{total}</span>
          </span>
        </button>
      )}
    </div>
  );
}
