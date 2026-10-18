"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { person, resumeUrl, socials as SOCIALS } from "@/content/punya";
import { cn, pad2 } from "@/lib/cn";
import { useHoverFine } from "@/lib/hooks";
import { lockScroll } from "@/lib/scroll";
import { useContact } from "./ContactProvider";
import { Sparkle } from "./icons";
import { KeypadPreview } from "./Keypad";
import { LocalTime } from "./LocalTime";
import { NavLink } from "./NavLink";

type NavItem = { href: string; label: string };
const DEFAULT_LINKS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "#work", label: "Work" },
  { href: "#desktop", label: "About" },
  { href: "#contact-section", label: "Contact" },
];

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** clip-path that makes the full-size panel look like the pill's rect. */
const pillClip = (from: DOMRect, to: DOMRect, r: number) =>
  `inset(${from.top - to.top}px ${to.right - from.right}px ${to.bottom - from.bottom}px ${from.left - to.left}px round ${r}px)`;

export function SiteNav({ links = DEFAULT_LINKS, availability = { open: true, text: "Open to freelance and internships" } }: {
  links?: NavItem[]; availability?: { open: boolean; text: string };
}) {
  const { openContact } = useContact();
  const [open, setOpen] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [tone, setTone] = useState("ink");
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const pillRect = useRef<DOMRect | null>(null);
  const restoreFocus = useRef(false);
  const closing = useRef(false);

  // "Get in touch" hides while the hero is on screen.
  useEffect(() => {
    const on = () => setHeroInView(window.scrollY < (document.getElementById("hero")?.offsetHeight ?? window.innerHeight) - 120);
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);

  // Nav tone follows whichever [data-tone] section sits under the header.
  useEffect(() => {
    let io: IntersectionObserver | undefined;
    const t = setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-tone]"));
      if (!els.length) return setTone("ink");
      const live = new Set<Element>();
      io = new IntersectionObserver((entries) => {
        for (const e of entries) (e.isIntersecting ? live.add(e.target) : live.delete(e.target));
        const last = els.filter((el) => live.has(el)).at(-1);
        if (last) setTone(last.dataset.tone ?? "ink");
      }, { rootMargin: "0px 0px -94% 0px", threshold: 0 });
      els.forEach((el) => io!.observe(el));
    }, 120);
    return () => { clearTimeout(t); io?.disconnect(); };
  }, []);
  useEffect(() => { document.documentElement.dataset.navTone = tone; }, [tone]);

  const openMenu = () => {
    pillRect.current = menuRef.current?.getBoundingClientRect() ?? null;
    setOpen(true);
  };

  // Pill -> full panel: clip-path grows from the pill's rect.
  useLayoutEffect(() => {
    if (!open) return;
    const el = menuRef.current, from = pillRect.current;
    if (!el || !from || reduced()) return;
    el.animate(
      [{ clipPath: pillClip(from, el.getBoundingClientRect(), 16) }, { clipPath: "inset(0px 0px 0px 0px round 28px)" }],
      { duration: 560, easing: EASE },
    );
  }, [open]);

  // Full panel -> pill, then unmount the panel.
  const closeMenu = useCallback(() => {
    const el = menuRef.current, from = pillRect.current;
    if (closing.current) return;
    restoreFocus.current = true;
    if (!el || !from || reduced()) return setOpen(false);
    closing.current = true;
    panelRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" });
    const a = el.animate(
      [{ clipPath: "inset(0px 0px 0px 0px round 28px)" }, { clipPath: pillClip(from, el.getBoundingClientRect(), 16) }],
      { duration: 380, easing: EASE, fill: "forwards" },
    );
    a.onfinish = a.oncancel = () => { closing.current = false; setOpen(false); };
  }, []);

  // Return focus to the pill after closing via the menu.
  useEffect(() => {
    if (open || !restoreFocus.current) return;
    restoreFocus.current = false;
    const t = setTimeout(() => pillRef.current?.focus({ preventScroll: true }), 0);
    return () => clearTimeout(t);
  }, [open]);

  const paper = tone === "paper";
  const hideTouch = heroInView || open;

  return (
    <header data-site-nav className="pointer-events-none fixed inset-x-0 top-0 z-[60]">
      <div className="relative flex items-center justify-between px-[var(--margin)] pt-4 sm:pt-5">
        <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center sm:top-5">
          <div
            ref={menuRef}
            id="site-menu"
            role={open ? "dialog" : undefined}
            aria-modal={open || undefined}
            aria-label={open ? "Menu" : undefined}
            style={{ borderRadius: open ? 28 : 16 }}
            className={cn(
              "pointer-events-auto overflow-hidden text-white backdrop-blur-xl",
              open ? "tone-ink fixed inset-2 z-[70] bg-ink sm:inset-3" : "relative h-11 bg-ink/80 ring-1 ring-white/10 sm:h-12",
            )}
          >
            {open ? (
              <MenuPanel
                panelRef={panelRef}
                links={links}
                onClose={closeMenu}
                onContact={() => { closeMenu(); setTimeout(openContact, 450); }}
              />
            ) : (
              <button
                ref={pillRef}
                type="button"
                aria-expanded={false}
                aria-controls="site-menu"
                onClick={openMenu}
                data-cursor-morph
                className="flex h-full items-center gap-4 px-4 sm:gap-6 sm:px-5"
              >
                <span className="flex items-center gap-2.5 text-[0.9375rem] font-medium">
                  <span className="grid grid-cols-2 gap-[3px]" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => <span key={i} className="size-[4px] rounded-full bg-white" />)}
                  </span>
                  Menu
                </span>
                <span className="hidden items-center gap-2 whitespace-nowrap text-[0.8125rem] font-light text-white/70 md:flex">
                  {availability.open && (
                    <span aria-hidden="true" className="relative flex size-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-ember opacity-60 motion-reduce:animate-none" />
                      <span className="relative size-1.5 rounded-full bg-ember" />
                    </span>
                  )}
                  {availability.text}
                </span>
              </button>
            )}
          </div>
        </div>
        <div
          inert={hideTouch}
          className="pointer-events-auto ml-auto max-sm:hidden"
          style={{
            opacity: hideTouch ? 0 : 1,
            transform: `translateY(${heroInView ? -28 : 0}px)`,
            transition: `opacity 0.35s ${EASE}, transform 0.35s ${EASE}`,
          }}
        >
          <button
            type="button"
            onClick={openContact}
            className={cn(
              "group flex h-11 items-center gap-1.5 rounded-[16px] px-3.5 text-[0.875rem] font-medium transition-colors duration-500 sm:h-12 sm:gap-2 sm:px-5 sm:text-[0.9375rem]",
              paper ? "bg-ink text-white hover:bg-ember" : "bg-white text-ink hover:bg-ember hover:text-white",
            )}
          >
            <span aria-hidden="true" className="relative grid place-items-center">
              <Sparkle className="size-3.5 group-hover:animate-[twinkle_0.7s_var(--ease-expo)]" />
              <Sparkle className="absolute -right-1.5 -top-1.5 size-2 scale-0 opacity-0 transition-[scale,opacity] duration-300 ease-[var(--ease-expo)] group-hover:scale-100 group-hover:opacity-100 group-hover:delay-150" />
            </span>
            Get in touch
          </button>
        </div>
      </div>
    </header>
  );
}

