import { certifications, education, experience, highlights, person, skillFolders, socials } from "@/content/punya";

/** Types shared by the fake macOS desktop. */
export type Skill = { name: string; icon?: string };
export type Folder = { id: string; name: string; blurb: string; x: number; y: number; skills: Skill[] };
export type Note = { key: string; title: string; date: string; preview: string; sub?: { text: string }; body: string[] };
export type NoteFolder = { id: string; name: string; notes: Note[] };
export type App = "finder" | "notes" | "about";
export type WinState = {
  id: number; app: App; hist: string[]; hi: number;
  x: number; y: number; w: number; h: number; z: number; max: boolean; min: boolean;
};
export type Spot = { id: string; name: string; kind: "folder" | "note"; spot: { x: number; y: number } };

/** Skill name -> /icons/<slug>.svg. Skills without an entry render an initials tile. */
const ICONS: Record<string, string> = {
  "Scikit-learn": "scikitlearn", PyTorch: "pytorch", TensorFlow: "tensorflow", OpenCV: "opencv",
  Transformers: "huggingface", Python: "python", Java: "java", JavaScript: "javascript", TypeScript: "typescript",
  Pandas: "pandas", NumPy: "numpy", Matplotlib: "matplotlib", React: "react", "Next.js": "nextdotjs",
  "Tailwind CSS": "tailwindcss", Figma: "figma", FastAPI: "fastapi", Flask: "flask", "Node.js": "nodedotjs",
  Express: "express", JWT: "jsonwebtokens", WebSockets: "socketdotio", PostgreSQL: "postgresql",
  MongoDB: "mongodb", Docker: "docker", AWS: "aws", "AWS Polly": "aws", Git: "git", GitHub: "github",
  Cloudinary: "cloudinary", LangChain: "langchain", n8n: "n8n", Deepgram: "deepgram",
};

/** Desktop position (% of the screen) of each folder. */
const POS: Record<string, [number, number]> = {
  "ai-ml": [9, 13], programming: [27, 9], "ml-models": [10, 37], data: [8, 60], agents: [44, 14],
  databases: [91, 13], cloud: [89, 36], backend: [91, 58], frontend: [84, 79],
};

export const FOLDERS: Folder[] = skillFolders.map((f) => {
  const [x, y] = POS[f.id] ?? [50, 50];
  return { id: f.id, name: f.name, blurb: f.blurb, x, y, skills: f.skills.map((name) => ({ name, icon: ICONS[name] })) };
});

const EXTRA_SPOTS = [
  { id: "experience", name: "Experience", x: 62, y: 10 },
  { id: "highlights", name: "Highlights", x: 76, y: 12 },
];

export const SPOTS: Spot[] = [
  ...FOLDERS.map((f): Spot => ({ id: f.id, name: f.name, kind: "folder", spot: { x: f.x / 100, y: f.y / 100 } })),
  ...EXTRA_SPOTS.map((f): Spot => ({ id: f.id, name: f.name, kind: "note", spot: { x: f.x / 100, y: f.y / 100 } })),
];

export const WIN_SIZES = {
  finder: { w: 940, h: 580, minW: 560, minH: 320 },
  notes: { w: 900, h: 560, minW: 620, minH: 320 },
  about: { w: 290, h: 530, minW: 290, minH: 530 },
} satisfies Record<App, { w: number; h: number; minW: number; minH: number }>;

/** "Title — rest" strings from the resume become a note title + body. */
const split = (s: string): [string, string] => {
  const i = s.indexOf(" — ");
  return i < 0 ? [s, ""] : [s.slice(0, i), s.slice(i + 3)];
};

const HIGHLIGHTS_INTRO = "Roles, wins and certificates I can point to, not adjectives. Each one is something you can check.";

const highlightNote = (kind: string) => (s: string): Note => {
  const [title, rest] = split(s);
  return { key: s, title, date: "", preview: rest || kind, sub: { text: kind }, body: [rest || title] };
};

export const NOTE_FOLDERS: NoteFolder[] = [
  {
    id: "experience",
    name: "Experience",
    notes: experience.map((e) => ({
      key: `${e.role}-${e.org}`,
      title: e.role,
      date: e.period,
      preview: e.org,
      sub: { text: `${e.org} · ${e.where}` },
      body: e.points,
    })),
  },
  {
    id: "education",
    name: "Education",
    notes: education.map((e) => ({
      key: e.title,
      title: e.title,
      date: e.period,
      preview: e.org,
      body: [e.org, e.note],
    })),
  },
  {
    id: "highlights",
    name: "Highlights",
    notes: [
      { key: "intro", title: "Earned, not claimed", date: "", preview: HIGHLIGHTS_INTRO, body: [HIGHLIGHTS_INTRO] },
      ...highlights.map(highlightNote("Highlight")),
      ...certifications.map(highlightNote("Certification")),
    ],
  },
];

/** Dock link order follows the reference: GitHub, LinkedIn, X, LeetCode. */
export const DOCK_LINKS = ["github", "linkedin", "x", "leetcode"].flatMap((id) => {
  const s = socials.find((x) => x.id === id);
  return s ? [{ label: s.label, url: s.url }] : [];
});

/** Copy for the "About This Mac" window. Status derives from the latest experience entry. */
export const ABOUT_ROWS: [string, string][] = [
  ["Based in", person.city],
  ["Focus", "AI systems and their interfaces"],
  ["Stack", "Python, FastAPI, Next.js"],
  ["Studying", education[0].title],
  ["Status", `${experience[0].role}, ${experience[0].org}`],
];

export const HEADING = { line1: "Models. Web. Agents.", line2: "One engineer." };
export const INTRO =
  "Each folder is a part of how I work: *the models I train*, *the web apps I build around them* and *the agents they power*. Open one to see the tools I reach for, where I've used them, and my experience and highlights.";
export const HINT = "Double-click a folder to look inside.";

export const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;
export const HEAD_WORDS = wordCount(HEADING.line1) + wordCount(HEADING.line2);
export const BODY_WORDS = wordCount(INTRO) + wordCount(HINT);
