"use client";

import { useEffect, useState } from "react";
import { renderInline } from "@/lib/inline";

interface GuideChecklistProps {
  storageKey: string;
  title: string;
  note?: string;
  items: string[];
}

export function GuideChecklist({ storageKey, title, note, items }: GuideChecklistProps) {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));

  useEffect(() => {
    // localStorage isn't available during SSR so this can't be a useState initializer.
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setChecked(items.map((_, i) => parsed[i] === true));
      }
    }
  }, [storageKey, items]);

  const doneCount = checked.filter(Boolean).length;

  function toggle(index: number) {
    setChecked((prev) => {
      const next = prev.map((value, i) => (i === index ? !value : value));
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }

  return (
    <section className="rounded-[12px] border border-moon-white/10 bg-deep-space/40">
      <header className="flex items-baseline justify-between gap-3 px-4 pt-4 pb-1 sm:px-5">
        <h3 className="font-display font-extrabold uppercase tracking-[-0.01em] text-moon-white">
          {title}
          {note && (
            <span className="ml-2 font-sans font-normal normal-case italic text-sm text-ash-grey">
              {note}
            </span>
          )}
        </h3>
        <span
          className={`eyebrow shrink-0 ${doneCount === items.length ? "text-aurora-cyan" : "text-ash-grey"}`}
        >
          {doneCount}/{items.length}
        </span>
      </header>
      <ul className="px-2 pb-2 sm:px-3">
        {items.map((item, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-pressed={checked[i]}
              className="group flex w-full items-start gap-3 rounded-[8px] px-2 py-2 text-left transition-colors hover:bg-moon-white/5 sm:px-2.5"
            >
              <span
                aria-hidden
                className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-[6px] border transition-colors ${
                  checked[i]
                    ? "border-signal-yellow bg-signal-yellow text-eclipse-black"
                    : "border-moon-white/30 group-hover:border-moon-white/60"
                }`}
              >
                {checked[i] && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </span>
              <span
                className={`leading-relaxed transition-colors ${
                  checked[i] ? "text-moon-white/40 line-through decoration-moon-white/30" : "text-moon-white/85"
                }`}
              >
                {renderInline(item)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
