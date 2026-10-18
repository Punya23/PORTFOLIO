import Image from "next/image";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/cn";

export type Media = { url: string; alt: string; kind?: "image" | "video"; blurDataURL?: string };

type Props = {
  media?: Media;
  title: string;
  index: number;
  accent?: string;
  sizes?: string;
  priority?: boolean;
  numeral?: boolean;
  shift?: number;
  className?: string;
};

/** Project cover: video, image (next/image fill; parent must be positioned) or the gradient placeholder. */
export function ProjectMedia({ media, title, index, accent = "#E8363C", sizes = "100vw", priority = false, numeral = false, shift = 0, className }: Props) {
  if (media?.kind === "video")
    return (
      <video className={cn("absolute inset-0 h-full w-full object-cover", className)} src={media.url} aria-label={media.alt}
        muted loop playsInline autoPlay preload="metadata" />
    );
  if (media)
    return (
      <Image src={media.url} alt={media.alt} fill sizes={sizes} priority={priority}
        placeholder={media.blurDataURL ? "blur" : "empty"} blurDataURL={media.blurDataURL} className={cn("object-cover", className)} />
    );
  const c = [
    ["16%", "6%", "92%", "104%"],
    ["84%", "4%", "8%", "100%"],
    ["50%", "-6%", "100%", "72%"],
    ["10%", "96%", "88%", "-4%"],
  ][(index + shift) % 4];
  return (
    <div role="img" aria-label={`${title} cover placeholder`}
      className={cn("grain absolute inset-0 overflow-hidden [container-type:inline-size]", className)}
      style={{
        backgroundColor: "#160907",
        backgroundImage: `radial-gradient(110% 92% at ${c[0]} ${c[1]}, ${accent} 0%, transparent 68%), radial-gradient(90% 80% at ${c[2]} ${c[3]}, var(--color-ember-deep) 0%, transparent 66%)`,
      }}>
      {numeral && (
        <span aria-hidden className="absolute bottom-[-0.12em] left-[0.06em] select-none font-medium leading-none text-white/[0.18]"
          style={{ "--tracking": "-0.05em", fontSize: "clamp(6rem, 42cqw, 24rem)" } as React.CSSProperties}>
          {pad2(index + 1)}
        </span>
      )}
    </div>
  );
}
