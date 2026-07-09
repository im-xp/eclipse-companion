"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  buildSpeakerIndex,
  eventLabels,
  eventSpeakers,
  type Schedule,
  type ScheduleEvent,
  type Speaker,
} from "@/lib/schedule";
import { categoryColor, stageStyle } from "@/lib/schedule-meta";
import { addMinutes } from "@/lib/schedule-time";
import { SocialRow } from "@/components/SocialRow";

function Avatar({
  name,
  headshot,
  color,
  size,
}: {
  name: string;
  headshot: string | null;
  color: string;
  size: number;
}) {
  if (headshot) {
    return (
      <Image
        src={headshot}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full border border-moon-white/15 object-cover"
        unoptimized
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, color }}
      className="flex shrink-0 items-center justify-center rounded-full border border-moon-white/15 font-display font-extrabold"
    >
      {name.slice(0, 1)}
    </div>
  );
}

function setLabel(e: ScheduleEvent): string {
  const d = new Date(`${e.date}T12:00:00Z`);
  const dow = d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" });
  const { primary } = eventLabels(e);
  return `${dow} ${e.start} · ${primary}`;
}

// Bottom-sheet detail for a single set. Timeline blocks are too small to expand
// inline, so tapping one opens this over the grid with the full record: title
// first, then a tile per speaker. Tapping a speaker reveals their bio + socials
// and every other session they're in ("all engagements of this speaker").
export function EventDetailSheet({
  event,
  schedule,
  onClose,
  onSelectEvent,
}: {
  event: ScheduleEvent | null;
  schedule: Schedule;
  onClose: () => void;
  onSelectEvent?: (e: ScheduleEvent) => void;
}) {
  const [openSpeaker, setOpenSpeaker] = useState<string | null>(null);
  // Collapse any expanded speaker when the sheet switches events — the
  // render-phase reset React recommends over a setState-in-effect.
  const [prevEvent, setPrevEvent] = useState(event);
  if (event !== prevEvent) {
    setPrevEvent(event);
    setOpenSpeaker(null);
  }

  useEffect(() => {
    if (!event) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [event, onClose]);

  const speakerIndex = useMemo(
    () => buildSpeakerIndex(schedule.events),
    [schedule.events]
  );

  if (!event) return null;
  const st = stageStyle(event.stage);
  const e = event;
  const { primary } = eventLabels(e);
  const speakers = eventSpeakers(e);
  const isPanel = speakers.length > 1;

  // Solo sets keep the classic layout; the lone speaker's profile shows inline.
  const renderSoloBody = (s: Speaker) => (
    <>
      {s.tagline && <p className="eyebrow mt-3 text-solar-corona">{s.tagline}</p>}
      {s.bio && (
        <p className="mt-2 text-[13px] leading-relaxed text-moon-white/70">{s.bio}</p>
      )}
      <SocialRow socials={s.socials} className="mt-4" />
      {s.link && (
        <a
          href={s.link.href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-pill bg-signal-yellow px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-eclipse-black transition-colors hover:bg-solar-corona"
        >
          {s.link.label}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3">
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      )}
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-eclipse-black/70 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={primary}
        onClick={(ev) => ev.stopPropagation()}
        style={{ borderTopColor: st.color, borderTopWidth: "4px" }}
        className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-[20px] border-x border-b border-moon-white/10 bg-deep-space p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:rounded-[20px] sm:border"
      >
        <div className="flex items-start gap-3">
          {!isPanel && (
            <Avatar name={speakers[0].name} headshot={speakers[0].headshot} color={st.color} size={56} />
          )}
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-extrabold uppercase leading-tight tracking-[-0.01em] text-moon-white">
              {primary}
            </h2>
            {!isPanel && e.title && (
              <p className="mt-0.5 text-[13px] leading-snug text-moon-white/75">
                {speakers[0].name}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]"
            style={{ color: st.color }}
          >
            <span className="size-1.5 rounded-full" style={{ backgroundColor: st.color }} />
            {st.label}
            {st.sub ? ` · ${st.sub}` : ""}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-moon-white/45">
            {e.start}–{addMinutes(e.start, e.durationMin)}
          </span>
          {e.category && (
            <span
              className="rounded-pill border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]"
              style={{ color: categoryColor(e.category), borderColor: `${categoryColor(e.category)}55` }}
            >
              {e.category}
            </span>
          )}
        </div>

        {!isPanel ? (
          renderSoloBody(speakers[0])
        ) : (
          <div className="mt-4">
            <p className="eyebrow mb-2 text-moon-white/50">
              {speakers.length} speakers · tap for bio & sessions
            </p>
            <div className="flex flex-col gap-1.5">
              {speakers.map((s) => {
                const open = openSpeaker === s.name;
                const profile = speakerIndex.get(s.name);
                const alsoIn = (profile?.sets ?? []).filter((x) => x !== e);
                return (
                  <div
                    key={s.name}
                    className={`rounded-[12px] border transition-colors ${
                      open ? "border-moon-white/30 bg-eclipse-black/40" : "border-moon-white/10"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenSpeaker(open ? null : s.name)}
                      className="flex w-full items-center gap-2.5 px-2.5 py-2 text-left"
                    >
                      <Avatar name={s.name} headshot={s.headshot} color={st.color} size={32} />
                      <span className="min-w-0 flex-1 truncate font-display text-[13px] font-bold uppercase tracking-[-0.01em] text-moon-white">
                        {s.name}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`size-4 shrink-0 text-moon-white/40 transition-transform ${open ? "rotate-180" : ""}`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    {open && (
                      <div className="border-t border-moon-white/10 px-2.5 py-2.5">
                        {s.tagline && (
                          <p className="eyebrow mb-1.5 text-solar-corona">{s.tagline}</p>
                        )}
                        {s.bio && (
                          <p className="text-[13px] leading-relaxed text-moon-white/70">{s.bio}</p>
                        )}
                        <SocialRow socials={s.socials} className="mt-2.5" />
                        {alsoIn.length > 0 && (
                          <div className="mt-3">
                            <p className="eyebrow mb-1.5 text-moon-white/45">Also appearing</p>
                            <div className="flex flex-col gap-1">
                              {alsoIn.map((x, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => onSelectEvent?.(x)}
                                  disabled={!onSelectEvent}
                                  className="flex items-center gap-1.5 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-moon-white/60 enabled:hover:text-moon-white disabled:cursor-default"
                                >
                                  <span
                                    className="size-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: stageStyle(x.stage).color }}
                                  />
                                  {setLabel(x)}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {!s.bio && !s.socials.length && alsoIn.length === 0 && (
                          <p className="text-[12px] italic text-moon-white/40">
                            No bio yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
