import "server-only";

// Session *verification* is NOT here — it's inlined directly in
// middleware.ts. Vercel's Edge Function bundler fails the build if
// middleware.ts imports any local project module (see middleware.ts for
// detail), so this file is only used by the login/logout API routes
// (regular Node.js runtime, not Edge), where that constraint doesn't apply
// and the server-only guard is safe to keep.
//
// Uses the Web Crypto API (crypto.subtle) rather than Node's `crypto`
// module — not required here, but kept consistent with middleware.ts.

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
