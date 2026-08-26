export type AnswerMap = Record<string, string | undefined>;
export type AreaId = "connectivity" | "reliability" | "cctv" | "planning";
export type Status = "good" | "attention" | "priority";

export interface Choice {
  value: string;
  label: string;
  points?: number;
}

export interface Question {
  id: string;
  area: AreaId;
  label: string;
  helper?: string;
  choices: Choice[];
}

export const AREAS: { id: AreaId; label: string; description: string }[] = [
  { id: "connectivity", label: "Internet & Connectivity", description: "Internet reliability, Wi-Fi coverage and network access." },
  { id: "reliability", label: "Network Reliability & Power", description: "Backup internet, UPS protection and resilience during outages." },
  { id: "cctv", label: "CCTV & Security", description: "Camera coverage, reliability and remote monitoring." },
  { id: "planning", label: "Upgrade Readiness", description: "How your business plans and budgets for technology improvements." },
];

export const QUESTIONS: Question[] = [
  {
    id: "slow-internet",
    area: "connectivity",
    label: "How often does your business experience slow or unreliable internet?",
    choices: [
      { value: "never", label: "Never", points: 10 },
      { value: "rarely", label: "Rarely", points: 8 },
      { value: "sometimes", label: "Sometimes", points: 5 },
      { value: "often", label: "Often", points: 2 },
      { value: "daily", label: "Almost every day", points: 0 },
    ],
  },
  {
    id: "coverage",
    area: "connectivity",
    label: "Are there areas in your office where the Wi-Fi/internet connection is weak or unavailable?",
    choices: [
      { value: "no", label: "No", points: 10 },
      { value: "small", label: "Yes, one or two areas", points: 6 },
      { value: "several", label: "Yes, several areas", points: 2 },
      { value: "unsure", label: "I'm not sure", points: 4 },
    ],
  },
  {
    id: "connection-type",
    area: "connectivity",
    label: "How do your employees primarily connect to your network?",
    choices: [
      { value: "both", label: "Both wired/Ethernet and Wi-Fi", points: 10 },
      { value: "wired", label: "Mostly wired/Ethernet", points: 8 },
      { value: "wifi", label: "Mostly Wi-Fi", points: 7 },
      { value: "unsure", label: "I'm not sure", points: 4 },
    ],
  },
  {
    id: "provider-speed",
    area: "connectivity",
    label: "What is your current business internet provider and plan/speed?",
    helper: "For example: PLDT Fiber 200 Mbps, Globe Business 500 Mbps, etc.",
    choices: [{ value: "provided", label: "I can provide this information", points: 10 }],
  },
  {
    id: "employee-issues",
    area: "connectivity",
    label: "How often do employees report slow internet or network problems?",
    choices: [
      { value: "never", label: "Never", points: 10 },
      { value: "rarely", label: "Rarely", points: 8 },
      { value: "sometimes", label: "Sometimes", points: 5 },
      { value: "often", label: "Often", points: 2 },
      { value: "very-often", label: "Very often", points: 0 },
    ],
  },
  {
    id: "power-outage",
    area: "reliability",
    label: "What happens to your internet/Wi-Fi when there is a power interruption?",
    choices: [
      { value: "backup", label: "Our network stays online because we have backup power", points: 10 },
      { value: "immediate", label: "Internet/Wi-Fi goes down immediately", points: 0 },
      { value: "later", label: "It stays on for a while, then goes down", points: 4 },
      { value: "unsure", label: "I'm not sure", points: 3 },
    ],
  },
  {
    id: "ups",
    area: "reliability",
    label: "Does your Wi-Fi/network equipment have backup power?",
    helper: "A UPS or battery backup can keep routers, switches and Wi-Fi equipment running during short power interruptions.",
    choices: [
      { value: "ups", label: "Yes, we use a UPS/battery backup", points: 10 },
      { value: "generator", label: "Yes, we use a generator or power station", points: 8 },
      { value: "none", label: "No", points: 0 },
      { value: "unsure", label: "I'm not sure", points: 3 },
    ],
  },
  {
    id: "failover",
    area: "reliability",
    label: "Does your business have a backup internet connection if your main internet goes down?",
    helper: "Internet failover can use a secondary connection, such as 4G/5G, to keep your business connected when the primary connection fails.",
    choices: [
      { value: "yes", label: "Yes", points: 10 },
      { value: "no", label: "No", points: 0 },
      { value: "unsure", label: "I'm not sure", points: 3 },
    ],
  },
  {
    id: "guest-vpn",
    area: "reliability",
    label: "Does your business currently have any of these network setups?",
    helper: "Choose the option that best describes your current setup.",
    choices: [
      { value: "secure", label: "Separate guest Wi-Fi and VPN/secure remote access are set up", points: 10 },
      { value: "guest", label: "We have separate guest Wi-Fi, but no VPN", points: 7 },
      { value: "vpn", label: "We have VPN/secure remote access, but no separate guest Wi-Fi", points: 7 },
      { value: "none", label: "Neither is set up", points: 2 },
      { value: "unsure", label: "I'm not sure", points: 3 },
    ],
  },
  {
    id: "cctv",
    area: "cctv",
    label: "Does your business currently have CCTV cameras?",
    choices: [
      { value: "yes", label: "Yes", points: 10 },
      { value: "no", label: "No", points: 2 },
      { value: "problems", label: "We have cameras, but some are not working properly", points: 3 },
      { value: "unsure", label: "I'm not sure", points: 4 },
    ],
  },
  {
    id: "cctv-coverage",
    area: "cctv",
    label: "Are there important areas of your business that are currently not covered by CCTV?",
    choices: [
      { value: "no", label: "No", points: 10 },
      { value: "yes", label: "Yes", points: 2 },
      { value: "unsure", label: "I'm not sure", points: 4 },
    ],
  },
  {
    id: "cctv-remote",
    area: "cctv",
    label: "Can you view your CCTV remotely from a phone or computer?",
    choices: [
      { value: "yes", label: "Yes", points: 10 },
      { value: "no", label: "No", points: 3 },
      { value: "unsure", label: "I'm not sure", points: 4 },
    ],
  },
  {
    id: "cctv-quality",
    area: "cctv",
    label: "How would you describe your current CCTV system?",
    choices: [
      { value: "good", label: "Works well and meets our needs", points: 10 },
      { value: "some", label: "Works, but some cameras have problems", points: 5 },
      { value: "poor", label: "Image quality is poor or the system is outdated", points: 2 },
      { value: "none", label: "We don't currently have CCTV", points: 2 },
      { value: "unsure", label: "I'm not sure", points: 4 },
    ],
  },
  {
    id: "cctv-interest",
    area: "cctv",
    label: "If you don't currently have CCTV, how interested are you in having it installed?",
    choices: [
      { value: "very", label: "Very interested", points: 0 },
      { value: "somewhat", label: "Somewhat interested", points: 2 },
      { value: "exploring", label: "Just exploring the idea", points: 4 },
      { value: "not-now", label: "Not interested right now", points: 7 },
    ],
  },
  {
    id: "budget",
    area: "planning",
    label: "Does your business have a planned annual budget for network or technology upgrades?",
    choices: [
      { value: "dedicated", label: "Yes, we have a dedicated annual budget", points: 10 },
      { value: "variable", label: "Yes, but the budget varies each year", points: 7 },
      { value: "breakfix", label: "We usually upgrade only when something breaks", points: 3 },
      { value: "none", label: "No dedicated budget", points: 0 },
      { value: "unsure", label: "I'm not sure", points: 3 },
    ],
  },
];

