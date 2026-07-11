import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";
import { isLiveMode, verifyLoginCode } from "@/lib/profile";

export async function POST(request: Request): Promise<NextResponse> {
  // Only live mode issues codes; demo/list sign in without a possession proof.
  if (!isLiveMode()) {
    return NextResponse.json({ error: "code_not_required" }, { status: 400 });
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
