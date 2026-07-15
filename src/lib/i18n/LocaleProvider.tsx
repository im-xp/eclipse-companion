"use client";

import { createContext, useContext } from "react";
import { getDict, type Dict, type Locale } from "@/lib/i18n";

// Locale is fixed per request (domain + geo decide it in src/proxy.ts), so a
// plain context mounted in the root layout is all client components need —
// there is no user-facing switcher.
const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useDict(): Dict {
  return getDict(useContext(LocaleContext));
}
