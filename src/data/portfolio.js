// Portfolio Data — Extracted from Punya Surana's Resume

export const personalInfo = {
  name: "Punya Surana",
  firstName: "Punya",
  role: "AI/ML Engineer & Full-Stack Developer",
  tagline: "Building intelligent systems that solve real-world problems",
  email: "Punyasurana23@gmail.com",
  github: "https://github.com/Punya23",
  linkedin: "https://www.linkedin.com/in/punya-surana",
  location: "Pune, India",
  bio: `Second-year B.Tech CSE (AI & ML) student with experience in developing end-to-end AI systems across finance, cybersecurity, and scalable applications. Skilled in machine learning, NLP, and full-stack development, with a proven ability to build practical, real-world solutions.`,
  resumeUrl: "/Punya Surana Resume.pdf",
};

export const impactMetrics = [
  { value: "9+", label: "AI Systems Built" },
  { value: "500+", label: "Users Tested" },
  { value: "85-93%", label: "Model Accuracy" },
  { value: "9.59", label: "CGPA" },
];

export const education = [
  {
    degree: "SY B.Tech — CSE (AI & ML)",
    institution: "Pimpri Chinchwad University, Pune",
    year: "2024–Present",
    details: "Minor in Digital Image Processing, Micro Economics",
    grade: "CGPA: 9.59 / 10 · Rank 3 / 189 · Top 2%",
    icon: "graduation",
  },
  {
    degree: "HSC — Bifocal (EXTC)",
    institution: "Nowrosjee Wadia College, Pune",
    year: "2022–2024",
    details: "Minor Computer Science",
    grade: "Percentage: 74.8%",
    icon: "books",
  },
  {
    degree: "ICSE — Class X",
    institution: "Spicer Higher Secondary School, Pune",
    year: "2009–2022",
    details: "",
    grade: "Percentage: 90.2%",
    icon: "school",
  },
];

export const experience = [
  {
    role: "Developer — ERP Client Delivery",
    company: "Client Project · External University Students, Pune Region",
    period: "Feb 2026",
    description:
      "Delivered CTMS, a full-stack campus placement ERP, TPO Cell dual-panel system for students (applications, mock tests, AI-ATS resume builder, round tracking) and admins (drives, eligibility, analytics, notifications).",
    tags: ["Full-Stack", "ERP", "AI-ATS", "React"],
    type: "work",
  },
  {
    role: "Freelance Web Developer & Digital Consultant",
    company: "Self-Employed",
    period: "May 2023 – Present",
    description:
      "Built and deployed WordPress websites for SMBs; managed branding, UI/UX, and Meta Ads campaigns. Delivered end-to-end digital strategy covering web, paid media, and analytics for 3+ clients.",
    tags: ["WordPress", "UI/UX", "Meta Ads", "Branding"],
    type: "work",
  },
  {
    role: "AI-ML Virtual Internship",
    company: "EduSkills (Google for Developers)",
    period: "Oct 2025 – Dec 2025",
    description:
      "Gained hands-on experience in ML/DL using TensorFlow, building CNNs for image classification. Developed understanding of computer vision, convolutions, and model optimization.",
    tags: ["TensorFlow", "CNN", "Computer Vision", "ML/DL"],
    type: "internship",
  },
];

