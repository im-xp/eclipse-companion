"use client";

import { useMemo, useState } from "react";
import type { Schedule, ScheduleEvent } from "@/lib/schedule";
import { eventKey } from "@/lib/favorites";
import { stageStyle } from "@/lib/schedule-meta";
import { addMinutes, festivalDate, slotMinutes } from "@/lib/schedule-time";
import { EventDetailSheet } from "@/components/EventDetailSheet";

// Vertical festival grid: stages are columns (wide, so titles have room),
// time runs top-to-bottom, and a set's HEIGHT is its duration. Overlaps are
// visible by construction — anything at the same vertical position across
// columns is a clash.
const TIME_W = 46; // px, sticky time gutter
const COL_W = 150; // px, per-stage column — wide enough for titles
const PPM_Y = 1.3; // px per minute (hour = 78px)
const HEADER_H = 40; // px, sticky stage-header row
const MIN_BLOCK_H = 30; // keep very short sets readable

const HOUR_LINES = `repeating-linear-gradient(to bottom, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, transparent ${60 * PPM_Y}px)`;

function hourLabel(slot: number): string {
  const hh = Math.floor((slot % 1440) / 60);
  return `${String(hh).padStart(2, "0")}:00`;
}

export function TimelineGrid({
  schedule,
  day,
  stages,
  stageFilter,
  favOnly,
  favorites,
  toggleFavorite,
  now,
  isToday,
}: {
  schedule: Schedule;
  day: string;
  stages: string[];
  stageFilter: string | null;
  favOnly: boolean;
  favorites: ReadonlySet<string>;
  toggleFavorite: (key: string) => void;
  now: { date: string; minutes: number };
  isToday: boolean;
}) {
  const [detail, setDetail] = useState<ScheduleEvent | null>(null);
  const events = useMemo(
    () =>
      schedule.events.filter(
        (e) =>
          festivalDate(e) === day &&
          (!stageFilter || e.stage === stageFilter) &&
          (!favOnly || favorites.has(eventKey(e)))
      ),
    [schedule.events, day, stageFilter, favOnly, favorites]
  );

  const rows = useMemo(() => {
    const present = new Set(events.map((e) => e.stage));
    return stages.filter((s) => present.has(s));
  }, [stages, events]);

  const range = useMemo(() => {
    if (events.length === 0) return null;
    let min = Infinity;
    let max = -Infinity;
    for (const e of events) {
      const start = slotMinutes(e.start);
      min = Math.min(min, start);
      max = Math.max(max, start + e.durationMin);
    }
    return { start: Math.floor(min / 60) * 60, end: Math.ceil(max / 60) * 60 };
  }, [events]);

  if (!range || rows.length === 0) {
    return (
      <div className="container-page pt-4">
        <p className="py-16 text-center text-moon-white/50">
          {favOnly
            ? "Nothing hearted for this day yet. Tap the heart on any set to build your plan."
            : "Nothing scheduled for this day yet."}
        </p>
      </div>
    );
  }

  const bodyH = (range.end - range.start) * PPM_Y;
  const hours: number[] = [];
  for (let h = range.start; h <= range.end; h += 60) hours.push(h);
  const nowTop =
    isToday && now.minutes >= range.start && now.minutes <= range.end
      ? (now.minutes - range.start) * PPM_Y
      : null;

  return (
    <>
    <div
      className="overflow-auto [scrollbar-width:thin]"
      style={{ height: "calc(100dvh - 16rem)", minHeight: "22rem" }}
    >
      <div
        className="grid"
        style={{ gridTemplateColumns: `${TIME_W}px repeat(${rows.length}, ${COL_W}px)` }}
      >
        {/* header row: sticky corner + stage columns */}
        <div
          className="sticky left-0 top-0 z-40 border-b border-r border-moon-white/10 bg-eclipse-black"
          style={{ height: HEADER_H }}
        />
        {rows.map((stage) => {
          const st = stageStyle(stage);
          return (
            <div
              key={stage}
              className="sticky top-0 z-30 flex items-center gap-1.5 border-b border-l border-moon-white/10 bg-eclipse-black px-2"
              style={{ height: HEADER_H }}
            >
              <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: st.color }} />
              <span className="truncate font-display text-[11px] font-extrabold uppercase tracking-[-0.01em] text-moon-white/90">
                {st.label}
              </span>
            </div>
          );
        })}

        {/* body row: sticky time gutter + stage columns */}
        <div
          className="sticky left-0 z-20 bg-eclipse-black"
          style={{ height: bodyH, position: "relative" }}
        >
          {hours.map((h) => (
            <span
              key={h}
              className="absolute right-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.06em] text-moon-white/45"
              style={{ top: (h - range.start) * PPM_Y - 5 }}
            >
              {hourLabel(h)}
            </span>
          ))}
          {nowTop !== null && (
            <span
              className="absolute right-0.5 size-2 rounded-full bg-eclipse-orange"
              style={{ top: nowTop - 4 }}
            />
          )}
        </div>
        {rows.map((stage) => {
          const st = stageStyle(stage);
          const colEvents = events.filter((e) => e.stage === stage);
          return (
            <div
              key={stage}
              className="relative border-l border-moon-white/8"
              style={{ height: bodyH, backgroundImage: HOUR_LINES }}
            >
              {colEvents.map((e, i) => {
                const top = (slotMinutes(e.start) - range.start) * PPM_Y;
                const height = Math.max(e.durationMin * PPM_Y - 2, MIN_BLOCK_H);
                const favKey = eventKey(e);
                const isFav = favorites.has(favKey);
                const live =
                  isToday &&
                  now.minutes >= slotMinutes(e.start) &&
                  now.minutes < slotMinutes(e.start) + e.durationMin;
                return (
                  <div
                    key={`${favKey}-${i}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setDetail(e)}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter" || ev.key === " ") {
                        ev.preventDefault();
                        setDetail(e);
                      }
                    }}
                    className={`absolute inset-x-1 flex cursor-pointer flex-col overflow-hidden rounded-[10px] px-2 py-1.5 ${
                      e.status === "pending" ? "opacity-70" : ""
                    } ${live ? "ring-2 ring-moon-white ring-offset-1 ring-offset-eclipse-black" : ""}`}
                    style={{ top, height, backgroundColor: st.color }}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-display text-[12px] font-extrabold uppercase leading-[1.1] tracking-[-0.01em] text-eclipse-black line-clamp-2">
                        {e.artist}
                      </span>
                      <button
                        type="button"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          toggleFavorite(favKey);
                        }}
                        aria-pressed={isFav}
                        aria-label={isFav ? `Remove ${e.artist} from my plan` : `Add ${e.artist} to my plan`}
                        className="-m-0.5 shrink-0 p-0.5 text-eclipse-black"
                      >
                        <svg viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>
                    {e.title && height > 52 && (
                      <span className="mt-0.5 text-[10px] leading-tight text-eclipse-black/75 line-clamp-2">
                        {e.title}
                      </span>
                    )}
                    <span className="mt-auto font-mono text-[9px] font-bold uppercase tracking-[0.06em] text-eclipse-black/70">
                      {e.start}–{addMinutes(e.start, e.durationMin)}
                    </span>
                  </div>
                );
              })}
              {nowTop !== null && (
                <span
                  className="pointer-events-none absolute inset-x-0 z-10 h-0.5 bg-eclipse-orange"
                  style={{ top: nowTop }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
    <EventDetailSheet
      event={detail}
      onClose={() => setDetail(null)}
      isFav={detail ? favorites.has(eventKey(detail)) : false}
      onToggleFav={() => detail && toggleFavorite(eventKey(detail))}
    />
    </>
  );
}
