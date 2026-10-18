import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectMedia } from "@/components/ProjectMedia";
import { ArrowUpRight } from "@/components/pages/icons";
import { allWork } from "@/content/case-studies";
import { person } from "@/content/punya";
import { pad2 } from "@/lib/cn";

type Params = { slug: string };

export const dynamicParams = false;
export const generateStaticParams = (): Params[] => allWork.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = allWork.find((w) => w.slug === slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${person.name}`,
    description: p.summary,
    openGraph: { title: `${p.title} — ${person.name}`, description: p.summary, type: "article", locale: "en_IN" },
  };
}

const li = "relative border-t border-line py-3.5 pl-7 first:border-t-0 first:pt-0 last:pb-0";
const linkBase = "group inline-flex h-12 items-center gap-2 rounded-pill px-6 font-medium transition-colors";

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const i = allWork.findIndex((w) => w.slug === slug);
  if (i < 0) notFound();
  const p = allWork[i];
  const next = allWork[(i + 1) % allWork.length];
  const links = [
    p.url && { href: p.url, label: "Live site", primary: true },
    p.repo && { href: p.repo, label: "GitHub", primary: !p.url },
  ].filter((l): l is { href: string; label: string; primary: boolean } => !!l);

  return (
    <main id="main">
      <div data-page="true">
        <article style={{ "--accent": "#d9a441" } as React.CSSProperties}>
          <header data-tone="ink" className="tone-ink relative isolate min-h-[100svh] overflow-hidden">
            <div data-shared-target="true" className="absolute inset-0 -z-20 bg-ink">
              <ProjectMedia media={p.media} title={p.title} priority sizes="100vw" bare />
            </div>
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,10,10,0.5)_0%,rgba(10,10,10,0)_28%,rgba(10,10,10,0.15)_52%,rgba(10,10,10,0.82)_100%)]" />
            <Link href="/work" className="group absolute left-[var(--margin)] top-[4.75rem] z-10 inline-flex h-10 items-center gap-2 rounded-pill border border-white/30 bg-black/20 px-4 text-[0.9375rem] text-white backdrop-blur-md transition-colors duration-300 hover:bg-white hover:text-ink sm:top-24">
              <svg viewBox="0 0 16 16" className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4" /></svg>
              All work
            </Link>
            <div className="wrap flex min-h-[100svh] flex-col justify-end pb-[clamp(2rem,4.5vw,4rem)] pt-[clamp(112px,14vw,200px)]">
              <p className="text-meta mb-5 text-white/75">{p.categories.join(" · ")}</p>
              <h1 className="max-w-[15ch] text-[clamp(3.25rem,9vw,9rem)] leading-none">{p.title}</h1>
              <p className="mt-6 max-w-[44ch] text-[clamp(1rem,1.2vw,1.1875rem)] font-light leading-snug text-white/85">{p.summary}</p>
            </div>
          </header>

          <section data-tone="ink" className="tone-ink grain relative py-[clamp(3rem,6vw,5rem)]">
            <div className="wrap relative z-[2]">
              <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-[1fr_0.6fr_1fr_2fr]">
                <div><dt className="text-meta mb-2 text-muted">Role</dt><dd className="text-[1.0625rem]">{p.kind}</dd></div>
                <div><dt className="text-meta mb-2 text-muted">Year</dt><dd className="text-[1.0625rem]">{p.year}</dd></div>
                <div>
                  <dt className="text-meta mb-2 text-muted">Status</dt>
                  <dd className="text-[1.0625rem]"><span className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-[var(--accent)]" />{p.status}</span></dd>
                </div>
                <div>
                  <dt className="text-meta mb-2 text-muted">Stack</dt>
                  <dd className="text-[1.0625rem]">
                    <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
                      {p.tags.map((t) => <li key={t} className="rounded-pill border border-line px-3 py-0.5 text-[0.875rem]">{t}</li>)}
                    </ul>
                  </dd>
                </div>
              </dl>
              {links.length > 0 && (
                <ul className="mt-10 flex flex-wrap gap-3">
                  {links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer"
                        className={`${linkBase} ${l.primary ? "bg-white text-ink hover:bg-[var(--accent)] hover:text-white" : "border border-line hover:border-[var(--accent)] hover:text-[var(--accent)]"}`}>
                        {l.label}
                        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {p.stats && (
            <section data-tone="paper" className="tone-paper pt-[clamp(3.5rem,7vw,6rem)]">
              <div className="wrap">
                <ul className="grid border-y border-line sm:grid-cols-2 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]" style={{ "--n": p.stats.length } as React.CSSProperties}>
                  {p.stats.map((s) => (
                    <li key={s.label} className="border-b border-line py-8 last:border-b-0 sm:px-6 sm:first:pl-0 lg:border-b-0 lg:border-l lg:first:border-l-0">
                      <p className="text-[clamp(2.75rem,5.4vw,5rem)] font-medium leading-none">{s.value}</p>
                      <p className="mt-3 text-muted">{s.label}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          <section data-tone="paper" className="tone-paper py-[clamp(4rem,9vw,8rem)]">
            <div className="wrap">
              <div className="flex flex-col">
                {p.sections.map((s, n) => (
                  <div key={s.title} className="grid-12 gap-y-6 border-t border-line py-[clamp(2.5rem,5vw,4.5rem)] first:border-t-0 first:pt-0">
                    <div className="col-span-12 lg:col-span-4">
                      <div className="lg:sticky lg:top-28">
                        <span className="text-meta text-muted">({pad2(n + 1)})</span>
                        <h2 className="mt-2 text-[clamp(1.875rem,3.4vw,3rem)]">{s.title}</h2>
                      </div>
                    </div>
                    <div className="col-span-12 lg:col-span-8">
                      <div>
                        {s.body?.map((t) => <p key={t} className="mb-5 max-w-[62ch] text-body last:mb-0">{t}</p>)}
                        {s.steps && (s.ordered ? (
                          <ol className="prose-list prose-ol mb-6 max-w-[62ch]">
                            {s.steps.map((st) => <li key={st.lead} className={li}><strong className="font-medium">{st.lead}</strong> {st.text}</li>)}
                          </ol>
                        ) : (
                          <ul className="prose-list mb-6 max-w-[62ch]">
                            {s.steps.map((st) => <li key={st.lead} className={li}><strong className="font-medium">{st.lead}</strong> {st.text}</li>)}
                          </ul>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section data-tone="ink" className="tone-ink grain relative py-[clamp(4rem,9vw,8rem)]">
            <div className="wrap relative z-[2]">
              <div className="mb-8 flex items-end justify-between gap-6">
                <p className="text-meta text-muted">Next project</p>
                <p className="text-meta text-muted">© {new Date().getFullYear()}</p>
              </div>
              <Link href={`/work/${next.slug}`} data-cursor="Open" aria-label={`Next project: ${next.title}`} className="group block">
                <div data-shared-source="true" className="relative aspect-[16/8] overflow-hidden rounded-card bg-ink">
                  <ProjectMedia media={next.media} title={next.title} sizes="100vw" />
                </div>
                <div className="mt-6 flex items-end justify-between gap-6">
                  <h2 className="max-w-[16ch] text-h1 leading-none">{next.title}</h2>
                  <span data-cursor-morph="true" className="grid size-14 shrink-0 place-items-center rounded-pill bg-white text-ink transition-colors duration-300 group-hover:bg-ember group-hover:text-white sm:size-16">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </Link>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
