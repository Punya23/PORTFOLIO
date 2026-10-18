import Link from "next/link";
import { BlurHeading, BlurReveal } from "@/components/BlurReveal";
import { InView } from "@/components/InView";

type Tool = { name: string; icon: string; tile?: string; fill?: boolean };
// Icons live in /public/icons (simpleicons / devicon). Tile = face background.
const tools: Tool[] = [
  { name: "Python", icon: "python" }, { name: "React", icon: "react" }, { name: "Next.js", icon: "nextdotjs" },
  { name: "TypeScript", icon: "typescript" }, { name: "FastAPI", icon: "fastapi" }, { name: "Node.js", icon: "nodedotjs" },
  { name: "PyTorch", icon: "pytorch" }, { name: "TensorFlow", icon: "tensorflow" }, { name: "OpenCV", icon: "opencv" },
  { name: "scikit-learn", icon: "scikitlearn" }, { name: "Pandas", icon: "pandas" }, { name: "LangChain", icon: "langchain", tile: "#0b1b26" },
  { name: "n8n", icon: "n8n" }, { name: "PostgreSQL", icon: "postgresql" }, { name: "MongoDB", icon: "mongodb" },
  { name: "Docker", icon: "docker" }, { name: "AWS", icon: "aws" }, { name: "GitHub", icon: "github" },
  { name: "JavaScript", icon: "javascript", tile: "#f0db4f" }, { name: "Java", icon: "java" }, { name: "Flask", icon: "flask" },
  { name: "Tailwind CSS", icon: "tailwindcss" }, { name: "Figma", icon: "figma", tile: "#1e1e1e" },
];

const Tile = ({ t, i, hidden }: { t: Tool; i: number; hidden?: boolean }) => (
  <li className="tool-tile group relative" aria-hidden={hidden || undefined} data-name={t.name}
    style={{ "--i": i, "--tile": t.tile ?? "#ffffff" } as React.CSSProperties}>
    <span className="tool-face grid size-[clamp(2.75rem,4.6vw,4.25rem)] place-items-center overflow-hidden rounded-[22%] ring-1 ring-black/[0.07]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/icons/${t.icon}.svg`} alt="" width={48} height={48} loading="lazy" decoding="async" draggable={false}
        className="object-contain size-[56%]" />
    </span>
    {!hidden && <span className="sr-only">{t.name}</span>}
    <span aria-hidden="true" className="tool-name">{t.name}</span>
  </li>
);

export function Toolkit() {
  return (
    <section id="toolkit" data-tone="paper"
      className="tone-paper relative overflow-hidden pt-[clamp(6rem,14vw,13rem)] pb-[clamp(3rem,6vw,5rem)]">
      <div className="wrap">
        <InView className="toolkit mx-auto max-w-[52rem]">
          <BlurReveal>
            <BlurHeading lines={["My key skills"]} className="text-[clamp(2.5rem,5.6vw,6rem)] leading-none" />
            <div className="toolkit-marquee">
              <ul className="toolkit-track" aria-label="Key skills and technologies">
                {tools.map((t, i) => <Tile key={t.name} t={t} i={i} />)}
                {tools.map((t, i) => <Tile key={`d-${t.name}`} t={t} i={i} hidden />)}
              </ul>
            </div>
            <h2 className="text-right text-[clamp(2.5rem,5.6vw,6rem)] leading-none">ready to build.</h2>
            <div className="mt-[clamp(2.5rem,6vw,5rem)] max-w-[21rem]">
              <p className="text-muted text-[1.0625rem] font-normal">
                A stack I know end to end. I pick the tool that fits the problem, from training the model to shipping the interface people actually use, and I&apos;d rather go deep on a few than skim a hundred.
              </p>
              <Link href="/work" className="mt-6 inline-flex h-12 items-center gap-2 rounded-tile bg-ink/10 px-5 text-[1.0625rem] font-medium transition-colors hover:bg-ember hover:text-white">
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                See what I&apos;ve built
              </Link>
            </div>
          </BlurReveal>
        </InView>
      </div>
    </section>
  );
}
