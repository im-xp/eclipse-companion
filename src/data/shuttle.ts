// Local shuttle loop, mirrored by hand from the "Local shuttle" tab of the IE26
// Transport Master Sheet (Google Sheets 1VvMmF8zD9XO_nbF7JxLGhkrABehVgvM4KHzv4nadbsU),
// as read on 2026-08-08. Requested by Andrew and Deja, who wanted the arrival
// guide to point at the real times instead of the festival schedule.
//
// NOT synced — that sheet is an internal ops document (driver names, phone
// numbers, ticket sales) and only these four columns are safe to publish. If
// transport changes the times, this file has to be updated by hand.
//
// All prose lives in lib/i18n so both locales stay in step; this file carries
// only times and structure.

export interface ShuttleRun {
  /** First departure from the festival, 24h. */
  first: string;
  /** Last departure from the festival, 24h. */
  last: string;
  /** Last departure falls after midnight, i.e. the following morning. */
  lastNextDay?: boolean;
}

export interface ShuttleDay {
  /** Day of August 2026. */
  day: number;
  /** Index into dict.shuttle.weekdays, 0 = Sunday. */
  weekday: number;
  /** Usually one continuous service; eclipse day splits into two. */
  runs: ShuttleRun[];
  /** Eclipse day — reduced to a single bus per shift, delays expected. */
  delays?: boolean;
}

/** 9 August 2026 is a Sunday, so weekday 0 lines up with day 9. */
export const SHUTTLE_DAYS: ShuttleDay[] = [
  { day: 9, weekday: 0, runs: [{ first: "11:30", last: "23:00" }] },
  { day: 10, weekday: 1, runs: [{ first: "07:45", last: "23:00" }] },
  { day: 11, weekday: 2, runs: [{ first: "07:45", last: "00:00", lastNextDay: true }] },
  {
    day: 12,
    weekday: 3,
    delays: true,
    runs: [
      { first: "07:45", last: "17:00" },
      { first: "18:30", last: "03:00", lastNextDay: true },
    ],
  },
  { day: 13, weekday: 4, runs: [{ first: "07:45", last: "03:00", lastNextDay: true }] },
  { day: 14, weekday: 5, runs: [{ first: "07:45", last: "05:00", lastNextDay: true }] },
  { day: 15, weekday: 6, runs: [{ first: "07:45", last: "05:00", lastNextDay: true }] },
  { day: 16, weekday: 0, runs: [{ first: "07:45", last: "21:00" }] },
  { day: 17, weekday: 1, runs: [{ first: "07:45", last: "15:00" }] },
];
