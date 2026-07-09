"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Schedule, ScheduleEvent } from "@/lib/schedule";
import { categoryColor, stageStyle } from "@/lib/schedule-meta";
import { LineupList } from "@/components/LineupView";
import { TimelineGrid } from "@/components/TimelineGrid";
import { SocialRow } from "@/components/SocialRow";
import {
  addMinutes,
  festivalDate,
  festivalNow,
  formatDayTab,
  nowInReykjavik,
  slotMinutes,
  toMinutes,
} from "@/lib/schedule-time";

function isLive(event: ScheduleEvent, now: { date: string; minutes: number }): boolean {
  if (event.date !== now.date) return false;
  const start = toMinutes(event.start);
  return now.minutes >= start && now.minutes < start + event.durationMin;
}

export function ScheduleView({ schedule }: { schedule: Schedule }) {
  const realNow = useMemo(() => nowInReykjavik(), []);
  const now = useMemo(() => festivalNow(realNow), [realNow]);
  const festivalDays = useMemo(
    () => [...new Set(schedule.events.map(festivalDate))].sort(),
    [schedule.events]
  );
  const defaultDay = festivalDays.includes(now.date)
    ? now.date
    : festivalDays[0];
  const [day, setDay] = useState(defaultDay);
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<"schedule" | "lineup">("schedule");
  const [mode, setMode] = useState<"timeline" | "list">("timeline");

  const isFestivalToday = festivalDays.includes(now.date);

  useEffect(() => {
    // Restore persisted view state after hydration; localStorage isn't
    // available during SSR so this can't be a useState initializer.
    // During the festival, always open on today; otherwise restore the
    // last viewed day. Stage filter is always restored.
    const savedDay = localStorage.getItem("ie:schedule:day");
    if (!isFestivalToday && savedDay && festivalDays.includes(savedDay)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDay(savedDay);
    }
    const savedStage = localStorage.getItem("ie:schedule:stage");
    if (savedStage && schedule.stages.includes(savedStage)) {
      setStageFilter(savedStage);
    }
    if (localStorage.getItem("ie:schedule:view") === "lineup") {
      setView("lineup");
    }
    if (localStorage.getItem("ie:schedule:mode") === "list") {
      setMode("list");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("ie:schedule:view", view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem("ie:schedule:mode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("ie:schedule:day", day);
  }, [day]);

  useEffect(() => {
    if (stageFilter) {
      localStorage.setItem("ie:schedule:stage", stageFilter);
    } else {
      localStorage.removeItem("ie:schedule:stage");
    }
  }, [stageFilter]);

  const dayEvents = useMemo(
    () =>
      schedule.events.filter(
        (e) =>
          festivalDate(e) === day &&
          (!stageFilter || e.stage === stageFilter)
      ),
    [schedule.events, day, stageFilter]
  );

  const timeGroups = useMemo(() => {
    const groups = new Map<string, ScheduleEvent[]>();
    for (const e of dayEvents) {
      const list = groups.get(e.start) ?? [];
      list.push(e);
      groups.set(e.start, list);
    }
    return [...groups.entries()].sort(
      ([a], [b]) => slotMinutes(a) - slotMinutes(b)
    );
  }, [dayEvents]);

  const stagesForDay = useMemo(() => {
    const present = new Set(
      schedule.events.filter((e) => festivalDate(e) === day).map((e) => e.stage)
    );
    return schedule.stages.filter((s) => present.has(s));
  }, [schedule, day]);

  return (
    <div>
      <div className="sticky top-16 z-40 border-b border-moon-white/10 bg-eclipse-black/85 backdrop-blur-md">
        <div className="container-page">
          <div className="flex gap-1 pt-3">
            {(
              [
                ["schedule", "Schedule"],
                ["lineup", "Lineup"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`flex items-center gap-1.5 rounded-soft px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  view === v
                    ? "bg-moon-white/10 text-moon-white"
                    : "text-moon-white/50 hover:text-moon-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {view === "schedule" && (
            <>
          <div className="flex gap-1 overflow-x-auto py-3 [scrollbar-width:none]">
            {festivalDays.map((d) => {
              const { dow, dom } = formatDayTab(d);
              const active = d === day;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDay(d);
                    setExpanded(null);
                    if (
                      stageFilter &&
                      !schedule.events.some(
                        (e) => festivalDate(e) === d && e.stage === stageFilter
                      )
                    ) {
                      setStageFilter(null);
                    }
                  }}
                  className={`flex shrink-0 flex-col items-center rounded-soft px-4 py-2 font-mono uppercase transition-colors ${
                    active
                      ? "bg-signal-yellow text-eclipse-black"
                      : "text-moon-white/60 hover:text-moon-white"
                  }`}
                >
                  <span className="text-[10px] tracking-[0.18em]">{dow}</span>
                  <span className="text-lg font-bold leading-tight">{dom}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 pb-3">
            <div className="flex shrink-0 rounded-pill border border-moon-white/15 p-0.5">
              {(
                [
                  ["timeline", "Timeline"],
                  ["list", "List"],
                ] as const
              ).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  className={`rounded-pill px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                    mode === m
                      ? "bg-moon-white text-eclipse-black"
                      : "text-moon-white/60 hover:text-moon-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="h-5 w-px shrink-0 bg-moon-white/15" />
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none]">
              <button
                type="button"
                onClick={() => setStageFilter(null)}
                className={`shrink-0 rounded-pill border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                  stageFilter === null
                    ? "border-moon-white bg-moon-white text-eclipse-black"
                    : "border-moon-white/25 text-moon-white/70 hover:border-moon-white/50"
                }`}
              >
                All stages
              </button>
              {stagesForDay.map((s) => {
                const st = stageStyle(s);
                const active = stageFilter === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStageFilter(active ? null : s)}
                    className={`flex shrink-0 items-center gap-2 rounded-pill border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                      active
                        ? "border-moon-white bg-moon-white text-eclipse-black"
                        : "border-moon-white/25 text-moon-white/70 hover:border-moon-white/50"
                    }`}
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: st.color }}
                    />
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>
            </>
          )}
        </div>
      </div>

      {view === "lineup" ? (
        <LineupList schedule={schedule} />
      ) : mode === "timeline" ? (
        <div className="container-page pt-4">
          <TimelineGrid
            schedule={schedule}
            day={day}
            stages={stagesForDay}
            stageFilter={stageFilter}
            now={now}
            isToday={isFestivalToday && day === now.date}
          />
        </div>
      ) : (
      <div className="container-page pt-4">
        {timeGroups.length === 0 && (
          <p className="py-16 text-center text-moon-white/50">
            Nothing scheduled for this day yet.
          </p>
        )}
        {timeGroups.map(([time, events]) => (
          <section key={time} id={`slot-${time.replace(":", "")}`} className="flex gap-4 py-3 scroll-mt-40">
            <div className="w-14 shrink-0 pt-1 text-right">
              <span className="font-mono text-sm font-bold text-moon-white/80">
                {time}
              </span>
              {slotMinutes(time) >= 1440 && (
                <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-moon-white/40">
                  Late
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2 border-l border-moon-white/10 pl-4">
              {events.map((e, i) => {
                const st = stageStyle(e.stage);
                const key = `${e.date}-${e.start}-${e.stage}-${e.artist}-${i}`;
                const live = isLive(e, realNow);
                const open = expanded === key;
                const hasDetail = Boolean(
                  e.bio || e.tagline || e.link || e.socials?.length
                );
                return (
                  <article
                    key={key}
                    onClick={() => hasDetail && setExpanded(open ? null : key)}
                    // Stage owns the block's color identity (Andrew, 2026-07-06):
                    // a colored left stripe keyed to the stage so blocks read as
                    // color-coded, not just the label dot (Elliot, 2026-07-07).
                    style={{ borderLeftColor: st.color, borderLeftWidth: "4px" }}
                    className={`rounded-[14px] border bg-deep-space/50 p-3.5 transition-colors ${
                      live ? "border-aurora-cyan/60" : "border-moon-white/10"
                    } ${hasDetail ? "cursor-pointer hover:border-moon-white/30" : ""} ${
                      e.status === "pending" ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {e.headshot ? (
                        <Image
                          src={e.headshot}
                          alt=""
                          width={44}
                          height={44}
                          className="size-11 shrink-0 rounded-full border border-moon-white/15 object-cover"
                          unoptimized
                        />
                      ) : (
                        <div
                          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-moon-white/15 font-display text-sm font-extrabold"
                          style={{ color: st.color }}
                        >
                          {e.artist.slice(0, 1)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-display text-[15px] font-extrabold uppercase tracking-[-0.01em] text-moon-white">
                            {e.artist}
                          </h3>
                          {live && (
                            <span className="flex shrink-0 items-center gap-1.5 rounded-pill bg-aurora-cyan/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-aurora-cyan">
                              <span className="size-1.5 animate-pulse rounded-full bg-aurora-cyan" />
                              Live
                            </span>
                          )}
                          {e.status === "pending" && (
                            <span className="shrink-0 rounded-pill border border-moon-white/25 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-moon-white/60">
                              TBC
                            </span>
                          )}
                        </div>
                        {e.title && (
                          <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-moon-white/75">
                            {e.title}
                          </p>
                        )}
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span
                            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]"
                            style={{ color: st.color }}
                          >
                            <span
                              className="size-1.5 rounded-full"
                              style={{ backgroundColor: st.color }}
                            />
                            {st.label}
                            {st.sub ? ` · ${st.sub}` : ""}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-moon-white/45">
                            {e.start}–{addMinutes(e.start, e.durationMin)}
                          </span>
                          {e.category && (
                            <span
                              className="rounded-pill border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]"
                              style={{
                                color: categoryColor(e.category),
                                borderColor: `${categoryColor(e.category)}55`,
                              }}
                            >
                              {e.category}
                            </span>
                          )}
                        </div>
                        {open && (
                          <div className="mt-3 border-t border-moon-white/10 pt-3">
                            {e.tagline && (
                              <p className="eyebrow mb-1.5 text-solar-corona">
                                {e.tagline}
                              </p>
                            )}
                            {e.bio && (
                              <p className="text-[13px] leading-relaxed text-moon-white/70">
                                {e.bio}
                              </p>
                            )}
                            <SocialRow socials={e.socials} className="mt-3" />
                            {e.link && (
                              <a
                                href={e.link.href}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(ev) => ev.stopPropagation()}
                                className="mt-3 inline-flex items-center gap-2 rounded-pill bg-signal-yellow px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-eclipse-black transition-colors hover:bg-solar-corona"
                              >
                                {e.link.label}
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                                  <path d="M7 17 17 7" />
                                  <path d="M7 7h10v10" />
                                </svg>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
        <div className="h-8" />
      </div>
      )}

      {view === "schedule" && mode === "list" && isFestivalToday && day === now.date && timeGroups.length > 0 && (
        <button
          type="button"
          onClick={() => {
            const target =
              timeGroups.find(
                ([time, events]) =>
                  slotMinutes(time) +
                    Math.max(...events.map((e) => e.durationMin)) >
                  now.minutes
              ) ?? timeGroups[timeGroups.length - 1];
            document
              .getElementById(`slot-${target[0].replace(":", "")}`)
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-30 rounded-pill border border-signal-yellow bg-signal-yellow px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-eclipse-black shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-solar-corona hover:bg-solar-corona"
        >
          Now
        </button>
      )}
    </div>
  );
}
