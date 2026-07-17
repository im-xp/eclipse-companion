"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { LOCALES, type Locale } from "@/lib/i18n";

// TEMPORARY (testing phase, Jon 2026-07-15): lets anyone flip EN/IS without
// an Icelandic IP. Sets the `lang` cookie that src/proxy.ts honors above the
// domain/geo default, then hard-reloads so the middleware re-runs and every
// RSC payload refetches in the new language. Remove together with the cookie
// block in proxy.ts to return to pure domain/geo selection.
export function LanguageToggle() {
  const locale = useLocale();

  function choose(next: Locale) {
    if (next === locale) return;
    document.cookie = `lang=${next}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <div className="flex shrink-0 rounded-pill border border-moon-white/15 p-0.5">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => choose(l)}
          aria-pressed={locale === l}
          className={`rounded-pill px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
            locale === l
              ? "bg-moon-white text-eclipse-black"
              : "text-moon-white/60 hover:text-moon-white"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
