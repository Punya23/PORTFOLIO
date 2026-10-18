"use client";
import { scrollToTop } from "@/lib/scroll";

export function BackToTop() {
  return (
    <button type="button" className="transition-colors hover:text-ember" onClick={() => scrollToTop(1.6)}>
      Back to top ↑
    </button>
  );
}
