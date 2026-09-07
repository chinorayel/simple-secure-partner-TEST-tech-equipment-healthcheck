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
    id: "website",
    label: "Does your business currently have a website?",
    choices: [
      { value: "professional", label: "Yes — it is professional, up to date, and actively maintained", points: 4 },
      { value: "needs-updates", label: "Yes — but it needs some updates or improvements", points: 3 },
      { value: "old", label: "We have a basic or older website that is rarely maintained", points: 2 },
      { value: "none", label: "No — we don't currently have a website", points: 1 },
    ],
  },
  {
    id: "domain-email",
    label: "Does your business use a professional email address connected to your domain?",
    choices: [
      { value: "team", label: "Yes — our team uses professional business email addresses", points: 4 },
      { value: "some", label: "Some team members use professional email, but not everyone", points: 3 },
      { value: "free-email", label: "We have a domain but mainly use personal or free email accounts", points: 2 },
      { value: "none", label: "We don't currently have a business domain or professional email", points: 1 },
    ],
  },
  {
    id: "facebook",
    label: "How would you describe your business's Facebook presence?",
    choices: [
      { value: "strong", label: "Our Facebook Page is complete, active, and regularly maintained", points: 4 },
      { value: "inconsistent", label: "We have a Page, but it isn't consistently updated", points: 3 },
      { value: "needs-work", label: "We have a Page, but it needs significant improvement", points: 2 },
      { value: "none", label: "We don't currently have a Facebook Business Page", points: 1 },
    ],
  },
  {
    id: "social-consistency",
    label: "How consistently does your business maintain its social media presence?",
    choices: [
      { value: "planned", label: "We post consistently according to a planned schedule", points: 4 },
      { value: "regular", label: "We post regularly, but without a clear schedule", points: 3 },
      { value: "occasional", label: "We post occasionally when we have something to share", points: 2 },
      { value: "rarely", label: "We rarely or never post", points: 1 },
    ],
  },
  {
    id: "online-enquiries",
    label: "How do customers currently contact your business online?",
    choices: [
      { value: "structured", label: "We have clear contact channels and a structured way to manage enquiries", points: 4 },
      { value: "multiple-manual", label: "Customers use several channels, but management is mostly manual", points: 3 },
      { value: "individual", label: "Most enquiries come through Facebook, Messenger, or individual accounts", points: 2 },
      { value: "inconsistent", label: "We don't have a consistent online enquiry system", points: 1 },
    ],
  },
  {
    id: "messenger",
    label: "How are Facebook or Messenger enquiries handled when you're unavailable?",
    choices: [
      { value: "automated", label: "We have automated replies and a clear follow-up process", points: 4 },
      { value: "some-automation", label: "We use some automated responses, but follow-up is mostly manual", points: 3 },
      { value: "manual", label: "We respond manually when someone is available", points: 2 },
      { value: "none", label: "There is no system for handling enquiries when we're unavailable", points: 1 },
    ],
  },
  {
    id: "visual-content",
    label: "How do you currently create visual content for your business?",
    choices: [
      { value: "consistent", label: "We have a consistent process and regularly produce professional content", points: 4 },
      { value: "in-house", label: "We create content ourselves when needed", points: 3 },
      { value: "struggle", label: "We create content occasionally, but often struggle to keep up", points: 2 },
      { value: "rarely", label: "We rarely create visual content", points: 1 },
    ],
  },
  {
    id: "content-planning",
    label: "How far ahead do you usually plan your social media content?",
    choices: [
      { value: "weeks-months", label: "We plan content weeks or months ahead", points: 4 },
      { value: "few-ahead", label: "We usually plan a few posts ahead", points: 3 },
      { value: "last-minute", label: "We decide what to post shortly before publishing", points: 2 },
      { value: "none", label: "We don't currently have a content plan", points: 1 },
    ],
  },
  {
    id: "target-customer",
    label: "How clearly defined is your business's target customer?",
    choices: [
      { value: "very-clear", label: "Very clear — we know exactly who we want to reach", points: 4 },
      { value: "fairly-clear", label: "Fairly clear — we have a general idea", points: 3 },
      { value: "broad", label: "Not very clear — we try to reach a broad audience", points: 2 },
      { value: "undefined", label: "We haven't clearly defined our target customer", points: 1 },
    ],
  },
  {
    id: "marketing-conversion",
    label: "How effectively does your online presence turn attention into enquiries or customers?",
    choices: [
      { value: "measured", label: "We have a clear process for generating enquiries and regularly track what works", points: 4 },
      { value: "some-tracking", label: "We generate enquiries online and track some of our results", points: 3 },
      { value: "unclear", label: "We get some attention or enquiries, but we aren't sure what drives them", points: 2 },
      { value: "none", label: "Our online presence rarely generates enquiries or customers", points: 1 },
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
}

export function calculateResult(answers: AnswerMap): AssessmentResult {
  const scores = QUESTIONS.map((q) => q.choices.find((c) => c.value === answers[q.id])?.points ?? 0);
  const score = scores.reduce((sum, value) => sum + value, 0);
  const maxScore = QUESTIONS.length * 4;
  const percentage = Math.round((score / maxScore) * 100);
  const level = score >= 37 ? "healthy" : score >= 29 ? "good" : score >= 20 ? "attention" : "risk";
  const labels = {
    healthy: "Healthy Digital Marketing",
    good: "Good, With Opportunities",
    attention: "Needs Attention",
    risk: "At Risk",
  } as const;
  const summaries = {
    healthy: "Your answers suggest a strong digital marketing foundation. There may still be opportunities to improve consistency, conversion and ongoing growth.",
    good: "Your business has a good digital marketing foundation, with a few areas where better online assets, content or systems could create more opportunities.",
    attention: "Your answers highlight several digital marketing areas that may be limiting your online visibility, customer engagement or ability to generate enquiries consistently.",
    risk: "Your answers highlight significant digital marketing gaps that may be making it harder for customers to find, trust and contact your business online.",
  } as const;

  const opportunities: string[] = [];
  const addIf = (id: string, values: string[], message: string) => {
    if (values.includes(answers[id] ?? "")) opportunities.push(message);
  };

  addIf("website", ["needs-updates", "old", "none"], "Strengthen your website and online presence so customers can find clear, current information about your business");
  addIf("domain-email", ["some", "free-email", "none"], "Set up a professional business domain and email addresses for a more consistent customer-facing presence");
  addIf("facebook", ["inconsistent", "needs-work", "none"], "Improve or establish your Facebook Business Page and keep important business information current");
  addIf("social-consistency", ["regular", "occasional", "rarely"], "Create a more consistent social media posting and management process");
  addIf("online-enquiries", ["multiple-manual", "individual", "inconsistent"], "Make online customer enquiries easier to capture, organize and follow up");
  addIf("messenger", ["some-automation", "manual", "none"], "Use automated Messenger responses and a clear follow-up process so customers receive timely replies");
  addIf("visual-content", ["in-house", "struggle", "rarely"], "Create a practical weekly or monthly visual content process that is easier to maintain");
  addIf("content-planning", ["few-ahead", "last-minute", "none"], "Build a simple content calendar so posts can be prepared and scheduled ahead of time");
  addIf("target-customer", ["broad", "undefined"], "Clarify your target customer so digital content and marketing efforts can be more focused");
  addIf("marketing-conversion", ["some-tracking", "unclear", "none"], "Improve the path from online attention to enquiries and track which activities generate results");

  if (opportunities.length === 0) opportunities.push("Review your digital marketing regularly to keep your online presence, content and customer journey effective as the business grows");

  return { score, maxScore, percentage, level, label: labels[level], summary: summaries[level], opportunities };
}

export function saveSubmission(data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const key = "sss-digital-marketing-submissions";
  const current = JSON.parse(localStorage.getItem(key) || "[]") as unknown[];
  current.push({ ...data, id: crypto.randomUUID(), submittedAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(current));
}
