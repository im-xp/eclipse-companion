"use client";

import { useMemo, useState } from "react";
import type { LumaSession } from "@/lib/profile";

type View = "upcoming" | "calendar";

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

function formatUpcomingDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

function monthLabel(cursor: Date): string {
  return cursor.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function EventsCalendar({ sessions }: { sessions: LumaSession[] }) {
  const [view, setView] = useState<View>("calendar");

  const dated = useMemo(
    () =>
      sessions
        .filter((s): s is LumaSession & { event_start_at: string } =>
          Boolean(s.event_start_at)
        )
        .sort((a, b) => a.event_start_at.localeCompare(b.event_start_at)),
    [sessions]
  );

  const nowIso = useMemo(() => new Date().toISOString(), []);
  const upcoming = dated.filter((s) => s.event_start_at >= nowIso);

  const byDay = useMemo(() => {
    const map = new Map<string, typeof dated>();
    for (const s of dated) {
      const key = dayKey(s.event_start_at);
      map.set(key, [...(map.get(key) ?? []), s]);
    }
    return map;
  }, [dated]);

  const initialAnchor = (upcoming[0] ?? dated[dated.length - 1])?.event_start_at;
  const [cursor, setCursor] = useState<Date>(() => {
    const d = initialAnchor ? new Date(initialAnchor) : new Date();
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(
    initialAnchor ? dayKey(initialAnchor) : null
  );

  if (dated.length === 0 && sessions.length === 0) return null;

  const minMonth = dated.length ? monthKey(new Date(dated[0].event_start_at)) : "";
  const maxMonth = dated.length
    ? monthKey(new Date(dated[dated.length - 1].event_start_at))
    : "";

  const shiftMonth = (delta: number) => {
    setCursor(
      (c) => new Date(Date.UTC(c.getUTCFullYear(), c.getUTCMonth() + delta, 1))
    );
    setSelectedDay(null);
  };

  const year = cursor.getUTCFullYear();
  const month = cursor.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const mondayOffset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const cells: Array<string | null> = [
    ...Array<null>(mondayOffset).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) =>
        `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`
    ),
  ];

  const selectedEvents = selectedDay ? (byDay.get(selectedDay) ?? []) : [];

  return (
    <section className="mt-4 rounded-[20px] border border-moon-white/10 bg-deep-space/50 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow text-moon-white/60">
          My registered events ({sessions.length})
        </p>
        <div className="flex gap-1.5">
          {(
            [
              ["upcoming", "Upcoming"],
              ["calendar", "Calendar"],
            ] as Array<[View, string]>
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-pill border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                view === v
                  ? "border-moon-white bg-moon-white text-eclipse-black"
                  : "border-moon-white/25 text-moon-white/60 hover:border-moon-white/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "upcoming" && (
        <>
          {upcoming.length === 0 ? (
            <p className="mt-3 text-sm text-moon-white/55">
              No upcoming events — open the calendar to see past
              registrations.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col divide-y divide-moon-white/8">
              {upcoming.map((s) => (
                <li key={s.event_id} className="flex gap-3 py-2.5">
                  <div className="w-16 shrink-0 pt-0.5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-solar-corona">
                      {formatUpcomingDay(s.event_start_at)}
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.12em] text-moon-white/50">
                      {formatTime(s.event_start_at)}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug text-moon-white/90">
                      {s.name}
                    </p>
                    {s.approval_status && s.approval_status !== "approved" && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-solar-corona">
                        {s.approval_status}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {view === "calendar" && (
        <div className="mx-auto mt-4 w-full max-w-sm">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              disabled={!minMonth || monthKey(cursor) <= minMonth}
              aria-label="Previous month"
              className="flex size-8 items-center justify-center rounded-pill border border-moon-white/20 text-moon-white/70 transition-colors hover:border-moon-white/50 disabled:opacity-30"
            >
              ‹
            </button>
            <p className="font-display text-sm font-extrabold uppercase tracking-[0.02em] text-moon-white">
              {monthLabel(cursor)}
            </p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              disabled={!maxMonth || monthKey(cursor) >= maxMonth}
              aria-label="Next month"
              className="flex size-8 items-center justify-center rounded-pill border border-moon-white/20 text-moon-white/70 transition-colors hover:border-moon-white/50 disabled:opacity-30"
            >
              ›
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span
                key={`${d}${i}`}
                className="py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-moon-white/40"
              >
                {d}
              </span>
            ))}
            {cells.map((key, i) => {
              if (!key) return <span key={`empty-${i}`} />;
              const has = byDay.has(key);
              const selected = selectedDay === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => has && setSelectedDay(selected ? null : key)}
                  disabled={!has}
                  className={`flex aspect-square flex-col items-center justify-center rounded-soft font-mono text-xs transition-colors ${
                    selected
                      ? "bg-signal-yellow font-bold text-eclipse-black"
                      : has
                        ? "border border-moon-white/20 text-moon-white hover:border-moon-white/50"
                        : "text-moon-white/30"
                  }`}
                >
                  {Number(key.slice(8))}
                  {has && !selected && (
                    <span className="mt-0.5 size-1 rounded-full bg-aurora-cyan" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedDay && selectedEvents.length > 0 && (
            <ul className="mt-4 flex flex-col divide-y divide-moon-white/8 border-t border-moon-white/10">
              {selectedEvents.map((s) => (
                <li key={s.event_id} className="flex gap-3 py-2.5">
                  <span className="w-12 shrink-0 pt-0.5 font-mono text-[11px] font-bold text-solar-corona">
                    {formatTime(s.event_start_at)}
                  </span>
                  <p className="text-sm font-semibold leading-snug text-moon-white/90">
                    {s.name}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {!selectedDay && (
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-moon-white/40">
              Tap a marked day to see its events
            </p>
          )}
        </div>
      )}
    </section>
  );
}
