import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/data/articles";

interface ArticleCardProps {
  article: Article;
  sizes: string;
  showSummary?: boolean;
}

export function ArticleCard({ article, sizes, showSummary = false }: ArticleCardProps) {
  return (
    <Link
      href={`/guides/${article.slug}`}
      className="group relative block overflow-hidden rounded-[20px] border border-moon-white/10 transition-all duration-200 hover:border-moon-white/30 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={article.hero}
          alt={article.heroAlt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-eclipse-black via-eclipse-black/25 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <h3 className="font-display text-lg font-extrabold uppercase leading-tight tracking-[-0.02em] text-moon-white [text-shadow:0_1px_12px_rgba(3,4,10,0.8)]">
          {article.title}
        </h3>
        {showSummary && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-moon-white/70">
            {article.summary}
          </p>
        )}
      </div>
    </Link>
  );
}
