import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { CONTACTS_COOKIE, encodeContacts } from "@/lib/contacts";
import { CONTACT_KEYS, type ContactChannels } from "@/lib/contacts-shared";
import {
  isDemoMode,
  lookupCustomerByEmail,
  saveContactsUpstream,
} from "@/lib/profile";

const MAX_LEN = 120;

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const contacts: ContactChannels = {};
  for (const key of CONTACT_KEYS) {
    const value = body[key];
    if (typeof value === "string" && value.trim()) {
      contacts[key] = value.trim().slice(0, MAX_LEN);
    }
  }

  if (!isDemoMode()) {
    // Live: write back to the master IMXP record so the participation API
    // serves the confirmed contacts and scoring counts the confirmed-profile
    // weight.
    try {
      const customerId =
        session.customerId ??
        (await lookupCustomerByEmail(session.email))?.customer_id;
      if (!customerId) {
        return NextResponse.json({ error: "not_found" }, { status: 404 });
      }
      await saveContactsUpstream(customerId, contacts);
    } catch {
      return NextResponse.json({ error: "upstream_failed" }, { status: 502 });
    }
  }

  // Cookie keeps the edit instantly visible on this device either way.
  const res = NextResponse.json({ ok: true, contacts });
  res.cookies.set(CONTACTS_COOKIE, encodeContacts(session.email, contacts), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
