import type Lenis from "lenis";

/** Registry for the single Lenis instance (set by <SmoothScroll/>); every scroll helper falls back to native. */
let lenis: Lenis | null = null;
export const getLenis = () => lenis;
export const setLenis = (l: Lenis | null) => { lenis = l; };

let locks = 0;
const afterUnlock: Array<() => void> = [];
/** Run now, or once every scroll lock (menu / dialog) is released: a locked Lenis ignores scrollTo. */
const whenUnlocked = (fn: () => void) => (locks > 0 ? afterUnlock.push(fn) : fn());

/** Freeze page scroll (menu / dialog open). Returns the unlock function. */
export function lockScroll(): () => void {
  const l = lenis;
  l?.stop();
  locks++;
  const root = document.documentElement;
  const prev = root.style.overflow;
  if (!l) root.style.overflow = "hidden";
  return () => {
    l?.start();
    if (!l) root.style.overflow = prev;
    if (--locks === 0) afterUnlock.splice(0).forEach((fn) => fn());
  };
}

export function scrollToTopNow() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

export function scrollToTop(duration = 1.6) {
  whenUnlocked(() => {
    if (lenis) lenis.scrollTo(0, { duration });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/** Smooth-scroll to an in-page target ("#work", "/" or "/#work"). Returns false when the target doesn't exist. */
export function scrollToHash(href: string): boolean {
  const hash = href.replace(/^\/(?=#)/, "");
  if (href === "/" || hash === "#") { scrollToTop(); return true; }
  const el = hash.startsWith("#") ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  if (!el) return false;
  whenUnlocked(() => {
    if (lenis) lenis.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  });
  history.replaceState(null, "", hash);
  return true;
}
