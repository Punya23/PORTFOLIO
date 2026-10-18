import { person, resumeUrl, socials } from "@/content/punya";
import { BlurReveal } from "@/components/BlurReveal";
import { ContactForm } from "./ContactForm";
import { CopyEmail } from "./CopyEmail";
import { Keypad } from "./Keypad";
import { LocalTime } from "./LocalTime";

const WORD = (k: number) => (
  <span key={k} className="contact-word flex items-center font-medium leading-none">
    Contact<span className="mx-[0.12em] translate-y-[0.2em] text-ember">*</span>
  </span>
);
const GROUP = [0, 1, 2, 3];

/** `#contact-section`: marquee headline, "Let's build something." card, email, keypad, location + message form. */
export function ContactSection({ availability = "Open to freelance and internships" }: { availability?: string }) {
  return (
    <section id="contact-section" data-tone="paper" className="contact-stage tone-paper">
      <h2 className="sr-only">Contact</h2>
      <div className="contact-head">
        <BlurReveal>
          <div aria-hidden="true" className="marquee mb-[clamp(2rem,4vw,4rem)]">
            <div className="marquee-track">
              <div className="flex shrink-0 items-center">{GROUP.map(WORD)}</div>
              <div className="flex shrink-0 items-center">{GROUP.map(WORD)}</div>
            </div>
          </div>
          <div className="wrap">
            <p className="mb-10 max-w-[38ch] text-muted lg:ml-[35%]">
              Tell me what you&apos;re working on: a product to ship, a model to put in front of users, or a site that needs to feel as good as the work behind it.
            </p>
          </div>
        </BlurReveal>
      </div>
      <div className="contact-body wrap">
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2 max-md:contents">
            <div className="tone-ink grain relative flex aspect-[16/11] flex-col justify-between overflow-hidden rounded-card p-5 max-md:order-1 sm:aspect-[4/3] sm:p-6">
              <p className="text-meta relative z-[2] flex items-center gap-2 text-muted">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
                {availability}
              </p>
              <p className="relative z-[2] text-[clamp(2rem,3.4vw,3.25rem)] font-medium leading-[0.95]">
                Let&apos;s build<br />something.
              </p>
            </div>
            <div className="flex flex-1 flex-col justify-between gap-6 rounded-tile bg-ink/[0.08] p-5 max-md:order-3 sm:gap-8 sm:p-6">
              <div>
                <h2 className="text-meta mb-3 font-normal text-muted">Email</h2>
                <CopyEmail email={person.email} className="break-all text-[1rem] font-medium leading-none" />
              </div>
              <p className="text-[0.9375rem] text-muted">Click to copy. I usually reply within a day.</p>
            </div>
          </div>
          <div className="flex flex-col rounded-tile bg-ink/[0.08] p-5 max-md:order-2 sm:p-6">
            <h2 className="text-meta font-normal text-muted">Elsewhere</h2>
            <div className="flex flex-1 items-center justify-center pb-2 pt-4">
              <div className="pr-[1.2em]">
                <Keypad socials={socials} email={person.email} resumeUrl={resumeUrl} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 max-md:contents md:col-span-2 lg:col-span-1 lg:flex-col-reverse">
            <div className="tone-ink grain relative flex aspect-[16/9] flex-1 flex-col justify-between overflow-hidden rounded-card p-5 max-md:order-5 sm:p-6 md:aspect-[8/3]">
              <h2 className="text-meta relative z-[2] font-normal text-muted">Based in</h2>
              <div className="relative z-[2]">
                <p className="text-[clamp(2rem,3.4vw,3.25rem)] font-medium leading-[0.95]">{person.city}</p>
                <LocalTime place={false} className="inline-block min-w-[16ch] tabular-nums mt-3 !font-sans !text-[1.0625rem] text-muted" />
              </div>
            </div>
            <div className="flex flex-col rounded-tile bg-ink/[0.08] p-5 max-md:order-4 sm:p-6">
              <p className="text-meta mb-3 text-muted">Message</p>
              <h2 className="mb-4 text-[1.375rem] leading-none sm:mb-5">Send me a note</h2>
              <ContactForm className="relative gap-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
