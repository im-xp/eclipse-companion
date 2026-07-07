import Image from "next/image";
import type { Article, ArticleBlock } from "@/data/articles";
import { renderInline } from "@/lib/inline";
import { GuideChecklist } from "@/components/GuideChecklist";

function Block({ block, articleSlug }: { block: ArticleBlock; articleSlug: string }) {
  switch (block.kind) {
    case "p":
      return <p className="leading-relaxed text-moon-white/75">{renderInline(block.text)}</p>;
    case "lede":
      return (
        <p className="border-l-2 border-aurora-cyan/50 pl-4 italic leading-relaxed text-moon-white/65">
          {renderInline(block.text)}
        </p>
      );
    case "list":
      return (
        <ul className="space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 leading-relaxed text-moon-white/75">
              <span aria-hidden className="mt-[0.65em] size-1.5 shrink-0 rotate-45 bg-aurora-cyan/70" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "checklist":
      return (
        <GuideChecklist
          storageKey={`ie:guide:${articleSlug}:${block.id}`}
          title={block.title}
          note={block.note}
          items={block.items}
        />
      );
    case "image":
      return (
        <Image
          src={block.src}
          alt={block.alt}
          width={1600}
          height={1000}
          className="w-full rounded-[12px] border border-moon-white/10 object-cover"
        />
      );
    case "facts":
      return (
        <dl className="overflow-hidden rounded-[12px] border border-moon-white/10">
          {block.rows.map((row, i) => (
            <div
              key={i}
              className={`flex gap-4 px-4 py-3 sm:px-5 ${i % 2 === 0 ? "bg-deep-space/50" : "bg-deep-space/20"}`}
            >
              <dt className="eyebrow w-24 shrink-0 pt-0.5 text-solar-corona">{row.label}</dt>
              <dd className="leading-snug text-moon-white/85">{renderInline(row.value)}</dd>
            </div>
          ))}
        </dl>
      );
    case "cta":
      return (
        <a
          href={block.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-[999px] bg-signal-yellow px-6 py-3 font-display text-sm font-extrabold uppercase tracking-[0.02em] text-eclipse-black transition-colors hover:bg-solar-corona"
        >
          {block.label}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      );
  }
}

export function ArticleBody({ article }: { article: Article }) {
  return (
    <div className="space-y-12">
      {article.sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-32 space-y-5">
          {section.title && (
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-[-0.02em] text-moon-white">
              {section.title}
            </h2>
          )}
          {section.blocks.map((block, i) => (
            <Block key={i} block={block} articleSlug={article.slug} />
          ))}
        </section>
      ))}
    </div>
  );
}

export function SectionNav({ article }: { article: Article }) {
  const titled = article.sections.filter((s) => s.title);
  return (
    <nav
      aria-label="Sections"
      className="sticky top-16 z-30 -mx-6 border-b border-moon-white/10 bg-eclipse-black/85 backdrop-blur-md md:-mx-10 xl:-mx-16"
    >
      <div className="flex gap-2 overflow-x-auto px-6 py-3 [scrollbar-width:none] md:px-10 xl:px-16">
        {titled.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="eyebrow shrink-0 rounded-[999px] border border-moon-white/15 px-3.5 py-2 text-moon-white/70 transition-colors hover:border-aurora-cyan/60 hover:text-aurora-cyan"
          >
            {s.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
