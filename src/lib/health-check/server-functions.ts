import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { QUESTIONS as TECH_QUESTIONS, evaluateHealthCheck } from "./technology-equipment";
import { QUESTIONS as NETWORK_QUESTIONS, calculateResult } from "./network-cctv";
import { getSubmissionsStore } from "./submissions-store.server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createSessionToken,
  isValidSessionToken,
  verifyAdminPassword,
} from "./admin-auth.server";
import type { StoredSubmission, SubmissionSummary } from "./submission-types";

const answerValueSchema = z.union([z.string(), z.array(z.string())]);

const submitSchema = z.object({
  customer: z.object({
    businessName: z.string().trim().min(1, "Business name is required").max(200),
    contactName: z.string().trim().min(1, "Contact name is required").max(200),
    email: z.string().trim().email("Enter a valid email address").max(320),
    phone: z.string().trim().max(40).optional(),
  }),
  answers: z.record(z.string(), answerValueSchema),
  consent: z.literal(true, { message: "Consent is required to submit the Health Check" }),
});

const networkSubmitSchema = z.object({
  customer: z.object({
    businessName: z.string().trim().min(1).max(200),
    contactName: z.string().trim().min(1).max(200),
    email: z.string().trim().email().max(320),
    phone: z.string().trim().max(40).optional(),
  }),
  provider: z.string().trim().max(200).optional(),
  answers: z.record(z.string(), z.string()),
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function answerLabel(questionSet: typeof TECH_QUESTIONS, id: string, value: string | string[]) {
  const question = questionSet.find((q) => q.id === id);
  if (!question) return Array.isArray(value) ? value.join(", ") : value;
  const values = Array.isArray(value) ? value : [value];
  return values.map((v) => question.choices.find((c) => c.value === v)?.label ?? v).join(", ");
}

function networkAnswerLabel(id: string, value: string) {
  const question = NETWORK_QUESTIONS.find((q) => q.id === id);
  return question?.choices.find((c) => c.value === value)?.label ?? value;
}

async function sendHealthCheckEmail(input: {
  assessment: string;
  customer: { businessName: string; contactName: string; email: string; phone?: string };
  answers: Record<string, string | string[]>;
  result: unknown;
  questionSet: typeof TECH_QUESTIONS;
  extra?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY is not configured" } as const;

  const answerRows = Object.entries(input.answers)
    .map(([id, value]) => {
      const label = answerLabel(input.questionSet, id, value);
      return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee"><strong>${escapeHtml(id)}</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(label)}</td></tr>`;
    })
    .join("");

  const resultText = escapeHtml(JSON.stringify(input.result, null, 2));
  const extra = input.extra ? `<p><strong>Additional information:</strong> ${escapeHtml(input.extra)}</p>` : "";
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:760px;color:#1f2937">
      <h2>New ${escapeHtml(input.assessment)} submission</h2>
      <p><strong>Business:</strong> ${escapeHtml(input.customer.businessName)}</p>
      <p><strong>Contact:</strong> ${escapeHtml(input.customer.contactName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.customer.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(input.customer.phone || "Not provided")}</p>
      ${extra}
      <h3>Assessment answers</h3>
      <table style="border-collapse:collapse;width:100%;font-size:14px"><tbody>${answerRows}</tbody></table>
      <h3>Calculated result</h3>
      <pre style="background:#f6f6f6;padding:16px;border-radius:8px;white-space:pre-wrap">${resultText}</pre>
    </div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Simple Secure Solutions <hello@simplesecure.solutions>",
      to: ["hello@simplesecure.solutions"],
      reply_to: input.customer.email,
      subject: `[Health Check] ${input.assessment} — ${input.customer.businessName}`,
      html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[health-check] email failed:", detail);
    return { sent: false, reason: "Email provider rejected the request" } as const;
  }
  return { sent: true } as const;
}

export const submitTechEquipmentHealthCheck = createServerFn({ method: "POST" })
  .validator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data: input }) => {
    const validIds = new Set(TECH_QUESTIONS.map((q) => q.id));
    const cleanedAnswers: Record<string, string | string[]> = {};
    for (const [id, value] of Object.entries(input.answers)) {
      if (validIds.has(id)) cleanedAnswers[id] = value;
    }

    const store = getSubmissionsStore();
    try {
      const submission = await store.create({
        customer: input.customer,
        answers: cleanedAnswers,
        consent: input.consent,
      });
      const email = await sendHealthCheckEmail({
        assessment: "Technology Equipment Health Check",
        customer: input.customer,
        answers: cleanedAnswers,
        result: submission.result,
        questionSet: TECH_QUESTIONS,
      });
      return { ok: true as const, id: submission.id, result: submission.result, emailSent: email.sent };
    } catch (err) {
      console.error("[health-check] submission failed:", err);
      return { ok: false as const, error: "We couldn't save your submission right now. Please try again." };
    }
  });

