"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CONFIRMED_PROFILE_BONUS,
  CONTACT_FIELDS,
  isProfileConfirmed,
  type ContactChannels,
} from "@/lib/contacts-shared";
import type { CustomerProfile } from "@/lib/profile";
import { EventsCalendar } from "@/components/EventsCalendar";

export function ProfileView({
  profile,
  contacts,
  sessionEmail,
  demo,
}: {
  profile: CustomerProfile;
  contacts: ContactChannels | null;
  sessionEmail: string;
  demo: boolean;
}) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const edgeos = profile.traits?.edgeos;
  const cio = profile.traits?.customerio;
  const name =
    [edgeos?.first_name ?? cio?.first_name, edgeos?.last_name ?? cio?.last_name]
      .filter(Boolean)
      .join(" ") || profile.email;
  const luma = profile.participation?.luma;
  const sessions = luma?.sessions ?? [];
  const breakdown = profile.scores?.breakdown ?? {};

  const serverContacts = (profile.confirmed_contacts?.contacts ??
    {}) as ContactChannels;
  const serverHasBonus = breakdown.confirmed_profile != null;
  const confirmed =
    isProfileConfirmed(contacts) || isProfileConfirmed(serverContacts);
  // The API bakes the bonus into scores once confirmation reaches the master
  // record; only add it client-side for edits the server doesn't know yet.
  const clientBonus = confirmed && !serverHasBonus ? CONFIRMED_PROFILE_BONUS : 0;
  const baseScore = profile.scores?.total ?? 0;
  const totalScore = baseScore + clientBonus;

  const telegramOnFile = profile.identities?.find(
    (id) => id.provider === "telegram"
  )?.external_id;
  const onFile: ContactChannels = {
    ...(telegramOnFile ? { telegram: telegramOnFile } : {}),
    ...serverContacts,
  };

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.refresh();
    }
  }

  return (
    <div className="container-page max-w-2xl pb-10">
      {demo && (
        <p className="mt-4 rounded-soft border border-solar-corona/30 bg-solar-corona/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-solar-corona">
          Demo mode — sample participant shown for {sessionEmail}
        </p>
      )}

      <section className="pt-8">
        <p className="eyebrow text-aurora-cyan">
          {cio?.event ?? "Iceland Eclipse"} · Participant
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-moon-white">
          {name}
        </h1>
        <p className="mt-2 font-mono text-sm text-moon-white/60">
          {profile.email}
        </p>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Score"
          value={profile.scores?.total != null || confirmed ? String(totalScore) : "—"}
          accent="text-aurora-cyan"
        />
        <Stat
          label="Status"
          value={cio?.application_status ?? "—"}
          accent="text-solar-corona"
        />
        <Stat
          label="Tickets"
          value={edgeos?.products_owned != null ? String(edgeos.products_owned) : "—"}
          accent="text-eclipse-orange"
        />
        <Stat
          label="Events"
          value={
            luma?.events_registered != null
              ? String(luma.events_registered)
              : "—"
          }
          accent="text-northern-violet"
        />
      </section>

      <ContactsCard contacts={contacts} onFile={onFile} confirmed={confirmed} />

      {(Object.keys(breakdown).length > 0 || confirmed) && (
        <section className="mt-4 rounded-[20px] border border-moon-white/10 bg-deep-space/50 p-5">
          <p className="eyebrow text-moon-white/60">Score breakdown</p>
          <div className="mt-3 flex flex-col gap-2">
            {Object.entries(breakdown).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-sm capitalize text-moon-white/75">
                  {k.replace(/_/g, " ")}
                </span>
                <span className="font-mono text-sm font-bold text-moon-white">
                  {v}
                </span>
              </div>
            ))}
            {clientBonus > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-moon-white/75">
                  Confirmed profile
                </span>
                <span className="font-mono text-sm font-bold text-aurora-cyan">
                  +{CONFIRMED_PROFILE_BONUS}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      <PurchasesCard commerce={profile.commerce} />

      {sessions.length > 0 && <EventsCalendar sessions={sessions} />}

      <button
        type="button"
        onClick={signOut}
        disabled={signingOut}
        className="mt-8 w-full rounded-pill border border-moon-white/25 px-7 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-moon-white/70 transition-colors hover:border-moon-white/50 hover:text-moon-white disabled:opacity-50"
      >
        {signingOut ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}

const SOURCE_LABELS: Record<string, string> = {
  fever: "Fever",
  stripe: "EdgeOS",
};

function formatSpend(spend: Record<string, number> | undefined): string | null {
  if (!spend) return null;
  const parts = Object.entries(spend).map(([currency, amount]) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(amount)
  );
  return parts.length ? parts.join(" · ") : null;
}

function formatPurchaseDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PurchasesCard({
  commerce,
}: {
  commerce: CustomerProfile["commerce"];
}) {
  const products = commerce?.products ?? [];
  if (!commerce || products.length === 0) return null;

  const spend = formatSpend(commerce.total_spend_by_currency);
  const range = [
    formatPurchaseDate(commerce.first_purchase_at),
    formatPurchaseDate(commerce.last_purchase_at),
  ].filter(Boolean);

  return (
    <section className="mt-4 rounded-[20px] border border-moon-white/10 bg-deep-space/50 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow text-moon-white/60">
          My purchases ({commerce.item_count ?? products.length})
        </p>
        <div className="flex gap-1.5">
          {(commerce.sources ?? []).map((s) => (
            <span
              key={s}
              className="rounded-pill border border-moon-white/20 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-moon-white/55"
            >
              {SOURCE_LABELS[s] ?? s}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {spend && (
          <span className="font-display text-2xl font-extrabold text-solar-corona">
            {spend}
          </span>
        )}
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-moon-white/45">
          {commerce.order_count ?? 0} orders
          {range.length === 2 ? ` · ${range[0]} – ${range[1]}` : ""}
        </span>
      </div>

      <ul className="mt-3 flex flex-col divide-y divide-moon-white/8">
        {products.map((p) => (
          <li
            key={p}
            className="py-2 text-sm leading-snug text-moon-white/85"
          >
            {p}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ContactsCard({
  contacts,
  onFile,
  confirmed,
}: {
  contacts: ContactChannels | null;
  onFile: ContactChannels;
  confirmed: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ContactChannels>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // What we know: user-saved values win over what's already on file.
  const effective: ContactChannels = { ...onFile, ...(contacts ?? {}) };

  const HANDLE_KEYS = new Set([
    "telegram",
    "instagram",
    "x",
    "tiktok",
    "youtube",
  ]);
  const displayValue = (key: string, value: string) =>
    HANDLE_KEYS.has(key) && /^[A-Za-z][A-Za-z0-9_.]*$/.test(value)
      ? `@${value}`
      : value;

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error(String(res.status));
      setEditing(false);
      router.refresh();
    } catch {
      setError("Couldn't save. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const groups: Array<{ title: string; keys: typeof CONTACT_FIELDS }> = [
    { title: "Messaging", keys: CONTACT_FIELDS.filter((f) => f.group === "comms") },
    { title: "Socials", keys: CONTACT_FIELDS.filter((f) => f.group === "social") },
  ];

  return (
    <section
      className={`mt-4 rounded-[20px] border bg-deep-space/50 p-5 ${
        confirmed ? "border-moon-white/10" : "border-aurora-cyan/40"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow text-moon-white/60">Socials & contact</p>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setDraft(effective);
              setEditing(true);
            }}
            className="rounded-pill border border-moon-white/25 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-moon-white/70 transition-colors hover:border-moon-white/50 hover:text-moon-white"
          >
            {confirmed ? "Edit" : "Connect"}
          </button>
        )}
      </div>

      {!confirmed && !editing && (
        <p className="mt-3 text-sm leading-relaxed text-moon-white/65">
          Confirm your socials and messaging contacts — and earn{" "}
          <span className="font-mono font-bold text-aurora-cyan">
            +{CONFIRMED_PROFILE_BONUS}
          </span>{" "}
          on your participation score.
        </p>
      )}

      {!editing && (
        <div className="mt-3 flex flex-col gap-4">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-moon-white/35">
                {g.title}
              </p>
              <div className="mt-1.5 flex flex-col gap-1.5">
                {g.keys.map((f) => {
                  const value = effective[f.key];
                  return (
                    <div
                      key={f.key}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-moon-white/50">
                        {f.label}
                      </span>
                      {value ? (
                        <span className="truncate text-sm text-moon-white/85">
                          {displayValue(f.key, value)}
                          {!contacts?.[f.key] && onFile[f.key] && (
                            <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.12em] text-moon-white/40">
                              on file
                            </span>
                          )}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setDraft(effective);
                            setEditing(true);
                          }}
                          className="font-mono text-[10px] uppercase tracking-[0.12em] text-aurora-cyan/80 transition-colors hover:text-aurora-cyan"
                        >
                          + Connect
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="mt-4 flex flex-col gap-3">
          {groups.map((g) => (
            <div key={g.title} className="flex flex-col gap-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-moon-white/35">
                {g.title}
              </p>
              {g.keys.map((f) => (
                <label key={f.key} className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-moon-white/50">
                    {f.label}
                  </span>
                  <input
                    type="text"
                    value={draft[f.key] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, [f.key]: e.target.value }))
                    }
                    className="w-full rounded-soft border border-moon-white/20 bg-eclipse-black/60 px-4 py-2.5 text-sm text-moon-white placeholder:text-moon-white/30 focus:border-aurora-cyan focus:outline-none"
                  />
                </label>
              ))}
            </div>
          ))}
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="flex-1 rounded-pill border border-signal-yellow bg-signal-yellow px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-eclipse-black transition-all duration-200 hover:-translate-y-0.5 hover:border-solar-corona hover:bg-solar-corona disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
              disabled={busy}
              className="rounded-pill border border-moon-white/25 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-moon-white/70 transition-colors hover:border-moon-white/50 hover:text-moon-white disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-sm text-eclipse-orange">{error}</p>}
        </div>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-[16px] border border-moon-white/10 bg-deep-space/50 p-4">
      <p className="eyebrow text-moon-white/50">{label}</p>
      <p
        className={`mt-1.5 truncate font-display text-xl font-extrabold uppercase ${accent}`}
      >
        {value}
      </p>
    </div>
  );
}
