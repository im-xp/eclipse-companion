import type { Metadata } from "next";
import { getSchedule } from "@/lib/schedule";
import { ScheduleView } from "@/components/ScheduleView";

export const metadata: Metadata = {
  title: "Schedule — Iceland Eclipse",
};

export default function SchedulePage() {
  const schedule = getSchedule();
  return <ScheduleView schedule={schedule} />;
}
