"use client";

import { useMemo, useState } from "react";
import { eventLabels, type Schedule, type ScheduleEvent } from "@/lib/schedule";
import { stageStyle } from "@/lib/schedule-meta";
import { addMinutes, festivalDate, slotMinutes } from "@/lib/schedule-time";
import { EventDetailSheet } from "@/components/EventDetailSheet";

// Vertical festival grid: stages are columns (wide, so titles have room),
// time runs top-to-bottom, and a set's HEIGHT is its duration. Overlaps are
// visible by construction — anything at the same vertical position across
// columns is a clash.
const TIME_W = 46; // px, sticky time gutter
const COL_W = 150; // px, per-stage column — wide enough for titles
// px per minute (hour = 180px). Tuned up from 1.3→2.3→3.0 so a short talk leads
// with its full multi-line title AND the performer without a tap: at 3.0 a
// 30-min block is ~88px, which clears the 76px threshold for 5 title lines +
// the performer instead of clipping the title to fit the speaker name. The day
// scrolls a bit more, which a calendar grid expects.
const PPM_Y = 3.0;
const HEADER_H = 40; // px, sticky stage-header row
const MIN_BLOCK_H = 30; // keep very short sets readable

// A day's canvas auto-fits its events, but a sparse day (e.g. the arrival day,
// with a single evening ceremony) would collapse to a ~2h sliver that reads as
// a bug. Floor every day to noon–midnight; this only ever pads, never clips —
// earlier/later events still expand the range past these bounds.
const DAY_FLOOR_START = 12 * 60; // 12:00
const DAY_FLOOR_END = 24 * 60; // 24:00

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
  now,
  isToday,
}: {
  schedule: Schedule;
  day: string;
  stages: string[];
  stageFilter: string | null;
  now: { date: string; minutes: number };
  isToday: boolean;
}) {
  const [detail, setDetail] = useState<ScheduleEvent | null>(null);
  const events = useMemo(
    () =>
      schedule.events.filter(
        (e) =>
          festivalDate(e) === day &&
          (!stageFilter || e.stage === stageFilter)
      ),
    [schedule.events, day, stageFilter]
  );

  // The time range spans the WHOLE day (every stage), independent of the stage
  // filter, so the time axis stays anchored to the start of the day. Deriving
  // it from the filtered events made a single-stage view start at that stage's
  // first set — so the axis jumped to a different time per stage.
  const dayEvents = useMemo(
    () => schedule.events.filter((e) => festivalDate(e) === day),
    [schedule.events, day]
  );

  const rows = useMemo(() => {
    const present = new Set(events.map((e) => e.stage));
    return stages.filter((s) => present.has(s));
  }, [stages, events]);

  const range = useMemo(() => {
    if (dayEvents.length === 0) return null;
    let min = Infinity;
    let max = -Infinity;
    for (const e of dayEvents) {
      const start = slotMinutes(e.start);
      min = Math.min(min, start);
      max = Math.max(max, start + e.durationMin);
    }
    return {
      start: Math.min(Math.floor(min / 60) * 60, DAY_FLOOR_START),
      end: Math.max(Math.ceil(max / 60) * 60, DAY_FLOOR_END),
    };
  }, [dayEvents]);

  if (!range || rows.length === 0) {
    return (
      <div className="container-page pt-4">
        <p className="py-16 text-center text-moon-white/50">
          Nothing scheduled for this day yet.
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
      className="overflow-auto [scrollbar-width:thin] rounded-2xl border border-moon-white/10 bg-deep-space/30 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]"
      // 21rem ≈ fixed header (4rem) + sticky control bar (10rem) + bottom nav
      // (5rem) + breathing room, so the card scrolls internally and its bottom
      // always clears the nav on both phone and desktop.
      style={{ maxHeight: "calc(100dvh - 21rem)" }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `${TIME_W}px repeat(${rows.length}, minmax(${COL_W}px, 1fr))`,
          minWidth: TIME_W + rows.length * COL_W,
        }}
      >
        {/* header row: sticky corner + stage columns. Kept below the page's
            sticky filter bar (z-40) so the stage labels never ride up over the
            stage selectors when the page and grid scroll together. */}
        <div
          className="sticky left-0 top-0 z-30 border-b border-r border-moon-white/10 bg-eclipse-black"
          style={{ height: HEADER_H }}
        />
        {rows.map((stage) => {
          const st = stageStyle(stage);
          return (
            <div
              key={stage}
              className="sticky top-0 z-20 flex items-center gap-1.5 border-l border-moon-white/10 bg-eclipse-black px-2"
              style={{ height: HEADER_H, borderBottom: `2px solid ${st.color}` }}
            >
              <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: st.color }} />
              <span className="truncate font-display text-[11px] font-extrabold uppercase tracking-[-0.01em] text-moon-white/90">
                {st.label}
              </span>
            </div>
          );
        })}

        {/* body row: sticky time gutter + stage columns. `sticky` doubles as the
            containing block for the absolute hour labels, so no explicit
            position:relative (which would clobber the sticky and let the times
            scroll away horizontally). */}
        <div
          className="sticky left-0 z-20 bg-eclipse-black"
          style={{ height: bodyH }}
        >
          {hours.map((h) => (
            <span
              key={h}
              className="absolute right-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.06em] text-moon-white/45"
              style={{ top: Math.max(1, (h - range.start) * PPM_Y - 5) }}
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
              style={{ height: bodyH, backgroundImage: HOUR_LINES, backgroundColor: `${st.color}12` }}
            >
              {colEvents.map((e, i) => {
                const top = (slotMinutes(e.start) - range.start) * PPM_Y;
                const height = Math.max(e.durationMin * PPM_Y - 2, MIN_BLOCK_H);
                const live =
                  isToday &&
                  now.minutes >= slotMinutes(e.start) &&
                  now.minutes < slotMinutes(e.start) + e.durationMin;
                const { primary, secondary } = eventLabels(e);
                // Title leads and must never be clipped to make room for the
                // extras, so we BUDGET its line count from the space left after
                // them rather than guessing by height. The time footer is
                // redundant (position + height already encode it), so only
                // sets of 40 min+ show it — short 25/30-min blocks give all
                // their room to the title + performer. Everything shows on tap.
                const TITLE_LINE = 13.44; // 12px title × 1.12 leading
                const content = height - 12; // minus py-1.5 top+bottom
                const showTime = e.durationMin >= 40;
                const showSecondary =
                  Boolean(secondary) && content - 15 >= 2 * TITLE_LINE;
                const avail =
                  content - (showSecondary ? 15 : 0) - (showTime ? 13 : 0);
                const primaryLines = Math.max(
                  1,
                  Math.min(6, Math.floor(avail / TITLE_LINE))
                );
                return (
                  <div
                    key={`${e.stage}-${e.start}-${e.artist}-${i}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setDetail(e)}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter" || ev.key === " ") {
                        ev.preventDefault();
                        setDetail(e);
                      }
                    }}
                    className={`absolute inset-x-1 flex cursor-pointer flex-col overflow-hidden rounded-[10px] px-2 ${
                      height < 46 ? "py-1" : "py-1.5"
                    } ${
                      e.status === "pending" ? "opacity-70" : ""
                    } ${live ? "ring-2 ring-moon-white ring-offset-1 ring-offset-eclipse-black" : ""}`}
                    style={{ top, height, backgroundColor: st.color }}
                  >
                    <span
                      className="font-display text-[12px] font-extrabold uppercase leading-[1.12] tracking-[-0.01em] text-eclipse-black"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: primaryLines,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {primary}
                    </span>
                    {showSecondary && (
                      <span className="mt-0.5 truncate text-[10px] font-semibold leading-tight text-eclipse-black/70">
                        {secondary}
                      </span>
                    )}
                    {showTime && (
                      <span className="mt-auto pt-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.06em] text-eclipse-black/65">
                        {e.start}–{addMinutes(e.start, e.durationMin)}
                      </span>
                    )}
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
      schedule={schedule}
      onClose={() => setDetail(null)}
      onSelectEvent={setDetail}
    />
    </>
  );
}
