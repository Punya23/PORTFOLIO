"use client";
import { useEffect, useRef } from "react";

type P = { ox: number; oy: number; x: number; y: number; vx: number; vy: number };

/**
 * A word drawn as dots. Dots spring back to their place; the pointer pushes them away, and as the block
 * scrolls through the viewport a ring ripples outward from its centre and displaces the dots it crosses.
 * The canvas fills its parent, which must have a height.
 */
export function ParticleWord({ text, color = "#ffffff", gap = 5, dot = 1.5, className }: {
  text: string; color?: string; gap?: number; dot?: number; className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current, cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = 1, raf = 0, visible = true;
    let parts: P[] = [];
    let px = -1e4, py = -1e4;

    const build = () => {
      W = el.clientWidth; H = el.clientHeight;
      if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Sample the word from an offscreen 1x canvas.
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      const font = (s: number) => `800 ${s}px Inter, system-ui, sans-serif`;
      let size = H * 0.95;
      o.font = font(size);
      const w = o.measureText(text).width;
      if (w > W * 0.94) size *= (W * 0.94) / w;
      o.font = font(size);
      o.textAlign = "center"; o.textBaseline = "middle"; o.fillStyle = "#fff";
      o.fillText(text, W / 2, H / 2);
      const data = o.getImageData(0, 0, W, H).data;
      parts = [];
      for (let y = 0; y < H; y += gap)
        for (let x = 0; x < W; x += gap)
          if (data[(y * W + x) * 4 + 3] > 128) parts.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = color;
      ctx.beginPath();
      for (const p of parts) { ctx.moveTo(p.x + dot, p.y); ctx.arc(p.x, p.y, dot, 0, Math.PI * 2); }
      ctx.fill();
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top enters the bottom of the viewport, 1 when its bottom leaves the top.
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const cx = W / 2, cy = H / 2, maxR = Math.hypot(cx, cy);
      const ring = p * maxR * 1.5, band = maxR * 0.16;
      const pr = 70;
      for (const d of parts) {
        let tx = d.ox, ty = d.oy;
        const dx = d.ox - cx, dy = d.oy - cy, dist = Math.hypot(dx, dy) || 1;
        const k = 1 - Math.abs(dist - ring) / band;
        if (k > 0) { const push = k * k * 26; tx += (dx / dist) * push; ty += (dy / dist) * push; }
        const mx = d.x - px, my = d.y - py, md = Math.hypot(mx, my);
        if (md < pr) { const f = (1 - md / pr) * 6; d.vx += (mx / (md || 1)) * f; d.vy += (my / (md || 1)) * f; }
        d.vx = (d.vx + (tx - d.x) * 0.08) * 0.82;
        d.vy = (d.vy + (ty - d.y) * 0.08) * 0.82;
        d.x += d.vx; d.y += d.vy;
      }
      draw();
    };

    const move = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; };
    const leave = () => { px = py = -1e4; };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; });
    io.observe(el);
    if (!reduce) {
      raf = requestAnimationFrame(frame);
      cv.addEventListener("pointermove", move);
      cv.addEventListener("pointerleave", leave);
    }
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      cv.removeEventListener("pointermove", move); cv.removeEventListener("pointerleave", leave);
    };
  }, [text, color, gap, dot]);

  return (
    <div ref={wrap} className={className} style={{ position: "relative", width: "100%", height: "100%", touchAction: "pan-y" }}>
      <canvas ref={canvas} role="img" aria-label={text} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
}
