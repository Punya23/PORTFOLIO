import { person } from "@/content/punya";
import { BackToTop } from "./BackToTop";
import { LocalTime } from "./LocalTime";
import { NavLink } from "./NavLink";
import { Typewriter } from "./Typewriter";

/** Same destinations as the menu overlay; keep in sync with SiteNav's default links. */
export const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "#work", label: "Work" },
  { href: "#desktop", label: "About" },
  { href: "#contact-section", label: "Contact" },
];

/** `<footer id="contact">`: link list + local time, giant name mark, copyright typewriter and back-to-top. */
export function SiteFooter() {
  return (
    <footer id="contact" data-tone="paper" className="tone-paper relative overflow-hidden">
      <div className="footer-field grain relative">
        <div aria-hidden="true" className="footer-wave" />
        <div aria-hidden="true" className="footer-shade" />
        <div className="wrap relative z-[2] flex min-h-[clamp(30rem,56vw,54rem)] flex-col gap-y-12 pb-6 max-lg:min-h-[44rem] pt-[clamp(4rem,7vw,7rem)] lg:grid lg:grid-cols-[minmax(0,1fr)_clamp(17rem,22.5vw,21rem)] lg:gap-x-[clamp(2rem,5vw,6rem)]">
          <div className="contents lg:flex lg:flex-col lg:justify-between lg:gap-y-16">
            <div className="order-1 flex gap-[clamp(3rem,8vw,8rem)] text-[0.8125rem] leading-snug">
              <nav aria-label="Footer">
                <ul className="-my-1 flex flex-col">
                  {FOOTER_LINKS.map((l, i) => (
                    <li key={l.label}>
                      <NavLink className={`inline-block py-1 ${i ? "text-muted " : ""}transition-colors hover:text-ember`} href={l.href}>{l.label}</NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <div>
                <h3 className="text-[0.8125rem] font-normal text-muted [--tracking:0]">Local time</h3>
                <LocalTime className="min-w-[16ch] tabular-nums mt-2 block !font-sans !text-[0.8125rem] text-fg" />
              </div>
            </div>
            <p aria-hidden="true" className="footer-mark order-3 select-none text-white max-lg:mt-auto max-lg:pt-24">
              {person.first}<span>©</span>
            </p>
          </div>
          <div className="contents lg:flex lg:flex-col lg:justify-end lg:gap-y-[clamp(1.5rem,2.2vw,2.25rem)]">
            <div className="order-4 text-white">
              <div className="flex items-center justify-between gap-4 border-t border-white/25 pt-4 text-[0.6875rem] text-white/70">
                <Typewriter text={`© Code by ${person.first}`} />
                <BackToTop />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
