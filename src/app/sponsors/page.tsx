import type { Metadata } from "next";
import sponsorsData from "@/data/sponsors.json";

export const metadata: Metadata = {
  title: "Partners — Iceland Eclipse",
  description:
    "The partners and producers making the Iceland Eclipse gathering possible.",
};

type Partner = {
  name: string;
  category: string;
  website: string | null;
  logo: string | null;
};
type Group = { title: string; partners: Partner[] };

const GROUPS = (sponsorsData.groups as Group[]) ?? [];

// Most partners have a sourced logo; the few without a sourceable asset
// (e.g. Askur, Audiopool, Vivobarefoot, Secret Solstice) fall back to a
// wordmark tile built from the initials.
function initials(name: string): string {
  return name
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function PartnerCard({ partner }: { partner: Partner }) {
  const inner = (
    <>
      <div className="flex h-24 items-center justify-center rounded-xl bg-moon-white/5 px-3">
        {partner.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={partner.logo}
            alt={partner.name}
            loading="lazy"
            className="max-h-16 max-w-full w-auto object-contain"
          />
        ) : (
          <span className="font-display text-2xl font-extrabold uppercase tracking-[-0.02em] text-moon-white/80">
            {initials(partner.name)}
          </span>
        )}
      </div>
      <div className="mt-3">
        <span className="block font-display text-base font-extrabold uppercase leading-tight tracking-[-0.01em] text-moon-white">
          {partner.name}
        </span>
        <span className="mt-0.5 block text-xs text-moon-white/55">
          {partner.category}
        </span>
      </div>
    </>
  );

  const className =
    "group block rounded-[20px] border border-moon-white/10 bg-deep-space/60 p-4 transition-all duration-200 hover:border-moon-white/25 hover:-translate-y-0.5";

  return partner.website ? (
    <a
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {inner}
    </a>
  ) : (
    <div className={className}>{inner}</div>
  );
}

export default function SponsorsPage() {
  return (
    <div className="container-page pt-12 pb-16 sm:pt-16">
      <p className="eyebrow text-aurora-cyan">Iceland Eclipse</p>
      <h1 className="mt-4 font-display font-extrabold uppercase text-moon-white text-[clamp(2rem,7vw,3.5rem)] leading-[0.95] tracking-[-0.035em]">
        Partners &amp; Producers
      </h1>
      <p className="mt-4 max-w-xl text-moon-white/70 leading-relaxed">
        The partners and producers making the gathering possible.
      </p>

      {GROUPS.map((group) => (
        <section key={group.title} className="mt-12">
          <h2 className="eyebrow text-solar-corona">{group.title}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {group.partners.map((p) => (
              <PartnerCard key={p.name} partner={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
