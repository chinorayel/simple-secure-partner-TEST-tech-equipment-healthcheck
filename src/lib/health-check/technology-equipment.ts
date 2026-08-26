/**
 * TECHNOLOGY EQUIPMENT HEALTH CHECK
 * Part of the Simple Secure Solutions Health Check system.
 *
 * This module is the single source of truth for:
 *  - the assessment questions and answer choices
 *  - the scoring system
 *  - the area status logic
 *  - the recommendation logic (including context-aware rules)
 */

export type AreaId =
  | "computer-age"
  | "performance"
  | "operating-systems"
  | "backup"
  | "storage"
  | "ups"
  | "asset-tracking"
  | "planning";

export type AreaStatus = "good" | "attention" | "priority";
export type Priority = "low" | "medium" | "high";

export type AnswerMap = Record<string, string | string[] | undefined>;

export interface AnswerChoice {
  value: string;
  label: string;
  /** 0-10 health points. Omitted for context-only questions. */
  points?: number;
}

export interface Question {
  id: string;
  area: AreaId | null;
  label: string;
  helper?: string;
  multi?: boolean;
  /** Relative weight in the overall score. 0 = context only. */
  weight: number;
  choices: AnswerChoice[];
}

export const AREAS: { id: AreaId; label: string }[] = [
  { id: "computer-age", label: "Computer Age" },
  { id: "performance", label: "Computer Performance" },
  { id: "operating-systems", label: "Operating Systems" },
  { id: "backup", label: "Backup" },
  { id: "storage", label: "Storage" },
  { id: "ups", label: "UPS Protection" },
  { id: "asset-tracking", label: "Asset Tracking" },
  { id: "planning", label: "Technology Budget / Planning" },
];

