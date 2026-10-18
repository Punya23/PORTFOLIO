"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { scrollToTop } from "@/lib/scroll";
import { NavLink } from "./NavLink";

type Social = { id: string; label: string; url: string };

const IDLE = "Have something\nworth shipping?\nPress a key";

const ICON = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57v-2.23c-3.34.72-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.02 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.25 6.93zM17.61 20.64h2.04L6.48 3.24H4.3z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6.5L20.5 7" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />
    </svg>
  ),
  dot: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-[62%]! text-ember">
      <circle cx="12" cy="12" r="12" />
    </svg>
  ),
  work: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
};

const Num = ({ n }: { n: number }) => (
  <span aria-hidden="true" className="keypad-num"><i>P</i>{n}</span>
);

const KNOB = (
  <span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 8.5 9 5h5l-4 3.5v10L5 15z" />
      <path d="m10 8.5 4-3.5h5l-4 3.5v10L10 22z" />
    </svg>
  </span>
);

const Sides = () => (
  <>
    <span aria-hidden="true" className="keypad-side keypad-side-a" />
    <span aria-hidden="true" className="keypad-side keypad-side-b" />
    <span aria-hidden="true" className="keypad-side keypad-side-c" />
  </>
);

type Key = {
  id: string; tone: string; label: string; line: string; icon: ReactNode;
  href?: string; external?: boolean; onPress?: () => void;
};

/** Static, non-interactive keypad used as the menu's "Contact" hover preview. */
export function KeypadPreview({ className }: { className?: string }) {
  const keys: Array<[string, string, ReactNode]> = [
    ["linkedin", "LinkedIn", ICON.linkedin], ["white", "GitHub", ICON.github], ["black", "X", ICON.x],
    ["red", "Email", ICON.mail], ["orange", "LeetCode", ICON.code], ["white", "Resume", ICON.dot],
    ["green", "Work", ICON.work], ["peach", "About", <Num n={8} key="n" />], ["yellow", "Home", ICON.code],
  ];
  return (
    <div aria-hidden="true" className={`keypad ${className ?? ""}`}>
      <Sides />
      <div className="keypad-top">
        <div className="keypad-screen">
          <p>Say hello.{"\n"}Press a key<b>_</b></p>
          <span className="keypad-slot">P0</span>
          <span className="keypad-count">0</span>
        </div>
        <span className="keypad-knob">{KNOB}</span>
        <i className="keypad-led" />
      </div>
      <ul className="keypad-keys">
        {keys.map(([tone, label, icon]) => (
          <li data-tone={tone} key={label}>
            <span className="keypad-key"><span className="keypad-cap"><span aria-hidden="true" className="keypad-face">{icon}</span><em>{label}</em></span></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Shortcut keypad. The reference mounts a lazy WebGL "mountKeypad" enhancement (hover/press lighting);
 * its chunk isn't recoverable, so this renders the full DOM keypad, which site.css styles on its own.
 */
export function Keypad({ socials, email, resumeUrl }: { socials: Social[]; email: string; resumeUrl: string }) {
  const [line, setLine] = useState(IDLE);
  const [slot, setSlot] = useState("P0");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const url = (id: string) => socials.find((s) => s.id === id)?.url;
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setLine("Email copied\nto clipboard");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setLine(IDLE), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  const keys: Key[] = [
    { id: "linkedin", tone: "linkedin", label: "LinkedIn", line: "Connect with me\non LinkedIn", icon: ICON.linkedin, href: url("linkedin"), external: true },
    { id: "github", tone: "white", label: "GitHub", line: "Read my code\non GitHub", icon: ICON.github, href: url("github"), external: true },
    { id: "x", tone: "black", label: "X", line: "Follow me on X", icon: ICON.x, href: url("x"), external: true },
    { id: "email", tone: "red", label: "Email", line: "Copy my email\naddress", icon: ICON.mail, onPress: copyEmail },
    { id: "leetcode", tone: "orange", label: "LeetCode", line: "See my LeetCode\nprofile", icon: ICON.code, href: url("leetcode"), external: true },
    { id: "resume", tone: "white", label: "Resume", line: "Download my\nresume", icon: ICON.dot, href: resumeUrl, external: true },
    { id: "work", tone: "green", label: "Work", line: "Browse my\nselected work", icon: ICON.work, href: "#work" },
    { id: "about", tone: "peach", label: "About", line: "Read more\nabout me", icon: <Num n={8} />, href: "#desktop" },
    // Reference's 9th key is Instagram; Punya has none, so it takes the reference's own "Home" fallback key.
    { id: "home", tone: "yellow", label: "Home", line: "Back to\nthe start", icon: ICON.code, href: "/" },
  ];

  return (
    <div className="keypad" data-cursor-dot role="group" aria-label="Shortcut keypad">
      <Sides />
      <div className="keypad-top">
        <div className="keypad-screen" aria-live="polite">
          <p>{line}<b aria-hidden="true">_</b></p>
          <span aria-hidden="true" className="keypad-slot">{slot}</span>
          <span aria-hidden="true" className="keypad-count">0</span>
        </div>
        <button
          type="button"
          className="keypad-knob"
          aria-label="Back to top"
          onClick={() => scrollToTop(1.6)}
          onPointerEnter={() => setLine("Turn it up:\nback to top")}
          onPointerLeave={() => setLine(IDLE)}
        >
          {KNOB}
        </button>
        <i aria-hidden="true" className="keypad-led" />
      </div>
      <ul className="keypad-keys">
        {keys.map((k, i) => {
          const on = () => { clearTimeout(timer.current); setLine(k.line); setSlot(`P${i + 1}`); };
          const off = () => { setLine(IDLE); setSlot("P0"); };
          const handlers = { onPointerEnter: on, onPointerLeave: off, onFocus: on, onBlur: off };
          const cap = (
            <span className="keypad-cap">
              <span aria-hidden="true" className="keypad-face">{k.icon}</span>
              <em aria-hidden="true">{k.label}</em>
            </span>
          );
          return (
            <li data-tone={k.tone} key={k.id}>
              {k.href && k.external ? (
                <a href={k.href} target="_blank" rel="noopener noreferrer" aria-label={k.label} {...handlers}>{cap}</a>
              ) : k.href ? (
                <NavLink href={k.href} aria-label={k.label} {...handlers}>{cap}</NavLink>
              ) : (
                <button type="button" aria-label={k.label} onClick={k.onPress} {...handlers}>{cap}</button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
