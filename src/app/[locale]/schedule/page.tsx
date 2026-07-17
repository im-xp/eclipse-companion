import type { Metadata } from "next";
import { getSchedule } from "@/lib/schedule";
import { getSession } from "@/lib/auth";
import { ScheduleView } from "@/components/ScheduleView";
import { asLocale, getDict } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Reads the session cookie (getSession) to decide whether the "save event"
// controls render, so this page must be rendered per-request. Without this the
// [locale] layout's generateStaticParams pulls it into static generation and
// loggedIn=false gets baked into the prerendered HTML.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: getDict(asLocale((await params).locale)).schedule.metaTitle };
}

export default async function SchedulePage({ params }: PageProps) {
  const schedule = getSchedule(asLocale((await params).locale));
  // The "save event" controls only appear for signed-in participants, so we
  // resolve login state server-side.
  const session = await getSession();
  return <ScheduleView schedule={schedule} loggedIn={Boolean(session)} />;
}
