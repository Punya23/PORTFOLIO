/**
 * Single source of truth for every piece of Punya-specific copy.
 * Source: resume (_Punya_Surana Resume.pdf) + github.com/Punya23. Replace TODO(user) values when supplied.
 */
export const person = {
  name: "Punya Surana",
  first: "Punya",
  role: "AI/ML engineer and full-stack developer",
  city: "Pune, India",
  timezone: "Asia/Kolkata",
  email: "Punyasurana23@gmail.com",
  phone: "+91 9370079820",
  university: "Pimpri Chinchwad University",
  summary:
    "Third-year B.Tech CSE (AI & ML) student building end-to-end AI systems across finance, cybersecurity and scalable applications.",
};

export const socials = [
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/punya-surana" },
  { id: "github", label: "GitHub", url: "https://github.com/Punya23" },
  { id: "x", label: "X", url: "https://x.com/" }, // TODO(user): real X profile
  { id: "leetcode", label: "LeetCode", url: "https://leetcode.com/" }, // TODO(user): real LeetCode profile
  { id: "email", label: "Email", url: "mailto:Punyasurana23@gmail.com" },
];

export const resumeUrl = "/Punya_Surana_Resume.pdf";

/** Finder folders on the desktop section. `skills` become icons; `where`/`blurb` are the folder copy. */
export const skillFolders = [
  { id: "ai-ml", name: "AI / ML", blurb: "Models, evaluation and the LLM stack around them.",
    skills: ["Scikit-learn", "PyTorch", "TensorFlow", "OpenCV", "Transformers", "NLP", "Deep Learning", "CNNs", "Reinforcement Learning"] },
  { id: "programming", name: "Programming", blurb: "The languages I think in.",
    skills: ["Python", "Java", "JavaScript", "TypeScript"] },
  { id: "ml-models", name: "ML Models", blurb: "Classical models I reach for first.",
    skills: ["Linear Regression", "Random Forest", "Logistic Regression", "Isolation Forest", "Prophet"] },
  { id: "data", name: "Data & Analytics", blurb: "From raw tables to features.",
    skills: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "EDA", "Feature Engineering"] },
  { id: "frontend", name: "Frontend / UI", blurb: "Interfaces people actually use.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Figma"] },
  { id: "backend", name: "Backend", blurb: "APIs and services behind the interface.",
    skills: ["FastAPI", "Flask", "Node.js", "Express", "REST APIs", "JWT", "WebSockets"] },
  { id: "databases", name: "Databases", blurb: "Where the data lives.", skills: ["PostgreSQL", "MongoDB"] },
  { id: "cloud", name: "Cloud / DevOps", blurb: "Shipping and running it.",
    skills: ["Docker", "AWS", "Git", "GitHub", "Cloudinary"] },
  { id: "agents", name: "Voice / AI Agents", blurb: "Agentic and voice systems.",
    skills: ["LLM APIs", "LangChain", "Deepgram", "Exotel", "AWS Polly", "n8n"] },
];

export const experience = [
  { role: "Software Engineering Intern", org: "Geta AI Labs", where: "Pune, India (onsite)", period: "Jun 2026 – Current",
    points: ["Working on AI powered automation systems, backend APIs, workflow orchestration, n8n automation, FastAPI services and production engineering tasks."] },
  { role: "Freelance", org: "Self-Employed", where: "Pune, India", period: "May 2024 – Present",
    points: ["Built and deployed websites for SMBs; managed branding, UI/UX and Meta Ads campaigns.", "Delivered an Autonomous Financial Advisory Voice Agent with CRM and WhatsApp automation."] },
];

export const education = [
  { title: "B.Tech — CSE (AI & ML)", org: "Pimpri Chinchwad University, Pune", period: "2024–Present", note: "Minor in Digital Image Processing, Micro Economics · CGPA 9.59 / 10" },
  { title: "HSC — Bifocal (EXTC)", org: "Nowrosjee Wadia College, Pune", period: "2022–2024", note: "74.8%" },
  { title: "ICSE — Class X", org: "Spicer Higher Secondary School, Pune", period: "2009–2022", note: "90.2%" },
];

export const highlights = [
  "Vice President — IEEE Student Branch (INNOVARE)",
  "1st Place — QA Fraternity Hackathon by SpurQLabs",
  "WON 2nd Place — Datathon 2025",
  "2nd Runner-Up — Tech For Good Hackathon (IEEE YP)",
  "Tech Head — Techneon",
  "Media Team Member — PCU ACM Chapter (2025)",
  "Cleared IIT Fellowship Entrance — IIT Mandi",
  "CREST CTF 8th Place (out of 158 teams)",
];

