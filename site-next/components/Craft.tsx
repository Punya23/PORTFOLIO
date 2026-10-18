"use client";
import { ScrollScene } from "./ScrollScene";
import { CraftBurn } from "./CraftBurn";
import { CRAFT_BEFORE, CRAFT_AFTER } from "@/app/craft-frag";
import { projects } from "@/content/punya";

/** Same gradient cover the work deck uses until a project has a screenshot. */
const POS = [["16%", "6%", "92%", "104%"], ["84%", "4%", "8%", "100%"], ["50%", "-6%", "100%", "72%"], ["10%", "96%", "88%", "-4%"]];
function cover(i: number, title: string, media?: string) {
  if (media) return `<img alt="${title}" loading="lazy" decoding="async" class="object-cover" style="position:absolute;height:100%;width:100%;inset:0" src="${media}">`;
  const c = POS[i % 4];
  return `<div role="img" aria-label="${title} cover placeholder" class="grain absolute inset-0 overflow-hidden" style="background-color:#160907;background-image:radial-gradient(110% 92% at ${c[0]} ${c[1]},#d9a441 0%,transparent 68%),radial-gradient(90% 80% at ${c[2]} ${c[3]},var(--color-ember-deep) 0%,transparent 66%)"></div>`;
}
const BEFORE = CRAFT_BEFORE.replace(/@@COVER(\d+)@@/g, (_, k) => {
  const p = projects[Number(k) % projects.length];
  return cover(Number(k), p.title);
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
