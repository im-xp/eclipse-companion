import scheduleData from "@/data/schedule.json";
import sideQuestData from "@/data/side-quests.json";
import { getSocials, type SocialLink } from "@/lib/socials";

export interface EventLink {
  label: string;
  href: string;
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
}

export interface Schedule {
  days: string[];
  stages: string[];
  categories: string[];
  events: ScheduleEvent[];
}

export function getSchedule(): Schedule {
  const data = scheduleData as Schedule;
  // Side quests live in their own file so regenerating schedule.json from
  // the ROS sheet never wipes them.
  const sideQuests = sideQuestData as ScheduleEvent[];
  const events = [...data.events.filter((e) => !e.isHostBlock), ...sideQuests]
    .map((e) => {
      // Side quests may carry their own socials; otherwise join by artist name.
      const socials = e.socials ?? getSocials(e.artist);
      return socials.length ? { ...e, socials } : e;
    })
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        a.start.localeCompare(b.start) ||
        a.stage.localeCompare(b.stage)
    );
  return {
    ...data,
    stages: [...data.stages, "SIDE QUESTS"],
    events,
  };
}