export const projects = [
  {
    title: "CYPHEX",
    subtitle: "Multi-Agent CYBER Defense AI System",
    description:
      "Multi-agent cybersecurity system to detect web vulnerabilities such as SQL injection, XSS, and CSRF. Automated crawling, attack simulation, and vulnerability analysis with actionable insights.",
    tags: ["Python", "FastAPI", "Scikit-Learn", "LLM APIs"],
    impact: "Automated web security testing using 5+ AI agents, reducing manual audit effort by ~70%",
    featured: true,
    github: "https://github.com/Punya23",
    image: "/projects/cyphex.png",
    color: "#7c3aed",
  },
  {
    title: "Quantisense",
    subtitle: "Automated Credit Appraisal System",
    description:
      "FinAI automated credit appraisal system reducing turnaround from 1 week to minutes (~90% accuracy). Modules: document parsing, fraud detection, stress test, research agent, CAM report generation.",
    tags: ["MERN", "ML", "EDA", "Python", "LLM", "FastAPI"],
    impact: "Reduced credit appraisal time by 95% (5–7 days → <10 mins)",
    featured: true,
    github: "https://github.com/Punya23",
    image: "/projects/quantisense.png",
    color: "#8b5cf6",
  },
  {
    title: "RAHI",
    subtitle: "Rural AI for Health & Inclusion",
    description:
      "Unified AI platform for rural India covering healthcare, education, agriculture, government schemes, and emergency services. Offline-capable, multilingual, LLM-integrated with speech interfaces for low-literacy users.",
    tags: ["MERN", "NLP", "STT/TTS", "LLM", "Python", "Multilingual"],
    impact: "Built 6-module AI platform supporting 3+ domains with multilingual voice",
    featured: true,
    github: "https://github.com/Punya23",
    image: "/projects/rahi.png",
    color: "#a78bfa",
  },
  {
    title: "LocalLoop",
    subtitle: "Student Relocation Platform",
    description:
      "AI-driven platform for housing, safety, transport, mentorship. Rent prediction (RF), chatbot, recommendation engine, and community features for incoming students.",
    tags: ["Node", "React", "PostgreSQL", "Socket.io", "Zustand"],
    impact: "ML-based rent prediction (85%+ accuracy) with recommendation system",
    featured: false,
    github: "https://github.com/Punya23",
    image: "/projects/localloop.png",
    color: "#7c3aed",
  },
  {
    title: "FraudGuard",
    subtitle: "Real-Time Fraud Detection",
    description:
      "Flags location mismatch, velocity anomalies, spending deviations, circular transactions, and shell company-like patterns in real-time financial streams.",
    tags: ["ML", "Deep Learning", "Python", "FastAPI", "PERN"],
    impact: "~90% fraud detection accuracy using behavioral anomaly analysis",
    featured: false,
    github: "https://github.com/Punya23",
    image: "/projects/carbonsense.png",
    color: "#c084fc",
  },
  {
    title: "Carbon Sense",
    subtitle: "Sustainability AI",
    description:
      "Calculates personal carbon footprint from travel, diet, and energy data. Outputs optimized behavioral recommendations using predictive AI models.",
    tags: ["Python", "FastAPI", "LangChain", "Recharts", "Zustand"],
    impact: "Predict footprint with ~88% accuracy and actionable reductions",
    featured: false,
    github: "https://github.com/Punya23",
    image: "/projects/fraudguard.jpg",
    color: "#8b5cf6",
  },
];

export const skills = {
  languages: ["Python", "Java", "C++", "C", "JavaScript", "TypeScript"],
  aiml: [
    "Scikit-learn",
    "PyTorch",
    "TensorFlow",
    "OpenCV",
    "Transformers",
    "NLP",
    "Deep Learning",
    "CNNs",
  ],
  backend: ["Flask", "Node.js", "Express", "FastAPI"],
  frontend: ["React", "Next.js", "Tailwind CSS"],
  database: ["PostgreSQL", "MongoDB"],
  tools: ["Git", "Docker", "AWS", "REST APIs", "JWT", "WebSockets", "Cloudinary"],
};

export const achievements = [
  "Vice President — IEEE Student Branch, PCU",
  "WON 2nd Place — Datathon 2025",
  "Tech Head — Techneon",
  "Media Team Member — PCU ACM Chapter (2025)",
  "Cleared IIT Fellowship Entrance — IIT Mandi",
  "CREST CTF 8th Place (Out of 158 teams)",
  "Cleared SIIH",
  "Multiple hackathon finalists",
];

export const certifications = [
  "RedHat Academy — Linux Fundamentals, RH134, RH124, OpenShift DO101",
  "IIT Bombay (Spoken Tutorial), Simplilearn — C++ Programming",
  "Coursera — Intro to OS (Codio), Django & Full-Stack Development",
  "Meta — Introduction to Front-End Development",
  "Google — Foundations of Cybersecurity",
];

export const researchInterests = [
  "Explainable AI (XAI)",
  "Reinforcement Learning",
  "Multi-Agent Systems",
  "Human-Centered & Trustworthy AI",
  "Anomaly Detection",
];

export const languages = ["English", "Japanese", "Hindi", "Marwadi", "Marathi"];

export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