export const QUESTIONS: Question[] = [
  {
    id: "employees",
    area: null,
    label: "How many employees does your business have?",
    weight: 0,
    choices: [
      { value: "under5", label: "Less than 5" },
      { value: "5to10", label: "5–10" },
      { value: "10to20", label: "10–20" },
      { value: "20to50", label: "20–50" },
      { value: "over50", label: "More than 50" },
    ],
  },
  {
    id: "computers",
    area: null,
    label: "How many computers does your business currently use?",
    weight: 0,
    choices: [
      { value: "under5", label: "Less than 5" },
      { value: "5to10", label: "5–10" },
      { value: "10to20", label: "10–20" },
      { value: "20to50", label: "20–50" },
      { value: "over50", label: "More than 50" },
    ],
  },
  {
    id: "industry",
    area: null,
    label: "What industry is your business in?",
    weight: 0,
    choices: [
      { value: "professional", label: "Professional / Office Services" },
      { value: "retail", label: "Retail / POS" },
      { value: "manufacturing", label: "Manufacturing / Machinery" },
      { value: "construction", label: "Construction / Engineering" },
      { value: "education", label: "Education / School" },
      { value: "healthcare", label: "Healthcare / Medical" },
      { value: "food", label: "Food / Restaurant / Hospitality" },
      { value: "finance", label: "Finance / Accounting" },
      { value: "realestate", label: "Real Estate / Property" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "usage",
    area: null,
    label: "Which areas of your business use computers?",
    helper: "Select all that apply.",
    multi: true,
    weight: 0,
    choices: [
      { value: "admin", label: "Admin — sales, Excel, documents, email, and general office work" },
      { value: "graphic", label: "Graphic — graphic design, video, photography, AutoCAD, and other GPU-intensive work" },
      { value: "machinery", label: "Machinery — printing, production equipment, machines, and related systems" },
      { value: "pos", label: "POS / Retail — point-of-sale, cashier, inventory, and retail operations" },
    ],
  },
  {
    id: "age",
    area: "computer-age",
    label: "How old are most of the computers currently being used in your business?",
    weight: 14,
    choices: [
      { value: "under5", label: "Less than 5 years", points: 10 },
      { value: "5to10", label: "5–10 years", points: 5 },
      { value: "over10", label: "More than 10 years", points: 0 },
      { value: "unsure", label: "I'm not sure", points: 3 },
    ],
  },
  {
    id: "os",
    area: "operating-systems",
    label: "What operating system are your computers currently running?",
    weight: 10,
    choices: [
      { value: "win11", label: "Windows 11", points: 10 },
      { value: "win10", label: "Windows 10", points: 3 },
      { value: "combination", label: "Combination of Windows 10 and Windows 11", points: 6 },
      { value: "other", label: "Other operating system", points: 4 },
      { value: "unsure", label: "I'm not sure", points: 3 },
    ],
  },
  {
    id: "slow",
    area: "performance",
    label: "How often do employees raise concerns about computers being slow?",
    weight: 14,
    choices: [
      { value: "rarely", label: "Rarely or never", points: 10 },
      { value: "sometimes", label: "Sometimes", points: 6 },
      { value: "frequently", label: "Frequently", points: 2 },
      { value: "very_frequently", label: "Very frequently", points: 0 },
    ],
  },
  {
    id: "storage",
    area: "storage",
    label: "How often do employees experience concerns related to computer storage?",
    weight: 10,
    choices: [
      { value: "rarely", label: "Rarely or never", points: 10 },
      { value: "sometimes", label: "Sometimes", points: 6 },
      { value: "frequently", label: "Frequently", points: 2 },
      { value: "very_frequently", label: "Very frequently", points: 0 },
    ],
  },
  {
    id: "server",
    area: null,
    label: "Does your business use a server or centralized file storage system?",
    weight: 0,
    choices: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "I'm not sure" },
    ],
  },
  {
    id: "backup",
    area: "backup",
    label: "Are your business files and data backed up?",
    weight: 18,
    choices: [
      { value: "all", label: "Yes, all business files are backed up", points: 10 },
      { value: "important", label: "Only some important files are backed up", points: 5 },
      { value: "unsure", label: "I'm not sure", points: 2 },
      { value: "none", label: "No backup is in place", points: 0 },
    ],
  },
  {
    id: "ups",
    area: "ups",
    label: "Do you have UPS protection for your computers or other important technology equipment?",
    helper: "A UPS (Uninterruptible Power Supply) provides temporary power during an outage and helps protect equipment from power interruptions and fluctuations.",
    weight: 8,
    choices: [
      { value: "all", label: "Yes, all important computers/equipment have UPS protection", points: 10 },
      { value: "some", label: "Some computers/equipment have UPS protection", points: 5 },
      { value: "none", label: "No UPS protection", points: 0 },
      { value: "unsure", label: "I'm not sure", points: 3 },
    ],
  },
  {
    id: "assets",
    area: "asset-tracking",
    label: "Do you keep a list or inventory of your computers and technology equipment?",
    weight: 8,
    choices: [
      { value: "current", label: "Yes, we keep an updated list", points: 10 },
      { value: "outdated", label: "We have a list, but it may not be updated", points: 5 },
      { value: "none", label: "No formal list", points: 0 },
      { value: "unsure", label: "I'm not sure", points: 3 },
    ],
  },
  {
    id: "management",
    area: "planning",
    label: "Who currently manages your business technology and computer equipment?",
    weight: 8,
    choices: [
      { value: "company", label: "We work with a technology / IT company", points: 10 },
      { value: "employee", label: "We have an employed IT person", points: 8 },
      { value: "whoever", label: "Someone in the company handles IT when needed", points: 3 },
      { value: "none", label: "We don't have anyone specifically managing IT", points: 0 },
    ],
  },
  {
    id: "budget",
    area: "planning",
    label: "Does your business have a planned annual budget for IT and technology?",
    weight: 8,
    choices: [
      { value: "dedicated", label: "Yes, we have a dedicated annual IT budget", points: 10 },
      { value: "as_needed", label: "We set a budget when technology needs arise", points: 4 },
      { value: "none", label: "No fixed IT budget", points: 0 },
      { value: "unsure", label: "I'm not sure", points: 3 },
    ],
  },
];

export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function choiceOf(q: Question, answers: AnswerMap): AnswerChoice | undefined {
  const v = answers[q.id];
  if (typeof v !== "string") return undefined;
  return q.choices.find((c) => c.value === v);
}

export function answerLabel(q: Question, answers: AnswerMap): string {
  const v = answers[q.id];
  if (q.multi) {
    const list = Array.isArray(v) ? v : [];
    if (!list.length) return "Not answered";
    return q.choices
      .filter((c) => list.includes(c.value))
      .map((c) => c.label)
      .join(", ");
  }
  return choiceOf(q, answers)?.label ?? "Not answered";
}

function has(answers: AnswerMap, id: string, value: string): boolean {
  const v = answers[id];
  return Array.isArray(v) ? v.includes(value) : v === value;
}

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

export interface AreaResult {
  id: AreaId;
  label: string;
  status: AreaStatus;
  score: number; // 0-10 average
}

export interface Recommendation {
  areaId: AreaId;
  category: string;
  priority: Priority;
  found: string;
  why: string;
  nextStep: string;
}

export interface Strength {
  areaId: AreaId;
  title: string;
  detail: string;
}

export interface OverallResult {
  score: number; // 0-100
  label: string;
  headline: string;
  summary: string;
}

export interface HealthCheckResult {
  overall: OverallResult;
  areas: AreaResult[];
  strengths: Strength[];
  recommendations: Recommendation[];
  answeredCount: number;
  totalScored: number;
}

