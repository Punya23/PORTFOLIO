import { cn } from "@/lib/cn";
import { DeviceMockup, type MockupMedia } from "@/components/DeviceMockup";

export type Media = MockupMedia;

type Props = {
  media?: Media;
  title: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** With no media: render nothing instead of the typographic cover (use when the page already shows the title). */
  bare?: boolean;
  /** Page-hero placement (see DeviceMockup). */
  hero?: boolean;
};

/** Project cover: a screenshot on a device mockup (parent must be positioned and sized) or a typographic placeholder (title on dark). */
export function ProjectMedia({ media, title, sizes = "100vw", priority = false, className, bare = false, hero = false }: Props) {
  if (media) return <DeviceMockup media={media} sizes={sizes} priority={priority} className={className} hero={hero} />;
  if (bare) return null;
  return (
    <div role="img" aria-label={`${title} cover placeholder`}
      className={cn("absolute inset-0 flex items-end overflow-hidden bg-[#111] p-[6%] [container-type:inline-size]", className)}>
      <span aria-hidden="true" className="select-none font-medium leading-[0.95] text-white/90" style={{ "--tracking": "-0.05em", fontSize: "clamp(1.75rem, 12cqw, 7rem)" } as React.CSSProperties}>{title}</span>
    </div>
  );
}
