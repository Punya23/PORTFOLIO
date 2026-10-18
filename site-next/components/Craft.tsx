"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ScrollScene } from "./ScrollScene";
import { DeviceMockup } from "./DeviceMockup";
import { CraftBurn } from "./CraftBurn";
import { CRAFT_BEFORE, CRAFT_AFTER } from "@/app/craft-frag";
import { projects } from "@/content/punya";
import { caseStudies } from "@/content/case-studies";

// Only projects with a screenshot go in the reel; each tile is a DeviceMockup portalled into its <li>.
const shots = projects.filter((p) => caseStudies[p.slug]?.media);
const BEFORE = CRAFT_BEFORE.replace(/@@COVER\d+@@/g, "");

/** "I use AI, but I don't ship slop." The fake AI-template collage burns away as you scroll (WebGL). */
export function Craft() {
  const [slots, setSlots] = useState<HTMLElement[]>([]);
  useEffect(() => {
    setSlots(Array.from(document.querySelectorAll<HTMLElement>("#craft .craft-reel > li")));
  }, []);
  return (
    <ScrollScene id="craft" tone="paper" className="craft tone-paper relative" style={{ "--n": 9 } as React.CSSProperties}>
      <div className="craft-stage sticky top-0 h-svh overflow-hidden">
        <div className="contents" dangerouslySetInnerHTML={{ __html: BEFORE }} />
        {slots.map((li, k) => {
          const media = caseStudies[shots[k % shots.length].slug].media!;
          return createPortal(<DeviceMockup media={media} sizes="(min-width: 900px) 34vw, 64vw" />, li, String(k));
        })}
        <CraftBurn />
        <div className="contents" dangerouslySetInnerHTML={{ __html: CRAFT_AFTER }} />
      </div>
    </ScrollScene>
  );
}
