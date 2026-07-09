import type { Metadata } from "next";
import faqData from "@/data/faq.json";

export const metadata: Metadata = {
  title: "Attendee FAQ — Iceland Eclipse",
  description:
    "Answers for Iceland Eclipse attendees: travel, packing, campgrounds, meals and the programme.",
};

type FaqItem = { question: string; answer: string };
type FaqCategory = { title: string; items: FaqItem[] };

const CATEGORIES = (faqData.categories as FaqCategory[]) ?? [];
const HUB_URL = faqData.hubUrl as string;
const HAS_CONTENT = CATEGORIES.some((c) => c.items.length > 0);

export default function FaqPage() {
  return (
    <div className="container-page pt-12 pb-16 sm:pt-16">
      <p className="eyebrow text-aurora-cyan">Iceland Eclipse</p>
      <h1 className="mt-4 font-display font-extrabold uppercase text-moon-white text-[clamp(2rem,7vw,3.5rem)] leading-[0.95] tracking-[-0.035em]">
        Attendee FAQ
      </h1>
      <p className="mt-4 max-w-xl text-moon-white/70 leading-relaxed">
        Answers on travel, packing, campgrounds, meals and the programme. Tap a
        question to expand.
      </p>

      <div className="mt-10 space-y-10">
        {CATEGORIES.map((cat) => (
          <section key={cat.title}>
            <h2 className="eyebrow text-solar-corona">{cat.title}</h2>
            {cat.items.length > 0 ? (
              <div className="mt-3 divide-y divide-moon-white/10 overflow-hidden rounded-[20px] border border-moon-white/10 bg-deep-space/40">
                {cat.items.map((item, i) => (
                  <details key={i} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-moon-white hover:bg-moon-white/5">
                      <span className="font-display text-sm font-bold uppercase tracking-[-0.01em]">
                        {item.question}
                      </span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-moon-white/50 transition-transform group-open:rotate-45">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                    </summary>
                    <div className="whitespace-pre-line px-5 pb-4 text-sm leading-relaxed text-moon-white/75">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <a
                href={HUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-between gap-4 rounded-[20px] border border-moon-white/10 bg-deep-space/40 px-5 py-4 text-sm text-moon-white/70 hover:border-moon-white/25"
              >
                View these questions on the Iceland Eclipse FAQ hub
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            )}
          </section>
        ))}
      </div>

      {!HAS_CONTENT && (
        <p className="mt-10 text-xs text-moon-white/40">
          Full answers are syncing from the Iceland Eclipse FAQ hub.
        </p>
      )}
    </div>
  );
}
