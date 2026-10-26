"use client";
import Link from "next/link";
import { useMemo, useRef, useState, useCallback } from "react";
import { ProjectMedia, type Media } from "@/components/ProjectMedia";
import { cn, pad2 } from "@/lib/cn";
import { useHoverFine } from "@/lib/hooks";
import { ArrowUpRight } from "./icons";

export type WorkItem = { slug: string; title: string; year: string; summary: string; categories: string[]; media?: Media };

/** /work index: category filter + grid/list toggle. List view shows a cover that follows the pointer. */
export function WorkIndex({ projects, categoryOrder }: { projects: WorkItem[]; categoryOrder: string[] }) {
  const cats = useMemo(() => categoryOrder.filter((c) => projects.some((p) => p.categories.includes(c))), [projects, categoryOrder]);
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [hover, setHover] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fine = useHoverFine();

  const shown = filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));
  const idx = (slug: string) => projects.findIndex((p) => p.slug === slug);
  const active = hover !== null ? shown[hover] : undefined;

  // Preview follows the pointer without re-rendering (the original used a spring; a direct transform is close enough).
  const onMove = useCallback((e: React.PointerEvent) => {
    const w = wrapRef.current, p = previewRef.current;
    if (!w || !p) return;
    const r = w.getBoundingClientRect();
    p.style.transform = `translate3d(${e.clientX - r.left + 36}px, ${e.clientY - r.top - 120}px, 0)`;
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {["All", ...cats].map((c) => {
            const on = filter === c;
            return (
              <button key={c} type="button" aria-pressed={on} onClick={() => { setFilter(c); setHover(null); }}
                className={cn("relative h-10 rounded-pill border px-4 text-[0.9375rem] transition-colors duration-300", on ? "border-transparent text-white" : "border-line hover:border-fg/40")}>
                {on && <span className="absolute inset-0 rounded-pill bg-ink" />}
                <span className="relative">
                  {c}
                  {c === "All" && <span className={cn("ml-1.5", on ? "text-white/60" : "text-muted")}>{projects.length}</span>}
                </span>
              </button>
            );
          })}
        </div>
        <div role="group" aria-label="View" className="flex h-10 shrink-0 rounded-pill border border-line p-0.5">
          {(["grid", "list"] as const).map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => { setView(v); setHover(null); }} data-cursor-morph="true"
              className={cn("rounded-pill px-4 text-[0.9375rem] capitalize transition-colors duration-300", view === v ? "bg-ink text-white" : "text-muted hover:text-fg")}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div ref={wrapRef} onPointerMove={view === "list" && fine ? onMove : undefined} className="relative mt-10">
        {view === "grid" ? (
          <ul key={filter} className="grid gap-x-6 gap-y-10 md:grid-cols-2">
            {shown.map((p) => (
              <li key={p.slug} className="work-li">
                <Link href={`/work/${p.slug}`} data-cursor="View" className="group block">
                  <div data-shared-source="true" className="relative aspect-[4/3] overflow-hidden rounded-card bg-ink">
                    <ProjectMedia media={p.media} title={p.title} sizes="(min-width: 768px) 46vw, 92vw"
                      className="transition-transform duration-[1200ms] ease-[var(--ease-expo)] group-hover:scale-[1.04]" />
                  </div>
                  <div className="mt-2 flex items-end justify-between gap-6 rounded-tile bg-ink/[0.07] p-5 sm:p-6">
                    <div className="min-w-0">
                      <p className="text-meta mb-3 text-muted">{p.categories.slice(0, 2).join(" · ")}{p.categories.length > 0 && " · "}{p.year}</p>
                      <h2 className="text-h3">{p.title}</h2>
                      <p className="mt-2 line-clamp-2 max-w-[42ch] text-muted">{p.summary}</p>
                    </div>
                    <span data-cursor-morph="true" className="grid size-11 shrink-0 place-items-center rounded-pill bg-ink text-white transition-colors duration-300 group-hover:bg-ember">
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <ul key={filter} className="border-t border-line" onPointerLeave={() => setHover(null)}>
              {shown.map((p, i) => (
                <li key={p.slug} className="work-li border-b border-line">
                  <Link href={`/work/${p.slug}`} data-cursor="View" onPointerEnter={() => setHover(i)} onFocus={() => setHover(i)}
                    className={cn("group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-6 transition-opacity duration-300 md:grid-cols-[4rem_1fr_16rem_4rem] md:py-8", hover !== null && hover !== i && "md:opacity-35")}>
                    <span className="text-meta text-muted">{pad2(idx(p.slug) + 1)}</span>
                    <span className="text-[clamp(1.75rem,4.4vw,4rem)] font-medium leading-none transition-transform duration-500 ease-[var(--ease-expo)] [--tracking:-0.05em] group-hover:translate-x-3">{p.title}</span>
                    <span className="hidden text-muted md:block">{p.categories.slice(0, 2).join(" · ")}</span>
                    <span className="text-meta text-right text-muted">{p.year}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {fine && (
              <div aria-hidden="true" ref={previewRef} className="pointer-events-none absolute left-0 top-0 z-20">
                {active && (
                  <div key={active.slug} className="work-preview relative aspect-[4/3] w-[min(380px,30vw)] overflow-hidden rounded-tile bg-ink">
                    <ProjectMedia media={active.media} title={active.title} sizes="380px" />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
