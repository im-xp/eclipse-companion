import { NextRequest, NextResponse } from "next/server";

/**
 * Staging password gate — password only (no username). Enabled ONLY when
 * STAGING_PASSWORD is set, so production (var unset) is never gated.
 *
 * Unauthenticated requests are redirected to /gate, a single-field password
 * form. On success /api/gate sets a cookie holding sha256(password); this
 * proxy lets the request through when the cookie matches. Web Crypto is used
 * here (edge runtime); /api/gate uses node:crypto — same SHA-256 digest.
 *
 * This is the guard that makes AUTH_MODE=list safe: list mode signs any listed
 * email into their real profile with no possession proof, so the deployment
 * must not be openly reachable.
 */
const GATE_COOKIE = "staging_gate";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const password = process.env.STAGING_PASSWORD;
  if (!password) return NextResponse.next();

  const { pathname } = req.nextUrl;
  // The gate page and its unlock endpoint must stay reachable while locked.
  if (pathname === "/gate" || pathname === "/api/gate") {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(GATE_COOKIE)?.value;
  if (cookie && cookie === (await sha256Hex(password))) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/gate";
  url.search = `?next=${encodeURIComponent(pathname + req.nextUrl.search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|txt|xml)).*)",
  ],
};
