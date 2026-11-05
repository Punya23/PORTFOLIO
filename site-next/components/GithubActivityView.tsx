"use client";
import { useMemo, useState } from "react";
import { BinaryField } from "./BinaryField";
import type { Day } from "@/lib/github";

const LEVELS = ["#1d1b18", "#4b3a14", "#8a6a1c", "#d9a441", "#f6d98a"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Longest run of consecutive days with contributions. */
function longestStreak(days: Day[]) {
  let best = 0, run = 0;
  for (const d of days) { run = d.count > 0 ? run + 1 : 0; best = Math.max(best, run); }
  return best;
}

/** Streak ending today; a still-empty today does not break it. */
function currentStreak(days: Day[], today: string) {
  const past = days.filter((d) => d.date <= today);
  let i = past.length - 1;
  if (i >= 0 && past[i].count === 0) i--;
  let run = 0;
  for (; i >= 0 && past[i].count > 0; i--) run++;
  return run;
}

function GithubMark({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function GithubActivityView({ byYear, user, today }: { byYear: Record<number, Day[]>; user: string; today: string }) {
  const years = useMemo(() => Object.keys(byYear).map(Number).sort((a, b) => b - a), [byYear]);
  const [year, setYear] = useState(years[0]);
  const days = byYear[year] ?? [];
  const all = useMemo(() => years.flatMap((y) => byYear[y]).sort((a, b) => a.date.localeCompare(b.date)), [years, byYear]);

  const total = useMemo(() => days.reduce((n, d) => n + d.count, 0), [days]);
  const stats = useMemo(() => {
    return [
      { label: "Current streak", value: `${currentStreak(all, today)} days` },
      { label: "Longest streak", value: `${longestStreak(days)} days` },
      { label: "Active days", value: String(days.filter((d) => d.count > 0).length) },
      { label: "Best day", value: String(days.reduce((m, d) => Math.max(m, d.count), 0)) },
    ];
  }, [days, all, today]);

  // Columns are weeks (Sunday first); pad the first week so the first day lands on its weekday row.
  const { cells, weeks, monthCols } = useMemo(() => {
    const lead = days.length ? new Date(days[0].date + "T00:00:00Z").getUTCDay() : 0;
    const cells: (Day | null)[] = [...Array<null>(lead).fill(null), ...days];
    const weeks = Math.ceil(cells.length / 7);
    const monthCols: { col: number; label: string }[] = [];
    let seen = -1;
    days.forEach((d, i) => {
      const m = Number(d.date.slice(5, 7)) - 1;
      if (m !== seen) { seen = m; monthCols.push({ col: Math.floor((i + lead) / 7), label: MONTHS[m] }); }
    });
    return { cells, weeks, monthCols };
  }, [days]);

  return (
    <section id="github" data-tone="ink" className="tone-ink relative overflow-hidden" style={{ padding: "clamp(4rem,8vw,8rem) 0" }}>
      <BinaryField />
      <div className="wrap relative z-[2]" style={{ maxWidth: "62rem", marginInline: "auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem 1.5rem" }}>
          <div>
            <h2 className="text-h3" style={{ margin: 0 }}>GitHub Activity</h2>
            <p className="text-meta text-muted" style={{ marginTop: 8 }}>{total.toLocaleString("en-US")} contributions in {year}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href={`https://github.com/${user}`} target="_blank" rel="noopener noreferrer" aria-label="Open GitHub profile" className="gh-logo">
              <span className="gh-logo-glow" aria-hidden="true" />
              <span className="gh-logo-face"><GithubMark size={22} /></span>
            </a>
            <select aria-label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))}
              style={{ height: 40, borderRadius: 999, padding: "0 14px", background: "#161412", color: "#fff", border: "1px solid rgba(255,255,255,0.14)", fontSize: 14 }}>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto", marginTop: 28, paddingBottom: 6 }}>
          <div style={{ minWidth: 640 }}>
            <div className="text-meta text-muted" style={{ display: "grid", gridTemplateColumns: `repeat(${weeks}, 1fr)`, gap: 3, marginBottom: 6, fontSize: 11 }}>
              {monthCols.map((m) => <span key={m.label + m.col} style={{ gridColumn: m.col + 1, whiteSpace: "nowrap" }}>{m.label}</span>)}
            </div>
            <div role="img" aria-label={`Contribution calendar for ${year}`} style={{ display: "grid", gridTemplateRows: "repeat(7, 1fr)", gridAutoFlow: "column", gridAutoColumns: "1fr", gap: 3 }}>
              {cells.map((d, i) => (
                <span key={i} title={d ? `${d.count} contributions on ${d.date}` : undefined}
                  style={{ aspectRatio: "1", borderRadius: 2, background: d ? LEVELS[d.level] : "transparent" }} />
              ))}
            </div>
          </div>
        </div>

        <div className="text-meta text-muted" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, marginTop: 12, fontSize: 11 }}>
          Less
          {LEVELS.map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: 2, background: c }} />)}
          More
        </div>

        <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))", gap: 12, marginTop: 28 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "14px 16px", background: "rgba(255,255,255,0.03)" }}>
              <dt className="text-meta text-muted" style={{ fontSize: 11 }}>{s.label}</dt>
              <dd style={{ margin: "6px 0 0", fontSize: "1.5rem", fontWeight: 500, letterSpacing: "-0.03em" }}>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
