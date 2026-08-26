/**
 * TECHNOLOGY EQUIPMENT HEALTH CHECK — SUBMISSION SCHEMA
 *
 * This is the persisted shape of a completed Health Check submission.
 * It is intentionally backend-agnostic: nothing here assumes a specific
 * database. Whatever storage implements `SubmissionsStore` (see
 * submissions-store.server.ts) reads and writes exactly this shape.
 *
 * Swapping the storage backend later (e.g. to Supabase/Postgres) should
 * only require a new SubmissionsStore implementation — this schema, the
 * server functions, and every route/component that uses them stay the same.
 */

import type { AnswerMap, HealthCheckResult } from "./technology-equipment";

/** Customer-supplied contact details, collected before final submission. */
export interface CustomerInfo {
  businessName: string;
  contactName: string;
  email: string;
  /** Optional. */
  phone?: string;
}

/** What the client sends when completing the widget. */
export interface SubmissionInput {
  customer: CustomerInfo;
  answers: AnswerMap;
  /** Must be explicitly true — enforced server-side, not just in the UI. */
  consent: boolean;
}

/**
 * A fully persisted submission. The raw answers AND the calculated result
 * are both stored — the result is a snapshot at completion time so it
 * never silently drifts if the scoring logic changes later.
 */
export interface StoredSubmission {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  answers: AnswerMap;
  result: HealthCheckResult;
  completedAt: string; // ISO timestamp
}

/** Lighter-weight shape for admin list views. */
export type SubmissionSummary = Pick<
  StoredSubmission,
  "id" | "businessName" | "contactName" | "email" | "phone" | "completedAt"
> & {
  overallScore: number;
  overallLabel: string;
};

export function toSummary(s: StoredSubmission): SubmissionSummary {
  return {
    id: s.id,
    businessName: s.businessName,
    contactName: s.contactName,
    email: s.email,
    phone: s.phone,
    completedAt: s.completedAt,
    overallScore: s.result.overall.score,
    overallLabel: s.result.overall.label,
  };
}
