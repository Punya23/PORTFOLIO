"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

const BASE = { rx: 7, ry: -18 };
const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));

/** Layered 3D card that eases toward the pointer (relative to `scope`) and idles with a slow float. */
export function Card3D({ className = "", src, alt, scope = "section" }: { className?: string; src: string; alt: string; scope?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const area = el.closest(scope) ?? el;
    let tx = 0, ty = 0, rx = BASE.rx, ry = BASE.ry, raf = 0, running = false;
    const move = (e: PointerEvent) => {
      const c = el.getBoundingClientRect(), a = area.getBoundingClientRect();
      tx = clamp1((e.clientX - (c.left + c.width / 2)) / (a.width / 2));
      ty = clamp1((e.clientY - (c.top + c.height / 2)) / (a.height / 2));
    };
    const leave = () => { tx = 0; ty = 0; };
    const frame = (now: number) => {
      const t = now / 1000;
      rx += (BASE.rx + 2.5 * Math.cos(0.55 * t) - 16 * ty - rx) * 0.07;
      ry += (BASE.ry + 7 * Math.sin(0.4 * t) + 34 * tx - ry) * 0.07;
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--lift", `${(8 * Math.sin(0.9 * t)).toFixed(1)}px`);
      el.style.setProperty("--gx", `${(50 - 1.6 * ry).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(30 - 1.8 * rx).toFixed(1)}%`);
      raf = requestAnimationFrame(frame);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    // Only animate while on screen.
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) { if (!running) { running = true; raf = requestAnimationFrame(frame); } } else stop();
    });
    io.observe(el);
    if (fine) { area.addEventListener("pointermove", move as EventListener, { passive: true }); area.addEventListener("pointerleave", leave); }
    return () => {
      stop(); io.disconnect();
      area.removeEventListener("pointermove", move as EventListener);
      area.removeEventListener("pointerleave", leave);
    };
  }, [scope]);

  return (
    <div ref={ref} className={`card3d ${className}`}>
      <span aria-hidden="true" className="card3d-shadow" />
      <div className="card3d-body">
        {Array.from({ length: 9 }, (_, i) => <i key={i} aria-hidden="true" style={{ "--z": i + 1 } as React.CSSProperties} />)}
        <div className="card3d-face">
          <Image src={src} alt={alt} fill priority sizes="(min-width: 1024px) 460px, 78vw" className="object-cover" />
          <span aria-hidden="true" className="card3d-glare" />
        </div>
      </div>
    </div>
  );
}
