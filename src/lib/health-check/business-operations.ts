export type AnswerMap = Record<string, string | undefined>;

export interface Choice {
  value: string;
  label: string;
  points: number;
}

export interface Question {
  id: string;
  label: string;
  choices: Choice[];
}

export const QUESTIONS: Question[] = [
  {
    id: "day-to-day-management",
    label: "How are your day-to-day business tasks managed?",
    choices: [
      { value: "clear-system", label: "We use a clear system with assigned responsibilities and deadlines", points: 4 },
      { value: "some-manual", label: "We have a system, but some tasks are still managed manually", points: 3 },
      { value: "messages", label: "We mostly use messages, emails or spreadsheets", points: 2 },
      { value: "as-they-come", label: "Tasks are handled as they come up", points: 1 },
    ],
  },
  {
    id: "task-delays",
    label: "How often do tasks get delayed because someone is waiting for information, approval, or another person?",
    choices: [
      { value: "rarely", label: "Rarely", points: 4 },
      { value: "occasionally", label: "Occasionally", points: 3 },
      { value: "frequently", label: "Frequently", points: 2 },
      { value: "daily", label: "Almost every day", points: 1 },
    ],
  },
  {
    id: "repetitive-work",
    label: "How much of your team's work involves repetitive manual tasks?",
    choices: [
      { value: "very-little", label: "Very little", points: 4 },
      { value: "some", label: "Some", points: 3 },
      { value: "significant", label: "A significant amount", points: 2 },
      { value: "large-part", label: "A large part of our daily work", points: 1 },
    ],
  },
  {
    id: "key-employee-handover",
    label: "If a key employee is absent, how easily can someone else take over their responsibilities?",
    choices: [
      { value: "very-easily", label: "Very easily — everything is documented", points: 4 },
      { value: "mostly-easily", label: "Mostly easily — some information needs to be explained", points: 3 },
      { value: "difficult", label: "Difficult — much of the knowledge is with the employee", points: 2 },
      { value: "very-difficult", label: "Very difficult — there is no clear handover process", points: 1 },
    ],
  },
  {
    id: "process-documentation",
    label: "How well documented are your important business processes?",
    choices: [
      { value: "most-documented", label: "Most processes are documented and regularly updated", points: 4 },
      { value: "some-documented", label: "Some important processes are documented", points: 3 },
      { value: "outdated", label: "Documentation exists but is outdated/incomplete", points: 2 },
      { value: "undocumented", label: "Most processes are undocumented", points: 1 },
    ],
  },
  {
    id: "new-employee-training",
    label: "When you hire a new employee, how do they learn their role?",
    choices: [
      { value: "structured", label: "We have structured training and documented procedures", points: 4 },
      { value: "some-materials", label: "We have some training materials/processes", points: 3 },
      { value: "shadowing", label: "They mainly learn by shadowing another employee", points: 2 },
      { value: "informal", label: "Training is mostly informal or on-the-job", points: 1 },
    ],
  },
  {
    id: "wasted-time",
    label: "How much time does your team spend searching for information, following up, or correcting avoidable mistakes?",
    choices: [
      { value: "very-little", label: "Very little", points: 4 },
      { value: "some-weekly", label: "Some time each week", points: 3 },
      { value: "several-hours", label: "Several hours each week", points: 2 },
      { value: "significant", label: "A significant amount of time", points: 1 },
    ],
  },
  {
    id: "calls-enquiries",
    label: "How do you currently manage customer calls and enquiries?",
    choices: [
      { value: "structured", label: "We use a structured system with tracking and follow-ups", points: 4 },
      { value: "some-tracking", label: "We track some enquiries but mostly manually", points: 3 },
      { value: "individual", label: "Calls/messages are handled through individual phones or inboxes", points: 2 },
      { value: "none", label: "There is no consistent tracking system", points: 1 },
    ],
  },
  {
    id: "missed-enquiries",
    label: "How often do you lose or miss customer enquiries because they aren't followed up?",
    choices: [
      { value: "almost-never", label: "Almost never", points: 4 },
      { value: "occasionally", label: "Occasionally", points: 3 },
      { value: "regularly", label: "Regularly", points: 2 },
      { value: "not-tracked", label: "We don't currently track this", points: 1 },
    ],
  },
  {
    id: "knows-what-to-change",
    label: "If you wanted to improve one part of your business operations today, how confident are you that you know exactly what needs to change?",
    choices: [
      { value: "very-confident", label: "Very confident", points: 4 },
      { value: "somewhat-confident", label: "Somewhat confident", points: 3 },
      { value: "not-very-confident", label: "Not very confident", points: 2 },
      { value: "dont-know", label: "We don't know where to start", points: 1 },
    ],
  },
  {
    id: "delegate-work",
    label: "If you could delegate some of your day-to-day administrative and operational work, would it allow you to focus more on your customers, products, and growing your business?",
    choices: [
      { value: "big-difference", label: "Definitely — this would make a big difference", points: 4 },
      { value: "free-time", label: "Yes — it would free up some of my time", points: 3 },
      { value: "depends", label: "Maybe — depending on what could be delegated", points: 2 },
      { value: "self", label: "No — I prefer to handle these tasks myself", points: 1 },
    ],
  },
];

