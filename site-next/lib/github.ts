import { githubUser } from "@/content/punya";

export type Day = { date: string; level: number; count: number };

/**
 * One year of the public contribution calendar (no token needed), parsed from GitHub's calendar fragment.
 * Cached for an hour. Returns [] on any failure so the page still builds and renders without the block.
 */
export async function getContributions(year: number): Promise<Day[]> {
  try {
    const res = await fetch(`https://github.com/users/${githubUser}/contributions?from=${year}-01-01&to=${year}-12-31`, {
      headers: { "user-agent": "portfolio-site" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return [];
    const html = await res.text();

    const days = new Map<string, Day>();
    for (const [td] of html.matchAll(/<td\b[^>]*>/g)) {
      const date = /data-date="([\d-]+)"/.exec(td)?.[1];
      const level = /data-level="(\d)"/.exec(td)?.[1];
      const id = /\bid="(contribution-day-component-[\d-]+)"/.exec(td)?.[1];
      if (date && level && id) days.set(id, { date, level: Number(level), count: 0 });
    }
    for (const [, id, text] of html.matchAll(/<tool-tip[^>]*\bfor="(contribution-day-component-[\d-]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
      const d = days.get(id);
      const n = /^(\d+) contribution/.exec(text);
      if (d && n) d.count = Number(n[1]);
    }
    return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
  } catch (err) {
    console.error("[github] contributions fetch failed", err);
    return [];
  }
}