export const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

function pointsFor(q: Question, answers: AnswerMap): number | undefined {
  const value = answers[q.id];
  return q.choices.find((c) => c.value === value)?.points;
}

export interface AreaResult {
  id: AreaId;
  label: string;
  status: Status;
  score: number;
  opportunity: string;
}

export interface AssessmentResult {
  areas: AreaResult[];
  overallScore: number;
  headline: string;
  summary: string;
  recommendations: string[];
}

export function calculateResult(answers: AnswerMap): AssessmentResult {
  const areas = AREAS.map((area) => {
    const qs = QUESTIONS.filter((q) => q.area === area.id);
    const scores = qs.map((q) => pointsFor(q, answers)).filter((p): p is number => p !== undefined);
    const score = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0;
    const status: Status = score >= 7.5 ? "good" : score >= 4.5 ? "attention" : "priority";
    const opportunity =
      area.id === "reliability"
        ? score < 7.5 ? "Consider UPS/battery backup and a 4G/5G internet failover review." : "Your network has useful resilience measures in place."
        : area.id === "connectivity"
          ? score < 7.5 ? "A Wi-Fi/network coverage and performance review may improve reliability." : "Your day-to-day connectivity looks healthy."
          : area.id === "cctv"
            ? score < 7.5 ? "A CCTV coverage, equipment and remote-viewing review may improve security." : "Your current CCTV setup appears to cover the basics well."
            : score < 7.5 ? "Planned annual upgrades can help prevent reactive technology spending." : "You have a good foundation for planned technology improvements.";
    return { id: area.id, label: area.label, status, score, opportunity };
  });

  const overallScore = Math.round((areas.reduce((sum, area) => sum + area.score, 0) / areas.length) * 10);
  const priority = areas.filter((a) => a.status === "priority");
  const attention = areas.filter((a) => a.status === "attention");
  const recommendations: string[] = [];

  if (answers["ups"] === "none" || answers["power-outage"] === "immediate") recommendations.push("UPS / battery backup for essential network equipment");
  if (answers["failover"] === "no") recommendations.push("4G/5G internet failover for business continuity");
  if (["small", "several"].includes(answers["coverage"] ?? "")) recommendations.push("Wi-Fi coverage and network optimization");
  if (answers["cctv"] === "no") recommendations.push("CCTV planning and installation for key business areas");
  if (answers["cctv-coverage"] === "yes") recommendations.push("CCTV coverage expansion for unmonitored areas");
  if (["problems", "poor"].includes(answers["cctv"] ?? "") || answers["cctv-quality"] === "poor") recommendations.push("CCTV system review or equipment upgrade");
  if (answers["cctv-remote"] === "no") recommendations.push("Remote CCTV viewing setup");
  if (answers["budget"] === "none" || answers["budget"] === "breakfix") recommendations.push("A planned annual network and technology upgrade plan");

  if (recommendations.length === 0) recommendations.push("A periodic network and security review to keep your current setup healthy");

  const headline = priority.length ? "Priority Improvements Recommended" : attention.length ? "Opportunities Identified" : "Strong Foundation";
  const summary = priority.length
    ? "Your answers highlight a few areas where practical improvements could strengthen reliability, continuity and security."
    : attention.length
      ? "Your setup has a solid foundation, with a few areas worth reviewing before they become bigger operational problems."
      : "Your network and security setup appears to be in good shape. Regular reviews can help keep it that way.";

  return { areas, overallScore, headline, summary, recommendations };
}

export function saveSubmission(data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const key = "sss-network-cctv-submissions";
  const current = JSON.parse(localStorage.getItem(key) || "[]") as unknown[];
  current.push({ ...data, id: crypto.randomUUID(), submittedAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(current));
}
