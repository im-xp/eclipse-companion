export const CONFIRMED_PROFILE_BONUS = 100;

export const CONTACT_KEYS = [
  "phone",
  "telegram",
  "whatsapp",
  "instagram",
  "x",
  "linkedin",
  "facebook",
  "spotify",
  "youtube",
  "tiktok",
  "soundcloud",
] as const;

export type ContactKey = (typeof CONTACT_KEYS)[number];

export type ContactChannels = Partial<Record<ContactKey, string>>;

export const CONTACT_FIELDS: Array<{
  key: ContactKey;
  label: string;
  placeholder: string;
  group: "comms" | "social";
}> = [
  { key: "phone", label: "Phone", placeholder: "+354 …", group: "comms" },
  { key: "telegram", label: "Telegram", placeholder: "@handle", group: "comms" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "+354 …", group: "comms" },
  { key: "instagram", label: "Instagram", placeholder: "@handle", group: "social" },
  { key: "x", label: "X (Twitter)", placeholder: "@handle", group: "social" },
  { key: "linkedin", label: "LinkedIn", placeholder: "profile URL or handle", group: "social" },
  { key: "facebook", label: "Facebook", placeholder: "profile URL or handle", group: "social" },
  { key: "spotify", label: "Spotify", placeholder: "artist/user link", group: "social" },
  { key: "youtube", label: "YouTube", placeholder: "@channel", group: "social" },
  { key: "tiktok", label: "TikTok", placeholder: "@handle", group: "social" },
  { key: "soundcloud", label: "SoundCloud", placeholder: "profile link", group: "social" },
];

export function isProfileConfirmed(
  contacts: ContactChannels | null
): boolean {
  return Boolean(
    contacts && Object.values(contacts).some((v) => v && v.trim())
  );
}
