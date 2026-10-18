import { Deck, type DeckProject } from "@/components/Deck";
import { projects, selectedProjects } from "@/content/punya";
import { caseStudies } from "@/content/case-studies";

const deck: DeckProject[] = selectedProjects.map((p) => ({
  slug: p.slug, title: p.title, role: p.kind, year: p.year, cover: caseStudies[p.slug]?.media,
}));

export function Work() {
  return <Deck projects={deck} total={projects.length} />;
}
