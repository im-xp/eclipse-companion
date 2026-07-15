import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

// Keep in sync with proxy.ts.
const GATE_COOKIE = "staging_gate";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

// Only allow same-site relative redirects, never "//host" or absolute URLs.
function safeNext(next: string): string {
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export async function POST(request: Request): Promise<NextResponse> {
  const expected = process.env.STAGING_PASSWORD ?? "";
  const origin = new URL(request.url).origin;

  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const next = safeNext(String(form.get("next") ?? "/"));

  if (!expected || password !== expected) {
    return NextResponse.redirect(
      `${origin}/gate?error=1&next=${encodeURIComponent(next)}`,
      { status: 303 }
    );
  }

  const res = NextResponse.redirect(`${origin}${next}`, { status: 303 });
  res.cookies.set(GATE_COOKIE, createHash("sha256").update(expected).digest("hex"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}
