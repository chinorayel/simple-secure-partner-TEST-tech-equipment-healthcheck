/**
 * TECHNOLOGY EQUIPMENT HEALTH CHECK — SERVER FUNCTIONS
 *
 * This is the entire API surface for the widget and the admin view. It is
 * the ONLY place client code touches submission storage or admin auth —
 * nothing in submissions-store.server.ts or admin-auth.server.ts is ever
 * imported directly by a route or component.
 *
 * Security model:
 *  - `submitTechEquipmentHealthCheck` is public (anyone can submit their
 *    own assessment) but only ever WRITES a new record and returns that
 *    one record's id + result back to its own caller. There is no public
 *    read endpoint for submissions by id, by email, or in bulk — a
 *    visitor cannot look up another visitor's submission because no
 *    route exists that would let them, regardless of what id they guess.
 *  - `adminListSubmissions` / `adminGetSubmission` require a valid admin
 *    session (checked server-side via the signed cookie) and throw
 *    otherwise. No submission data is ever sent to an unauthenticated
 *    caller.
 *  - `adminLogin` only ever returns success/failure — it never echoes the
 *    password back, and the session cookie is HTTP-only so client-side
 *    JS (including this app's own React code) cannot read it.
 */

import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { QUESTIONS } from "./technology-equipment";
import { getSubmissionsStore } from "./submissions-store.server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createSessionToken,
  isValidSessionToken,
  verifyAdminPassword,
} from "./admin-auth.server";
import type { StoredSubmission, SubmissionSummary } from "./submission-types";

/* ------------------------------------------------------------------ */
/* Public: submit                                                      */
/* ------------------------------------------------------------------ */

const answerValueSchema = z.union([z.string(), z.array(z.string())]);

const submitSchema = z.object({
  customer: z.object({
    businessName: z.string().trim().min(1, "Business name is required").max(200),
    contactName: z.string().trim().min(1, "Contact name is required").max(200),
    email: z.string().trim().email("Enter a valid email address").max(320),
    phone: z.string().trim().max(40).optional(),
  }),
  answers: z.record(z.string(), answerValueSchema),
  consent: z.literal(true, {
    message: "Consent is required to submit the Health Check",
  }),
});

export const submitTechEquipmentHealthCheck = createServerFn({ method: "POST" })
  .validator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data: input }) => {
    // Belt-and-braces: reject answers for question ids that don't exist,
    // so a malformed/forged payload can't pollute stored data. Unknown
    // keys are silently dropped; every question is still optional at the
    // network layer (evaluateHealthCheck treats missing answers as
    // "not answered", exactly like the existing standalone page).
    const validIds = new Set(QUESTIONS.map((q) => q.id));
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
      return {
        ok: true as const,
        id: submission.id,
        result: submission.result,
      };
    } catch (err) {
      console.error("[health-check] submission failed:", err);
      // Never leak internals (file paths, stack traces) to the client.
      return {
        ok: false as const,
        error: "We couldn't save your submission right now. Please try again.",
      };
    }
  });

/* ------------------------------------------------------------------ */
/* Admin: auth                                                         */
/* ------------------------------------------------------------------ */

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

    if (!valid) {
      return { ok: false as const, error: "Incorrect password." };
    }

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

/** Throws if the caller doesn't have a valid admin session. */
function requireAdminSession() {
  const token = getCookie(ADMIN_SESSION_COOKIE);
  if (!isValidSessionToken(token)) {
    throw new Error("UNAUTHORIZED");
  }
}

export const adminCheckSession = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie(ADMIN_SESSION_COOKIE);
  return { authenticated: isValidSessionToken(token) };
});

/* ------------------------------------------------------------------ */
/* Admin: read submissions                                             */
/* ------------------------------------------------------------------ */

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
  .handler(
    async ({
      data: input,
    }): Promise<
      { ok: true; submission: StoredSubmission } | { ok: false; error: string }
    > => {
      try {
        requireAdminSession();
      } catch {
        return { ok: false, error: "UNAUTHORIZED" };
      }
      const store = getSubmissionsStore();
      const submission = await store.getById(input.id);
      if (!submission) return { ok: false, error: "NOT_FOUND" };
      return { ok: true, submission };
    },
  );
