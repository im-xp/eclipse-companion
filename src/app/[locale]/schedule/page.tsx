import type { Metadata } from "next";
import { getSchedule } from "@/lib/schedule";
import { ScheduleView } from "@/components/ScheduleView";
import { asLocale, getDict } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: getDict(asLocale((await params).locale)).schedule.metaTitle };
}

export default async function SchedulePage({ params }: PageProps) {
  const schedule = getSchedule(asLocale((await params).locale));
  return <ScheduleView schedule={schedule} />;
}
