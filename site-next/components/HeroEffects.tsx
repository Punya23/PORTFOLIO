"use client";
import { useEffect } from "react";
import { loadGsap } from "@/lib/gsap";
import { initHeroBits } from "@/lib/heroBits";

/** Publishes hero scroll progress as --sp (drives the portrait parallax in CSS). */
export function HeroEffects() {
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let kill: (() => void) | undefined;
    let off = false;
    loadGsap().then(({ ScrollTrigger }) => {
      if (off) return;
      const st = ScrollTrigger.create({
        trigger: hero, start: "top top", end: "bottom top",
        onUpdate: (s) => hero.style.setProperty("--sp", s.progress.toFixed(4)),
      });
      kill = () => st.kill();
    });
    // pointer trail of fading 0/1 glyphs, fine pointers only
    const bits = window.matchMedia("(hover: hover) and (pointer: fine)").matches ? initHeroBits(hero) : undefined;
    return () => { off = true; kill?.(); bits?.(); };
  }, []);
  return null;
}
