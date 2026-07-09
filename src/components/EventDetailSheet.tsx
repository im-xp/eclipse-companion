"use client";

import Image from "next/image";
import { useEffect } from "react";
import { eventLabels, type ScheduleEvent } from "@/lib/schedule";
import { categoryColor, stageStyle } from "@/lib/schedule-meta";
import { addMinutes } from "@/lib/schedule-time";
import { SocialRow } from "@/components/SocialRow";

// Bottom-sheet detail for a single set. Timeline blocks are too small to expand
// inline, so tapping one opens this over the grid with the full bio + socials.
export function EventDetailSheet({
  event,
  onClose,
}: {
  event: ScheduleEvent | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!event) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [event, onClose]);

  if (!event) return null;
  const st = stageStyle(event.stage);
  const e = event;
  const { primary, secondary } = eventLabels(e);

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
          {e.headshot ? (
            <Image
              src={e.headshot}
              alt=""
              width={56}
              height={56}
              className="size-14 shrink-0 rounded-full border border-moon-white/15 object-cover"
              unoptimized
            />
          ) : (
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-full border border-moon-white/15 font-display text-lg font-extrabold"
              style={{ color: st.color }}
            >
              {e.artist.slice(0, 1)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-extrabold uppercase leading-tight tracking-[-0.01em] text-moon-white">
              {primary}
            </h2>
            {secondary && (
              <p className="mt-0.5 text-[13px] leading-snug text-moon-white/75">{secondary}</p>
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

        {e.tagline && <p className="eyebrow mt-3 text-solar-corona">{e.tagline}</p>}
        {e.bio && (
          <p className="mt-2 text-[13px] leading-relaxed text-moon-white/70">{e.bio}</p>
        )}
        <SocialRow socials={e.socials} className="mt-4" />
        {e.link && (
          <a
            href={e.link.href}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-pill bg-signal-yellow px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-eclipse-black transition-colors hover:bg-solar-corona"
          >
            {e.link.label}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
