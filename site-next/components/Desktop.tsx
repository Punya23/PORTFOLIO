"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { InView } from "@/components/InView";
import { person } from "@/content/punya";
import { clamp } from "@/lib/cn";
import { useGsap } from "@/lib/gsap";
import { useMedia } from "@/lib/hooks";
import { getLenis, lockScroll } from "@/lib/scroll";
import {
  BODY_WORDS, DOCK_LINKS, FOLDERS, HEAD_WORDS, HEADING, HINT, INTRO, SPOTS, WIN_SIZES, wordCount,
  type App, type Spot, type WinState,
} from "./desktop/data";
import { AppleIcon, BatteryIcon, ControlIcon, IconDefs, MailIcon, NotesIcon, SearchIcon, WifiIcon } from "./desktop/icons";
import { appleMenu, buildMenus } from "./desktop/menus";
import {
  AboutView, DesktopIcon, DockGlyph, DockItem, FinderView, MenuPanel, MenuTitle, NoticeCard, NotesView, Win, Words,
  type Grab,
} from "./desktop/views";

const MENU_BAR = 37;
const DOCK_H = 84;
/** Virtual screen width the OS is laid out at before being scaled into the MacBook frame. */
const BASE_W = 1512;

type Pt = { x: number; y: number };

/** Menu-bar clock in Pune time: "Mon 19 Oct 2:05 PM", or just the time on narrow screens. */
function useClock(compact: boolean) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1e4);
    return () => clearInterval(id);
  }, []);
  if (!now) return "";
  const part = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", { timeZone: person.timezone, ...o }).format(now);
  const time = new Intl.DateTimeFormat("en-US", { timeZone: person.timezone, hour: "numeric", minute: "2-digit" }).format(now);
  return compact ? time : `${part({ weekday: "short" })} ${part({ day: "numeric" })} ${part({ month: "short" })} ${time}`;
}

