import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/data/articles";
import { ArticleBody, SectionNav } from "@/components/ArticleBody";
import { asLocale, getDict } from "@/lib/i18n";

interface GuidePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Locale comes from the parent [locale] segment; both language trees get every
// guide statically.
export function generateStaticParams(): { slug: string }[] {
  return ARTICLES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = asLocale(rawLocale);
  const dict = getDict(locale);
  const article = getArticle(slug, locale);
  return {
    title: article ? `${article.title} — Iceland Eclipse` : dict.guides.metaTitle,
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = asLocale(rawLocale);
  const dict = getDict(locale);
  const article = getArticle(slug, locale);
  if (!article) {
    notFound();
  }

  return (
    <article>
      <div className="relative h-[38vh] min-h-64 sm:h-[46vh]">
        <Image
          src={article.hero}
          alt={article.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-eclipse-black via-eclipse-black/30 to-eclipse-black/10" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-6 sm:pb-8">
          <p className="eyebrow text-aurora-cyan">
            {dict.guides.categoryLabels[article.category] ?? article.category}
          </p>
          <h1 className="mt-3 max-w-3xl font-display font-extrabold uppercase text-moon-white text-[clamp(1.9rem,6vw,3.25rem)] leading-[0.95] tracking-[-0.035em] [text-shadow:0_2px_20px_rgba(3,4,10,0.7)]">
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="eyebrow mt-3 max-w-2xl text-moon-white/70 [text-shadow:0_1px_12px_rgba(3,4,10,0.9)]">
              {article.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="container-page">
        {article.sectionNav && <SectionNav article={article} />}
        <div className="mx-auto max-w-2xl py-10 sm:py-12">
          <ArticleBody article={article} />
          <Link
            href="/guides"
            className="eyebrow mt-14 inline-flex items-center gap-2 text-moon-white/60 transition-colors hover:text-moon-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            {dict.guides.allGuides}
          </Link>
        </div>
      </div>
    </article>
  );
}