function areaResults(answers: AnswerMap): AreaResult[] {
  return AREAS.map((area) => {
    const qs = QUESTIONS.filter((q) => q.area === area.id);
    const scored = qs
      .map((q) => choiceOf(q, answers)?.points)
      .filter((p): p is number => typeof p === "number");
    const score = scored.length ? scored.reduce((a, b) => a + b, 0) / scored.length : 0;
    const status: AreaStatus = !scored.length
      ? "attention"
      : score >= 7
        ? "good"
        : score >= 4
          ? "attention"
          : "priority";
    return { id: area.id, label: area.label, status, score };
  });
}

function overallFor(answers: AnswerMap): OverallResult {
  let weighted = 0;
  let weight = 0;
  for (const q of QUESTIONS) {
    if (!q.weight) continue;
    const points = choiceOf(q, answers)?.points;
    if (typeof points !== "number") continue;
    weighted += points * q.weight;
    weight += q.weight;
  }
  const score = weight ? Math.round((weighted / (weight * 10)) * 100) : 0;

  if (score >= 85)
    return {
      score,
      label: "Strong",
      headline: "Well Maintained",
      summary:
        "Your technology environment looks well managed. A few refinements can help keep it that way.",
    };
  if (score >= 70)
    return {
      score,
      label: "Good",
      headline: "Opportunities Identified",
      summary:
        "Your foundations look solid. We have identified a small number of areas worth reviewing.",
    };
  if (score >= 50)
    return {
      score,
      label: "Fair",
      headline: "Several Areas to Review",
      summary:
        "A number of areas could benefit from attention to improve reliability and day-to-day productivity.",
    };
  if (score >= 30)
    return {
      score,
      label: "Needs Attention",
      headline: "Improvements Recommended",
      summary:
        "Your answers suggest several practical improvements that would make daily operations more dependable.",
    };
  return {
    score,
    label: "Priority Review",
    headline: "A Closer Look Is Recommended",
    summary:
      "Your answers point to a number of areas worth reviewing together, starting with the most business-critical ones.",
  };
}

/* ------------------------------------------------------------------ */
/* Strengths                                                           */
/* ------------------------------------------------------------------ */

const STRENGTH_TEXT: Record<AreaId, { title: string; detail: string }> = {
  "computer-age": {
    title: "Equipment Age",
    detail: "Most of your computers are within a reasonable age range.",
  },
  performance: {
    title: "Day-to-Day Performance",
    detail: "Your team reports that computers perform reliably for everyday work.",
  },
  "operating-systems": {
    title: "Supported Operating Systems",
    detail: "Your computers are running operating system versions that are still supported.",
  },
  backup: {
    title: "Reliable Backup Coverage",
    detail: "Your business reports having backup coverage for its files and data.",
  },
  storage: {
    title: "Healthy Storage Levels",
    detail: "Your computers generally have enough free storage space to run comfortably.",
  },
  ups: {
    title: "Power Protection",
    detail: "Your important computers are protected against sudden power interruptions.",
  },
  "asset-tracking": {
    title: "Asset Tracking",
    detail: "Your business maintains an up-to-date equipment list.",
  },
  planning: {
    title: "Technology Planning",
    detail: "You plan and budget for technology ahead of time rather than only when issues arise.",
  },
};

/* ------------------------------------------------------------------ */
/* Recommendations                                                     */
/* ------------------------------------------------------------------ */

function priorityFor(status: AreaStatus): Priority {
  return status === "priority" ? "high" : "medium";
}