export function Desktop() {
  const sectionRef = useRef<HTMLElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const zTop = useRef(10);
  const nextId = useRef(1);
  const [dim, setDim] = useState({ w: BASE_W, h: 982, s: 0 });
  const [wins, setWins] = useState<WinState[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [offsets, setOffsets] = useState<Record<string, Pt>>({});
  const [menu, setMenu] = useState<string | null>(null);
  const [bouncing, setBouncing] = useState<App | null>(null);
  /** null = not shown yet, true = notification visible, false = dismissed. */
  const [notice, setNotice] = useState<boolean | null>(null);
  const isSmall = useMedia("(max-width: 767px), (pointer: coarse) and (max-height: 600px)");
  const [fullscreen, setFullscreen] = useState(false);
  const collapsed = isSmall && !fullscreen;
  const portrait = useMedia("(orientation: portrait)");
  const [rotateOk, setRotateOk] = useState(false);
  const askRotate = fullscreen && portrait && !rotateOk;

  // Fit the virtual screen to the MacBook screen element.
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w) return;
      const s = collapsed ? w / BASE_W : Math.max(w / BASE_W, Math.min(0.72, w / 520));
      setDim({ w: w / s, h: h / s, s });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [collapsed]);

  // Full-screen mode on phones: lock page scroll, Esc exits, keep the scroll position across rotation/resize.
  useEffect(() => {
    if (!fullscreen) return;
    const unlock = lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullscreen(false);
    window.addEventListener("keydown", onKey);
    const el = sectionRef.current;
    const range = () => (el ? el.offsetHeight - window.innerHeight : 0);
    const top = () => (el ? el.getBoundingClientRect().top + window.scrollY : 0);
    const progress = range() > 0 ? clamp((window.scrollY - top()) / range(), 0, 1) : 0;
    let raf = 0;
    const restore = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => {
          const y = Math.round(top() + progress * range());
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
          else window.scrollTo(0, y);
        });
      });
    };
    window.addEventListener("resize", restore);
    window.addEventListener("orientationchange", restore);
    return () => {
      cancelAnimationFrame(raf);
      unlock();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", restore);
      window.removeEventListener("orientationchange", restore);
    };
  }, [fullscreen]);

  useEffect(() => {
    if (!isSmall) setFullscreen(false);
  }, [isSmall]);
  useEffect(() => {
    if (!fullscreen) setRotateOk(false);
  }, [fullscreen]);

  // Scroll-driven progress (--sp) and sticky offset (--stick) for the pinned section.
  useGsap(sectionRef, ({ ScrollTrigger }, cond, el) => {
    if (cond.reduce) return;
    const syncStick = () => {
      const menuEl = document.getElementById("site-menu");
      const parent = menuEl?.parentElement;
      const px = Math.max(
        document.querySelector<HTMLElement>("[data-site-nav]")?.offsetHeight ?? 0,
        menuEl && parent ? parent.offsetTop + Math.min(menuEl.offsetHeight, 48) : 0,
      );
      el.style.setProperty("--stick", `${(px + 20).toFixed(1)}px`);
    };
    syncStick();
    const pin = el.querySelector<HTMLElement>(".dk-pin");
    const setProgress = (st: { progress: number }) => el.style.setProperty("--sp", st.progress.toFixed(4));
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: () =>
        `top+=${Math.round(((parseFloat(getComputedStyle(el).getPropertyValue("--pt")) || 0) / 100) * (pin?.offsetHeight ?? 0))} top`,
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onRefreshInit: syncStick,
      onUpdate: setProgress,
      onRefresh: setProgress,
    });
    return () => {
      trigger.kill();
      for (const v of ["--stick", "--sp"]) el.style.removeProperty(v);
    };
  });

  // Show the "Welcome to my Mac" notification once the MacBook is mostly in view.
  useEffect(() => {
    const el = screenRef.current;
    if (!el || notice !== null) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          io.disconnect();
          timer = window.setTimeout(() => setNotice(true), 700);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [notice]);
  useEffect(() => {
    if (wins.length && notice) setNotice(false);
  }, [wins.length, notice]);

  /** Screen-space px per virtual px (frame scale x the OS scale), for pointer-delta maths. */
  const scale = () => {
    const el = screenRef.current;
    return el?.clientWidth ? (el.getBoundingClientRect().width / el.clientWidth) * dim.s : dim.s;
  };
  const compact = dim.w < 760;
  const area = { w: dim.w, h: dim.h - MENU_BAR };

  const patchWin = useCallback(
    (id: number, patch: Partial<WinState>) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, ...patch } : w))),
    [],
  );
  const focusWin = useCallback((id: number) => {
    setWins((ws) =>
      ws.find((w) => w.id === id)?.z === zTop.current ? ws : ws.map((w) => (w.id === id ? { ...w, z: ++zTop.current, min: false } : w)),
    );
  }, []);
  const closeWin = useCallback((id: number) => setWins((ws) => ws.filter((w) => w.id !== id)), []);

  /** Open (or focus) a window. Finder reuses a window already showing `target`; Notes navigates its existing window. */
  const launch = useCallback(
    (app: App, target?: string) => {
      setWins((ws) => {
        const same = ws.filter((w) => w.app === app).sort((a, b) => b.z - a.z);
        const existing = app === "finder" && target ? same.find((w) => w.hist[w.hi] === target) : same[0];
        if (existing) {
          const nav =
            app === "notes" && target && existing.hist[existing.hi] !== target
              ? { hist: [...existing.hist.slice(0, existing.hi + 1), target], hi: existing.hi + 1 }
              : {};
          return ws.map((w) => (w.id === existing.id ? { ...w, ...nav, min: false, z: ++zTop.current } : w));
        }
        const size = WIN_SIZES[app];
        const w = Math.min(size.w, dim.w - 60);
        const h = Math.min(size.h, dim.h - MENU_BAR - DOCK_H - 24);
        const cascade = (ws.length % 5) * 24;
        const x = Math.round((dim.w - w) / 2 + cascade - (app === "about" ? 0 : 40));
        const y = Math.round(MENU_BAR + Math.max(12, (dim.h - MENU_BAR - DOCK_H - h) / 2) + cascade - 20);
        const start = target ?? (app === "notes" ? "experience" : app === "finder" ? FOLDERS[0].id : "about");
        return [
          ...ws,
          { id: nextId.current++, app, hist: [start], hi: 0, x, y: Math.max(MENU_BAR, y), w, h, z: ++zTop.current, max: false, min: false },
        ];
      });
    },
    [dim.w, dim.h],
  );

  const isOpen = (app: App) => wins.some((w) => w.app === app);
  /** Dock click: bounce the icon when the app is not running yet, then launch. */
  const dockClick = (app: App, target?: string) => {
    if (!isOpen(app) && app !== "finder") {
      setBouncing(app);
      setTimeout(() => setBouncing(null), 900);
    }
    launch(app, target);
  };
  const navigate = (w: WinState, target: string) => {
    if (w.hist[w.hi] !== target) patchWin(w.id, { hist: [...w.hist.slice(0, w.hi + 1), target], hi: w.hi + 1 });
  };

  const visible = wins.filter((w) => !w.min);
  const topWin = visible.reduce<WinState | null>((best, w) => (!best || w.z > best.z ? w : best), null);
  const appName = topWin?.app === "notes" ? "Notes" : "Finder";

  // Close the open menu on outside press / Escape.
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest?.(".mb-title, .menu")) setMenu(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const menus = buildMenus({
    appName,
    top: topWin,
    wins: visible,
    launch,
    close: closeWin,
    focus: focusWin,
    patch: patchWin,
    closeApp: (app) => setWins((ws) => ws.filter((w) => w.app !== app)),
  });
  const clock = useClock(compact);
  const posKey = (id: string) => `${compact ? "c" : "w"}:${id}`;

  /** Where a desktop icon sits (0..1 of the screen): user-dragged, else its spot; compact screens stack them in columns. */
  const iconPos = (spot: Spot, index: number): Pt => {
    const dragged = offsets[posKey(spot.id)];
    if (dragged) return dragged;
    if (!compact) return spot.spot;
    const rows = Math.max(1, Math.floor((area.h - DOCK_H - 12) / 104));
    const col = Math.floor(index / rows);
    return { x: (area.w - 14 - 52 - 104 * col) / area.w, y: (64 + (index % rows) * 104) / area.h };
  };

  /** Pointer handler for moving / resizing window `id`. */
  const grab = (id: number) => (e: ReactPointerEvent, how: Grab) => {
    const win = wins.find((w) => w.id === id);
    if (!win || win.max || compact || e.button !== 0) return;
    e.preventDefault();
    const { minW, minH } = WIN_SIZES[win.app];
    const start = { cx: e.clientX, cy: e.clientY, x: win.x, y: win.y, w: win.w, h: win.h };
    const k = scale();
    const onMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - start.cx) / k;
      const dy = (ev.clientY - start.cy) / k;
      if (how === "move") {
        patchWin(id, { x: clamp(start.x + dx, 90 - start.w, dim.w - 90), y: clamp(start.y + dy, MENU_BAR, dim.h - 44) });
      } else {
        patchWin(id, {
          w: how === "b" ? start.w : clamp(start.w + dx, minW, dim.w - start.x),
          h: how === "r" ? start.h : clamp(start.h + dy, minH, dim.h - start.y),
        });
      }
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return (
    <section
      ref={sectionRef}
      id="desktop"
      data-tone="ink"
      className="desktop-sec tone-ink relative overflow-clip"
      style={{ "--dn": HEAD_WORDS + BODY_WORDS } as CSSProperties}
    >
      <div className="dk-pin">
        <div className="wrap dk-inner">
          <InView className="dk-head" threshold={0.4}>
            <p className="dk-eyebrow">Disciplines</p>
            <h2 className="dk-title">
              <Words text={HEADING.line1} from={0} />
              <br />
              <Words text={HEADING.line2} from={wordCount(HEADING.line1)} />
            </h2>
            <p className="dk-caption">
              <Words text={INTRO} from={HEAD_WORDS} />{" "}
              <span className="hint-fine">
                <Words text={HINT} from={HEAD_WORDS + wordCount(INTRO)} />
              </span>
            </p>
          </InView>
          <InView className="mac-stage mx-auto" threshold={0.15}>
            <div className="mac-crop" data-crop={collapsed || undefined}>
              <div className="mac" data-native-cursor data-full={fullscreen || undefined}>
                <div
                  className="mac-screen"
                  ref={screenRef}
                  data-full={fullscreen || undefined}
                  data-lenis-prevent={fullscreen || undefined}
                >
                  <div
                    className="os"
                    data-compact={compact || undefined}
                    inert={collapsed || undefined}
                    style={{
                      width: dim.w,
                      height: dim.h,
                      transform: `scale(${dim.s})`,
                      visibility: dim.s ? undefined : "hidden",
                    }}
                  >
                    <IconDefs />
                    <img
                      src="/desktop/wallpaper.webp"
                      alt=""
                      width={2560}
                      height={1440}
                      decoding="async"
                      draggable={false}
                      className="os-wall"
                      onPointerDown={() => setSelected(null)}
                    />
                    <div className="mb">
                      <MenuTitle id="apple" menu={menu} setMenu={setMenu} className="mb-apple" label="Apple menu">
                        <AppleIcon className="mb-apple-ico" />
                      </MenuTitle>
                      {menus.map((m) => (
                        <MenuTitle key={m.id} id={m.id} menu={menu} setMenu={setMenu} className={m.id === "app" ? "mb-app" : "mb-extra"}>
                          {m.title}
                        </MenuTitle>
                      ))}
                      <div className="mb-notch" aria-hidden />
                      <div className="mb-r" aria-hidden>
                        {!compact && <BatteryIcon className="mb-ico mb-battery" />}
                        <WifiIcon className="mb-ico" />
                        {!compact && <SearchIcon className="mb-ico" />}
                        {!compact && <ControlIcon className="mb-ico" />}
                        <span className="mb-clock">{clock || "\xa0"}</span>
                      </div>
                    </div>
                    {menu && (
                      <MenuPanel
                        items={menu === "apple" ? appleMenu(launch) : (menus.find((m) => m.id === menu)?.items ?? [])}
                        anchor={menu}
                        onDone={() => setMenu(null)}
                      />
                    )}
                    <ul className="dt" aria-label="Desktop">
                      {SPOTS.map((spot, i) => {
                        const pos = iconPos(spot, i);
                        return (
                          <DesktopIcon
                            key={spot.id}
                            item={spot}
                            left={pos.x * area.w - 52}
                            top={MENU_BAR + pos.y * area.h - 52}
                            selected={selected === spot.id}
                            onSelect={() => setSelected(spot.id)}
                            onOpen={() => launch(spot.kind === "note" ? "notes" : "finder", spot.id)}
                            onDrag={(dx, dy) =>
                              setOffsets((o) => {
                                const cur = o[posKey(spot.id)] ?? pos;
                                return {
                                  ...o,
                                  [posKey(spot.id)]: {
                                    x: clamp(cur.x + dx / scale() / area.w, 44 / area.w, 1 - 44 / area.w),
                                    y: clamp(cur.y + dy / scale() / area.h, 44 / area.h, 1 - 52 / area.h),
                                  },
                                };
                              })
                            }
                          />
                        );
                      })}
                    </ul>
                    {visible.map((w) => {
                      const common = {
                        active: topWin?.id === w.id,
                        onFocus: () => focusWin(w.id),
                        onClose: () => closeWin(w.id),
                        onGrab: grab(w.id),
                      };
                      if (w.app === "about") {
                        return (
                          <Win key={w.id} {...common} win={{ ...w }} title="About This Mac" className="win-about" resizable={false}>
                            <AboutView />
                          </Win>
                        );
                      }
                      const maximised = compact || w.max ? { x: 0, y: MENU_BAR, w: dim.w, h: dim.h - MENU_BAR - DOCK_H + 6 } : {};
                      const title = w.app === "notes" ? "Notes" : (FOLDERS.find((f) => f.id === w.hist[w.hi])?.name ?? "Finder");
                      return (
                        <Win
                          key={w.id}
                          {...common}
                          win={{ ...w, ...maximised }}
                          title={title}
                          className={w.app === "notes" ? "win-notes" : "win-finder"}
                          resizable={!compact}
                          onMin={() => patchWin(w.id, { min: true })}
                          onZoom={compact ? undefined : () => patchWin(w.id, { max: !w.max })}
                        >
                          {w.app === "notes" ? (
                            <NotesView folderId={w.hist[w.hi]} onFolder={(id) => navigate(w, id)} />
                          ) : (
                            <FinderView
                              win={w}
                              onNavigate={(id) => navigate(w, id)}
                              onBack={() => patchWin(w.id, { hi: Math.max(0, w.hi - 1) })}
                              onForward={() => patchWin(w.id, { hi: Math.min(w.hist.length - 1, w.hi + 1) })}
                              onOpenNotes={(id) => launch("notes", id)}
                            />
                          )}
                        </Win>
                      );
                    })}
                    {notice && !collapsed && !wins.length && (
                      <NoticeCard
                        onOpen={() => {
                          setNotice(false);
                          launch("finder", FOLDERS[0].id);
                        }}
                        onClose={() => setNotice(false)}
                      />
                    )}
                    <nav className="dock" aria-label="Dock">
                      <DockItem label="Finder" running onClick={() => dockClick("finder")}>
                        <img
                          src="/icons/Finder_Icon_macOS_Tahoe.png"
                          alt=""
                          width={116}
                          height={116}
                          draggable={false}
                          className="dock-img"
                        />
                      </DockItem>
                      <DockItem label="About Me" running={isOpen("about")} bouncing={bouncing === "about"} onClick={() => dockClick("about")}>
                        <span className="sq">
                          <img src="/punya.jpg" alt="" width={80} height={80} draggable={false} />
                        </span>
                      </DockItem>
                      <DockItem
                        label="Notes"
                        running={isOpen("notes")}
                        bouncing={bouncing === "notes"}
                        onClick={() => dockClick("notes", "experience")}
                      >
                        <span className="sq">
                          <NotesIcon />
                        </span>
                      </DockItem>
                      <DockItem label="Mail" href={`mailto:${person.email}`}>
                        <span className="sq">
                          <MailIcon />
                        </span>
                      </DockItem>
                      <span className="dock-sep" aria-hidden />
                      {DOCK_LINKS.map((l) => (
                        <DockItem key={l.label} label={l.label} href={l.url} external>
                          <DockGlyph label={l.label} />
                        </DockItem>
                      ))}
                    </nav>
                  </div>
                  {askRotate && (
                    <div className="mac-rotate" role="dialog" aria-label="Rotate your phone">
                      <svg viewBox="0 0 48 48" aria-hidden>
                        <rect x="14" y="6" width="20" height="36" rx="4" />
                        <path d="M40 14c2 3 3 6 3 10M8 34c-2-3-3-6-3-10" />
                        <path d="m37 12 3 3 3-3M11 36l-3-3-3 3" />
                      </svg>
                      <p>Rotate your phone</p>
                      <p>The desktop is built for a wide screen. Turn your phone sideways to use it properly.</p>
                      <button type="button" onClick={() => setRotateOk(true)}>
                        Continue anyway
                      </button>
                    </div>
                  )}
                  {collapsed && (
                    <button type="button" className="mac-open-hit" aria-label="Open the desktop" onClick={() => setFullscreen(true)} />
                  )}
                  {fullscreen && (
                    <button type="button" className="mac-exit" aria-label="Close the desktop" onClick={() => setFullscreen(false)}>
                      <svg viewBox="0 0 12 12" aria-hidden>
                        <path d="m3 3 6 6m0-6L3 9" />
                      </svg>
                    </button>
                  )}
                </div>
                <img
                  src="/desktop/macbook.webp"
                  alt=""
                  aria-hidden
                  width={1605}
                  height={980}
                  draggable={false}
                  className="mac-frame"
                />
              </div>
            </div>
            {isSmall && (
              <button type="button" className="mac-open" onClick={() => setFullscreen(true)}>
                Open the desktop
                <svg viewBox="0 0 12 12" aria-hidden>
                  <path d="M4.5 1.5h6v6M10.5 1.5 5 7M1.5 4v6.5H8" />
                </svg>
              </button>
            )}
          </InView>
        </div>
      </div>
    </section>
  );
}
