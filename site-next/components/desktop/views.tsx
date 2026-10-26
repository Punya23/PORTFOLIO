"use client";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { person } from "@/content/punya";
import {
  ActionIcon, BulletsIcon, ChecklistIcon, ChevDown, ChevLeft, ChevRight, ComposeIcon, DocIcon, FolderIcon,
  FontIcon, GridIcon, ListIcon, LockIcon, SearchIcon, ShareIcon, SideFolderIcon, SideNoteIcon, TableIcon,
  TagIcon, TrashIcon, XIcon,
} from "./icons";
import { ABOUT_ROWS, FOLDERS, NOTE_FOLDERS, type Skill, type Spot, type WinState } from "./data";

export type Grab = "move" | "r" | "b" | "rb";
export type MenuItem = "-" | { label: string; keys?: string; off?: boolean; check?: boolean; sub?: boolean; run?: () => void };
export type Menu = { id: string; title: string; items: MenuItem[] };

export function Win(props: {
  win: WinState;
  active: boolean;
  title: string;
  className?: string;
  resizable?: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMin?: () => void;
  onZoom?: () => void;
  onGrab: (e: PointerEvent, how: Grab) => void;
  children?: ReactNode;
}) {
  let {
      win,
      active,
      title,
      className,
      resizable = true,
      onFocus,
      onClose,
      onMin,
      onZoom,
      onGrab,
      children,
    } = props,
    grab = (e: Grab) => (t: PointerEvent) => {
      (t.stopPropagation(), onFocus(), onGrab(t, e));
    };
  return (
    <div
      className={cn("win", className)}
      data-active={active || undefined}
      data-max={win.max || undefined}
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
      }}
      role="dialog"
      aria-label={title}
      onPointerDown={(e) => {
        onFocus();
        let t = e.target as HTMLElement;
        0 === e.button &&
          t.closest("[data-drag]") &&
          !t.closest("button, a, input, [data-nodrag]") &&
          onGrab(e, "move");
      }}
      onDoubleClick={(e) => {
        let t = e.target as HTMLElement;
        onZoom &&
          t.closest("header[data-drag]") &&
          !t.closest("button") &&
          onZoom();
      }}
    >
      <div className="tls">
        <button
          type="button"
          className="tl tl-close"
          aria-label="Close"
          onClick={onClose}
        >
          <svg viewBox="0 0 12 12" aria-hidden>
            <path d="m3.6 3.6 4.8 4.8m0-4.8L3.6 8.4" />
          </svg>
        </button>
        <button
          type="button"
          className="tl tl-min"
          aria-label="Minimise"
          onClick={onMin}
          disabled={!onMin}
        >
          <svg viewBox="0 0 12 12" aria-hidden>
            <path d="M2.8 6h6.4" />
          </svg>
        </button>
        <button
          type="button"
          className="tl tl-zoom"
          aria-label={win.max ? "Exit full size" : "Full size"}
          onClick={onZoom}
          disabled={!onZoom}
        >
          <svg viewBox="0 0 12 12" aria-hidden>
            <path d="M3.3 4.4v4.3h4.3zM8.7 7.6V3.3H4.4z" className="fill" />
          </svg>
        </button>
      </div>
      {children}
      {resizable && !win.max && (
        <>
          <span className="rz rz-r" onPointerDown={grab("r")} />
          <span className="rz rz-b" onPointerDown={grab("b")} />
          <span className="rz rz-rb" onPointerDown={grab("rb")} />
        </>
      )}
    </div>
  );
}

