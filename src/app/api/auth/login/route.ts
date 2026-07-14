import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createLoginToken,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";
import { sendMagicLink } from "@/lib/email";
import {
  isDemoMode,
  isListMode,
  isMagicMode,
  lookupCustomerByEmail,
  requestLoginCode,
} from "@/lib/profile";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Base URL used to build the magic link that gets emailed. Prefer the
 * configured production origin so links point at app.icelandeclipse.com even
 * when the handler runs on a *.vercel.app deployment URL; fall back to the
 * request origin in dev/preview.
 */
function appBaseUrl(request: Request): string {
  const configured = process.env.APP_BASE_URL;
  if (configured) return configured.replace(/\/+$/, "");
  return new URL(request.url).origin;
}

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

  if (isMagicMode()) {
    // Magic link: possession proof via a single-use link we email. We look the
    // email up server-side, but ALWAYS return the same response whether or not
    // it maps to a participant — otherwise the endpoint becomes an email
    // enumeration oracle. A link is only minted + sent for a real match.
    let profile;
    try {
      profile = await lookupCustomerByEmail(normalized);
    } catch {
      return NextResponse.json({ error: "lookup_failed" }, { status: 502 });
    }
    if (profile) {
      const token = createLoginToken(normalized, profile.customer_id);
      const link = `${appBaseUrl(request)}/api/auth/magic?token=${encodeURIComponent(token)}`;
      try {
        await sendMagicLink(normalized, link);
      } catch {
        return NextResponse.json({ error: "send_failed" }, { status: 502 });
      }
    }
    return NextResponse.json({ ok: true, linkSent: true });
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
