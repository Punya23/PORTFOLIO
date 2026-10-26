import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card3D } from "@/components/pages/Card3D";
import { Capabilities, type Capability } from "@/components/pages/Capabilities";
import { ArrowUpRight } from "@/components/pages/icons";
import { allWork } from "@/content/case-studies";
import { education, experience, highlights, person, resumeUrl, skillFolders } from "@/content/punya";

const description = `Who ${person.name} is: an AI/ML engineer and full-stack developer in ${person.city}. Background, education, experience, skills and how to work with him.`;
export const metadata: Metadata = {
  title: `About — ${person.name}`,
  description,
  openGraph: { title: `About ${person.name} — AI/ML engineer and full-stack developer`, description, type: "profile", locale: "en_IN" },
};

const capabilities: Capability[] = [
  { title: "AI Engineering", description: "Models, pipelines and evaluation, from notebook experiments to services that hold up: scikit-learn, PyTorch, TensorFlow, NLP and computer vision." },
  { title: "Agentic & Voice Systems", description: "Multi-agent and voice systems on LLM APIs, LangChain, Deepgram and Exotel, with objection handling, scheduling and CRM sync." },
  { title: "Full-Stack Web", description: "React, Next.js and TypeScript on the front, Node, FastAPI and PostgreSQL behind them." },
  { title: "Cybersecurity", description: "Agents that crawl, simulate attacks and report SQL injection, XSS and CSRF with fixes. CREST CTF 8th place out of 158 teams." },
  { title: "UI/UX", description: "Interfaces designed in Figma and shipped in code, plus branding and Meta Ads for small-business clients." },
];

/** Year the freelance work and the degree both started. */
const SINCE = "2024";

const rows = [
  { k: "Based in", v: person.city },
  { k: "Studying", v: "B.Tech, CSE (AI & ML)", sub: `${education[0].period} · ${person.university}` },
  { k: "Now", v: experience[0].role, sub: `${experience[0].org} · ${experience[0].period}` },
  { k: "Also", v: "Freelance developer", sub: `${experience[1].org} · ${experience[1].period}` },
];

const technologies = skillFolders.flatMap((f) => f.skills).join(", ");
const built = allWork.slice(2).map((p) => p.title).join(", ");

const faqs = [
  { q: `Who is ${person.name}?`, a: `I'm ${person.name}, an AI/ML engineer and full-stack developer based in ${person.city}. ${person.summary} I study at ${person.university}.` },
  { q: "What kind of work do you take on?", a: capabilities.map((c) => `${c.title}: ${c.description}`).join(" ") },
  { q: "Which technologies do you work with?", a: `${technologies}. I pick the tool that fits the problem.` },
  { q: "What have you built?", a: `${built}. Recognition includes ${highlights.slice(1, 4).join("; ")}. There are ${allWork.length} case studies on the work page.` },
  { q: "What experience do you have?", a: experience.map((e) => `${e.role}, ${e.org}, ${e.period}. ${e.points.join(" ")}`).join(" ") },
  { q: "Are you available for freelance work or internships?", a: `Yes. Open to freelance and internships. Email ${person.email} or use the contact form.` },
];

const story = [
  `I'm ${person.name}, an AI/ML engineer and full-stack developer based in Pune. I build end-to-end AI systems and the interfaces around them, from the model to the last pixel.`,
  `${person.summary} My work runs from credit appraisal and cyber defense to voice agents that make real calls.`,
  "Most of what I know came from shipping real things, alongside my degree, hackathons and student leadership.",
];

const bgCard = "relative flex min-h-[clamp(36rem,56vw,52rem)] flex-col overflow-hidden rounded-tile";

