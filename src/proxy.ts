import { NextRequest, NextResponse } from "next/server";

/**
 * Staging password gate. HTTP Basic Auth over the whole site, enabled ONLY
 * when STAGING_PASSWORD is set — so production (var unset) is never gated.
 *
 * This is the guard that makes AUTH_MODE=list safe: list mode lets any listed
 * email sign straight into their real profile with no possession proof, so the
 * deployment must not be openly reachable. Set STAGING_PASSWORD on every
 * Preview deployment; leave it unset on Production.
 *
 * Username is ignored; any value works. Share as "user: imxp / pass: <secret>".
 */
export function proxy(req: NextRequest): NextResponse {
  const password = process.env.STAGING_PASSWORD;
  if (!password) return NextResponse.next();

  const header = req.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const decoded = atob(header.slice("Basic ".length));
    const supplied = decoded.slice(decoded.indexOf(":") + 1);
    if (supplied === password) return NextResponse.next();
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Iceland Eclipse (staging)"' },
  });
}

export const config = {
  // Gate everything except Next internals and static assets, so the browser
  // can load the page chrome once the visitor has authenticated.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|txt|xml)).*)",
  ],
};
