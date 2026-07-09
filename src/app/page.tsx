import Link from "next/link";
import { ARTICLES } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";

const SECTIONS = [
  {
    href: "/map",
    title: "Festival Map",
    blurb: "Stages, food, water, medical — find your way around the site.",
    accent: "text-aurora-cyan",
  },
  {
    href: "/schedule",
    title: "Schedule",
    blurb: "Every talk, ceremony and set across five days and nine stages.",
    accent: "text-solar-corona",
  },
  {
    href: "/guides",
    title: "Guides",
    blurb: "Field notes and essentials for the eclipse, the land, and the gathering.",
    accent: "text-eclipse-orange",
  },
  {
    href: "/faq",
    title: "Attendee FAQ",
    blurb: "Answers on travel, packing, campgrounds, meals and the programme.",
    accent: "text-aurora-cyan",
  },
  {
    href: "/sponsors",
    title: "Partners",
    blurb: "The partners and producers making the gathering possible.",
    accent: "text-solar-corona",
  },
];

// External upsell links (Fever). Open in a new tab so attendees keep the app.
const QUICK_LINKS = [
  {
    href: "https://feverup.com/m/570327",
    title: "Shuttles",
    blurb: "Book your ride to and from the site.",
  },
  {
    href: "https://feverup.com/m/474974?session_ids=296955961",
    title: "Experiences",
    blurb: "Add-on tours and experiences around the peninsula.",
  },
];

export default function HomePage() {
  return (
    <div className="container-page">
      <section className="pt-12 pb-10 sm:pt-20">
        <p className="eyebrow text-aurora-cyan">
          Total Solar Eclipse · Snæfellsnes Peninsula
        </p>
        <h1 className="mt-5 font-display font-extrabold uppercase text-moon-white text-[clamp(2.25rem,8vw,4.5rem)] leading-[0.95] tracking-[-0.035em] [text-wrap:balance]">
          Your Companion for the Gathering
        </h1>
        <p className="mt-5 max-w-xl text-moon-white/70 leading-relaxed">
          Everything you need on the ground: the festival map, the full
          schedule, and guides to the gathering.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="eyebrow text-aurora-cyan">Plan your trip</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {QUICK_LINKS.map((q) => (
            <a
              key={q.href}
              href={q.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-[20px] border border-moon-white/10 bg-deep-space/60 p-5 transition-all duration-200 hover:border-moon-white/25 hover:-translate-y-0.5"
            >
              <span>
                <span className="block font-display text-lg font-extrabold uppercase tracking-[-0.02em] text-moon-white">
                  {q.title}
                </span>
                <span className="mt-1 block text-sm text-moon-white/70 leading-relaxed">
                  {q.blurb}
                </span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-moon-white/50 group-hover:text-moon-white transition-colors">
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          ))}
        </div>
      </section>

      <section className="pb-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="eyebrow text-solar-corona">Featured Articles</h2>
          <Link
            href="/guides"
            className="eyebrow text-moon-white/60 transition-colors hover:text-moon-white"
          >
            See all
          </Link>
        </div>
        <div className="-mx-6 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:-mx-10 md:px-10 xl:-mx-16 xl:px-16">
          {ARTICLES.map((article) => (
            <div key={article.slug} className="w-60 shrink-0 snap-start sm:w-72">
              <ArticleCard article={article} sizes="288px" />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 pb-16 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-[20px] border border-moon-white/10 bg-deep-space/60 p-6 transition-all duration-200 hover:border-moon-white/25 hover:-translate-y-0.5"
          >
            <h2
              className={`font-display font-extrabold uppercase tracking-[-0.02em] text-2xl ${s.accent}`}
            >
              {s.title}
            </h2>
            <p className="mt-2 text-sm text-moon-white/70 leading-relaxed">
              {s.blurb}
            </p>
            <span className="eyebrow mt-5 inline-flex items-center gap-2 text-moon-white/60 group-hover:text-moon-white transition-colors">
              Open
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
