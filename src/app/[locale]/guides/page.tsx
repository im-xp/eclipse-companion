import type { Metadata } from "next";
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
