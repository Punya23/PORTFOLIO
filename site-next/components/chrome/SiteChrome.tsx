import { SmoothScroll } from "./SmoothScroll";
import { Cursor } from "./Cursor";
import { SiteNav } from "./SiteNav";
import { BitHud } from "./StrayBits";
import { Preloader } from "./Preloader";

/** Cycled by the preloader ("Need a guy for ..."). Edit freely. */
const PRELOADER_SKILLS = [
  "Python", "FastAPI", "PyTorch", "LangChain", "Next.js", "TypeScript", "React", "PostgreSQL",
  "Docker", "AWS", "n8n", "Voice AI agents", "ML models", "full-stack",
];

/**
 * Everything fixed to the viewport, in the reference's DOM order: skip link, cursor, header + menu, stray-bits HUD.
 * Render it as the first child of <body> contents, inside <ContactProvider>.
 */
export function SiteChrome({ preloader = true }: { preloader?: boolean }) {
  return (
    <>
      {preloader && <Preloader skills={PRELOADER_SKILLS} />}
      <SmoothScroll />
      <a href="#main" className="skip-link">Skip to content</a>
      <Cursor />
      <SiteNav />
      <BitHud />
    </>
  );
}
