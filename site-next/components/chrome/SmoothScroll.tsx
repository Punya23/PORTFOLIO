"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { loadGsap } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

/** Lenis driven by the GSAP ticker, kept in sync with ScrollTrigger. Mount once (inside <SiteChrome/>). */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let dispose: (() => void) | undefined;
    let dead = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (dead) return;
      const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, autoRaf: false });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const refresh = () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); };
      window.addEventListener("load", refresh, { once: true });
      document.fonts?.ready.then(refresh);

      // Re-measure when the document height changes (late images, accordions, route content).
      let height = document.documentElement.scrollHeight;
      let timer = 0;
      const ro = new ResizeObserver(() => {
        clearTimeout(timer);
        timer = window.setTimeout(() => {
          const h = document.documentElement.scrollHeight;
          if (h !== height) { height = h; refresh(); }
        }, 120);
      });
      ro.observe(document.body);

      dispose = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        setLenis(null);
        window.removeEventListener("load", refresh);
        clearTimeout(timer);
        ro.disconnect();
      };
    });
    return () => { dead = true; dispose?.(); };
  }, []);
  return null;
}
