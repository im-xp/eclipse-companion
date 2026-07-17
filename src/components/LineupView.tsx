"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { buildSpeakerIndex, type Schedule, type ScheduleEvent } from "@/lib/schedule";
import type { SocialLink } from "@/lib/socials";
import { categoryColor, stageStyle } from "@/lib/schedule-meta";
import { SocialRow } from "@/components/SocialRow";
import { useDict, useLocale } from "@/lib/i18n/LocaleProvider";
import { getDict, type Locale } from "@/lib/i18n";

interface LineupEntry {
  artist: string;
  headshot: string | null;
  categories: string[];
  bio: string | null;
  tagline: string | null;
  socials: SocialLink[];
  sets: ScheduleEvent[];
}

function formatSet(e: ScheduleEvent, locale: Locale): string {
  const d = new Date(`${e.date}T12:00:00Z`);
  const dow = d.toLocaleDateString(getDict(locale).dateLocale, {
    weekday: "short",
    timeZone: "UTC",
  });
  return `${dow} ${e.start}`;
}

export function LineupList({ schedule }: { schedule: Schedule }) {
  const locale = useLocale();
  const dict = useDict();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const entries = useMemo(() => {
    // Build from the shared speaker index so each panelist gets their own entry
    // (panels are one merged event but list every speaker in speakers[]).
    return [...buildSpeakerIndex(schedule.events).values()]
      .map((p) => ({
        artist: p.name,
        headshot: p.headshot,
        bio: p.bio,
        tagline: p.tagline,
        socials: p.socials,
        sets: p.sets,
        categories: [...new Set(p.sets.map((s) => s.category).filter((c): c is string => Boolean(c)))],
      } as LineupEntry))
      .sort((a, b) => a.artist.localeCompare(b.artist, "en"));
  }, [schedule.events]);

  const filtered = entries.filter(
    (en) =>
      (!category || en.categories.includes(category)) &&
      (!query || en.artist.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="container-page pt-4 pb-8">
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.schedule.searchPlaceholder}
          className="w-full rounded-pill border border-moon-white/20 bg-deep-space/50 px-4 py-2 text-sm text-moon-white placeholder:text-moon-white/40 focus:border-aurora-cyan/60 focus:outline-none sm:max-w-xs"
        />
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {schedule.categories.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(active ? null : c)}
                className="shrink-0 rounded-pill border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors"
                style={{
                  color: active ? "#03040a" : categoryColor(c),
                  borderColor: active ? categoryColor(c) : `${categoryColor(c)}55`,
                  backgroundColor: active ? categoryColor(c) : "transparent",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <p className="eyebrow pb-3 text-moon-white/50">
        {dict.schedule.nParticipants(filtered.length)}
      </p>

      <div className="flex flex-col gap-2">
        {filtered.map((en) => {
          const open = expanded === en.artist;
          const hasDetail = Boolean(en.bio || en.tagline || en.socials.length);
          return (
            <article
              key={en.artist}
              onClick={() => hasDetail && setExpanded(open ? null : en.artist)}
              className={`rounded-[14px] border border-moon-white/10 bg-deep-space/50 p-3.5 transition-colors ${
                hasDetail ? "cursor-pointer hover:border-moon-white/30" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {en.headshot ? (
                  <Image
                    src={en.headshot}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 shrink-0 rounded-full border border-moon-white/15 object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-moon-white/15 font-display text-sm font-extrabold text-moon-white/70">
                    {en.artist.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-[15px] font-extrabold uppercase tracking-[-0.01em] text-moon-white">
                    {en.artist}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {en.categories.map((c) => (
                      <span
                        key={c}
                        className="rounded-pill border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]"
                        style={{ color: categoryColor(c), borderColor: `${categoryColor(c)}55` }}
                      >
                        {c}
                      </span>
                    ))}
                    {en.sets.map((s, i) => {
                      const st = stageStyle(s.stage, locale);
                      return (
                        <span
                          key={i}
                          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-moon-white/50"
                        >
                          <span className="size-1.5 rounded-full" style={{ backgroundColor: st.color }} />
                          {formatSet(s, locale)} · {st.label}
                        </span>
                      );
                    })}
                  </div>
                  {open && (
                    <div className="mt-3 border-t border-moon-white/10 pt-3">
                      {en.tagline && <p className="eyebrow mb-1.5 text-solar-corona">{en.tagline}</p>}
                      {en.bio && (
                        <p className="text-[13px] leading-relaxed text-moon-white/70">{en.bio}</p>
                      )}
                      <SocialRow socials={en.socials} className="mt-3" />
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-16 text-center text-moon-white/50">{dict.schedule.noMatch}</p>
        )}
      </div>
    </div>
  );
}
