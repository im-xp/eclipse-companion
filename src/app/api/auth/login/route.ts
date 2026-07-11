import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";
import {
  isDemoMode,
  isListMode,
  lookupCustomerByEmail,
  requestLoginCode,
} from "@/lib/profile";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request): Promise<NextResponse> {
  let email: unknown;
  try {
    ({ email } = (await request.json()) as { email?: unknown });
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  const normalized = email.trim().toLowerCase();

  if (isDemoMode()) {
    // Demo: any email signs straight in with the sample profile.
    const res = NextResponse.json({ ok: true, demo: true });
    res.cookies.set(
      SESSION_COOKIE,
      createSessionToken(normalized),
      sessionCookieOptions()
    );
    return res;
  }

  if (isListMode()) {
    // List (gated staging): any email present in the participation API signs
    // straight in to their real profile — no possession proof. The session
    // carries the resolved customer_id so favorites/contacts/activity write
    // back to the right record, exactly as in live mode.
    let profile;
    try {
      profile = await lookupCustomerByEmail(normalized);
    } catch {
      return NextResponse.json({ error: "lookup_failed" }, { status: 502 });
    }
    if (!profile) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(
      SESSION_COOKIE,
      createSessionToken(normalized, profile.customer_id),
      sessionCookieOptions()
    );
    return res;
  }

  // Live: possession proof — the API emails a 6-digit EdgeOS login code,
  // which the participant submits to /api/auth/verify.
  try {
    const sent = await requestLoginCode(normalized);
    if (!sent) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, codeSent: true });
  } catch {
    return NextResponse.json({ error: "lookup_failed" }, { status: 502 });
  }
}
