import demoProfile from "@/data/demo-profile.json";

export interface LumaSession {
  event_id: string;
  name: string;
  event_start_at: string | null;
  approval_status: string | null;
  registered_at: string | null;
  attended_at: string | null;
}

export interface CustomerProfile {
  customer_id: string;
  email: string;
  identities?: Array<{
    provider: string;
    external_id: string;
    verified: boolean;
  }>;
  traits?: {
    edgeos?: {
      first_name?: string;
      last_name?: string;
      category?: string;
      check_in_code?: string;
      products_owned?: number;
      payment_products?: number;
      email_validated?: boolean;
    };
    customerio?: {
      first_name?: string;
      last_name?: string;
      application_status?: string;
      event?: string;
    };
  };
  segments?: Record<string, string[]>;
  scores?: {
    total?: number;
    breakdown?: Record<string, number>;
  };
  events_summary?: {
    total_events?: number;
    last_event_at?: string;
  };
  commerce?: {
    total_spend_by_currency?: Record<string, number>;
    order_count?: number;
    item_count?: number;
    first_purchase_at?: string | null;
    last_purchase_at?: string | null;
    products?: string[];
    sources?: string[];
  } | null;
  participation?: {
    luma?: {
      events_registered?: number;
      events_attended?: number;
      attendance_rate?: number;
      sessions?: LumaSession[];
    };
  };
  confirmed_contacts?: {
    contacts?: Record<string, string>;
    confirmed_at?: string;
  } | null;
}

export function isDemoMode(): boolean {
  return (process.env.AUTH_MODE ?? "demo") !== "live";
}

/**
 * Demo mode: any email resolves to the bundled sample profile.
 * Live mode: server-to-server lookup against the IMXP participation API
 * (keyed, 60 req/min) — flip AUTH_MODE=live and set PAT_API_TOKEN to enable.
 */
export async function getProfileForEmail(
  email: string
): Promise<CustomerProfile | null> {
  if (isDemoMode()) {
    return demoProfile as CustomerProfile;
  }
  return lookupCustomerByEmail(email);
}

function patApi(): { base: string; headers: { Authorization: string; "Content-Type": string } } {
  const base = process.env.PAT_API_BASE;
  const token = process.env.PAT_API_TOKEN;
  if (!base || !token) {
    throw new Error("PAT_API_BASE and PAT_API_TOKEN must be set for live mode");
  }
  return {
    base,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}

/** Ask the API to email the participant a 6-digit EdgeOS login code. */
export async function requestLoginCode(email: string): Promise<boolean> {
  const { base, headers } = patApi();
  const res = await fetch(`${base}/v1/auth/login`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 404) return false;
  if (!res.ok) throw new Error(`auth login failed: ${res.status}`);
  const body = (await res.json()) as { sent?: boolean };
  return body.sent === true;
}

/** Verify the emailed code; returns the matched customer on success. */
export async function verifyLoginCode(
  email: string,
  code: string
): Promise<{ customerId: string | null } | null> {
  const { base, headers } = patApi();
  const res = await fetch(`${base}/v1/auth/verify`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, code }),
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`auth verify failed: ${res.status}`);
  const body = (await res.json()) as { customer_id?: string | null };
  return { customerId: body.customer_id ?? null };
}

/** Write participant-confirmed contacts back to the master IMXP record. */
export async function saveContactsUpstream(
  customerId: string,
  contacts: Record<string, string>
): Promise<void> {
  const { base, headers } = patApi();
  const res = await fetch(
    `${base}/v1/customers/${encodeURIComponent(customerId)}/contacts`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ contacts }),
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`contacts write failed: ${res.status}`);
}

/** The participant's synced favorites (hearted schedule events). */
export async function getFavoritesUpstream(customerId: string): Promise<string[]> {
  const { base, headers } = patApi();
  const res = await fetch(
    `${base}/v1/customers/${encodeURIComponent(customerId)}/favorites`,
    { headers, cache: "no-store" }
  );
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`favorites read failed: ${res.status}`);
  const body = (await res.json()) as { ids?: unknown };
  return Array.isArray(body.ids)
    ? body.ids.filter((id): id is string => typeof id === "string")
    : [];
}

/** Full-replace the participant's favorites on the master IMXP record. */
export async function saveFavoritesUpstream(
  customerId: string,
  ids: string[]
): Promise<void> {
  const { base, headers } = patApi();
  const res = await fetch(
    `${base}/v1/customers/${encodeURIComponent(customerId)}/favorites`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({ ids }),
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`favorites write failed: ${res.status}`);
}

export async function lookupCustomerByEmail(
  email: string
): Promise<CustomerProfile | null> {
  const { base, headers } = patApi();

  const searchRes = await fetch(
    `${base}/v1/customers?q=${encodeURIComponent(email)}`,
    { headers, cache: "no-store" }
  );
  if (searchRes.status === 404) return null;
  if (!searchRes.ok) {
    throw new Error(`Customer lookup failed: ${searchRes.status}`);
  }
  const search = (await searchRes.json()) as {
    customers?: Array<{ customer_id: string; email?: string }>;
  };
  const match = search.customers?.find(
    (c) => c.email?.toLowerCase() === email.toLowerCase()
  );
  if (!match) return null;

  const fullRes = await fetch(`${base}/v1/customers/${match.customer_id}`, {
    headers,
    cache: "no-store",
  });
  if (!fullRes.ok) {
    throw new Error(`Customer fetch failed: ${fullRes.status}`);
  }
  return (await fullRes.json()) as CustomerProfile;
}
