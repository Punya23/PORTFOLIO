/**
 * Scroll narration. Generate each line in ElevenLabs and save the mp3 as public/voice/<id>.mp3.
 * A line whose file is missing is silently skipped, so you can add them one by one.
 * `id` is the section's DOM id; `text` is both the script and the on-screen caption.
 */
export const narration = [
  { id: "hero", text: "Hey, I'm Punya. I'm an AI and ML engineer and full-stack developer from Pune. Scroll down and I'll walk you through what I build." },
  { id: "statement", text: "I build AI systems, and the interfaces around them, so ambitious ideas become products people can trust." },
  { id: "desktop", text: "Everything I work with lives in these folders: models, web, agents. Double-click one to look inside." },
  { id: "toolkit", text: "Python, FastAPI, React, Next.js, PyTorch. I pick the tool that fits the problem." },
  { id: "work", text: "A few things I've shipped. CYPHEX, a multi-agent security scanner. Dineveo, a restaurant operating system. Quantisense, credit appraisal in minutes. And LocalLoop, for students moving to a new city." },
  { id: "craft", text: "I use AI, but I don't ship slop. The models make me faster. The decisions stay mine." },
  { id: "contact-section", text: "If you have something worth shipping, let's talk. My email is right here." },
] as const;
