/**
 * ADMIN AUTH — SERVER ONLY
 *
 * Deliberately minimal, per Phase 8 ("this is a TEST implementation, keep
 * the admin interface simple") — but not a toy. A single admin password
 * is checked against an env var, and successful login issues a signed,
 * HTTP-only, short-lived session cookie. The cookie is a stateless signed
 * token (password isn't in it, just an expiry + signature), so there's no
 * session table to manage.
 *
 * This is intentionally NOT a full user-accounts system — there is one
 * shared admin credential, matching "Only authorized Simple Secure
 * Solutions administrators can view submissions" without over-building
 * for a TEST environment. If real multi-admin accounts are needed later,
 * this file is the seam to replace.
 *
 * Required env vars (see .env.example):
 *   ADMIN_PASSWORD        — the shared admin password
 *   ADMIN_SESSION_SECRET  — random string used to sign session cookies
 */

import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "sss_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not configured. Set it in your environment before using admin login.",
    );
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error(
      "ADMIN_PASSWORD is not configured. Set it in your environment before using admin login.",
    );
  }
  // Lengths differ in the common case (wrong password); only do the
  // constant-time compare when lengths already match to avoid a crash,
  // falling back to false otherwise.
  if (password.length !== expected.length) return false;
  return safeEqual(password, expected);
}

/** Builds the cookie value for a fresh admin session. */
export function createSessionToken(): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${expiresAt}`;
  const signature = sign(payload);
  return { token: `${payload}.${signature}`, expiresAt };
}

/** Validates a session cookie value. Returns true only if unexpired and unforged. */
export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  if (!safeEqual(signature, expected)) return false;
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt)) return false;
  return Date.now() < expiresAt;
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
export const ADMIN_SESSION_TTL_SECONDS = Math.floor(SESSION_TTL_MS / 1000);
