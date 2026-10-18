import { ProjectMedia } from "@/components/ProjectMedia";
import { caseStudies } from "@/content/case-studies";
import { person } from "@/content/punya";

/* Hover previews for the menu links: Home = portrait, Work = a project mockup, About = ID card. */

export function HomePreview() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/punya.jpg" alt="" draggable={false} className="absolute inset-0 size-full object-cover" style={{ objectPosition: "50% 22%", transform: "scale(1.35)", transformOrigin: "50% 28%" }} />
  );
}

export function WorkPreview() {
  const media = caseStudies.cyphex?.media;
  return media ? <ProjectMedia media={media} title="CYPHEX" sizes="380px" /> : null;
}

/** Name card with the portrait and a QR code to the LinkedIn profile (static SVG in /public). Inline styles: site.css has no cqw utilities. */
export function AboutCard() {
  const [first, ...rest] = person.name.split(" ");
  const abs = (o: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...o });
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden text-ink" style={{ background: "#faf5ea", containerType: "inline-size" }}>
      <p className="font-medium" style={abs({ left: "7cqw", top: "6cqw", fontSize: "15cqw", lineHeight: 0.92, letterSpacing: "-0.05em" })}>
        {first}<br />{rest.join(" ")}
      </p>
      <p className="text-meta" style={abs({ right: "7cqw", top: "8cqw", textAlign: "right", fontSize: "3.1cqw", lineHeight: 1.5 })}>
        AI ENGINEER<br />FULL-STACK<br />DEVELOPER
      </p>
      <div style={abs({ inset: "30% 0 0 0", background: "#161412" })}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/punya.jpg" alt="" draggable={false} className="size-full object-cover"
          style={{ objectPosition: "50% 20%", maskImage: "linear-gradient(#0000, #000 30%)", WebkitMaskImage: "linear-gradient(#0000, #000 30%)" }} />
        <div style={abs({ inset: 0, background: "radial-gradient(90% 60% at 50% 100%, #d9a44166, transparent 70%)" })} />
      </div>
      <div style={abs({ bottom: "6cqw", right: "6cqw", width: "24cqw", height: "24cqw", borderRadius: "3cqw", background: "#fff", padding: "1.5cqw" })}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/qr-linkedin.svg" alt="" draggable={false} style={{ width: "100%", height: "100%" }} />
      </div>
      <p className="text-meta" style={abs({ bottom: "7cqw", left: "7cqw", fontSize: "2.8cqw", lineHeight: 1.6, color: "rgba(255,255,255,0.8)" })}>
        SCAN<br />TO<br />CONNECT
      </p>
    </div>
  );
}
