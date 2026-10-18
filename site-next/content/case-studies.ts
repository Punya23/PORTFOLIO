import type { Media } from "@/components/ProjectMedia";
import { projects } from "@/content/punya";

/**
 * Case-study copy keyed by project slug (title / kind / year / summary / tags / links live in punya.ts).
 * Facts come from the resume and punya.ts only; anything not stated there is deliberately left out.
 * TODO(user): review every paragraph and metric below; add `media` (screenshot) per project when available.
 */
export type Step = { lead: string; text: string };
export type Section = { title: string; body?: string[]; steps?: Step[]; ordered?: boolean };
export type CaseStudy = {
  categories: string[];
  status: string;
  stats?: { value: string; label: string }[];
  sections: Section[];
  /** Cover / gallery image. When present it replaces the gradient placeholder everywhere. */
  media?: Media;
};

/** Filter-chip order on /work. */
export const categoryOrder = ["AI/ML", "Web", "Voice AI", "Security", "Open source"];

const todo = (name: string): Section[] => [
  { title: "Overview", body: [`TODO(user): what ${name} is, the problem it solves, your approach and the outcome.`] },
];

export const caseStudies: Record<string, CaseStudy> = {
  scifex: {
    categories: ["AI/ML"], // TODO(user): confirm categories
    status: "TODO(user)",
    sections: todo("SciFex"),
  },
  "ad-intel": {
    categories: ["AI/ML"], // TODO(user): confirm categories
    status: "TODO(user)",
    sections: todo("Ad Intel"),
  },
  quantisense: {
    categories: ["AI/ML", "Web"],
    status: "Built",
    stats: [
      { value: "<10 min", label: "Credit appraisal, down from 5–7 days" },
      { value: "92.5%", label: "AI risk analysis accuracy" },
    ],
    sections: [
      { title: "Problem", body: ["Credit appraisal is slow and manual. Documents are read by hand, figures are cross-checked by eye and the appraisal memo is written from scratch, which stretched a single case to 5–7 days."] },
      { title: "Approach", body: ["Quantisense turns the appraisal into a pipeline: parse the documents, flag fraud signals, stress-test the numbers, research the borrower with an agent and assemble the credit appraisal memo (CAM) automatically."] },
      {
        title: "What it does",
        steps: [
          { lead: "Document parsing.", text: "Extracts the figures the analysis needs from the submitted documents." },
          { lead: "Fraud detection.", text: "Flags anomalies in the data before they reach the memo." },
          { lead: "Stress tests.", text: "Runs the borrower's numbers through adverse scenarios." },
          { lead: "Research agent.", text: "Gathers context on the borrower using an LLM agent." },
          { lead: "CAM generation.", text: "Produces the credit appraisal memo from the analysis." },
        ],
      },
      { title: "Outcome", body: ["Appraisal time dropped from 5–7 days to under 10 minutes, with 92.5% accuracy on the AI risk analysis."] },
    ],
  },
  cyphex: {
    categories: ["Security", "AI/ML", "Open source"],
    status: "Open source",
    stats: [
      { value: "5+", label: "AI agents" },
      { value: "~70%", label: "Less manual audit effort" },
      { value: "3", label: "Vulnerability classes covered" },
    ],
    sections: [
      { title: "Problem", body: ["Security audits of web applications are repetitive: crawl the app, try the usual attacks, write up what broke. Most of that effort is manual."] },
      { title: "Approach", body: ["CYPHEX splits the audit across cooperating AI agents. They crawl the target, simulate attacks, classify what they find and write a report with actionable fixes."] },
      {
        title: "Coverage",
        steps: [
          { lead: "SQL injection.", text: "Probes inputs and reports injectable endpoints with fixes." },
          { lead: "XSS.", text: "Tests inputs for script injection." },
          { lead: "CSRF.", text: "Checks state-changing requests for missing protection." },
        ],
      },
      { title: "Outcome", body: ["Five or more agents share the work, cutting manual audit effort by roughly 70%. The code is open source."] },
    ],
  },
  "voice-agent": {
    categories: ["Voice AI", "AI/ML"],
    status: "Delivered",
    stats: [
      { value: "100+", label: "Outbound calls a day" },
      { value: "~90%", label: "Less manual calling effort" },
    ],
    sections: [
      { title: "Problem", body: ["Lead qualification for financial advisory is a calling job: dial, qualify, handle the pushback, book the meeting and update the CRM, over and over, in the customer's language."] },
      { title: "Approach", body: ["An autonomous multilingual voice agent makes the calls end to end. It qualifies the lead, handles objections, schedules an appointment with an advisor and syncs the result to the CRM and WhatsApp."] },
      {
        title: "Pipeline",
        ordered: true,
        steps: [
          { lead: "Call.", text: "Outbound calls placed through Exotel." },
          { lead: "Listen and speak.", text: "Deepgram for speech recognition, AWS Polly for the voice, an LLM for the conversation." },
          { lead: "Act.", text: "Objection handling, appointment scheduling and CRM and WhatsApp sync." },
        ],
      },
      { title: "Outcome", body: ["The agent places 100+ outbound calls a day and removes roughly 90% of the manual calling effort. It was delivered as freelance work."] },
    ],
  },
  rahi: {
    categories: ["AI/ML", "Web", "Open source"],
    status: "Open source",
    stats: [
      { value: "6", label: "Modules" },
      { value: "3+", label: "Domains" },
      { value: "<2G", label: "Network design target" },
    ],
    sections: [
      { title: "Problem", body: ["Rural communities often lack reliable access to healthcare, education, agricultural guidance and government schemes, and many users are low-literacy with poor connectivity."] },
      { title: "Approach", body: ["RAHI bundles six modules in one platform covering healthcare, education, agriculture, schemes and emergency services. It is multilingual, offers speech input and output for low-literacy users and is designed to work on networks slower than 2G."] },
      { title: "Outcome", body: ["A six-module platform across three or more domains with multilingual voice. The code is open source."] },
    ],
  },
  localloop: {
    categories: ["Web", "AI/ML", "Open source"],
    status: "Open source",
    stats: [{ value: "85%+", label: "Rent prediction accuracy" }],
    sections: [
      { title: "Problem", body: ["Students moving to a new city have to judge rents, find places and find people with little local knowledge."] },
      { title: "Approach", body: ["LocalLoop combines an ML rent-prediction model with recommendations, a chatbot and community features, on a Node, React and PostgreSQL stack with Socket.io for real-time features."] },
      { title: "Outcome", body: ["The rent model reaches 85%+ accuracy. The code is open source."] },
    ],
  },
  "carbon-sense": {
    categories: ["AI/ML", "Web", "Open source"],
    status: "Open source",
    stats: [
      { value: "~88%", label: "Prediction accuracy" },
      { value: "3+", label: "Input domains" },
    ],
    sections: [
      { title: "Problem", body: ["Most people have no clear picture of their personal carbon footprint or which habits matter most."] },
      { title: "Approach", body: ["Carbon Sense predicts a footprint from travel, diet and energy data, then suggests reductions. It is built with FastAPI, LangChain and Recharts."] },
      { title: "Outcome", body: ["About 88% accuracy across three or more input domains. The code is open source."] },
    ],
  },
  ctms: {
    categories: ["Web", "AI/ML"],
    status: "Built",
    stats: [{ value: "65%", label: "Less TPO workflow effort" }],
    sections: [
      { title: "Problem", body: ["Training and placement offices coordinate students, companies and interview rounds by hand, and matching resumes to openings is slow."] },
      { title: "Approach", body: ["CTMS is a campus placement ERP with separate student and TPO panels, round tracking and an AI-ATS that matches resumes to roles."] },
      { title: "Outcome", body: ["AI resume matching cut TPO workflow effort by 65%."] },
    ],
  },
  "hiring-agent": {
    categories: ["AI/ML", "Open source"],
    status: "Open source",
    sections: [
      { title: "Overview", body: ["Hiring Agent is an LLM-based agent, written in Python, that evaluates resumes against a role and scores them. The code is open source."] },
    ],
  },
};

/** Every project joined with its case study, in display order. A missing study is a build-time error. */
export const allWork = projects.map((p) => {
  const cs = caseStudies[p.slug];
  if (!cs) throw new Error(`No case study for project "${p.slug}"`);
  return { ...p, ...cs };
});
