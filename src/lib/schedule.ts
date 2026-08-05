import scheduleData from "@/data/schedule.json";
import sideQuestData from "@/data/side-quests.json";
import { getSocials, type SocialLink } from "@/lib/socials";
import { stageStyle } from "@/lib/schedule-meta";
import { getDict, type Locale } from "@/lib/i18n";

// The order stages appear in the schedule UI, by chip label (Elliot 2026-07-09).
const STAGE_ORDER = [
  "Eclipse",
  "Aurora",
  "Afterglow",
  "Polaris",
  "Cosmic Connection",
  "Sacred Fire",
];

function stageRank(label: string): number {
  const i = STAGE_ORDER.indexOf(label);
  return i === -1 ? STAGE_ORDER.length : i;
}

export interface EventLink {
  label: string;
  href: string;
}

// One person on a session. A panel has several; a talk or solo act has one.
// Bio/headshot/socials live here (not on the event) because a panel's block is
// shared but each speaker has their own profile.
export interface Speaker {
  name: string;
  headshot: string | null;
  bio: string | null;
  tagline: string | null;
  socials: SocialLink[];
  link?: EventLink;
}

export interface ScheduleEvent {
  artist: string;
  title: string | null;
  isHostBlock: boolean;
  status: "confirmed" | "pending";
  category: string | null;
  subcategory: string | null;
  date: string;
  day: string;
  start: string;
  durationMin: number;
  stage: string;
  headshot: string | null;
  bio: string | null;
  tagline: string | null;
  emcee: string | null;
  link?: EventLink;
  // Social links joined from the public lineup page by artist name (see
  // src/lib/socials.ts). Empty when the participant has none listed there.
  socials?: SocialLink[];
  // Everyone on this block. Always populated by getSchedule() (length >= 1);
  // length > 1 means the ROS entered a panel/b2b as one row per speaker and we
  // merged them. Optional on the raw type only because schedule.json predates
  // it.
  speakers?: Speaker[];
}

export interface Schedule {
  days: string[];
  stages: string[];
  categories: string[];
  events: ScheduleEvent[];
}

// Every session a person appears in, plus their profile — the "all engagements
// of this speaker" view behind the clickable tiles and the Lineup tab.
export interface SpeakerProfile {
  name: string;
  headshot: string | null;
  bio: string | null;
  tagline: string | null;
  socials: SocialLink[];
  sets: ScheduleEvent[];
}

export function eventSpeakers(e: ScheduleEvent): Speaker[] {
  return e.speakers ?? [speakerFromEvent(e)];
}

// What an event leads with. Talks/panels are known by their title; the
// speaker(s) are secondary. Acts/ceremonies with no title ARE their own name,
// so we fall back to the speaker as the headline rather than show a blank line.
export function eventLabels(
  e: ScheduleEvent,
  locale: Locale = "en"
): {
  primary: string;
  secondary: string | null;
} {
  const names = eventSpeakers(e).map((s) => s.name);
  if (!e.title) return { primary: names[0] ?? e.artist, secondary: null };
  // Two people read fine inline; a bigger panel just says how many.
  const secondary =
    names.length > 2
      ? getDict(locale).schedule.nSpeakers(names.length)
      : names.join(" · ");
  return { primary: e.title, secondary: secondary || null };
}

function speakerFromEvent(e: ScheduleEvent): Speaker {
  return {
    name: e.artist,
    headshot: e.headshot,
    bio: e.bio,
    tagline: e.tagline,
    socials: e.socials ?? [],
    link: e.link,
  };
}

// The ROS enters a panel as one row per speaker: same title, slot, and stage.
// Fold those rows into a single block whose speakers[] holds each person. Only
// titled sessions merge — untitled music acts never collide on a slot+stage,
// and keying on an empty title would wrongly glue unrelated blocks together.
function mergePanels(events: ScheduleEvent[]): ScheduleEvent[] {
  const groups = new Map<string, ScheduleEvent[]>();
  const order: string[] = [];
  for (const e of events) {
    const key = e.title
      ? `${e.date}|${e.start}|${e.stage}|${e.title.trim().toLowerCase()}`
      : `solo|${e.date}|${e.start}|${e.stage}|${e.artist}`;
    const rows = groups.get(key);
    if (rows) rows.push(e);
    else {
      groups.set(key, [e]);
      order.push(key);
    }
  }
  return order.map((key) => {
    const rows = groups.get(key)!;
    if (rows.length === 1) {
      return { ...rows[0], speakers: [speakerFromEvent(rows[0])] };
    }
    return {
      ...rows[0],
      // Rows should agree on duration; take the longest to be safe.
      durationMin: Math.max(...rows.map((r) => r.durationMin)),
      speakers: rows.map(speakerFromEvent),
    };
  });
}

