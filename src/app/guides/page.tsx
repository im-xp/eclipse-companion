import type { Metadata } from "next";
import { ARTICLES, type ArticleCategory } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "Guides — Iceland Eclipse",
};

// Articles keep their categories in data, but the guides page now shows them as
// one unified grid (Andrew, 2026-07-07) — quick-guides first, then the rest.
const CATEGORY_ORDER: ArticleCategory[] = ["quick-guides", "highlights-news"];
const orderedArticles = CATEGORY_ORDER.flatMap((category) =>
  ARTICLES.filter((a) => a.category === category)
);

export default function GuidesPage() {
  return (
    <div className="container-page">
      <section className="pt-12 pb-8 sm:pt-16">
        <p className="eyebrow text-aurora-cyan">Know Before You Go</p>
        <h1 className="mt-4 font-display font-extrabold uppercase text-moon-white text-[clamp(2rem,6vw,3.5rem)] leading-[0.95] tracking-[-0.035em]">
          Guides
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-moon-white/70">
          Everything worth reading before and during the gathering: packing,
          camping, the eclipse itself, and what makes this peninsula special.
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
