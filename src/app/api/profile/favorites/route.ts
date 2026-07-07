import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getFavoritesUpstream,
  isDemoMode,
  lookupCustomerByEmail,
  saveFavoritesUpstream,
} from "@/lib/profile";

const MAX_IDS = 500;
const MAX_ID_LEN = 200;

// Demo sessions accept any email unverified, so demo mode never writes
// upstream — except when previewing the sync UX against a local pat API.
function syncEnabled(): boolean {
  return !isDemoMode() || process.env.DEMO_FAVORITES_SYNC === "1";
}

async function resolveCustomerId(session: {
  email: string;
  customerId?: string;
}): Promise<string | null> {
  if (session.customerId) return session.customerId;
  return (await lookupCustomerByEmail(session.email))?.customer_id ?? null;
}

export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!syncEnabled()) {
    return NextResponse.json({ synced: false, ids: null });
  }
  try {
    const customerId = await resolveCustomerId(session);
    if (!customerId) {
      return NextResponse.json({ synced: false, ids: null });
    }
    const ids = await getFavoritesUpstream(customerId);
    return NextResponse.json({ synced: true, ids });
  } catch {
    return NextResponse.json({ error: "upstream_failed" }, { status: 502 });
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { ids?: unknown };
  try {
    body = (await request.json()) as { ids?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (!Array.isArray(body.ids) || body.ids.length > MAX_IDS) {
    return NextResponse.json({ error: "invalid_ids" }, { status: 400 });
  }
  const ids = body.ids
    .filter((id): id is string => typeof id === "string")
    .map((id) => id.trim().slice(0, MAX_ID_LEN))
    .filter(Boolean);

  if (!syncEnabled()) {
    return NextResponse.json({ synced: false, ids });
  }
  try {
    const customerId = await resolveCustomerId(session);
    if (!customerId) {
      return NextResponse.json({ synced: false, ids });
    }
    await saveFavoritesUpstream(customerId, ids);
    return NextResponse.json({ synced: true, ids });
  } catch {
    return NextResponse.json({ error: "upstream_failed" }, { status: 502 });
  }
}

// sendBeacon (the page-close flush) can only send POST.
export const POST = PUT;
