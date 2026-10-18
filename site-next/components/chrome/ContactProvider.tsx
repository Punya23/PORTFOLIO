"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { person, resumeUrl as RESUME, socials as SOCIALS } from "@/content/punya";
import { lockScroll } from "@/lib/scroll";
import { Keypad } from "./Keypad";

type Ctx = { openContact: () => void };
const ContactCtx = createContext<Ctx>({ openContact: () => {} });
/** Open the "Let's talk." keypad dialog from anywhere under <ContactProvider>. */
export const useContact = () => useContext(ContactCtx);

export function ContactProvider({ children, email = person.email, socials = SOCIALS, resumeUrl = RESUME }: {
  children: ReactNode; email?: string; socials?: typeof SOCIALS; resumeUrl?: string;
}) {
  const [mounted, setMounted] = useState(false); // dialog mounts lazily, on first open
  const [open, setOpen] = useState(false);
  const openContact = useCallback(() => { setMounted(true); setOpen(true); }, []);
  const value = useMemo(() => ({ openContact }), [openContact]);
  return (
    <ContactCtx.Provider value={value}>
      {children}
      {mounted && <ContactDialog open={open} onClose={() => setOpen(false)} email={email} socials={socials} resumeUrl={resumeUrl} />}
    </ContactCtx.Provider>
  );
}

function ContactDialog({ open, onClose, email, socials, resumeUrl }: {
  open: boolean; onClose: () => void; email: string; socials: typeof SOCIALS; resumeUrl: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      window.dispatchEvent(new Event("cursor:raise"));
      const unlock = lockScroll();
      return () => { unlock(); window.dispatchEvent(new Event("cursor:lower")); };
    }
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="contact-title"
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className="tone-ink m-auto max-h-[92dvh] w-[min(520px,calc(100vw-24px))] overflow-y-auto overscroll-contain rounded-card border border-line p-0 text-fg backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-[dialog-in_0.5s_var(--ease-expo)]"
      data-lenis-prevent
    >
      <div className="p-6 sm:p-10">
        <div className="flex items-start justify-between gap-6">
          <h2 id="contact-title" className="text-h2">Let&apos;s talk.</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-11 shrink-0 place-items-center rounded-pill border border-line transition-colors hover:bg-fg hover:text-bg"
          >
            <svg viewBox="0 0 16 16" className="size-4" stroke="currentColor" strokeWidth="1.5" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3 3 13" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="mt-4 max-w-[46ch] text-muted">Pick a key to find me.</p>
        <div
          className="mt-8 flex justify-center pb-2 pr-[1.2em]"
          onClick={(e) => { if ((e.target as Element).closest("a, .keypad-knob")) onClose(); }}
        >
          <Keypad socials={socials} email={email} resumeUrl={resumeUrl} />
        </div>
      </div>
    </dialog>
  );
}
