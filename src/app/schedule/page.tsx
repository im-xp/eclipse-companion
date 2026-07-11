import type { Metadata } from "next";
import { getSchedule } from "@/lib/schedule";
import { getSession } from "@/lib/auth";
import { ScheduleView } from "@/components/ScheduleView";

export const metadata: Metadata = {
  title: "Schedule — Iceland Eclipse",
};

export default async function SchedulePage() {
  const schedule = getSchedule();
  // Reading the session makes this dynamic — the "save event" controls only
  // appear for signed-in participants, so we resolve login state server-side.
  const session = await getSession();
  return <ScheduleView schedule={schedule} loggedIn={Boolean(session)} />;
}
