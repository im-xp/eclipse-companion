import lineupData from "@/data/lineup.json";

export type SocialPlatform =
  | "instagram"
  | "twitter"
  | "facebook"
  | "youtube"
  | "spotify"
  | "soundcloud"
  | "bandcamp"
  | "tiktok"
  | "linkedin"
  | "vimeo"
  | "substack"
  | "bluesky"
  | "website";

export interface SocialLink {
  platform: SocialPlatform | string;
  href: string;
}

interface LineupEntry {
  name: string;
  socials: SocialLink[];
}

/**
 * Normalize a participant name to a join key. Must stay in sync with
 * `normalize()` in src/scripts/scrape_lineup.py so schedule.json artists match
 * the lineup-page entries: drop parentheticals ("Quantic (DJ set)"), strip
 * accents and honorifics ("…, Dr."), fold "&"→"and", and keep alphanumerics.
 */
export function normalizeName(name: string): string {
  return name
    .replace(/\(.*?\)/g, " ")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/,?\s*\b(dr|prof|professor|phd|md|sir|dame)\.?\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const socialsByName = new Map<string, SocialLink[]>(
  (lineupData as LineupEntry[]).map((e) => [normalizeName(e.name), e.socials])
);

/** Social links scraped from the public lineup page for this artist, if any. */
export function getSocials(artist: string): SocialLink[] {
  return socialsByName.get(normalizeName(artist)) ?? [];
}
