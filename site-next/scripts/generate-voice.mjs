// Generates public/voice/<section>.mp3 from content/narration.ts with the ElevenLabs API.
// Run from site-next/ (the key stays on your machine, in .env.local, never in the repo):
//   node --env-file=.env.local --experimental-strip-types scripts/generate-voice.mjs [--force]
// .env.local needs: ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID
// Optional: ELEVENLABS_BASE_URL (India data-residency accounts: https://api.in.residency.elevenlabs.io),
//           ELEVENLABS_MODEL (default eleven_multilingual_v2).
import { mkdir, writeFile, access } from "node:fs/promises";
import { narration } from "../content/narration.ts";

const { ELEVENLABS_API_KEY: key, ELEVENLABS_VOICE_ID: voice } = process.env;
const base = process.env.ELEVENLABS_BASE_URL ?? "https://api.elevenlabs.io";
const model = process.env.ELEVENLABS_MODEL ?? "eleven_multilingual_v2";
const force = process.argv.includes("--force");

if (!key || !voice) {
  console.error("Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID in .env.local");
  process.exit(1);
}

await mkdir("public/voice", { recursive: true });
let failed = 0;
for (const { id, text } of narration) {
  const out = `public/voice/${id}.mp3`;
  if (!force && (await access(out).then(() => true, () => false))) { console.log(`skip   ${id} (exists, use --force)`); continue; }
  const res = await fetch(`${base}/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify({ text, model_id: model }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) { failed++; console.error(`FAIL   ${id}: ${res.status} ${(await res.text()).slice(0, 200)}`); continue; }
  await writeFile(out, Buffer.from(await res.arrayBuffer()));
  console.log(`wrote  ${out}`);
}
process.exit(failed ? 1 : 0);
