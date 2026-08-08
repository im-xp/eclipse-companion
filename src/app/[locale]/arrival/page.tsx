import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CAMPGROUNDS } from "@/data/arrival";

// Public, and linked from /guides. Not in AppNav — it's a pre-arrival read.
export const metadata: Metadata = {
  title: "Accommodation Arrival Instructions — Iceland Eclipse",
};

export default function ArrivalPage() {
  return (
    <div className="container-page">
      <section className="mx-auto max-w-2xl pt-12 pb-8 sm:pt-16">
        <p className="eyebrow text-aurora-cyan">Iceland Eclipse · 9–17 August 2026</p>
        <h1 className="mt-4 font-display font-extrabold uppercase text-moon-white text-[clamp(2rem,6vw,3.25rem)] leading-[0.95] tracking-[-0.035em]">
          Accommodation Arrival Instructions
        </h1>
        <p className="mt-4 leading-relaxed text-moon-white/70">
          Everything you need before you arrive, for your accommodation specifically.
          Start with your campground — it's printed on your pass.
        </p>
      </section>

      <section className="mx-auto max-w-2xl pb-10">
        <div className="overflow-hidden rounded-[20px] border border-moon-white/10">
          <Image
            src="/campground-map.jpg"
            alt="Campground map of the Iceland Eclipse site, showing the Daybreak and Moonrise camping areas"
            width={1800}
            height={2400}
            className="w-full"
            priority
          />
        </div>
      </section>

      <section className="mx-auto max-w-2xl pb-16">
        <h2 className="eyebrow text-solar-corona">Choose your campground</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {CAMPGROUNDS.map((c) => (
            <Link
              key={c.slug}
              href={`/arrival/${c.slug}`}
              className="group rounded-[20px] border border-moon-white/10 bg-deep-space/60 p-6 transition-all duration-200 hover:border-aurora-cyan/50 hover:-translate-y-0.5"
            >
              <h3 className="font-display text-3xl font-extrabold uppercase tracking-[-0.02em] text-moon-white">
                {c.name}
              </h3>
              <p className="eyebrow mt-1 text-aurora-cyan">{c.icelandic}</p>
              <p className="mt-3 text-sm leading-relaxed text-moon-white/70">{c.tagline}</p>
              <ul className="mt-4 space-y-1.5">
                {c.accommodations.map((a) => (
                  <li key={a.slug} className="flex gap-2.5 text-sm text-moon-white/55">
                    <span
                      aria-hidden
                      className="mt-[0.6em] size-1 shrink-0 rotate-45 bg-moon-white/30"
                    />
                    <span>{a.name}</span>
                  </li>
                ))}
              </ul>
              <span className="eyebrow mt-5 inline-flex items-center gap-2 text-moon-white/60 transition-colors group-hover:text-aurora-cyan">
                Continue
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-3.5"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm text-moon-white/50">
          Not sure which one you're in? Your campground is on your pass, or email{" "}
          <a
            href="mailto:hallo@icelandeclipse.com"
            className="text-aurora-cyan underline decoration-aurora-cyan/40 underline-offset-2"
          >
            hallo@icelandeclipse.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
