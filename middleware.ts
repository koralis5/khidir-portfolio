import { NextRequest, NextResponse } from "next/server";

// TEMPORARY DIAGNOSTIC: matcher set to match nothing, to test whether the
// mere presence of a middleware Edge Function bundle (regardless of matcher)
// is what's breaking routing for ALL paths on Vercel, not just /admin.
// Real logic is preserved below, commented out — restore once diagnosed.

export async function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/__never_matches__"],
};