export const certifications = [
  "RedHat Academy — Linux Fundamentals, RH134, RH124, OpenShift DO101",
  "IIT Bombay (Spoken Tutorial), Simplilearn — C++ Programming",
  "Coursera — Intro to Operating Systems (Codio), Django Web Framework & Full-Stack Development",
  "Meta — Introduction to Front-End Development",
  "Google — Foundations of Cybersecurity",
];

export const metrics = [
  { value: "9", label: "AI systems built" },
  { value: "85–93%", label: "Model accuracy" },
  { value: "500+", label: "Users tested" },
];

/**
 * `draft` entries stay here but are hidden from the site until they have real content (Ad Intel needs a
 * description and repo). The first four are the "Selected work" deck, so keep them to projects with a screenshot.
 */
const allProjects = [
  { slug: "scifex", title: "SciFex", kind: "Design and engineering", year: "2026",
    summary: "Multi-agent cyber defense system: 11 agents run recon, crawling and parallel exploitation against a target, then write a pentest report and code patches.",
    tags: ["Python", "FastAPI", "Scikit-learn", "LLM APIs"], url: "", repo: "https://github.com/Punya23/CYPHEX" },
  { slug: "dineveo", title: "Dineveo", kind: "Design and engineering", year: "2026",
    summary: "Restaurant and hotel operating system: CRM, waiter app and kitchen display, paired with a free customer app for QR dine-in and takeaway.",
    tags: ["Node", "Express", "Socket.io", "React", "React Native"], url: "", repo: "" }, // repo HM_CRM is private on GitHub
  { slug: "quantisense", title: "Quantisense", kind: "Design and engineering", year: "2026",
    summary: "Automated credit appraisal that cuts turnaround from a week to minutes: document parsing, fraud detection, stress tests, a research agent and CAM report generation.",
    tags: ["MERN", "ML", "EDA", "Python", "LLM", "FastAPI"], url: "", repo: "https://github.com/vedant91/Multi-agents" },
  { slug: "localloop", title: "LocalLoop", kind: "Design and engineering", year: "2025",
    summary: "Student relocation platform: verified housing with ML rent prediction, community groups, mentors, real-time chat and an AI assistant.",
    tags: ["NestJS", "Next.js", "PostgreSQL", "Socket.io"], url: "https://localloop-red.vercel.app", repo: "https://github.com/Punya23/Localloop" },
  { slug: "rahi", title: "RAHI", kind: "Design and engineering", year: "2025",
    summary: "Rural AI for health and inclusion: healthcare, education, agriculture, schemes and emergency services. Offline-capable, multilingual, with speech for low-literacy users.",
    tags: ["MERN", "NLP", "STT/TTS", "LLM"], url: "", repo: "" } /* RAHI repo is private on GitHub */,
  { slug: "carbon-sense", title: "Carbon Sense", kind: "Design and engineering", year: "2025",
    summary: "Predicts a personal carbon footprint from travel, diet and energy data with about 88% accuracy and suggests reductions.",
    tags: ["Python", "FastAPI", "LangChain", "Recharts"], url: "", repo: "" } /* CarbonSense repo is private on GitHub */,
  { slug: "voice-agent", title: "Financial Advisory Voice Agent", kind: "Engineering", year: "2026",
    summary: "Autonomous multilingual calling agent: qualifies leads, handles objections, schedules advisor appointments and syncs CRM and WhatsApp. 100+ calls a day.",
    tags: ["LLM", "Voice AI", "FastAPI", "Deepgram", "Exotel", "AWS Polly"], url: "", repo: "https://github.com/Punya23/Kalpvrukshfinserv_Automation" },
  { slug: "ctms", title: "CTMS", kind: "Design and engineering", year: "2026",
    summary: "Campus placement ERP with student and TPO panels, AI resume matching and round tracking. Cut TPO workflow effort by 65%.",
    tags: ["React", "Node", "Prisma", "PostgreSQL", "Tailwind"], url: "", repo: "https://github.com/VishalMache/CTMS" },
  { slug: "hiring-agent", title: "Hiring Agent", kind: "Engineering", year: "2026",
    summary: "AI agent that evaluates and scores resumes against a role.", tags: ["Python", "LLM"], url: "", repo: "https://github.com/Punya23/hiring-agent" },
  { slug: "ad-intel", draft: true, title: "Ad Intel", kind: "Design and engineering", year: "2026",
    summary: "TODO(user): one-line description of Ad Intel.", tags: ["TODO"], url: "", repo: "" },
];
export const projects = allProjects.filter((p) => !("draft" in p && p.draft));
export const selectedProjects = projects.slice(0, 4);
