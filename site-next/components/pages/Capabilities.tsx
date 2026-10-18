"use client";
import { useCallback, useState } from "react";
import { ScrollScene } from "@/components/ScrollScene";
import { clamp, pad2 } from "@/lib/cn";

export type Capability = { title: string; description: string };

const icons = [
  <g key="ai"><circle cx="5" cy="6" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="12" cy="12" r="2.2" /><circle cx="19" cy="6.5" r="2" /><circle cx="19" cy="17.5" r="2" /><path d="M6.8 7l3.6 3.7M6.8 17l3.6-3.7M14 11l3.2-3.3M14 13l3.2 3.3" /></g>,
  <g key="ag"><path d="M5 4l6.5 15 2.2-6.3L20 10.5z" /><path d="M17 3.5v3M15.5 5h3" /></g>,
  <g key="web"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3 9.5h18M7 7.2h.01M9.5 7.2h.01" /><path d="M8 14l2.4 2L8 18M13 17.5h3.5" transform="translate(0 -1)" /></g>,
  <g key="sec"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2.2 2.2L15 10" /></g>,
  <g key="ui"><path d="M4 18C7 4 15 21 20 6" /><rect x="2.6" y="16.6" width="2.8" height="2.8" rx=".5" /><rect x="18.6" y="4.6" width="2.8" height="2.8" rx=".5" /></g>,
];

/** Pinned scroll drum: scroll progress (--p) rotates the ring; the active item drives the caption. */
export function Capabilities({ items }: { items: Capability[] }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const onProgress = useCallback((p: number) => setActive(Math.round(clamp((p - 0.04) / 0.92, 0, 1) * (n - 1))), [n]);
  if (!n) return null;
  const cur = items[active];
  return (
    <ScrollScene id="capabilities" tone="paper" onProgress={onProgress} className="drum tone-paper relative" style={{ "--count": n } as React.CSSProperties}>
      <div className="drum-stage sticky top-0 flex h-svh flex-col overflow-hidden">
        <div className="wrap flex items-start justify-between pt-[clamp(88px,10vh,120px)]">
          <h2 className="text-meta text-muted">Capabilities</h2>
          <p className="text-meta tabular-nums text-muted" aria-hidden="true">({pad2(active + 1)}/{pad2(n)})</p>
        </div>
        <div className="drum-viewport relative grid flex-1 place-items-center">
          <div className="drum-ring">
            {items.map((it, i) => (
              <div key={it.title} className="drum-item" style={{ "--i": i } as React.CSSProperties} data-active={i === active || undefined}>
                <span className="drum-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{icons[i % icons.length]}</svg>
                </span>
                <span className="drum-word">{it.title}</span>
                <p className="drum-static-desc">{it.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="wrap drum-desc pb-[clamp(28px,7vh,72px)]" aria-live="polite">
          <p key={active} className="drum-desc-in max-w-[34ch] text-[1.0625rem] text-muted"><span className="text-fg">{cur.title}. </span>{cur.description}</p>
        </div>
      </div>
    </ScrollScene>
  );
}
