"use client";
import Link from "next/link";
import { useCallback, useRef, useState, type CSSProperties } from "react";
import { BlurHeading, BlurReveal } from "@/components/BlurReveal";
import { ScrollScene } from "@/components/ScrollScene";
import { ProjectMedia, type Media } from "@/components/ProjectMedia";
import { useHoverFine, useMedia } from "@/lib/hooks";
import { clamp, cn, pad2 } from "@/lib/cn";

export type DeckProject = {
  slug: string; title: string; role: string; year: string;
  /** Screenshot/video cover. Omit to show the gradient placeholder. */
  cover?: Media; accentColor?: string;
};

const Arrow = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Deck({ projects, total }: { projects: DeckProject[]; total: number }) {
  const m = projects.length;
  const [idx, setIdx] = useState(0);
  const mobile = useMedia("(max-width: 899.98px)");
  const hoverFine = useHoverFine();
  const dragged = useRef(false);
  const start = useRef<{ x: number; y: number } | null>(null);

  // Desktop: scroll progress through the pinned section picks the active card.
  const onProgress = useCallback((p: number) => {
    if (mobile) return;
    const span = (m - 1) * 110 + 60;
    setIdx(Math.round(clamp((p * span) / 110, 0, m - 1)));
  }, [mobile, m]);
  const step = useCallback((d: number) => setIdx((i) => clamp(i + d, 0, m - 1)), [m]);

  const next = projects[(idx + 1) % m] ?? projects[0];
  const cur = projects[idx];

  return (
    <ScrollScene id="work" tone="paper" onProgress={onProgress} className="deck tone-paper relative"
      style={{ "--count": m, "--idx": idx } as CSSProperties}>
      <div className="deck-stage sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <BlurReveal className="wrap grid-12 items-center gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <BlurHeading lines={["Selected", "work"]} className="text-h2 lg:pr-4">
              <span className="text-meta ml-2 align-top font-normal text-muted">({pad2(m)})</span>
            </BlurHeading>
            <Link href="/work" data-cursor="Open"
              className="group mt-8 hidden max-w-[16rem] items-center justify-between border-y border-line py-3.5 text-[1.0625rem] transition-colors hover:border-ember lg:flex">
              <span>All work</span>
              <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-4">
            <div className="deck-stack relative"
              onPointerDown={(e) => { start.current = { x: e.clientX, y: e.clientY }; dragged.current = false; }}
              onPointerMove={(e) => { if (start.current && Math.abs(e.clientX - start.current.x) > 10) dragged.current = true; }}
              onPointerUp={(e) => {
                const s = start.current; start.current = null;
                if (!s || !mobile) return;
                const dx = e.clientX - s.x;
                if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(e.clientY - s.y)) step(dx < 0 ? 1 : -1);
              }}
              onClickCapture={(e) => { if (dragged.current) { e.preventDefault(); e.stopPropagation(); } }}>
              {projects.map((p, i) => (
                <article key={p.slug} className="deck-card" style={{ "--i": i, zIndex: m - i } as CSSProperties}
                  inert={!hoverFine && i !== idx}>
                  <Link href={`/work/${p.slug}`} data-cursor="View" aria-label={`${p.title}, ${p.role || "case study"}, ${p.year}`}
                    className="absolute inset-0 block">
                    <span data-shared-source className="absolute inset-0 block overflow-hidden rounded-[10px] bg-ink">
                      <ProjectMedia media={p.cover} title={p.title} index={i} accent={p.accentColor}
                        sizes="(min-width: 900px) 58vw, 92vw" priority={i === 0} />
                    </span>
                  </Link>
                </article>
              ))}
              <div className="deck-captions" aria-live="polite">
                {projects.map((p, i) => (
                  <div key={p.slug} data-active={i === idx || undefined}
                    className="deck-caption grid grid-cols-[1fr_auto_1fr] items-start gap-4 text-[0.8125rem]">
                    <span className="text-meta">({pad2(i + 1)})</span>
                    <span className="text-center">
                      <span className="block font-medium text-[0.9375rem] leading-none">{p.title}</span>
                      <span className="block text-muted">{p.role}</span>
                    </span>
                    <span className="text-right text-meta">© {p.year}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-24 flex items-center justify-between lg:hidden">
              <div className="flex" role="group" aria-label="Choose project">
                {projects.map((p, i) => (
                  <button key={p.slug} type="button" onClick={() => setIdx(i)} aria-label={`Show ${p.title}`}
                    aria-current={i === idx} className="grid h-11 w-7 place-items-center">
                    <span className={cn("block h-1.5 rounded-pill transition-all duration-300", i === idx ? "w-8 bg-ink" : "w-1.5 bg-ink/25")} />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => step(-1)} disabled={idx === 0} aria-label="Previous project"
                  className="grid size-11 rotate-180 place-items-center rounded-pill bg-ink text-white transition-opacity disabled:opacity-30">
                  <ArrowRight />
                </button>
                <button type="button" onClick={() => step(1)} disabled={idx === m - 1} aria-label="Next project"
                  className="grid size-11 place-items-center rounded-pill bg-ink text-white transition-opacity disabled:opacity-30">
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>
          <div className="hidden lg:col-span-2 lg:col-start-11 lg:flex lg:justify-end">
            <Link href="/work" className="group flex items-center gap-4 rounded-tile bg-ink/[0.06] pr-5 text-[1.0625rem] font-medium transition-colors hover:bg-ink/10">
              <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-l-tile">
                <ProjectMedia media={next.cover} title={next.title} index={(idx + 1) % m} accent={next.accentColor} numeral={false} sizes="64px" />
              </span>
              <span className="whitespace-nowrap">See all <span className="text-muted">({pad2(total)})</span></span>
            </Link>
          </div>
        </BlurReveal>
        <span className="sr-only">Showing {cur.title}</span>
      </div>
    </ScrollScene>
  );
}
