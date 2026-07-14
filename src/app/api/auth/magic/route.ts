import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  verifyLoginToken,
} from "@/lib/auth";

/**
 * Land here from the emailed magic link. Verify the single-purpose login token,
 * and on success trade it for a real session cookie and redirect to /profile.
 * An invalid or expired token bounces back to /profile with a notice so the
 * participant can request a fresh link.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const token = new URL(request.url).searchParams.get("token");
  const destination = new URL("/profile", request.url);

  const payload = token ? verifyLoginToken(token) : null;
  if (!payload) {
    destination.searchParams.set("login", "expired");
    return NextResponse.redirect(destination);
  }

  const res = NextResponse.redirect(destination);
  res.cookies.set(
    SESSION_COOKIE,
    createSessionToken(payload.email, payload.customerId),
    sessionCookieOptions()
  );
  return res;
}
