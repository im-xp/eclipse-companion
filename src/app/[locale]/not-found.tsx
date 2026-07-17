import Link from "next/link";
import { getDict } from "@/lib/i18n";

// not-found can't read params, and the locale context isn't available here
// (it renders outside the page tree on 404s), so this stays English-leaning —
// both languages shown keeps it honest for either domain.
export default function NotFound() {
  const en = getDict("en");
  const is = getDict("is");
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="eyebrow text-aurora-cyan">404</p>
      <h1 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-[-0.02em] text-moon-white">
        {en.notFound.title}
      </h1>
      <p className="mt-2 text-sm text-moon-white/60">{is.notFound.title}</p>
      <Link
        href="/"
        className="mt-8 rounded-pill border border-signal-yellow bg-signal-yellow px-6 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-eclipse-black transition-colors hover:bg-solar-corona"
      >
        {en.notFound.backHome} · {is.notFound.backHome}
      </Link>
    </div>
  );
}
