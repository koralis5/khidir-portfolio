// No "server-only" import here deliberately: this module is loaded by
// middleware.ts, which Vercel bundles as an Edge Function, and the
// server-only package's browser-guard trick breaks Edge Function bundling.
// Safe to omit — this file is never imported from a client component.
//
// Uses the Web Crypto API (crypto.subtle) rather than Node's `crypto` module
// so this works in the Edge Runtime too.

export const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

async function hmac(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  const expires = String(Date.now() + SESSION_LIFETIME_MS);
  return `${expires}.${await hmac(expires)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig) return false;

  const expected = await hmac(expires);
  if (!constantTimeEqual(sig, expected)) return false;

  return Number(expires) > Date.now();
}

export async function checkPassword(candidate: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD!;
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(candidate)),
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(expected)),
  ]);
  const aHex = Array.from(new Uint8Array(a)).map((x) => x.toString(16).padStart(2, "0")).join("");
  const bHex = Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
  return constantTimeEqual(aHex, bHex);
}
