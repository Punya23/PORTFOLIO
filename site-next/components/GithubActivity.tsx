import { getContributions } from "@/lib/github";
import { githubUser } from "@/content/punya";
import { GithubActivityView } from "./GithubActivityView";

/** Server wrapper: fetches the last three years of the public contribution calendar (cached for an hour). */
export async function GithubActivity() {
  const now = new Date();
  const years = [now.getFullYear(), now.getFullYear() - 1, now.getFullYear() - 2];
  const data = await Promise.all(years.map(getContributions));
  const byYear: Record<number, Awaited<ReturnType<typeof getContributions>>> = {};
  years.forEach((y, i) => { if (data[i].length) byYear[y] = data[i]; });
  if (!Object.keys(byYear).length) return null; // GitHub unreachable: render nothing rather than an empty box
  return <GithubActivityView byYear={byYear} user={githubUser} today={now.toISOString().slice(0, 10)} />;
}
