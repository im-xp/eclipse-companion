import { getDict, type Locale } from "@/lib/i18n";

export interface StageStyle {
  color: string;
  label: string;
  sub?: string;
}

// sub = Icelandic name (Andrew 2026-07-06: Icelandic names replace the venue
// descriptors). Full list confirmed by Elliot 2026-07-07. Campsite Yoga,
// Röstin, and Side Quests have no Icelandic name yet, so they keep descriptors.
export const STAGE_STYLES: Record<string, StageStyle> = {
  "ECLIPSE (Main Stage)": { color: "#f7f4ea", label: "Eclipse", sub: "Sólmyrkvi" },
  "AURORA (Electronic Tent)": { color: "#ff5bce", label: "Aurora", sub: "Norðurljós" },
  POLARIS: { color: "#5a9df0", label: "Polaris", sub: "Pólstjarnan" },
  "AFTERGLOW (Dome)": { color: "#ffc85a", label: "Afterglow", sub: "Eftirljómi" },
  "SACRED FIRE": { color: "#f47a3d", label: "Sacred Fire", sub: "Eldhringurinn" },
  "COSMIC CONNECTION (Wellness)": { color: "#9b74d8", label: "Cosmic Connection", sub: "Samhljómur" },
  "CAMPSITE YOGA": { color: "#1fe0d0", label: "Daybreak" },
  "STARSEEDS (Kids & Family)": { color: "#8fe08a", label: "Starseeds", sub: "Stjörnuskátar" },
  "Röstin Film Premiers": { color: "#efff2a", label: "Röstin", sub: "Film Premieres" },
  "SIDE QUESTS": { color: "#9bd1ff", label: "Side Quests", sub: "Ticketed Add-On" },
};

export function stageStyle(stage: string, locale: Locale = "en"): StageStyle {
  const style = STAGE_STYLES[stage] ?? { color: "#a7aaa6", label: stage };
  // Stage names are proper names and stay untouched; only the two English
  // descriptor subs (Film Premieres, Ticketed Add-On) localize. Icelandic-name
  // subs pass through the (empty) lookup unchanged.
  if (locale !== "en" && style.sub) {
    const sub = getDict(locale).stageSubs[style.sub];
    if (sub) return { ...style, sub };
  }
  return style;
}

// Content-type tags on schedule cards: Elliot's color-coding compromise
// (2026-07-06 thread) — stage keeps the card's color identity, the category
// rides along as a small colored tag.
export const CATEGORY_COLORS: Record<string, string> = {
  Dance: "#ff5bce",
  "Inner Space": "#9b74d8",
  "Cosmic Space": "#1fe0d0",
  "Outer Space": "#5a9df0",
  "Digital Space": "#efff2a",
  "Community Space": "#8fe08a",
};

export function categoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#a7aaa6";
}
