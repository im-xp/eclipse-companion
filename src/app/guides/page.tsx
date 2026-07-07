import type { Metadata } from "next";
import { ARTICLES, CATEGORY_LABELS, type ArticleCategory } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "Guides — Iceland Eclipse",
};

const CATEGORY_ORDER: ArticleCategory[] = ["quick-guides", "highlights-news"];

const CATEGORY_ACCENTS: Record<ArticleCategory, string> = {
  "quick-guides": "text-aurora-cyan",
  "highlights-news": "text-solar-corona",
};

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

      {CATEGORY_ORDER.map((category) => {
        const articles = ARTICLES.filter((a) => a.category === category);
        return (
          <section key={category} className="pb-12">
            <h2 className={`eyebrow ${CATEGORY_ACCENTS[category]}`}>
              {CATEGORY_LABELS[category]}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  showSummary
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
