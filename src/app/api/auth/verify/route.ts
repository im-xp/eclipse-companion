import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";
import { isDemoMode, verifyLoginCode } from "@/lib/profile";

export async function POST(request: Request): Promise<NextResponse> {
  if (isDemoMode()) {
    return NextResponse.json({ error: "not_available_in_demo" }, { status: 400 });
  }

  let email: unknown;
  let code: unknown;
  try {
    ({ email, code } = (await request.json()) as {
      email?: unknown;
      code?: unknown;
    });
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (typeof email !== "string" || typeof code !== "string" || !code.trim()) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const normalized = email.trim().toLowerCase();

  try {
    const verified = await verifyLoginCode(normalized, code.trim());
    if (!verified) {
      return NextResponse.json({ error: "invalid_code" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(
      SESSION_COOKIE,
      createSessionToken(normalized, verified.customerId ?? undefined),
      sessionCookieOptions()
    );
    return res;
  } catch {
    return NextResponse.json({ error: "verify_failed" }, { status: 502 });
  }
}
