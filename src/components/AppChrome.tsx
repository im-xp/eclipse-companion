"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDict } from "@/lib/i18n/LocaleProvider";
import type { Dict } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

const navItems = (dict: Dict) => [
  {
    href: "/",
    label: dict.nav.home,
    // exact: "/" is a prefix of every path, so match it exactly or Home would
    // stay highlighted on Map/Schedule/Guides too.
    exact: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    ),
  },
  {
    href: "/map",
    label: dict.nav.map,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </svg>
    ),
  },
  {
    href: "/schedule",
    label: dict.nav.schedule,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/guides",
    label: dict.nav.guides,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
    ),
  },
];

// The proxy rewrite means SSR sees /en/... or /is/... while the browser URL is
// clean — normalize so active-state matches on both passes.
function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(en|is)(?=\/|$)/, "") || "/";
}

export function AppHeader() {
  const dict = useDict();
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-moon-white/10 backdrop-blur-md bg-eclipse-black/70">
      <div className="container-page flex items-center justify-between h-16 gap-4">
        <Link href="/" className="flex items-center gap-2 leading-none" aria-label="Iceland Eclipse home">
          <Image
            src="/iceland-eclipse-logo.png"
            alt="Iceland Eclipse"
            width={140}
            height={54}
            className="h-7 w-auto"
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center gap-7 eyebrow text-moon-white/80">
          {navItems(dict).map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-moon-white transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <span className="flex items-center gap-3">
          <span className="eyebrow hidden text-ash-grey sm:inline">
            {dict.nav.dates}
          </span>
          <LanguageToggle />
        </span>
      </div>
    </header>
  );
}

export function AppNav() {
  const dict = useDict();
  const pathname = stripLocale(usePathname());
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-moon-white/10 backdrop-blur-md bg-eclipse-black/80 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {navItems(dict).map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                active ? "text-signal-yellow" : "text-moon-white/60 hover:text-moon-white"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
