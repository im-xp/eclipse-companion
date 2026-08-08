import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CAMPGROUNDS, GROUP_LABELS, getCampground, type Group } from "@/data/arrival";
import { LOCALES } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string; campground: string }>;
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    CAMPGROUNDS.map((c) => ({ locale, campground: c.slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const c = getCampground((await params).campground);
  return {
    title: c
      ? `${c.name} — Arrival Instructions`
      : "Accommodation Arrival Instructions",
  };
}

const GROUP_ORDER: Group[] = ["glamping", "camping", "rv"];

export default async function CampgroundPage({ params }: PageProps) {
  const campground = getCampground((await params).campground);
  if (!campground) notFound();

  return (
    <div className="container-page">
      <div className="mx-auto max-w-2xl">
        <section className="pt-12 pb-8 sm:pt-16">
          <Link
            href="/arrival"
            className="eyebrow inline-flex items-center gap-2 text-moon-white/50 transition-colors hover:text-moon-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            All campgrounds
          </Link>
          <h1 className="mt-4 font-display font-extrabold uppercase text-moon-white text-[clamp(2rem,7vw,3.5rem)] leading-[0.95] tracking-[-0.035em]">
            {campground.name}
          </h1>
          <p className="eyebrow mt-2 text-aurora-cyan">{campground.icelandic}</p>
          <p className="mt-4 leading-relaxed text-moon-white/70">{campground.tagline}</p>
        </section>

        <section className="pb-16">
          <h2 className="eyebrow text-solar-corona">Choose your accommodation</h2>
          <div className="mt-5 space-y-9">
            {GROUP_ORDER.map((group) => {
              const items = campground.accommodations.filter((a) => a.group === group);
              if (!items.length) return null;
              return (
                <div key={group}>
                  <h3 className="font-display text-lg font-extrabold uppercase tracking-[-0.01em] text-moon-white/80">
                    {GROUP_LABELS[group]}
                  </h3>
                  <div className="mt-3 space-y-2.5">
                    {items.map((a) => (
                      <Link
                        key={a.slug}
                        href={`/arrival/${campground.slug}/${a.slug}`}
                        className="group flex items-center justify-between gap-4 rounded-[16px] border border-moon-white/10 bg-deep-space/50 px-5 py-4 transition-all duration-200 hover:border-aurora-cyan/50 hover:-translate-y-0.5"
                      >
                        <span>
                          <span className="block font-semibold text-moon-white">
                            {a.name}
                          </span>
                          <span className="mt-0.5 block text-sm leading-snug text-moon-white/60">
                            {a.blurb}
                          </span>
                        </span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-4 shrink-0 text-moon-white/40 transition-colors group-hover:text-aurora-cyan"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
