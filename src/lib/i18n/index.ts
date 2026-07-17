import en, { type Dict } from "./en";
import is from "./is";

export type { Dict };

export const LOCALES = ["en", "is"] as const;
export type Locale = (typeof LOCALES)[number];

const DICTS: Record<Locale, Dict> = { en, is };

/** Coerce a route param (plain string) to a supported locale. */
export function asLocale(value: string): Locale {
  return value === "is" ? "is" : "en";
}

export function getDict(locale: Locale): Dict {
  return DICTS[locale];
}
