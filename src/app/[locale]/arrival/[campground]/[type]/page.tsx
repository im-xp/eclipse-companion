import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CAMPGROUNDS, SHARED, getAccommodation } from "@/data/arrival";
import { renderInline } from "@/lib/inline";
import { LOCALES } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string; campground: string; type: string }>;
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    CAMPGROUNDS.flatMap((c) =>
      c.accommodations.map((a) => ({ locale, campground: c.slug, type: a.slug }))
    )
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { campground, type } = await params;
  const found = getAccommodation(campground, type);
  return {
    title: found
      ? `${found.accommodation.name} — Arrival Instructions`
      : "Accommodation Arrival Instructions",
    robots: { index: false, follow: false },
  };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-extrabold uppercase tracking-[-0.02em] text-moon-white">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 leading-relaxed text-moon-white/75">
          <span
            aria-hidden
            className="mt-[0.65em] size-1.5 shrink-0 rotate-45 bg-aurora-cyan/70"
          />
          <span>{renderInline(item)}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function AccommodationPage({ params }: PageProps) {
  const { campground: cSlug, type } = await params;
  const found = getAccommodation(cSlug, type);
  if (!found) notFound();
  const { campground, accommodation: a } = found;

  return (
    <div className="container-page">
      <div className="mx-auto max-w-2xl pb-20">
        <section className="pt-12 pb-8 sm:pt-16">
          <Link
            href={`/arrival/${campground.slug}`}
            className="eyebrow inline-flex items-center gap-2 text-moon-white/50 transition-colors hover:text-moon-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            {campground.name}
          </Link>
          <h1 className="mt-4 font-display font-extrabold uppercase text-moon-white text-[clamp(1.75rem,5.5vw,2.75rem)] leading-[1] tracking-[-0.03em]">
            {a.name}
          </h1>
          <p className="mt-3 leading-relaxed text-moon-white/70">{a.blurb}</p>
        </section>

        {a.review && (
          <div className="mb-8 rounded-[14px] border border-solar-corona/50 bg-solar-corona/10 px-5 py-4">
            <p className="eyebrow text-solar-corona">Needs confirming</p>
            <p className="mt-2 text-sm leading-relaxed text-moon-white/80">{a.review}</p>
          </div>
        )}

        {/* The dates are the whole point of the page — first thing after the title,
            and the only element with a filled background. */}
        <div className="rounded-[18px] border border-aurora-cyan/40 bg-aurora-cyan/5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="eyebrow text-moon-white/60">Access begins</p>
              <p className="mt-1.5 font-display text-xl font-extrabold uppercase tracking-[-0.01em] text-moon-white">
                {SHARED.accessBegins}
              </p>
            </div>
            <div>
              <p className="eyebrow text-solar-corona">
                {a.mustReturn ? "Return by" : "Check out"}
              </p>
              <p className="mt-1.5 font-display text-xl font-extrabold uppercase tracking-[-0.01em] text-solar-corona">
                {a.checkOut}
              </p>
              <p className="mt-0.5 text-sm text-moon-white/70">
                by {SHARED.checkOutTime}
              </p>
            </div>
          </div>
          {a.mustReturn && (
            <p className="mt-5 border-t border-aurora-cyan/20 pt-4 text-sm leading-relaxed text-moon-white/75">
              <strong className="font-semibold text-moon-white">
                This unit has to come back to us.
              </strong>{" "}
              Turnkey campers, caravans and RVs check out a day earlier than the tents
              so our team can collect and turn them around.
            </p>
          )}
          {a.occupancy && (
            <p className="mt-4 text-sm text-moon-white/70">
              Maximum occupancy: <strong className="text-moon-white">{a.occupancy}</strong>
            </p>
          )}
        </div>

        <div className="mt-12 space-y-10">
          <Section title="What's included">
            <Bullets items={a.includes} />
          </Section>

          {a.notes && (
            <Section title="Good to know">
              <Bullets items={a.notes} />
            </Section>
          )}

          <Section title="Checking in">
            <ol className="space-y-3">
              {campground.checkIn.map((step, i) => (
                <li key={i} className="flex gap-3.5 leading-relaxed text-moon-white/75">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-aurora-cyan/50 font-mono text-[10px] font-bold text-aurora-cyan">
                    {i + 1}
                  </span>
                  <span>{renderInline(step)}</span>
                </li>
              ))}
            </ol>
            <p className="pt-1 text-sm text-moon-white/60">
              Your camping hub is the {renderInline(`**${campground.hub}**`)}.
            </p>
            <Bullets items={campground.hubAmenities} />
          </Section>

          <Section title="Power and adapters">
            <Bullets items={campground.power} />
          </Section>

          <Section title="Getting here">
            {SHARED.gettingHere.map((p, i) => (
              <p key={i} className="leading-relaxed text-moon-white/75">
                {p}
              </p>
            ))}
            <p className="pt-1 text-sm text-moon-white/60">
              Transport from the airport is not automatically included with your housing
              reservation. You have two options:
            </p>
            <Bullets items={SHARED.transport} />
            <p className="leading-relaxed text-moon-white/75">{SHARED.gettingAround}</p>
          </Section>

          <Section title="Before you arrive">
            <Bullets items={SHARED.beforeYouArrive} />
          </Section>

          <section className="rounded-[16px] border border-moon-white/10 bg-deep-space/50 px-5 py-5">
            <p className="text-sm leading-relaxed text-moon-white/70">
              Questions about your accommodation? Email the Iceland Eclipse Camping Team
              at{" "}
              <a
                href={`mailto:${SHARED.contact}`}
                className="text-aurora-cyan underline decoration-aurora-cyan/40 underline-offset-2"
              >
                {SHARED.contact}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