export const submitNetworkCctvHealthCheck = createServerFn({ method: "POST" })
  .validator((input: unknown) => networkSubmitSchema.parse(input))
  .handler(async ({ data: input }) => {
    const validIds = new Set(NETWORK_QUESTIONS.map((q) => q.id));
    const cleanedAnswers: Record<string, string> = {};
    for (const [id, value] of Object.entries(input.answers)) {
      if (validIds.has(id)) cleanedAnswers[id] = value;
    }
    try {
      const result = calculateResult(cleanedAnswers);
      const email = await sendHealthCheckEmail({
        assessment: "Network & CCTV Health Check",
        customer: input.customer,
        answers: cleanedAnswers,
        result,
        questionSet: NETWORK_QUESTIONS,
        extra: input.provider ? `Internet provider / plan: ${input.provider}` : undefined,
      });
      return { ok: true as const, result, emailSent: email.sent };
    } catch (err) {
      console.error("[health-check] network/CCTV submission failed:", err);
      return { ok: false as const, error: "We couldn't submit your assessment right now. Please try again." };
    }
  });

const loginSchema = z.object({ password: z.string().min(1) });

export const adminLogin = createServerFn({ method: "POST" })
  .validator((input: unknown) => loginSchema.parse(input))
  .handler(async ({ data: input }) => {
    let valid: boolean;
    try {
      valid = verifyAdminPassword(input.password);
    } catch (err) {
      console.error("[health-check] admin login misconfigured:", err);
      return { ok: false as const, error: "Admin login is not configured." };
    }
    if (!valid) return { ok: false as const, error: "Incorrect password." };
    const { token } = createSessionToken();
    setCookie(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_TTL_SECONDS,
    });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(ADMIN_SESSION_COOKIE, { path: "/" });
  return { ok: true as const };
});

function requireAdminSession() {
  const token = getCookie(ADMIN_SESSION_COOKIE);
  if (!isValidSessionToken(token)) throw new Error("UNAUTHORIZED");
}

export const adminCheckSession = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie(ADMIN_SESSION_COOKIE);
  return { authenticated: isValidSessionToken(token) };
});

export const adminListSubmissions = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ ok: true; submissions: SubmissionSummary[] } | { ok: false; error: string }> => {
    try {
      requireAdminSession();
    } catch {
      return { ok: false, error: "UNAUTHORIZED" };
    }
    const store = getSubmissionsStore();
    const submissions = await store.list();
    return { ok: true, submissions };
  },
);

const getByIdSchema = z.object({ id: z.string().min(1) });

export const adminGetSubmission = createServerFn({ method: "GET" })
  .validator((input: unknown) => getByIdSchema.parse(input))
  .handler(async ({ data: input }): Promise<{ ok: true; submission: StoredSubmission } | { ok: false; error: string }> => {
    try {
      requireAdminSession();
    } catch {
      return { ok: false, error: "UNAUTHORIZED" };
    }
    const store = getSubmissionsStore();
    const submission = await store.getById(input.id);
    if (!submission) return { ok: false, error: "NOT_FOUND" };
    return { ok: true, submission };
  });