function recommendationFor(
  area: AreaResult,
  answers: AnswerMap,
): Recommendation | null {
  if (area.status === "good") return null;

  const priority = priorityFor(area.status);
  const hasServer = has(answers, "server", "yes");
  const machinery = has(answers, "usage", "machinery");
  const heavyApps = has(answers, "usage", "graphic");
  const pos = has(answers, "usage", "pos");

  switch (area.id) {
    case "computer-age":
      return {
        areaId: area.id,
        category: "Computer Age",
        priority,
        found:
          "Some of your computers appear to be reaching the later part of their useful life, based on the ages you reported.",
        why: "Older equipment tends to need more support time and becomes harder to repair or replace quickly when something goes wrong.",
        nextStep:
          "Identify which computers are oldest and which roles depend on them, so replacements can be planned gradually rather than urgently.",
      };

    case "performance":
      return {
        areaId: area.id,
        category: "Computer Performance",
        priority,
        found: heavyApps
          ? "You reported performance concerns alongside design or video work, which places heavier demands on computers."
          : "You reported that some computers are slower than your team would like.",
        why: "Slow computers quietly reduce productivity across the working day, and the cause is often straightforward to identify.",
        nextStep:
          "Review the slowest computers individually to determine whether the cause is RAM/memory, storage, software, or age before deciding whether an upgrade or replacement is needed.",
      };

    case "operating-systems":
      return {
        areaId: area.id,
        category: "Operating Systems",
        priority,
        found: machinery
          ? "Some computers are on older Windows versions, and you also indicated machinery work. Specialised equipment may require individual compatibility review before an operating system is upgraded or replaced."
          : "Some computers appear to be running operating system versions that are no longer current.",
        why: "Supported operating systems continue to receive updates, which helps keep business data and daily operations stable.",
        nextStep: machinery
          ? "Review the machinery-connected computers separately with the equipment vendor, and plan upgrades for general office computers first."
          : "Confirm which computers are on older versions and review whether they can be updated in place or should be scheduled for replacement.",
      };

    case "backup": {
      const backup = answers["backup"];
      const noBackup = backup === "none" || backup === "unsure";
      return {
        areaId: area.id,
        category: "Backup",
        priority: noBackup ? "high" : priority,
        found:
          hasServer && noBackup
            ? "You indicated that you use a server or centralized storage, and that backup coverage is not confirmed. This suggests centralised business data may not currently be backed up."
            : noBackup
              ? "Backup coverage for your business files does not appear to be confirmed."
              : "Backups appear to be partial, or a restore has not been tested recently.",
        why: "Backups are only useful if they cover the data your business depends on and can be restored when needed.",
        nextStep:
          "Confirm exactly what is included in your backups, then test restoring a file so you know the process works.",
      };
    }

    case "storage":
      return {
        areaId: area.id,
        category: "Storage",
        priority,
        found: "Free storage space on your computers appears limited or unconfirmed.",
        why: "Computers running low on storage often slow down and can have trouble applying updates.",
        nextStep:
          "Check available space on the affected computers and review whether older files can be archived to shared or cloud storage.",
      };

    case "ups":
      return {
        areaId: area.id,
        category: "UPS Protection",
        priority,
        found:
          hasServer && has(answers, "ups", "none")
            ? "You reported a server or shared storage without UPS protection, which leaves centralised data exposed to sudden power interruptions."
            : pos
              ? "Point-of-sale computers may not currently have UPS protection, leaving them exposed to sudden power interruptions."
              : "Employee computers may not currently have UPS protection, leaving them exposed to sudden power interruptions.",
        why: "Unexpected power loss can interrupt work in progress and, over time, affect equipment reliability.",
        nextStep:
          "Review which computers are most critical and determine whether UPS protection should be added.",
      };

    case "asset-tracking":
      return {
        areaId: area.id,
        category: "Asset Tracking",
        priority,
        found: "Your equipment list appears to be partial, outdated, or not currently maintained.",
        why: "A simple, current equipment list makes support, budgeting, and replacement planning much easier.",
        nextStep:
          "Start a basic list of computers with age, location, and user, and keep it updated as equipment changes.",
      };

    case "planning":
      return {
        areaId: area.id,
        category: "Technology Budget / Planning",
        priority,
        found:
          "Technology spending appears to happen mainly in response to issues rather than as part of a plan.",
        why: "Planned replacement spreads cost over time and reduces unexpected disruption to daily operations.",
        nextStep:
          "Set a simple annual technology budget and a rough replacement schedule based on equipment age.",
      };

    default:
      return null;
  }
}

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function evaluateHealthCheck(answers: AnswerMap): HealthCheckResult {
  const areas = areaResults(answers);

  const strengths: Strength[] = areas
    .filter((a) => a.status === "good")
    .map((a) => ({ areaId: a.id, ...STRENGTH_TEXT[a.id] }));

  const recommendations = areas
    .map((a) => recommendationFor(a, answers))
    .filter((r): r is Recommendation => r !== null)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  const scoredQuestions = QUESTIONS.filter((q) => q.weight > 0);

  return {
    overall: overallFor(answers),
    areas,
    strengths,
    recommendations,
    answeredCount: QUESTIONS.filter((q) => {
      const v = answers[q.id];
      return Array.isArray(v) ? v.length > 0 : Boolean(v);
    }).length,
    totalScored: scoredQuestions.length,
  };
}

/* ------------------------------------------------------------------ */
/* Submission storage (browser only)                                   */
/* ------------------------------------------------------------------ */

export interface Submission {
  businessName?: string;
  completedAt: string; // ISO
  answers: AnswerMap;
}

const STORAGE_KEY = "sss.healthcheck.technology-equipment";

export function saveSubmission(submission: Submission) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submission));
  } catch {
    /* storage unavailable */
  }
}

export function loadSubmission(): Submission | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Submission;
    if (!parsed || typeof parsed !== "object" || !parsed.answers) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const STATUS_LABEL: Record<AreaStatus, string> = {
  good: "GOOD",
  attention: "NEEDS ATTENTION",
  priority: "PRIORITY",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: "HIGH",
  medium: "MEDIUM",
  low: "LOW",
};