export default function AboutPage() {
  return (
    <main id="main">
      <div data-page="true">
        <section data-tone="ink" className="tone-ink grain relative overflow-hidden lg:min-h-svh">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[54%] aspect-square w-[min(120vw,70rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
            style={{ background: "radial-gradient(circle, rgb(217 164 65 / 0.38) 0%, rgb(217 164 65 / 0.1) 38%, transparent 66%)" }} />
          <div className="wrap relative z-[2] flex flex-col pb-[clamp(3rem,6vw,5rem)] pt-[clamp(96px,9vw,128px)] lg:min-h-svh">
            <div className="flex items-center justify-between gap-6">
              <p className="text-meta text-muted">(About)</p>
              <p className="text-meta uppercase text-muted">[Based in &mdash; Pune, IN]</p>
            </div>
            <div className="my-auto grid items-center gap-x-[clamp(1.5rem,4vw,5rem)] gap-y-12 py-[clamp(2rem,4vw,3rem)] lg:grid-cols-[1fr_auto_1fr]">
              <div className="flex flex-col gap-8">
                <h1 className="max-w-[11ch] text-balance text-[clamp(2.75rem,min(5.2vw,9svh),5.5rem)] leading-[0.94]">An engineer who ships the whole product.</h1>
                <p className="text-meta flex items-center gap-1.5 uppercase" aria-label="Building since 2024">
                  <span className="inline-flex h-8 items-center rounded-pill border border-white/25 px-3">Since</span>
                  {SINCE.split("").map((d, i) => (
                    <span key={i} aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 999, background: "#fff", color: "#0a0a0a", fontSize: 13 }}>{d}</span>
                  ))}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <Link href="/work" className="group inline-flex h-12 items-center gap-2 rounded-pill bg-white px-6 text-[0.9375rem] font-medium text-ink transition-colors duration-300 hover:bg-ember hover:text-white">
                    See my work
                    <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center rounded-pill border border-white/25 px-6 text-[0.9375rem] font-medium transition-colors duration-300 hover:border-white/60">Résumé</a>
                </div>
              </div>
              <Card3D className="mx-auto w-[min(72vw,20rem)] max-lg:order-first lg:w-[min(27vw,46svh)]" src="/punya.jpg" alt={`${person.name}, ${person.role}`} />
              <dl className="border-t border-white/15 lg:ml-auto lg:w-full lg:max-w-[24rem]">
                {rows.map((r) => (
                  <div key={r.k} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 border-b border-white/15 py-4">
                    <dt className="text-meta text-muted">{r.k}</dt>
                    <dd>
                      <span className="block font-medium leading-snug">{r.v}</span>
                      {r.sub && <span className="mt-1 block text-[0.9375rem] leading-snug text-muted">{r.sub}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="text-meta text-center text-muted max-lg:hidden">Move your pointer. The card follows.</p>
          </div>
        </section>

        <Capabilities items={capabilities} />

        <section id="experience" data-tone="paper" className="tone-paper py-[clamp(4rem,9vw,8rem)]">
          <div className="wrap">
            <div className="mb-[clamp(2rem,4vw,3.5rem)] grid grid-cols-2 items-center gap-4 border-t border-line pt-[clamp(1.5rem,3vw,2.75rem)] text-[clamp(1rem,1.3vw,1.25rem)] sm:grid-cols-3">
              <h2 className="flex items-center gap-3 text-[1em] font-normal [--tracking:-0.02em]"><span aria-hidden="true" className="size-[0.7em] rounded-[0.15em] bg-ember" />Background</h2>
              <p aria-hidden="true" className="hidden text-center sm:block">(PS® — 04)</p>
              <p className="text-right">©{new Date().getFullYear()}</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <article className={`${bgCard} bg-ink/[0.04] p-[clamp(1.5rem,2.4vw,2.25rem)]`}>
                <span aria-hidden="true" className="bg-corner right-5 top-5 border-r border-t" />
                <div aria-hidden="true" className="bg-streak"><i /><i /><i /></div>
                <div className="relative">
                  <h3 className="text-meta font-normal text-muted">Education</h3>
                  <p className="mt-2 text-[clamp(3rem,4.6vw,4.5rem)] font-semibold leading-none">9.59<span className="ml-2 text-[0.32em] font-normal text-muted [--tracking:0]">CGPA</span></p>
                </div>
                <ul className="relative mt-auto pt-[clamp(2rem,4vw,3rem)]">
                  {education.map((e) => (
                    <li key={e.title} className="border-t border-line py-5">
                      <p className="text-meta text-muted">{e.period}</p>
                      <p className="mt-2 text-[clamp(1.25rem,1.7vw,1.5rem)] font-medium leading-tight">{e.title}</p>
                      <p className="mt-1.5 text-[0.9375rem] leading-snug text-muted">{e.org}. {e.note}</p>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-line pt-5">
                  <a href={resumeUrl} download className="group inline-flex h-11 items-center gap-2 rounded-pill bg-ink px-5 font-medium text-white transition-colors hover:bg-ember">
                    Download resume
                    <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </article>

              <article className={`${bgCard} bg-[#03040c] px-4 pt-[clamp(2rem,3.4vw,3.25rem)] text-center text-white`}>
                <Image src="/punya.jpg" alt={`${person.name} portrait`} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(3_4_12/0.55)_0%,transparent_30%,transparent_72%,rgb(3_4_12/0.7)_100%)]" />
                <h3 className="text-meta relative z-[2] font-normal text-white/60">Beyond coursework</h3>
                <p className="relative z-[2] mt-2 text-[clamp(2.75rem,5vw,5rem)] font-semibold leading-[0.88]">Not just<br />code</p>
                <ul className="relative z-[2] mt-auto flex flex-wrap justify-center gap-1.5 pb-5">
                  {highlights.slice(0, 5).map((h) => <li key={h} className="rounded-pill bg-white/90 px-3 py-1.5 text-[0.8125rem] font-medium leading-tight text-ink backdrop-blur">{h}</li>)}
                </ul>
              </article>

              <article className="tone-ink grain relative flex min-h-[clamp(36rem,56vw,52rem)] flex-col overflow-hidden rounded-tile px-[clamp(1.5rem,2.4vw,2.25rem)] pt-[clamp(1.5rem,2.4vw,2.25rem)]">
                <span aria-hidden="true" className="bg-corner right-5 top-5 z-[2] border-r border-t" />
                <div className="relative z-[2]">
                  <h3 className="text-meta font-normal text-muted">Experience</h3>
                  <p className="mt-2 text-[clamp(3rem,4.6vw,4.5rem)] font-semibold leading-none">{String(experience.length).padStart(2, "0")}<span className="ml-2 text-[0.32em] font-normal text-muted [--tracking:0]">roles so far</span></p>
                </div>
                <ol className="relative z-[2] mt-auto flex flex-col pb-[clamp(1.5rem,2.4vw,2.25rem)] pt-[clamp(2rem,4vw,3rem)]">
                  {experience.map((e, i) => (
                    <li key={e.role + e.org} className="relative grid grid-cols-[1.25rem_1fr] gap-x-4 pb-8 last:pb-0">
                      {i === 0 && <span aria-hidden="true" className="absolute bottom-0 left-[0.3125rem] top-3 w-px bg-white/15" />}
                      <span aria-hidden="true" className={i === 0 ? "relative mt-[0.4rem] size-[0.6875rem] rounded-full bg-ember shadow-[0_0_0_4px_rgb(217_164_65/0.22)]" : "relative mt-[0.4rem] size-[0.6875rem] rounded-full border border-white/40"} />
                      <div>
                        <p className="text-meta text-muted">{e.period}</p>
                        <p className="mt-2 text-[clamp(1.25rem,1.7vw,1.5rem)] font-medium leading-tight">{e.role}</p>
                        <p className="mt-1 text-white/70">{e.org}</p>
                        <p className="mt-3 max-w-[38ch] text-[0.9375rem] leading-snug text-muted">{e.points[0]}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            </div>
          </div>
        </section>

        <section id="story" data-tone="paper" className="tone-paper py-[clamp(4rem,9vw,8rem)]">
          <div className="wrap flex flex-col">
            <div className="grid-12 gap-y-6 border-t border-line py-[clamp(2.5rem,5vw,4.5rem)] first:border-t-0 first:pt-0 last:pb-0">
              <div className="col-span-12 lg:col-span-4">
                <span className="text-meta text-muted">(01)</span>
                <h2 className="mt-2 text-[clamp(1.875rem,3.4vw,3rem)]">The short version</h2>
              </div>
              <div className="col-span-12 lg:col-span-8">
                <div className="flex max-w-[58ch] flex-col gap-5 text-[clamp(1.125rem,1.5vw,1.375rem)] leading-snug">
                  {story.map((t, i) => <p key={t} className={i ? "text-muted" : undefined}>{t}</p>)}
                </div>
              </div>
            </div>
            <div className="grid-12 gap-y-6 border-t border-line py-[clamp(2.5rem,5vw,4.5rem)] first:border-t-0 first:pt-0 last:pb-0">
              <div className="col-span-12 lg:col-span-4">
                <span className="text-meta text-muted">(02)</span>
                <h2 className="mt-2 text-[clamp(1.875rem,3.4vw,3rem)]">Common questions</h2>
              </div>
              <div className="col-span-12 lg:col-span-8">
                <div className="border-b border-line">
                  {faqs.map((f, i) => (
                    <details key={f.q} open={i === 0} className="faq group border-t border-line">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[clamp(1.0625rem,1.4vw,1.25rem)] font-medium leading-snug transition-colors hover:text-ember [&::-webkit-details-marker]:hidden">
                        {f.q}
                        <span aria-hidden="true" className="relative grid size-9 shrink-0 place-items-center rounded-full border border-line transition-[rotate,background-color,border-color,color] duration-500 ease-[var(--ease-expo)] group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-white">
                          <span className="absolute h-px w-3 bg-current" /><span className="absolute h-3 w-px bg-current" />
                        </span>
                      </summary>
                      <p className="max-w-[62ch] pb-7 pr-12 leading-snug text-muted">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* SLOT: the shared footer / contact stage is mounted globally by the layout. */}
      </div>
    </main>
  );
}
