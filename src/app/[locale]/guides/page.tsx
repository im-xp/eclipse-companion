import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getArticles, type ArticleCategory } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { asLocale, getDict } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: getDict(asLocale((await params).locale)).guides.metaTitle };
}

// Articles keep their categories in data, but the guides page now shows them as
// one unified grid (Andrew, 2026-07-07) — quick-guides first, then the rest.
const CATEGORY_ORDER: ArticleCategory[] = ["quick-guides", "highlights-news"];

export default async function GuidesPage({ params }: PageProps) {
  const locale = asLocale((await params).locale);
  const dict = getDict(locale);
  const articles = getArticles(locale);
  const orderedArticles = CATEGORY_ORDER.flatMap((category) =>
    articles.filter((a) => a.category === category)
  );
  return (
    <div className="container-page">
      <section className="pt-12 pb-8 sm:pt-16">
        <p className="eyebrow text-aurora-cyan">{dict.guides.eyebrow}</p>
        <h1 className="mt-4 font-display font-extrabold uppercase text-moon-white text-[clamp(2rem,6vw,3.5rem)] leading-[0.95] tracking-[-0.035em]">
          {dict.guides.title}
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-moon-white/70">
          {dict.guides.intro}
        </p>
      </section>

      <section className="pb-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/*
            /arrival isn't an article — it's a picker keyed to what you booked.
            It leads the grid because it's the most time-sensitive read before
            the gates open. Its body copy is English-only; only this card is
            translated.
          */}
          <Link
            href="/arrival"
            className="group relative block overflow-hidden rounded-[20px] border border-moon-white/10 transition-all duration-200 hover:border-moon-white/30 hover:-translate-y-0.5"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src="/articles/arrival-instructions.jpg"
                alt={dict.guides.arrivalAlt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-eclipse-black via-eclipse-black/25 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="eyebrow text-solar-corona [text-shadow:0_1px_12px_rgba(3,4,10,0.8)]">
                {dict.guides.arrivalEyebrow}
              </p>
              <h3 className="mt-1.5 font-display text-lg font-extrabold uppercase leading-tight tracking-[-0.02em] text-moon-white [text-shadow:0_1px_12px_rgba(3,4,10,0.8)]">
                {dict.guides.arrivalTitle}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-moon-white/70">
                {dict.guides.arrivalSummary}
              </p>
            </div>
          </Link>
          {orderedArticles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              showSummary
            />
          ))}
        </div>
      </section>
    </div>
  );
}
