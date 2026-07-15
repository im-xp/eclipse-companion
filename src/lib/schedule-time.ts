import type { ScheduleEvent } from "@/lib/schedule";
import { getDict, type Locale } from "@/lib/i18n";

// Sets that start before 06:00 belong to the previous night's lineup
// (Elliot, 2026-07-06): a Friday 00:30 set lists under Thursday.
export const LATE_CUTOFF_MIN = 6 * 60;

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function addMinutes(start: string, minutes: number): string {
  const [h, m] = start.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function shiftDate(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** The day an event lists under: pre-dawn sets roll back to the night before. */
export function festivalDate(e: ScheduleEvent): string {
  return toMinutes(e.start) < LATE_CUTOFF_MIN ? shiftDate(e.date, -1) : e.date;
}

/** Minutes within the festival day (late night continues past 24:00). */
export function slotMinutes(start: string): number {
  const m = toMinutes(start);
  return m < LATE_CUTOFF_MIN ? m + 1440 : m;
}

/** Absolute minutes since epoch-day, for cross-day overlap comparison. */
export function absoluteMinutes(e: ScheduleEvent): number {
  return Date.parse(`${e.date}T00:00:00Z`) / 60000 + toMinutes(e.start);
}

export function formatDayTab(
  date: string,
  locale: Locale = "en"
): { dow: string; dom: string } {
  const d = new Date(`${date}T12:00:00Z`);
  return {
    // Intl carries Icelandic weekday names natively; is-IS shorts end in a
    // period ("mið.") which the mono uppercase styling wears fine.
    dow: d.toLocaleDateString(getDict(locale).dateLocale, {
      weekday: "short",
      timeZone: "UTC",
    }),
    dom: String(d.getUTCDate()),
  };
}

/** Reykjavik is UTC year-round, so festival-local time is UTC time. */
export function nowInReykjavik(): { date: string; minutes: number } {
  const now = new Date();
  return {
    date: now.toISOString().slice(0, 10),
    minutes: now.getUTCHours() * 60 + now.getUTCMinutes(),
  };
}

export function festivalNow(real: { date: string; minutes: number }): {
  date: string;
  minutes: number;
} {
  return real.minutes < LATE_CUTOFF_MIN
    ? { date: shiftDate(real.date, -1), minutes: real.minutes + 1440 }
    : real;
}

/** True when two events overlap in absolute time. */
export function eventsOverlap(a: ScheduleEvent, b: ScheduleEvent): boolean {
  const aStart = absoluteMinutes(a);
  const bStart = absoluteMinutes(b);
  return aStart < bStart + b.durationMin && bStart < aStart + a.durationMin;
}
