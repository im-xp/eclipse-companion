import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { ContactChannels } from "@/lib/contacts-shared";

export const CONTACTS_COOKIE = "ie_contacts";

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

/**
 * Contacts are stored per-participant in a signed cookie keyed to the
 * session email. In live mode they should ALSO be written back to the
 * participation API so the scoring job can count the confirmed-profile
 * weight — see the TODO in app/api/profile/contacts/route.ts.
 */
export function encodeContacts(
  email: string,
  contacts: ContactChannels
): string {
  const body = Buffer.from(
    JSON.stringify({ email: email.toLowerCase(), contacts })
  ).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function decodeContacts(
  token: string,
  email: string
): ContactChannels | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      email: string;
      contacts: ContactChannels;
    };
    if (parsed.email !== email.toLowerCase()) return null;
    return parsed.contacts;
  } catch {
    return null;
  }
}

export async function getContacts(
  email: string
): Promise<ContactChannels | null> {
  const store = await cookies();
  const token = store.get(CONTACTS_COOKIE)?.value;
  if (!token) return null;
  return decodeContacts(token, email);
}
