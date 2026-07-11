"use client";

// Save/unsave toggle used on schedule events and in the detail sheet. Filled
// heart = saved. Stops click propagation so tapping it never also opens/closes
// the surrounding event card or sheet.
export function HeartButton({
  active,
  onToggle,
  size = 18,
  className = "",
}: {
  active: boolean;
  onToggle: () => void;
  size?: number;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remove from saved" : "Save event"}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`flex shrink-0 items-center justify-center rounded-full transition-colors ${
        active
          ? "text-signal-yellow"
          : "text-moon-white/45 hover:text-moon-white"
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21s-7.5-4.6-10-9.5C.8 8 2.6 5 6 5c2.1 0 3.4 1.2 4.5 2.6C11.6 6.2 12.9 5 15 5c3.4 0 5.2 3 4 6.5C21.5 16.4 12 21 12 21z" />
      </svg>
    </button>
  );
}