export function FinderView(props: {
  win: WinState;
  onNavigate: (id: string) => void;
  onBack: () => void;
  onForward: () => void;
  onOpenNotes: (id: string) => void;
}) {
  let { win, onNavigate, onBack, onForward, onOpenNotes } = props,
    folder = FOLDERS.find((e) => e.id === win.hist[win.hi]) ?? FOLDERS[0],
    [sel, setSel] = useState<number | null>(null);
  useEffect(() => setSel(null), [folder.id]);
  let skill = null === sel ? null : folder.skills[sel];
  const also = skill
    ? FOLDERS.filter((f) => f.id !== folder.id && f.skills.some((k) => k.name === skill.name)).map((f) => f.name)
    : [];
  return (
    <div className="fd">
      <aside className="side" data-drag>
        <p className="side-h">Skills</p>
        {FOLDERS.map((e) => (
          <button
            key={e.id}
            type="button"
            className="side-i"
            data-on={e.id === folder.id || undefined}
            onClick={() => onNavigate(e.id)}
          >
            <SideFolderIcon className="side-ico" />
            <span>{e.name}</span>
          </button>
        ))}
        <p className="side-h">Notes</p>
        <button
          type="button"
          className="side-i"
          onClick={() => onOpenNotes("experience")}
        >
          <SideNoteIcon className="side-ico" />
          <span>Experience</span>
        </button>
        <button
          type="button"
          className="side-i"
          onClick={() => onOpenNotes("highlights")}
        >
          <SideNoteIcon className="side-ico" />
          <span>Highlights</span>
        </button>
      </aside>
      <div className="fd-main">
        <header className="tb" data-drag>
          <div className="tb-nav">
            <button
              type="button"
              className="tb-btn"
              aria-label="Back"
              disabled={0 === win.hi}
              onClick={onBack}
            >
              <ChevLeft />
            </button>
            <button
              type="button"
              className="tb-btn"
              aria-label="Forward"
              disabled={win.hi >= win.hist.length - 1}
              onClick={onForward}
            >
              <ChevRight />
            </button>
          </div>
          <h2 className="tb-title">{folder.name}</h2>
          <div className="tb-tools" aria-hidden>
            <span className="tb-btn tb-wide">
              <GridIcon />
              <ChevDown className="tb-chev" />
            </span>
            <span className="tb-btn tb-wide tb-x">
              <ListIcon />
              <ChevDown className="tb-chev" />
            </span>
            <span className="tb-btn tb-x">
              <ShareIcon />
            </span>
            <span className="tb-btn tb-x">
              <TagIcon />
            </span>
            <span className="tb-btn tb-wide">
              <ActionIcon />
              <ChevDown className="tb-chev" />
            </span>
            <span className="tb-btn">
              <SearchIcon />
            </span>
          </div>
        </header>
        <div className="fd-body">
          <div
            className="fd-scroll"
            onPointerDown={(e) => e.target === e.currentTarget && setSel(null)}
          >
            <ul
              className="fd-grid"
              onPointerDown={(e) =>
                e.target === e.currentTarget && setSel(null)
              }
            >
              {folder.skills.map((e, t) => (
                <li key={`${e.name}-${t}`}>
                  <button
                    type="button"
                    className="fi"
                    data-on={sel === t || undefined}
                    onPointerDown={() => setSel(t)}
                    onFocus={() => setSel(t)}
                  >
                    <SkillTile skill={e} />
                    <span className="fi-name">{e.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="fd-preview">
            {skill ? (
              <>
                <SkillTile skill={skill} size="lg" />
                <p className="pv-name">{skill.name}</p>
                <p className="pv-kind">Skill</p>
                <p className="pv-h">Information</p>
                <dl className="pv-info">
                  <dt>Where</dt>
                  <dd>
                    {"Skills ▸ "}
                    {folder.name}
                  </dd>
                  {also.length > 0 && (
                    <>
                      <dt>Also in</dt>
                      <dd>{also.join(", ")}</dd>
                    </>
                  )}
                </dl>
              </>
            ) : (
              <>
                <FolderIcon className="pv-folder" />
                <p className="pv-name">{folder.name}</p>
                <p className="pv-kind">
                  {"Folder · "}
                  {folder.skills.length}
                  {" items"}
                </p>
                <p className="pv-h">Information</p>
                <dl className="pv-info">
                  <dt>Comments</dt>
                  <dd>{folder.blurb}</dd>
                </dl>
              </>
            )}
          </div>
        </div>
        <footer className="fd-status">
          {null === sel
            ? `${folder.skills.length} items`
            : `1 of ${folder.skills.length} selected`}
          , 342.71 GB available
        </footer>
      </div>
    </div>
  );
}

const initials = (name: string) => {
  const parts = name.split(/[\s./-]+/).filter(Boolean);
  return (parts.length > 1 ? parts.map((p) => p[0]).join("") : name.slice(0, name.length > 4 ? 2 : 3)).slice(0, 3);
};

function SkillTile({ skill, size }: { skill: Skill; size?: "lg" }) {
  return (
    <span className={cn("tile-wrap", "lg" === size && "tile-lg")}>
      <span className="tile-sh">
        <span className="sq tile" data-mono={!skill.icon || undefined}>
          {skill.icon ? (
            <img
              src={`/icons/${skill.icon}.svg`}
              alt=""
              width={40}
              height={40}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          ) : (
            <span className="tile-mono">
              {initials(skill.name)}
            </span>
          )}
        </span>
      </span>
    </span>
  );
}

export function NotesView({ folderId, onFolder }: { folderId: string; onFolder: (id: string) => void }) {
  const folders = NOTE_FOLDERS;
  const current = folders.find((f) => f.id === folderId) ?? folders[0];
  const [idx, setIdx] = useState(0);
  useEffect(() => setIdx(0), [current.id]);
  let note = current.notes[idx];
  return (
    <div className="nv">
      <aside className="side nv-side" data-drag>
        <p className="side-h">iCloud</p>
        {folders.map((e) => (
          <button
            key={e.id}
            type="button"
            className="side-i"
            data-on={e.id === current.id || undefined}
            onClick={() => onFolder(e.id)}
          >
            <SideFolderIcon className="side-ico nv-ico" />
            <span>{e.name}</span>
            <span className="side-count">{e.notes.length}</span>
          </button>
        ))}
      </aside>
      <div className="nv-list">
        <header className="tb" data-drag>
          <div className="nv-head">
            <h2>{current.name}</h2>
            <p>
              {current.notes.length}
              {" note"}
              {1 === current.notes.length ? "" : "s"}
            </p>
          </div>
          <div className="tb-tools" aria-hidden>
            <span className="tb-btn">
              <BulletsIcon />
            </span>
            <span className="tb-btn tb-x">
              <GridIcon />
            </span>
            <span className="tb-btn">
              <TrashIcon />
            </span>
          </div>
        </header>
        <ul className="nv-items">
          {current.notes.map((e, t) => (
            <li key={e.key}>
              <button
                type="button"
                className="nv-item"
                data-on={t === idx || undefined}
                onClick={() => setIdx(t)}
              >
                <span className="nv-t">{e.title}</span>
                <span className="nv-p">
                  {e.date && <span className="nv-d">{e.date}</span>} {e.preview}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="nv-note">
        <header className="tb" data-drag>
          <div className="tb-tools nv-tools" aria-hidden>
            <span className="tb-btn">
              <ComposeIcon />
            </span>
            <span className="nv-gap" />
            <span className="tb-btn">
              <FontIcon />
            </span>
            <span className="tb-btn">
              <ChecklistIcon />
            </span>
            <span className="tb-btn tb-x">
              <TableIcon />
            </span>
            <span className="nv-gap" />
            <span className="tb-btn tb-x">
              <LockIcon />
            </span>
            <span className="tb-btn">
              <ShareIcon />
            </span>
            <span className="tb-btn">
              <SearchIcon />
            </span>
          </div>
        </header>
        {note && (
          <article className="nv-body">
            {note.date && <p className="nv-stamp">{note.date}</p>}
            <h3>{note.title}</h3>
            {note.sub && <p className="nv-sub">{note.sub.text}</p>}
            {note.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </article>
        )}
      </div>
    </div>
  );
}

export function AboutView() {
  return (
    <div className="ab" data-drag>
      <img
        src="/punya.jpg"
        alt={person.name}
        width={160}
        height={160}
        draggable={false}
        className="ab-img"
      />
      <h2>{person.name}</h2>
      <p className="ab-sub">AI/ML Engineer, Full-Stack Developer</p>
      <dl className="ab-specs">
        {ABOUT_ROWS.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <a href="/about" className="ab-btn" data-nodrag>
        More Info…
      </a>
      <p className="ab-legal">
        ™ and © 2026 {person.name}.
        <br />
        All Rights Reserved.
      </p>
    </div>
  );
}

export function Words({ text, from }: { text: string; from: number }) {
  let
    inHl = false,
    words = text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => {
        let hl = inHl;
        for (const ch of word) ch === "*" ? (inHl = !inHl) : inHl && (hl = true);
        return { w: word.replaceAll("*", ""), hl };
      });
  return (
    <>
      {words.map(({ w, hl }, t) => (
        <span key={t}>
          <span className={hl ? "dk-w hl" : "dk-w"} style={{ "--i": from + t } as CSSProperties}>
            {w}
          </span>
          {t < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

export function NoticeCard({ onOpen, onClose }: { onOpen: () => void; onClose: () => void }) {
  return (
    <div className="nc" role="status">
      <button type="button" className="nc-body" onClick={onOpen}>
        <img
          src="/icons/Finder_Icon_macOS_Tahoe.png"
          alt=""
          width={76}
          height={76}
          draggable={false}
          className="nc-icon"
        />
        <span className="nc-text">
          <span className="nc-top">
            <b>Welcome to my Mac</b>
            <span className="nc-time">now</span>
          </span>
          <span className="nc-msg">
            Everything here works. Double-click a folder to see what I build
            with.
          </span>
        </span>
      </button>
      <button
        type="button"
        className="nc-close"
        aria-label="Dismiss"
        onClick={onClose}
      >
        <svg viewBox="0 0 12 12" aria-hidden>
          <path d="m3.5 3.5 5 5m0-5-5 5" />
        </svg>
      </button>
    </div>
  );
}

export function DesktopIcon(props: {
  item: Spot;
  left: number;
  top: number;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onDrag: (dx: number, dy: number) => void;
}) {
  let { item, left, top, selected, onSelect, onOpen, onDrag } = props,
    dragRef = useRef<{ px: number; py: number; moved: boolean; touch: boolean } | null>(null),
    [dragging, setDragging] = useState(false);
  return (
    <li className="dt-cell" style={{ left, top }}>
      <button
        type="button"
        className="dt-icon"
        data-on={selected || undefined}
        data-dragging={dragging || undefined}
        onPointerDown={(e) => {
          0 === e.button &&
            (onSelect(),
            (dragRef.current = {
              px: e.clientX,
              py: e.clientY,
              moved: false,
              touch: "mouse" !== e.pointerType,
            }),
            e.currentTarget.setPointerCapture(e.pointerId));
        }}
        onPointerMove={(e) => {
          let t = dragRef.current;
          if (!t) return;
          let n = e.clientX - t.px,
            a = e.clientY - t.py;
          (!t.moved && 4 > Math.hypot(n, a)) ||
            (t.moved || setDragging(true),
            (t.moved = true),
            (t.px = e.clientX),
            (t.py = e.clientY),
            onDrag(n, a));
        }}
        onPointerUp={() => {
          let e = dragRef.current;
          ((dragRef.current = null),
            setDragging(false),
            e && !e.moved && e.touch && onOpen());
        }}
        onPointerCancel={() => {
          ((dragRef.current = null), setDragging(false));
        }}
        onDoubleClick={onOpen}
        onKeyDown={(e) => {
          "Enter" === e.key && (e.preventDefault(), onOpen());
        }}
        onFocus={onSelect}
      >
        <span className="dt-art">
          {"folder" === item.kind ? <FolderIcon /> : <DocIcon />}
        </span>
        <span className="dt-label">{item.name}</span>
      </button>
    </li>
  );
}

export function DockItem(props: {
  label: string;
  running?: boolean;
  bouncing?: boolean;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  children?: ReactNode;
}) {
  let { label, running, bouncing, onClick, href, external, children } = props,
    inner = (
      <>
        <span className="dock-icon" data-bounce={bouncing || undefined}>
          {children}
        </span>
        <span className="dock-tip" aria-hidden>
          {label}
        </span>
        {running && <span className="dock-dot" aria-hidden />}
      </>
    );
  return href ? (
    <a
      className="dock-item"
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
    </a>
  ) : (
    <button
      type="button"
      className="dock-item"
      aria-label={label}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}

export function DockGlyph({ label }: { label: string }) {
  switch (label.toLowerCase()) {
    case "github":
      return (
        <span className="sq" style={{ background: "#0d1117" }}>
          <img
            src="/icons/github.svg"
            alt=""
            width={40}
            height={40}
            className="dock-logo invert"
            draggable={false}
          />
        </span>
      );
    case "linkedin":
      return (
        <span className="sq" style={{ background: "#0a66c2" }}>
          <svg viewBox="0 0 24 24" className="dock-logo" aria-hidden>
            <path
              fill="#fff"
              d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.62 4.79 6.03V21h-4v-5.08c0-1.21-.02-2.77-1.7-2.77-1.69 0-1.95 1.32-1.95 2.68V21h-4z"
            />
          </svg>
        </span>
      );
    case "x":
    case "twitter":
      return (
        <span className="sq" style={{ background: "#000", color: "#fff" }}>
          <XIcon className="dock-logo dock-logo-sm" />
        </span>
      );
    case "leetcode":
      return (
        <span className="sq" style={{ background: "#fff" }}>
          <img
            src="/icons/leetcode.svg"
            alt=""
            width={40}
            height={40}
            className="dock-logo"
            draggable={false}
          />
        </span>
      );
    default:
      return (
        <span
          className="sq dock-mono"
          style={{ background: "linear-gradient(#5a5a5f,#2c2c30)" }}
        >
          {label.slice(0, 2)}
        </span>
      );
  }
}

export function MenuTitle(props: {
  id: string;
  menu: string | null;
  setMenu: (id: string | null) => void;
  className?: string;
  label?: string;
  children?: ReactNode;
}) {
  let { id, menu, setMenu, className, label, children } = props;
  return (
    <button
      type="button"
      className={`mb-title ${className ?? ""}`}
      data-open={menu === id || undefined}
      data-menu={id}
      aria-label={label}
      aria-haspopup="menu"
      aria-expanded={menu === id}
      onPointerDown={(e) => {
        (e.preventDefault(), setMenu(menu === id ? null : id));
      }}
      onPointerEnter={() => menu && menu !== id && setMenu(id)}
      onKeyDown={(e) => {
        ("Enter" === e.key || " " === e.key) &&
          (e.preventDefault(), setMenu(menu === id ? null : id));
      }}
    >
      {children}
    </button>
  );
}

export function MenuPanel(props: { items: MenuItem[]; anchor: string; onDone: () => void }) {
  let { items, anchor, onDone } = props,
    ref = useRef<HTMLDivElement>(null),
    [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const title = ref.current?.parentElement?.querySelector<HTMLElement>(`[data-menu="${anchor}"]`);
    setLeft(title ? title.offsetLeft : 0);
  }, [anchor]);
  const run = (item: Exclude<MenuItem, "-">) => {
    if (item.off) return;
    item.run?.();
    onDone();
  };
  return (
    <div
      ref={ref}
      className="menu"
      role="menu"
      style={{
        left: left ?? 0,
        visibility: null === left ? "hidden" : undefined,
      }}
    >
      {items.map((e, t) =>
        "-" === e ? (
          <div key={t} className="menu-sep" role="separator" />
        ) : (
          <button
            key={t}
            type="button"
            role="menuitem"
            className="menu-i"
            aria-disabled={e.off || undefined}
            onPointerUp={() => run(e)}
            onKeyDown={(t) => "Enter" === t.key && run(e)}
          >
            <span className="menu-check">{e.check ? "✓" : ""}</span>
            <span className="menu-label">{e.label}</span>
            {e.keys && <span className="menu-keys">{e.keys}</span>}
            {e.sub && (
              <svg viewBox="0 0 8 12" className="menu-sub" aria-hidden>
                <path
                  d="m1.5 1.5 4.5 4.5-4.5 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        ),
      )}
    </div>
  );
}
