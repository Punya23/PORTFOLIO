"use client";
import { useEffect, useRef, useState } from "react";

/** Types `text` out once it is fully on screen (CSS in site.css hides/reveals `.tw` via data-tw / data-on). */
export function Typewriter({ text, className, step = 70 }: { text: string; className?: string; step?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(-1);
  const chars = Array.from(text);
  const total = chars.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    const run = (i: number) => {
      setN(i);
      if (i >= total) return;
      const prev = chars[i - 1];
      const base = i === 0 ? 650 : prev === " " ? step * 2.2 : prev && /[^\p{L}\p{N}]/u.test(prev) ? step * 3 : step;
      timer = window.setTimeout(() => run(i + 1), base * (0.65 + 0.7 * Math.random()));
    };
    if (typeof IntersectionObserver === "undefined") {
      timer = window.setTimeout(() => run(0), 0);
      return () => window.clearTimeout(timer);
    }
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { io.disconnect(); run(0); } }, { threshold: 1 });
    io.observe(el);
    return () => { io.disconnect(); window.clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, step]);

  const cur = Math.max(n, 0);
  const span = (c: string, i: number) => <span className="tw" data-on={i < n ? "" : undefined} key={i}>{c}</span>;
  return (
    <span ref={ref} className={className} data-tw={n < 0 ? "idle" : n === 0 ? "wait" : n < total ? "typing" : "done"}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.slice(0, cur).map(span)}
        {n >= 0 && <span className="tw-caret" />}
        {chars.slice(cur).map((c, i) => span(c, i + cur))}
      </span>
    </span>
  );
}
