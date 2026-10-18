"use client";
import { ScrollScene } from "./ScrollScene";
import { CraftBurn } from "./CraftBurn";
import { CRAFT_BEFORE, CRAFT_AFTER } from "@/app/craft-frag";
import { projects } from "@/content/punya";
import { caseStudies } from "@/content/case-studies";

function cover(title: string, url: string) {
  return `<img alt="${title}" loading="lazy" decoding="async" class="object-cover" style="position:absolute;height:100%;width:100%;inset:0" src="${url}">`;
}
// Only projects with a screenshot go in the reel (no placeholder tiles).
const shots = projects.filter((p) => caseStudies[p.slug]?.media);
const BEFORE = CRAFT_BEFORE.replace(/@@COVER(\d+)@@/g, (_, k) => {
  const p = shots[Number(k) % shots.length];
  return cover(p.title, caseStudies[p.slug].media!.url);
});

/** "I use AI, but I don't ship slop." The fake AI-template collage burns away as you scroll (WebGL). */
export function Craft() {
  return (
    <ScrollScene id="craft" tone="paper" className="craft tone-paper relative" style={{ "--n": 9 } as React.CSSProperties}>
      <div className="craft-stage sticky top-0 h-svh overflow-hidden">
        <div className="contents" dangerouslySetInnerHTML={{ __html: BEFORE }} />
        <CraftBurn />
        <div className="contents" dangerouslySetInnerHTML={{ __html: CRAFT_AFTER }} />
      </div>
    </ScrollScene>
  );
}
