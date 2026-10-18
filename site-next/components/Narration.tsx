"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { narration } from "@/content/narration";

/**
 * "Sound on" toggle + per-section voiceover. Browsers block autoplay, so nothing plays until the visitor
 * turns sound on. Each section's line plays once, when it is mostly in view; missing mp3s are skipped.
 */
export function Narration() {
  const [on, setOn] = useState(false);
  const [caption, setCaption] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const played = useRef(new Set<string>());
  const available = useRef(new Map<string, boolean>());

  const stop = useCallback(() => {
    audio.current?.pause();
    audio.current = null;
    setCaption(null);
  }, []);

  const play = useCallback(async (id: string, text: string) => {
    const src = `/voice/${id}.mp3`;
    if (!available.current.has(id)) {
      const res = await fetch(src, { method: "HEAD" }).catch(() => null);
      available.current.set(id, !!res?.ok && (res.headers.get("content-type") ?? "").startsWith("audio"));
    }
    if (!available.current.get(id)) return;
    audio.current?.pause();
    const a = new Audio(src);
    audio.current = a;
    a.onended = () => { if (audio.current === a) { audio.current = null; setCaption(null); } };
    try { await a.play(); setCaption(text); } catch { /* blocked or interrupted: ignore */ }
  }, []);

  useEffect(() => {
    if (!on) { stop(); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const id = e.target.id;
        if (played.current.has(id)) continue;
        played.current.add(id);
        const line = narration.find((n) => n.id === id);
        if (line) void play(id, line.text);
      }
    }, { threshold: 0.5 });
    for (const n of narration) { const el = document.getElementById(n.id); if (el) io.observe(el); }
    return () => { io.disconnect(); stop(); };
  }, [on, play, stop]);

  return (
    <>
      <div style={{ position: "fixed", left: "50%", bottom: "5rem", transform: "translateX(-50%)", zIndex: 58, maxWidth: "min(34rem, calc(100vw - 2rem))", pointerEvents: "none",
        opacity: caption ? 1 : 0, transition: "opacity .3s" }}>
        <p style={{ background: "rgba(10,10,10,.82)", color: "#fff", padding: ".6rem 1rem", borderRadius: "999px", fontSize: ".9375rem", textAlign: "center", backdropFilter: "blur(16px)" }}>{caption}</p>
      </div>
      <button type="button" aria-pressed={on} onClick={() => { played.current.clear(); setOn((v) => !v); }}
        style={{ position: "fixed", left: "50%", bottom: "1.25rem", transform: "translateX(-50%)" }}
        className="text-meta z-[58] flex h-10 items-center gap-2.5 rounded-pill border border-white/12 bg-ink/80 px-3.5 uppercase text-white backdrop-blur-xl">
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 6v4h3l4 3V3L5 6H2Z" />{on ? <path d="M11.5 5.5a3.5 3.5 0 0 1 0 5M13 3.5a6 6 0 0 1 0 9" /> : <path d="M11.5 6l3 4M14.5 6l-3 4" />}
        </svg>
        Sound {on ? "on" : "off"}
      </button>
    </>
  );
}
