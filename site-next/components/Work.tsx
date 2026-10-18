import { Deck, type DeckProject } from "@/components/Deck";
import { projects, selectedProjects } from "@/content/punya";

/**
 * Screenshots: add `cover: { url: "/projects/<slug>.png", alt: "…" }` (file in /public) per slug here;
 * without one the deck renders the gradient placeholder. Optional `accentColor` tints the placeholder.
 */
const covers: Record<string, Pick<DeckProject, "cover" | "accentColor">> = {};

const deck: DeckProject[] = selectedProjects.map((p) => ({
  slug: p.slug, title: p.title, role: p.kind, year: p.year, ...covers[p.slug],
}));

export function Work() {
  return <Deck projects={deck} total={projects.length} />;
}
