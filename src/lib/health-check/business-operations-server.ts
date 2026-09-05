import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { QUESTIONS, calculateResult } from "./business-operations";

const submitSchema = z.object({
  customer: z.object({
    businessName: z.string().trim().min(1).max(200),
    contactName: z.string().trim().min(1).max(200),
    email: z.string().trim().email().max(320),
    phone: z.string().trim().max(40).optional(),
  }),
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

export const submitBusinessOperationsHealthCheck = createServerFn({ method: "POST" })
  .validator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data: input }) => {
    const validIds = new Set(QUESTIONS.map((q) => q.id));
    const cleanedAnswers: Record<string, string> = {};
    for (const [id, value] of Object.entries(input.answers)) {
      if (validIds.has(id)) cleanedAnswers[id] = value;
    }

    const result = calculateResult(cleanedAnswers);
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return { ok: true as const, result, emailSent: false };
    }

    const answerRows = QUESTIONS.map((question) => {
      const answer = cleanedAnswers[question.id];
      const label = question.choices.find((choice) => choice.value === answer)?.label ?? answer ?? "Not answered";
      return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee"><strong>${escapeHtml(question.label)}</strong></td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(label)}</td></tr>`;
    }).join("");

    const html = `<div style="font-family:Arial,sans-serif;max-width:760px;color:#1f2937">
      <h2>New Business Operations Health Check submission</h2>
      <p><strong>Business:</strong> ${escapeHtml(input.customer.businessName)}</p>
      <p><strong>Contact:</strong> ${escapeHtml(input.customer.contactName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.customer.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(input.customer.phone || "Not provided")}</p>
      <h3>Result</h3>
      <p><strong>${escapeHtml(result.label)}</strong> — ${result.score}/${result.maxScore} (${result.percentage}%)</p>
      <p>${escapeHtml(result.summary)}</p>
      <h3>Assessment answers</h3>
      <table style="border-collapse:collapse;width:100%;font-size:14px"><tbody>${answerRows}</tbody></table>
    </div>`;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Simple Secure Solutions <hello@simplesecure.solutions>",
          to: ["hello@simplesecure.solutions"],
          reply_to: input.customer.email,
          subject: `[Health Check] Business Operations — ${input.customer.businessName}`,
          html,
        }),
      });

      if (!response.ok) {
        console.error("[health-check] business operations email failed:", await response.text());
        return { ok: false as const, error: "We couldn't submit your assessment right now. Please try again." };
      }

      return { ok: true as const, result, emailSent: true };
    } catch (err) {
      console.error("[health-check] business operations submission failed:", err);
      return { ok: false as const, error: "We couldn't submit your assessment right now. Please try again." };
    }
  });
