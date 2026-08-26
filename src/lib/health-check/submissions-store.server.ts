/**
 * SUBMISSIONS STORE — SERVER ONLY
 *
 * `.server.ts` is a convention, not enforced by the framework in this repo,
 * so nothing here must ever be imported from client code. It is only ever
 * imported from server-functions.ts, which itself is only called through
 * `createServerFn`.
 *
 * ── Why a JSON file, and why this is TEST-only ──────────────────────────
 * This project has no database configured (see Phase 1 inspection). Rather
 * than silently provisioning one, this store persists submissions to a
 * single JSON file on disk (`.data/tech-equipment-submissions.json`,
 * git-ignored). That is enough to prove out the full flow — real
 * persistence across requests, no localStorage-only data — in a TEST
 * environment with a single long-lived server process.
 *
 * It is NOT appropriate for a production/serverless deployment, where the
 * filesystem is typically ephemeral or not shared across instances. The
 * `SubmissionsStore` interface below is the seam: swapping to Supabase,
 * Postgres, etc. later means writing one new class that implements this
 * interface and changing a single line in `getSubmissionsStore()` — no
 * changes to server-functions.ts, routes, or components.
 */

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  StoredSubmission,
  SubmissionInput,
  SubmissionSummary,
} from "./submission-types";
import { toSummary } from "./submission-types";
import { evaluateHealthCheck } from "./technology-equipment";

export interface SubmissionsStore {
  create(input: SubmissionInput): Promise<StoredSubmission>;
  list(): Promise<SubmissionSummary[]>;
  getById(id: string): Promise<StoredSubmission | null>;
}

/* ------------------------------------------------------------------ */
/* File-backed default implementation                                  */
/* ------------------------------------------------------------------ */

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "tech-equipment-submissions.json");

async function readAll(): Promise<StoredSubmission[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
      return [];
    }
    // Corrupt file: don't crash submissions over it, but don't pretend
    // there's nothing there either — surface it in server logs.
    console.error("[health-check] failed to read submissions file:", err);
    return [];
  }
}

async function writeAll(submissions: StoredSubmission[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  // Write to a temp file then rename, so a crash mid-write can't corrupt
  // the store for every submission that comes after it.
  const tmpFile = `${DATA_FILE}.tmp-${randomUUID()}`;
  await writeFile(tmpFile, JSON.stringify(submissions, null, 2), "utf-8");
  const { rename } = await import("node:fs/promises");
  await rename(tmpFile, DATA_FILE);
}

class FileSubmissionsStore implements SubmissionsStore {
  async create(input: SubmissionInput): Promise<StoredSubmission> {
    if (!input.consent) {
      throw new Error("Consent is required before a submission can be stored.");
    }

    // Score is always calculated server-side from the raw answers — never
    // trust a pre-computed score/result sent by the client.
    const result = evaluateHealthCheck(input.answers);

    const submission: StoredSubmission = {
      id: randomUUID(),
      businessName: input.customer.businessName.trim(),
      contactName: input.customer.contactName.trim(),
      email: input.customer.email.trim(),
      phone: input.customer.phone?.trim() || undefined,
      answers: input.answers,
      result,
      completedAt: new Date().toISOString(),
    };

    const all = await readAll();
    all.push(submission);
    await writeAll(all);

    return submission;
  }

  async list(): Promise<SubmissionSummary[]> {
    const all = await readAll();
    return all
      .slice()
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
      .map(toSummary);
  }

  async getById(id: string): Promise<StoredSubmission | null> {
    const all = await readAll();
    return all.find((s) => s.id === id) ?? null;
  }
}

let storeInstance: SubmissionsStore | undefined;

/**
 * Single entry point used by server-functions.ts. Swap the implementation
 * constructed here to change backends.
 */
export function getSubmissionsStore(): SubmissionsStore {
  if (!storeInstance) {
    storeInstance = new FileSubmissionsStore();
  }
  return storeInstance;
}
