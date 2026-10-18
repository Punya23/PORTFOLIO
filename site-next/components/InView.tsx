"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode, type ElementType } from "react";

/** Sets data-in="true" once on first intersection; CSS (data-inview) does the reveal. */
export function InView({ children, className, style, threshold = 0.25, as: Tag = "div" }: {
  children?: ReactNode; className?: string; style?: CSSProperties; threshold?: number; as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.dataset.in = "true"; return; }
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { el.dataset.in = "true"; io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return <Tag ref={ref} className={className} style={style} data-inview>{children}</Tag>;
}
