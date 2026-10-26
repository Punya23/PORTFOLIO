"use client";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ScrollScene } from "./ScrollScene";
import { PortalTransition } from "./PortalTransition";
import { person } from "@/content/punya";

const WORDS = "I build AI systems and the interfaces around them, so ambitious ideas become products people trust.".split(" ");
const ACCENT = "interfaces";

/** Pinned, scroll-scrubbed intro. Word reveal is CSS (--p/--i); the portal canvas burns into the desktop section. */
export function Statement() {
  return (
    <ScrollScene id="statement" tone="ink" className="statement tone-ink relative" style={{ "--n": WORDS.length } as CSSProperties}>
      <div className="statement-stage sticky top-0 h-svh overflow-hidden">
        <div className="statement-copy">
          <p className="statement-eyebrow">Intro</p>
          <p className="statement-text text-[clamp(1.5rem,min(3vw,5.2svh),3.5rem)] max-[899.98px]:text-[clamp(1.5rem,6.4vw,2.1rem)] font-medium">
            {WORDS.map((w, i) => (
              <span key={i}>
                <span className={w === ACCENT ? "rw accent-serif" : "rw"} style={{ "--i": i - 2 } as CSSProperties}>{w}</span>
                {i < WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
          <div className="statement-more">
            <div className="grid gap-x-[10vw] gap-y-5 min-[900px]:grid-cols-[38fr_15fr]">
              <p className="statement-about text-ash">
                <span className="font-medium text-white">About me.</span>{" "}
                I&apos;m {person.first}, an AI/ML engineer and full-stack developer in Pune. I start with the problem and the people it&apos;s for, then work back through the data, the model and the interface, so nothing gets built that doesn&apos;t need to be.{" "}
                <span className="text-white">The result: AI products people can rely on, not demos that look good once.</span>
              </p>
              <p className="statement-note text-ash">Agents, models and the web apps around them, from first prototype to production.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link className="statement-cta group" href="/work">
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px">↗</span>
                See selected work
              </Link>
              <Link className="statement-cta group" href="/about">
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px">↗</span>
                More about me
              </Link>
            </div>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" aria-hidden="true" data-portal-layer="true" loading="lazy" width={1140} height={890} className="hand hand-l" src="/hands/left-hand.png" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" aria-hidden="true" data-portal-layer="true" loading="lazy" width={1128} height={890} className="hand hand-r" src="/hands/right-hand.png" />
        <span aria-hidden="true" data-portal-origin="true" className="portal-origin" />
        <PortalTransition sectionA="#statement" sectionB="#desktop" />
      </div>
    </ScrollScene>
  );
}
