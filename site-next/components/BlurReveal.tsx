"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode, type ElementType } from "react";

function useOnceIn<T extends HTMLElement>(threshold: number) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.dataset.in = "true"; return; }
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { el.dataset.in = "true"; io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

/** Word-by-word blur-in heading. `lines` are split on spaces; each word gets --d / --wi. */
export function BlurHeading({ lines, className, children, step = 110, delay = 0, as: Tag = "h2" }: {
  lines: string[]; className?: string; children?: ReactNode; step?: number; delay?: number; as?: ElementType;
}) {
  const ref = useOnceIn<HTMLElement>(0.4);
  let i = 0;
  return (
    <Tag ref={ref} className={className} data-bw style={delay ? ({ "--bd": `${delay}ms` } as CSSProperties) : undefined}>
      {lines.map((line, li) => (
        <span className="contents" key={li}>
          {li > 0 && <br />}
          {line.split(" ").map((w, wi) => {
            const idx = i++;
            return (
              <span className="contents" key={wi}>
                {wi > 0 && " "}
                <span className="bw" style={{ "--d": `${idx * step}ms`, "--wi": idx } as CSSProperties}>{w}</span>
              </span>
            );
          })}
        </span>
      ))}
      {children}
    </Tag>
  );
}

export function BlurReveal({ children, className, threshold = 0.15 }: { children?: ReactNode; className?: string; threshold?: number }) {
  const ref = useOnceIn<HTMLDivElement>(threshold);
  return <div ref={ref} className={className} data-br>{children}</div>;
}
