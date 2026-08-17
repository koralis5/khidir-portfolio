import "server-only";
import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

function sign(value: string): string {
  return crypto.createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(value).digest("hex");
}

export function createSessionToken(): string {
  const expires = String(Date.now() + SESSION_LIFETIME_MS);
  return `${expires}.${sign(expires)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig) return false;

  const expected = sign(expires);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  return Number(expires) > Date.now();
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD!;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
