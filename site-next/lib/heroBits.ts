/**
 * Pointer trail of fading 0/1 glyphs painted on a canvas inside the hero's `.hero-layers`.
 * Port of the reference's lazy `initHeroBits`. Returns a disposer (or undefined if there is nothing to mount on).
 */
export function initHeroBits(hero: HTMLElement): (() => void) | undefined {
  const layers = hero.querySelector(".hero-layers");
  if (!layers) return;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;font-family:var(--font-mono)";
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  layers.appendChild(canvas);

  const CELL = 16;
  const LIFE = 620;
  const font = `500 11px ${getComputedStyle(canvas).fontFamily || "monospace"}`;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    const w = Math.max(2, Math.round(hero.clientWidth * dpr));
    const h = Math.max(2, Math.round(hero.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(hero);

  type Cell = { x: number; y: number; t: number; one: boolean };
  const cells = new Map<string, Cell>();
  let raf = 0;
  let tx = 0, ty = 0, sx = 0, sy = 0; // target / smoothed pointer
  let inside = false;

  const touch = (cx: number, cy: number, t: number) => {
    const key = `${cx},${cy}`;
    const c = cells.get(key);
    if (c) c.t = t;
    else cells.set(key, { x: (cx + 0.5) * CELL, y: (cy + 0.5) * CELL, t, one: Math.random() < 0.5 });
  };
  const splash = (x: number, y: number, t: number) => {
    const cx = Math.floor(x / CELL), cy = Math.floor(y / CELL);
    touch(cx, cy, t);
    if (Math.random() < 0.3) touch(cx + (Math.random() < 0.5 ? -1 : 1), cy, t);
    if (Math.random() < 0.3) touch(cx, cy + (Math.random() < 0.5 ? -1 : 1), t);
  };

  const frame = (now: number) => {
    const px = sx, py = sy;
    sx += (tx - sx) * 0.4;
    sy += (ty - sy) * 0.4;
    const dist = Math.hypot(sx - px, sy - py);
    if (dist > 0.5) {
      const steps = Math.max(1, Math.ceil(dist / 8));
      for (let i = 1; i <= steps; i++) splash(px + ((sx - px) * i) / steps, py + ((sy - py) * i) / steps, now);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    for (const [key, c] of cells) {
      const k = 1 - (now - c.t) / LIFE;
      if (k <= 0) { cells.delete(key); continue; }
      if (Math.random() < 0.05) c.one = !c.one;
      ctx.globalAlpha = 0.8 * k * k;
      ctx.fillText(c.one ? "1" : "0", c.x, c.y);
    }
    ctx.globalAlpha = 1;
    raf = cells.size || dist > 0.5 ? requestAnimationFrame(frame) : 0;
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const was = inside;
    inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
    if (!inside) return;
    tx = x; ty = y;
    if (!was) { sx = x; sy = y; }
    if (!raf) raf = requestAnimationFrame(frame);
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener("pointermove", onMove);
    canvas.remove();
  };
}