/** Gradient stand-in for the reference's per-link hover image (no project/portrait media yet). */
function Cover({ i }: { i: number }) {
  const [a, b, c, d] = [["16%", "6%", "92%", "104%"], ["84%", "4%", "8%", "100%"], ["50%", "-6%", "100%", "72%"], ["10%", "96%", "88%", "-4%"]][i % 4]!;
  return (
    <div
      aria-hidden="true"
      className="grain absolute inset-0 overflow-hidden"
      style={{
        backgroundColor: "#160907",
        backgroundImage: `radial-gradient(110% 92% at ${a} ${b}, #E8363C 0%, transparent 68%), radial-gradient(90% 80% at ${c} ${d}, var(--color-ember-deep) 0%, transparent 66%)`,
      }}
    />
  );
}

function MenuPanel({ links, onClose, onContact, panelRef }: {
  links: NavItem[]; onClose: () => void; onContact: () => void; panelRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [hover, setHover] = useState<number | null>(null);

  // Scroll lock, inert page, focus trap, Escape.
  useEffect(() => {
    const unlock = lockScroll();
    const shell = document.getElementById("site-shell");
    shell?.setAttribute("inert", "");
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    const focus = setTimeout(() => first?.focus({ preventScroll: true }), 320);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (!f.length) return;
      const a = f[0]!, z = f[f.length - 1]!;
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focus);
      document.removeEventListener("keydown", onKey);
      shell?.removeAttribute("inert");
      unlock();
    };
  }, [onClose, panelRef]);

  const href = hover != null ? links[hover]?.href : undefined;
  const preview: { frame: string; node: ReactNode; relative?: boolean } | null =
    hover == null ? null
    : href === "#contact-section"
      ? { frame: "aspect-auto w-auto overflow-visible rounded-none", node: <KeypadPreview className="-rotate-6 text-[clamp(0.8rem,1vw,1rem)]" />, relative: true }
    : href === "#work"
      ? { frame: "aspect-[4/3] w-[min(380px,30vw)] bg-ink overflow-hidden rounded-tile", node: <Cover i={1} /> }
    : href === "#desktop"
      ? { frame: "aspect-[1400/1985] w-[min(280px,22vw)] -rotate-3 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] overflow-hidden rounded-tile", node: <Cover i={2} /> }
      : { frame: "aspect-square w-[min(190px,16vw)] overflow-hidden rounded-tile", node: <Cover i={0} /> };

  return (
    <div
      ref={panelRef}
      className="menu-panel relative flex h-full flex-col px-5 pb-6 pt-4 sm:px-10 sm:pb-8 sm:pt-6"
      style={{ animation: "menu-fade 0.3s 0.22s both" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[0.9375rem] font-medium">Menu</span>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-white px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-ember hover:text-white"
        >
          Close
          <svg viewBox="0 0 16 16" className="size-3.5" stroke="currentColor" strokeWidth="1.6" fill="none" aria-hidden="true">
            <path d="M3 3l10 10M13 3 3 13" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <nav aria-label="Primary" className="my-auto py-8" onPointerLeave={() => setHover(null)}>
        <ul className="flex flex-col">
          {links.map((l, i) => (
            <li key={l.label} className="overflow-hidden">
              <div style={{ animation: `menu-rise 0.7s ${0.28 + 0.05 * i}s var(--ease-expo) both` }}>
                <NavLink
                  href={l.href}
                  onClick={onClose}
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  data-cursor="Go"
                  className={cn(
                    "group flex items-baseline gap-4 py-[0.04em] text-[clamp(3.25rem,11vw,9.5rem)] font-medium leading-none transition-opacity duration-300",
                    hover !== null && hover !== i && "opacity-30",
                  )}
                >
                  <span className="text-meta mt-3 w-8 shrink-0 self-start text-white/50 sm:mt-5 sm:w-10">{pad2(i + 1)}</span>
                  <span className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-3">{l.label}</span>
                </NavLink>
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col gap-6 text-[0.9375rem] sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-meta text-white/50">Say hello</span>
          <button
            type="button"
            onClick={onContact}
            className="w-fit text-left text-[1.25rem] underline decoration-white/20 underline-offset-4 hover:decoration-ember"
          >
            {person.email}
          </button>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-white/70">
          {SOCIALS.filter((s) => s.id !== "email").map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ember">{s.label}</a>
            </li>
          ))}
          <li>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ember">Resume</a>
          </li>
        </ul>
        <LocalTime className="text-meta inline-block min-w-[16ch] tabular-nums text-white/50 sm:text-right" />
      </div>
      <Follower containerRef={panelRef} visible={!!preview} frame={preview?.frame ?? ""}>
        <div key={hover ?? "none"} className={preview?.relative ? "relative" : "absolute inset-0"}>{preview?.node}</div>
      </Follower>
    </div>
  );
}

/** Hover preview that trails the pointer inside `containerRef` (fine-pointer devices only). */
function Follower({ containerRef, visible, frame, children }: {
  containerRef: React.RefObject<HTMLElement | null>; visible: boolean; frame: string; children: ReactNode;
}) {
  const fine = useHoverFine();
  const pos = useRef<HTMLDivElement>(null);
  const offset = { x: 40, y: -130 };

  useEffect(() => {
    const box = containerRef.current, el = pos.current;
    if (!box || !el || !fine) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, seeded = false;
    const loop = () => {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      tx = e.clientX - r.left + offset.x; ty = e.clientY - r.top + offset.y;
      if (!seeded) { seeded = true; x = tx; y = ty; }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    box.addEventListener("pointermove", move, { passive: true });
    return () => { box.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, fine]);

  if (!fine) return null;
  return (
    <div ref={pos} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-20">
      <div
        className={cn("relative", frame)}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "scale(0.9)",
          transition: `opacity 0.28s ${EASE}, transform 0.28s ${EASE}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
