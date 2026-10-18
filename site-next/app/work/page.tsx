import type { Metadata } from "next";
import { WorkIndex } from "@/components/pages/WorkIndex";
import { allWork, categoryOrder } from "@/content/case-studies";
import { person } from "@/content/punya";

const description = `AI systems, full-stack products and agents designed and built by ${person.name}. Filter by category and open any project for the full case study.`;
export const metadata: Metadata = {
  title: `Work — ${person.name}`,
  description,
  openGraph: { title: `Work — AI and full-stack projects by ${person.name}`, description, type: "website", locale: "en_IN" },
};

export default function WorkPage() {
  const items = allWork.map((p) => ({ slug: p.slug, title: p.title, year: p.year, summary: p.summary, categories: p.categories, media: p.media }));
  return (
    <main id="main">
      <div data-page="true">
        <section data-tone="paper" className="tone-paper min-h-dvh pb-[clamp(5rem,10vw,9rem)] pt-[clamp(112px,13vw,190px)]">
          <div className="wrap">
            <header className="mb-[clamp(2.5rem,5vw,4.5rem)] flex items-end justify-between gap-6">
              <h1 className="text-h1">Work<span className="text-meta ml-2 align-top font-normal text-muted">({items.length})</span></h1>
              <p className="hidden max-w-[26ch] text-muted sm:block">Products, prototypes and agents. Open any of them for the full story.</p>
            </header>
            <WorkIndex projects={items} categoryOrder={categoryOrder} />
          </div>
        </section>
      </div>
    </main>
  );
}
