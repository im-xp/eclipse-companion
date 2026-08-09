import Link from "next/link";
import { getArticles } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { asLocale, getDict, type Dict } from "@/lib/i18n";

function sections(dict: Dict) {
  return [
    {
      href: "/map",
      title: dict.home.mapTitle,
      blurb: dict.home.mapBlurb,
      accent: "text-aurora-cyan",
    },
    {
      href: "/schedule",
      title: dict.home.scheduleTitle,
      blurb: dict.home.scheduleBlurb,
      accent: "text-solar-corona",
    },
    {
      href: "/guides",
      title: dict.home.guidesTitle,
      blurb: dict.home.guidesBlurb,
      accent: "text-eclipse-orange",
    },
    {
      // The FAQ lives on the marketing sites: icelandeclipse.com in English,
      // eclipse.is (its #faq section) in Icelandic.
      href: dict.home.faqHref,
      title: dict.home.faqTitle,
      blurb: dict.home.faqBlurb,
      accent: "text-aurora-cyan",
      external: true,
    },
    {
      href: "/sponsors",
      title: dict.home.sponsorsTitle,
      blurb: dict.home.sponsorsBlurb,
      accent: "text-solar-corona",
    },
  ];
}

// Plan-your-trip cards. Arrival is internal (root-relative, no locale prefix);
// the Fever upsells are external and open in a new tab so attendees keep the app.
function quickLinks(dict: Dict) {
  return [
    {
      href: "/arrival",
      title: dict.home.arrivalTitle,
      blurb: dict.home.arrivalBlurb,
      external: false,
      wide: true,
    },
    {
      href: "https://feverup.com/m/570327",
      title: dict.home.shuttlesTitle,
      blurb: dict.home.shuttlesBlurb,
      external: true,
      wide: false,
    },
    {
      href: "https://feverup.com/m/474974?session_ids=296955961",
      title: dict.home.experiencesTitle,
      blurb: dict.home.experiencesBlurb,
      external: true,
      wide: false,
    },
  ];
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = asLocale((await params).locale);
  const dict = getDict(locale);
  const articles = getArticles(locale);
  return (
    <div className="container-page">
      <section className="pt-12 pb-10 sm:pt-20">
        <p className="eyebrow text-aurora-cyan">{dict.home.eyebrow}</p>
        <h1 className="mt-5 font-display font-extrabold uppercase text-moon-white text-[clamp(2.25rem,8vw,4.5rem)] leading-[0.95] tracking-[-0.035em] [text-wrap:balance]">
          {dict.home.heroTitle}
        </h1>
        <p className="mt-5 max-w-xl text-moon-white/70 leading-relaxed">
          {dict.home.heroBody}
        </p>
        <p className="mt-7 text-sm text-moon-white/70">{dict.home.ticketPre}</p>
        <a
          href={dict.home.ticketHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 rounded-pill bg-signal-yellow px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-eclipse-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-solar-corona"
        >
          {dict.home.ticketCta}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      </section>

      <section className="pb-12">
        <h2 className="eyebrow text-aurora-cyan">{dict.home.planTrip}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {quickLinks(dict).map((q) => {
            const Card = q.external ? "a" : Link;
            const linkProps = q.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <Card
                key={q.href}
                href={q.href}
                {...linkProps}
                className={`group flex items-center justify-between gap-4 rounded-[20px] border border-moon-white/10 bg-deep-space/60 p-5 transition-all duration-200 hover:border-moon-white/25 hover:-translate-y-0.5${
                  q.wide ? " sm:col-span-2" : ""
                }`}
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
                  {q.external ? (
                    <>
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </>
                  ) : (
                    <>
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </>
                  )}
                </svg>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="pb-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="eyebrow text-solar-corona">{dict.home.featured}</h2>
          <Link
            href="/guides"
            className="eyebrow text-moon-white/60 transition-colors hover:text-moon-white"
          >
            {dict.home.seeAll}
          </Link>
        </div>
        <div className="-mx-6 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:-mx-10 md:px-10 xl:-mx-16 xl:px-16">
          {articles.map((article) => (
            <div key={article.slug} className="w-60 shrink-0 snap-start sm:w-72">
              <ArticleCard article={article} sizes="288px" />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 pb-16 sm:grid-cols-3">
        {sections(dict).map((s) => {
          const cardClass =
            "group rounded-[20px] border border-moon-white/10 bg-deep-space/60 p-6 transition-all duration-200 hover:border-moon-white/25 hover:-translate-y-0.5";
          const inner = (
            <>
              <h2
                className={`font-display font-extrabold uppercase tracking-[-0.02em] text-2xl ${s.accent}`}
              >
                {s.title}
              </h2>
              <p className="mt-2 text-sm text-moon-white/70 leading-relaxed">
                {s.blurb}
              </p>
              <span className="eyebrow mt-5 inline-flex items-center gap-2 text-moon-white/60 group-hover:text-moon-white transition-colors">
                {dict.home.open}
                {s.external ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                )}
              </span>
            </>
          );

          return s.external ? (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cardClass}
            >
              {inner}
            </a>
          ) : (
            <Link key={s.href} href={s.href} className={cardClass}>
              {inner}
            </Link>
          );
        })}
      </section>
    </div>
  );
}
