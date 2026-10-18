import Image from "next/image";
import { cn } from "@/lib/cn";

/** `bg` is the colour behind a letterboxed image (sample the screenshot's edge) so it is shown whole, never cropped. */
export type Media = { url: string; alt: string; kind?: "image" | "video"; blurDataURL?: string; bg?: string };

type Props = {
  media?: Media;
  title: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** With no media: render nothing instead of the typographic cover (use when the page already shows the title). */
  bare?: boolean;
};

/** Project cover: video, image (next/image fill; parent must be positioned) or a typographic placeholder (title on dark). */
export function ProjectMedia({ media, title, sizes = "100vw", priority = false, className, bare = false }: Props) {
  if (media?.kind === "video")
    return (
      <video className={cn("absolute inset-0 h-full w-full object-cover", className)} src={media.url} aria-label={media.alt}
        muted loop playsInline autoPlay preload="metadata" />
    );
  if (media)
    return (
      <div className="absolute inset-0" style={{ backgroundColor: media.bg ?? "#0a0a0a" }}>
        <Image src={media.url} alt={media.alt} fill sizes={sizes} priority={priority}
          placeholder={media.blurDataURL ? "blur" : "empty"} blurDataURL={media.blurDataURL} className={cn("object-contain", className)} />
      </div>
    );
  if (bare) return null;
  return (
    <div role="img" aria-label={`${title} cover placeholder`}
      className={cn("absolute inset-0 flex items-end overflow-hidden bg-[#111] p-[6%] [container-type:inline-size]", className)}>
      <span aria-hidden="true" className="select-none font-medium leading-[0.95] text-white/90" style={{ "--tracking": "-0.05em", fontSize: "clamp(1.75rem, 12cqw, 7rem)" } as React.CSSProperties}>{title}</span>
    </div>
  );
}