export function buildSpeakerIndex(
  events: ScheduleEvent[]
): Map<string, SpeakerProfile> {
  const map = new Map<string, SpeakerProfile>();
  for (const e of events) {
    for (const s of eventSpeakers(e)) {
      const p =
        map.get(s.name) ??
        ({
          name: s.name,
          headshot: null,
          bio: null,
          tagline: null,
          socials: [],
          sets: [],
        } as SpeakerProfile);
      if (s.headshot && !p.headshot) p.headshot = s.headshot;
      if (s.bio && !p.bio) p.bio = s.bio;
      if (s.tagline && !p.tagline) p.tagline = s.tagline;
      if (s.socials.length && !p.socials.length) p.socials = s.socials;
      p.sets.push(e);
      map.set(s.name, p);
    }
  }
  return map;
}

// Icelandic fields ride along on the raw records: schedule.json rows carry
// title_is/bio_is/tagline_is written by scripts/translate_schedule.py at sync
// time (missing = fall back to English); side-quests.json entries carry a
// hand-maintained `is` block. Localizing BEFORE mergePanels keeps panel
// merging consistent — all rows of a panel share one English title, so they
// share one Icelandic title too.
type RawEvent = ScheduleEvent & {
  title_is?: string | null;
  bio_is?: string | null;
  tagline_is?: string | null;
  is?: {
    title?: string | null;
    bio?: string | null;
    tagline?: string | null;
    linkLabel?: string | null;
  };
};

function localizeEvent(e: RawEvent, locale: Locale): ScheduleEvent {
  if (locale === "en") return e;
  const inline = e.is;
  const out: RawEvent = {
    ...e,
    title: inline?.title ?? e.title_is ?? e.title,
    bio: inline?.bio ?? e.bio_is ?? e.bio,
    tagline: inline?.tagline ?? e.tagline_is ?? e.tagline,
  };
  if (e.link && inline?.linkLabel) {
    out.link = { ...e.link, label: inline.linkLabel };
  }
  delete out.title_is;
  delete out.bio_is;
  delete out.tagline_is;
  delete out.is;
  return out;
}

export function getSchedule(locale: Locale = "en"): Schedule {
  const data = scheduleData as Schedule;
  // Side quests live in their own file so regenerating schedule.json from
  // the ROS sheet never wipes them.
  const sideQuests = sideQuestData as ScheduleEvent[];
  const withSocials = [
    ...data.events.filter((e) => !e.isHostBlock),
    ...sideQuests,
  ]
    .map((e) => localizeEvent(e as RawEvent, locale))
    // Only confirmed events are published — the Status column is the on/off
    // switch. schedule.json is already confirmed-only (normalize_schedule.py
    // drops the rest), so this gates the side quests and anything unconfirmed
    // that ever slips through.
    .filter((e) => e.status === "confirmed")
    .map((e) => {
      // Side quests may carry their own socials; otherwise join by artist name.
      const socials = e.socials ?? getSocials(e.artist);
      return socials.length ? { ...e, socials } : e;
    });
  // Merge panel rows BEFORE sorting so each session is a single block.
  const events = mergePanels(withSocials).sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.start.localeCompare(b.start) ||
      a.stage.localeCompare(b.stage)
  );
  return {
    ...data,
    // Fixed stage order (Elliot 2026-07-09), keyed by the label shown on the
    // chips. Any stage not in the list (Daybreak, Starseeds, Side Quests)
    // falls to the end in its original order.
    stages: [...data.stages, "SIDE QUESTS"].sort(
      (a, b) => stageRank(stageStyle(a).label) - stageRank(stageStyle(b).label)
    ),
    events,
  };
}
