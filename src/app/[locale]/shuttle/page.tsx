import type { Metadata } from "next";
import { SHUTTLE_DAYS } from "@/data/shuttle";
import { asLocale, getDict } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const dict = getDict(asLocale((await params).locale)).shuttle;
  return { title: dict.metaTitle, description: dict.metaDescription };
}

export default async function ShuttlePage({ params }: PageProps) {
  const locale = asLocale((await params).locale);
  const t = getDict(locale).shuttle;

  return (
    <div className="container-page">
      <section className="mx-auto max-w-2xl pt-12 pb-8 sm:pt-16">
        <p className="eyebrow text-aurora-cyan">{t.eyebrow}</p>
        <h1 className="mt-4 font-display font-extrabold uppercase text-moon-white text-[clamp(2rem,6vw,3.5rem)] leading-[0.95] tracking-[-0.035em]">
          {t.title}
        </h1>
        <p className="mt-4 leading-relaxed text-moon-white/70">{t.intro}</p>
      </section>

      <section className="mx-auto max-w-2xl pb-10">
        <h2 className="eyebrow text-solar-corona">{t.routeTitle}</h2>
        {/* Circular: the festival is both the first stop and where the last one
            returns to, so it is repeated at the end and marked differently. */}
        <ol className="mt-4">
          {[...t.stops, t.stops[0]].map((stop, i, all) => (
            <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
              {i < all.length - 1 && (
                <span
                  aria-hidden
                  className="absolute bottom-0 left-[3px] top-3 w-px bg-moon-white/15"
                />
              )}
              <span
                aria-hidden
                className={`relative mt-[0.5em] size-2 shrink-0 rotate-45 ${
                  i === 0 || i === all.length - 1
                    ? "bg-signal-yellow"
                    : "bg-aurora-cyan/70"
                }`}
              />
              <span className="leading-relaxed text-moon-white/85">{stop}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-moon-white/55">{t.routeNote}</p>
      </section>

      <section className="mx-auto max-w-2xl pb-16">
        <h2 className="eyebrow text-solar-corona">{t.scheduleTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-moon-white/60">{t.scheduleNote}</p>

        <div className="mt-5 overflow-hidden rounded-[16px] border border-moon-white/10">
          {SHUTTLE_DAYS.map((d, i) => (
            <div
              key={d.day}
              className={`px-4 py-4 sm:px-5 ${
                d.delays
                  ? "border-y border-solar-corona/30 bg-solar-corona/[0.07]"
                  : i % 2 === 0
                    ? "bg-deep-space/50"
                    : "bg-deep-space/20"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <p className="font-display font-extrabold uppercase tracking-[-0.01em] text-moon-white">
                  {t.weekdays[d.weekday]} {d.day} {t.month}
                </p>
                {d.delays && (
                  <p className="eyebrow text-solar-corona">{t.eclipseLabel}</p>
                )}
              </div>

              <div className="mt-3 space-y-2">
                {d.runs.map((run) => (
                  <dl key={run.first} className="flex flex-wrap gap-x-10 gap-y-1">
                    <div className="flex items-baseline gap-3">
                      <dt className="eyebrow text-moon-white/45">{t.first}</dt>
                      <dd className="font-mono tabular-nums text-moon-white">
                        {run.first}
                      </dd>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <dt className="eyebrow text-moon-white/45">{t.last}</dt>
                      <dd className="font-mono tabular-nums text-moon-white">
                        {run.last}
                        {run.lastNextDay && (
                          <span className="ml-1.5 text-xs text-solar-corona">
                            {t.nextDay}
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>
                ))}
              </div>

              {d.delays && (
                <p className="mt-3 text-sm leading-relaxed text-moon-white/75">
                  {t.eclipseNote}
                </p>
              )}
            </div>
          ))}
        </div>

        <p className="mt-5 text-sm text-moon-white/50">{t.sourceNote}</p>
      </section>
    </div>
  );
}