export const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

export interface AssessmentResult {
  score: number;
  maxScore: number;
  percentage: number;
  level: "healthy" | "good" | "attention" | "risk";
  label: string;
  summary: string;
  opportunities: string[];
  supportInterest: "strong" | "moderate" | "explore" | "self-managed";
}

export function calculateResult(answers: AnswerMap): AssessmentResult {
  const scores = QUESTIONS.map((q) => q.choices.find((c) => c.value === answers[q.id])?.points ?? 0);
  const score = scores.reduce((sum, value) => sum + value, 0);
  const maxScore = QUESTIONS.length * 4;
  const percentage = Math.round((score / maxScore) * 100);

  const level = score >= 37 ? "healthy" : score >= 29 ? "good" : score >= 20 ? "attention" : "risk";
  const labels = {
    healthy: "Healthy Operations",
    good: "Good, With Opportunities",
    attention: "Needs Attention",
    risk: "At Risk",
  } as const;
  const summaries = {
    healthy: "Your answers suggest a strong operational foundation. There may still be opportunities to save time and keep the business running smoothly as it grows.",
    good: "Your business has a good operational foundation, with a few areas where better systems or support could make day-to-day work easier.",
    attention: "Your answers highlight several operational areas that may be consuming time or creating avoidable friction for your team.",
    risk: "Your answers highlight significant operational gaps that may be affecting efficiency, consistency, and your ability to focus on growing the business.",
  } as const;

  const opportunities: string[] = [];
  const addIf = (id: string, values: string[], message: string) => {
    if (values.includes(answers[id] ?? "")) opportunities.push(message);
  };

  addIf("day-to-day-management", ["messages", "as-they-come"], "Create a clearer task and responsibility management process");
  addIf("task-delays", ["frequently", "daily"], "Identify workflow bottlenecks and improve handoffs");
  addIf("repetitive-work", ["significant", "large-part"], "Reduce repetitive manual work through process improvement or automation");
  addIf("key-employee-handover", ["difficult", "very-difficult"], "Document key processes and create practical handover procedures");
  addIf("process-documentation", ["outdated", "undocumented"], "Build and maintain clear SOPs and process documentation");
  addIf("new-employee-training", ["shadowing", "informal"], "Improve onboarding and role-specific training");
  addIf("wasted-time", ["several-hours", "significant"], "Reduce time spent searching, following up, and correcting avoidable mistakes");
  addIf("calls-enquiries", ["individual", "none"], "Create a more consistent customer call and enquiry tracking process");
  addIf("missed-enquiries", ["regularly", "not-tracked"], "Strengthen customer enquiry follow-up and tracking");
  addIf("knows-what-to-change", ["not-very-confident", "dont-know"], "Review current workflows to identify the highest-impact improvements");

  if (opportunities.length === 0) opportunities.push("A periodic operations review to keep your processes efficient as the business grows");

  const supportInterest = answers["delegate-work"] === "big-difference"
    ? "strong"
    : answers["delegate-work"] === "free-time"
      ? "moderate"
      : answers["delegate-work"] === "depends"
        ? "explore"
        : "self-managed";

  return {
    score,
    maxScore,
    percentage,
    level,
    label: labels[level],
    summary: summaries[level],
    opportunities,
    supportInterest,
  };
}

export function saveSubmission(data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const key = "sss-business-operations-submissions";
  const current = JSON.parse(localStorage.getItem(key) || "[]") as unknown[];
  current.push({ ...data, id: crypto.randomUUID(), submittedAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(current));
}
