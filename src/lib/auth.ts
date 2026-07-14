import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ie_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;
// A magic login link is a one-shot possession proof, not a session: keep it
// short so a leaked or forwarded link stops working quickly.
const LOGIN_TOKEN_TTL_SECONDS = 15 * 60;

interface SessionPayload {
  email: string;
  customerId?: string;
  // Session and login tokens are HMAC'd with the same secret and share a wire
  // format, so each is tagged with a distinct purpose that verify requires —
  // a 15-min login link can't be replayed as a 14-day session, or vice versa.
  purpose: "session";
  exp: number;
}

interface LoginTokenPayload {
  email: string;
  customerId?: string;
  purpose: "magic";
  exp: number;
}

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set in production");
    }
    return "dev-only-secret";
  }
  return s;
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createSessionToken(email: string, customerId?: string): string {
  const payload: SessionPayload = {
    email: email.toLowerCase().trim(),
    ...(customerId ? { customerId } : {}),
    purpose: "session",
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString()
    ) as SessionPayload;
    if (
      payload.purpose !== "session" ||
      !payload.email ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Mint a magic-link login token: proof that whoever holds it controls `email`
 * (they received it in their inbox). Short-lived and single-purpose; the magic
 * route trades it for a real session cookie.
 */
export function createLoginToken(email: string, customerId?: string): string {
  const payload: LoginTokenPayload = {
    email: email.toLowerCase().trim(),
    ...(customerId ? { customerId } : {}),
    purpose: "magic",
    exp: Math.floor(Date.now() / 1000) + LOGIN_TOKEN_TTL_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifyLoginToken(token: string): LoginTokenPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString()
    ) as LoginTokenPayload;
    if (
      payload.purpose !== "magic" ||
      !payload.email ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
