import { createHmac, timingSafeEqual } from "node:crypto";

// Simple shared-password admin auth (right-sized for a wedding RSVP list).
// The login cookie stores a token derived from ADMIN_PASSWORD, so the raw
// password is never stored in the cookie and the token can't be forged
// without knowing ADMIN_PASSWORD.

export function checkPassword(pw: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (expected.length === 0 || pw.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(pw), Buffer.from(expected));
}

export function adminToken(): string {
  const key = process.env.ADMIN_PASSWORD || "unset";
  return createHmac("sha256", key).update("rsvp-admin-v1").digest("hex");
}

export function isAuthed(cookieValue: string | undefined): boolean {
  if (!process.env.ADMIN_PASSWORD || !cookieValue) return false;
  const expected = adminToken();
  if (cookieValue.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(cookieValue), Buffer.from(expected));
}

export const ADMIN_COOKIE = "rsvp_admin";
