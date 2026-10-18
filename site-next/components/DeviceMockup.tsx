import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type Device = "laptop" | "monitor";
export type MockupMedia = {
  url: string;
  alt: string;
  /** screenshot width / height: the screen is sized to this so nothing is cropped */
  ratio: number;
  device?: Device;
  /** backdrop gradient [top, bottom] behind the device */
  backdrop?: [string, string];
  /** y-rotation in degrees, for a slight 3D lean */
  tilt?: number;
};

const px = (k: number) => `calc(var(--sw) * ${k})`;

/**
 * A project screenshot shown on a laptop or monitor over a tinted backdrop (the "mockup" look).
 * Pure CSS, sized with container units, so it fills any parent: card, hero or the scrolling reel.
 * Parent must be positioned and have a size.
 */
export function DeviceMockup({ media, sizes = "100vw", priority = false, className, hero = false }: {
  media: MockupMedia; sizes?: string; priority?: boolean; className?: string;
  /** Page-hero placement: smaller and pushed up-right so the title block at the bottom left stays clear. */
  hero?: boolean;
}) {
  const { url, alt, ratio, device = "laptop", backdrop = ["#d9d4c8", "#8f8776"], tilt = 0 } = media;
  // max screen height as a share of the container, so the whole device (screen + stand) fits.
  const maxH = (device === "monitor" ? 54 : 66) * (hero ? 0.8 : 1);
  const root: CSSProperties = {
    position: "absolute", inset: 0, overflow: "hidden", containerType: "size",
    background: `radial-gradient(120% 95% at 50% 0%, ${backdrop[0]} 0%, ${backdrop[1]} 100%)`,
  };
  const stage = {
    "--sw": `min(80cqw, calc(${maxH}cqh * ${ratio}))`,
    position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    transform: `${hero ? "translate(16cqw, -9cqh) " : ""}perspective(1800px) rotateY(${tilt}deg) rotateX(2deg)`,
  } as CSSProperties;
  const screen: CSSProperties = {
    position: "relative", width: "var(--sw)", aspectRatio: String(ratio), boxSizing: "content-box",
    padding: device === "monitor" ? `${px(0.014)} ${px(0.014)} ${px(0.05)}` : px(0.011),
    background: device === "monitor" ? "linear-gradient(#1b1b1d, #0d0d0e)" : "#0c0c0d",
    borderRadius: device === "monitor" ? px(0.018) : `${px(0.016)} ${px(0.016)} ${px(0.004)} ${px(0.004)}`,
    boxShadow: "0 0 0 1px rgba(255,255,255,0.08) inset, 0 2.5cqh 6cqh rgba(0,0,0,0.35)",
  };
  return (
    <div style={root}>
      <div style={stage} className={cn("transition-transform duration-[1200ms] ease-[var(--ease-expo)]", className)}>
        <div style={screen}>
          <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: px(0.006) }}>
            <Image src={url} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
          </div>
        </div>
        {device === "laptop" ? (
          <div aria-hidden="true" style={{
            width: px(1.14), height: px(0.02), marginTop: -1, borderRadius: `0 0 ${px(0.03)} ${px(0.03)}`,
            background: "linear-gradient(#d8d8dc, #8c8c92)", boxShadow: "0 2cqh 4cqh rgba(0,0,0,0.3)",
          }} />
        ) : (
          <>
            <div aria-hidden="true" style={{ width: px(0.13), height: px(0.1), marginTop: -1, background: "linear-gradient(90deg, #8a8a90, #cfcfd4 50%, #8a8a90)" }} />
            <div aria-hidden="true" style={{
              width: px(0.3), height: px(0.014), borderRadius: px(0.014), background: "linear-gradient(#d6d6da, #8f8f95)",
              boxShadow: "0 1.5cqh 3cqh rgba(0,0,0,0.3)",
            }} />
          </>
        )}
      </div>
    </div>
  );
}
