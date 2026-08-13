// Accommodation arrival instructions — the content of the camping team's two
// "[TEMPLATE] ... CAMPING ARRIVAL INSTRUCTIONS" docs, restructured so a guest
// can find only their own accommodation instead of reading past everyone else's.
//
// Public since 2026-08-08: linked from /guides so guests can reach it without
// the URL. Still not in AppNav — it's a pre-arrival read, not a during-event tab.
//
// Copy is English-only and deliberately kept out of lib/i18n — the page body has
// no dictionary entries to mirror in is.ts. Only the /guides card that points
// here is translated. Icelandic guests get an English page; translating the full
// arrival copy is open work, not a regression.

export type Group = "glamping" | "camping" | "rv";

export const GROUP_LABELS: Record<Group, string> = {
  glamping: "Glamping",
  camping: "Camping",
  rv: "RVs, Campers & Caravans",
};

export interface Accommodation {
  slug: string;
  name: string;
  group: Group;
  /** One line under the name in the list and on the detail hero. */
  blurb: string;
  includes: string[];
  /** Check-out date. Turnkey units are 16 Aug because IMXP collects them back. */
  checkOut: string;
  /** True for units IMXP owns and must recover — drives the stronger callout. */
  mustReturn?: boolean;
  /** Only where the source states a real number for this booking. */
  occupancy?: string;
  notes?: string[];
  /** Shown as an unresolved-question chip for reviewers. */
  review?: string;
}

export interface Campground {
  slug: string;
  name: string;
  icelandic: string;
  tagline: string;
  /** Which accommodations live here, in list order. */
  accommodations: Accommodation[];
  hub: string;
  hubAmenities: string[];
  checkIn: string[];
  /** Where and when to collect credentials. Same for both campgrounds. */
  boxOffice: string[];
  power: string[];
}

const ACCESS_BEGINS = "9 August 2026, 12:00";
const CHECKOUT_TIME = "10:00";
// The box office moves mid-week (Pam, 2026-08-08): camping box office at
// Daybreak for the arrival days, festival box office once the gates open.
// Kept out of `checkIn` so the numbered steps stay actions, not reference info.
const BOX_OFFICE = [
  "**9–12 August** — the camping box office, outside the Daybreak hub.",
  "**13–15 August** — the camping box office is closed. Credentials move to the **festival box office, next to the main gate**.",
  // 13–15 Aug moved to a 12:00 open (Regan, 2026-08-13). The 10–12 Aug camping
  // box office kept its 10:00 open, but those days have passed.
  "**Hours** — 10:00 – 22:00 through 12 August, then 12:00 – 22:00 at the festival box office. If you are driving in, plan to arrive within these hours.",
];
const HOST_STAND = "24/7 on-site Host Stand for guest support";
const CONCIERGE = "Exclusive 24/7 on-site concierge";

export const CAMPGROUNDS: Campground[] = [
  {
    slug: "daybreak",
    name: "Daybreak",
    icelandic: "Dagsbrún",
    tagline: "Base camping area. Glamping, tents, and self-drive campers.",
    hub: "Base Camping Hub “DAYBREAK”",
    hubAmenities: [
      "Reception desk for check-in on arrival",
      "Bathrooms and showers",
      "Charging stations",
      "Medical and security",
      "Food vendor",
    ],
    checkIn: [
      "Pick up your festival wristband and your camping wristband at the box office.",
      "Once you have your credentials, go to the **Concierge Desk** to check into your accommodation. Our team will escort you from there.",
    ],
    boxOffice: BOX_OFFICE,
    power: [
      "**This area does not have power.** Prepare accordingly.",
      "US hair dryers, curling irons, clothing steamers and electric toothbrushes will burn out, overheat, break or cause a fire if plugged in. Leave them at home.",
      "For charging phones, cameras and computers you need a standard European two-round-prong adapter (**type C or F**).",
    ],
    accommodations: [
      {
        slug: "base-glamping-queen",
        name: "Base Glamping — Queen",
        group: "glamping",
        blurb: "Pre-set bell tent with a real queen bed.",
        includes: [
          "(2) Campground Passes, providing access from 9 to 16 August",
          "Pre-set 5m bell-style tent rental",
          "Real bed with queen-sized mattress and bedding, including pillows, pillowcases, sheets, comforter and extra blanket",
          "(1) side table and (2) chairs",
          "(1) battery-operated lantern and tent lock",
          "Access to free hot showers",
          HOST_STAND,
        ],
        checkOut: "17 August 2026",
        occupancy: "2 people",
      },
      {
        slug: "base-glamping-twins",
        name: "Base Glamping — 2 Twins",
        group: "glamping",
        blurb: "Pre-set bell tent with two real twin beds.",
        includes: [
          "(2) Campground Passes, providing access from 9 to 16 August",
          "Pre-set 5m bell-style tent rental",
          "Real beds with twin-sized mattresses and bedding, including pillows, pillowcases, sheets, comforter and extra blanket",
          "(1) side table and (2) chairs",
          "(1) battery-operated lantern and tent lock",
          "Access to free hot showers",
          HOST_STAND,
        ],
        checkOut: "17 August 2026",
        occupancy: "2 people",
      },
      {
        slug: "easy-camping-2",
        name: "Easy Camping — 2 People",
        group: "camping",
        blurb: "Pre-set tipi tent with pads and sleeping bags.",
        includes: [
          "(2) Campground Passes, providing access from 9 to 16 August",
          "Pre-set 4m tipi-style tent rental",
          "Closed-cell foam pads and insulated sleeping bags for Iceland's cool nights",
          "Battery-operated lantern and tent lock",
          "No furniture included",
        ],
        checkOut: "17 August 2026",
        occupancy: "2 people",
      },
      {
        slug: "easy-camping-4",
        name: "Easy Camping — 4 People",
        group: "camping",
        blurb: "Pre-set tipi tent with pads and sleeping bags.",
        includes: [
          "(4) Campground Passes, providing access from 9 to 16 August",
          "Pre-set 4m tipi-style tent rental",
          "Closed-cell foam pads and insulated sleeping bags for Iceland's cool nights",
          "Battery-operated lantern and tent lock",
          "No furniture included",
        ],
        checkOut: "17 August 2026",
        occupancy: "4 people",
      },
      {
        slug: "easy-camping-6",
        name: "Easy Camping — 6 People",
        group: "camping",
        blurb: "Pre-set tipi tent with pads and sleeping bags.",
        includes: [
          "(6) Campground Passes, providing access from 9 to 16 August",
          "Pre-set 4m tipi-style tent rental",
          "Closed-cell foam pads and insulated sleeping bags for Iceland's cool nights",
          "Battery-operated lantern and tent lock",
          "No furniture included",
        ],
        checkOut: "17 August 2026",
        occupancy: "6 people",
      },
      {
        slug: "grab-and-go-1",
        name: "Grab & Go — 1 Person",
        group: "camping",
        blurb: "Gear rental you pitch yourself. Campground pass sold separately.",
        includes: [
          "2-person tent",
          "Closed-cell foam pad and insulated sleeping bag",
          "No furniture included",
          "**Campground pass required — sold separately**",
        ],
        checkOut: "17 August 2026",
        notes: [
          "This is a gear rental, not a campground assignment. Your campground pass is a separate purchase.",
        ],
      },
      {
        slug: "grab-and-go-2",
        name: "Grab & Go — 2 People",
        group: "camping",
        blurb: "Gear rental you pitch yourself. Campground passes sold separately.",
        includes: [
          "4-person tent",
          "(2) closed-cell foam pads and insulated sleeping bags",
          "No furniture included",
          "**Campground passes required — sold separately**",
        ],
        checkOut: "17 August 2026",
        notes: [
          "This is a gear rental, not a campground assignment. Your campground passes are a separate purchase.",
        ],
      },
      {
        slug: "self-drive-camper",
        name: "Self Drive Camper — Parking Pass",
        group: "rv",
        blurb: "Bring your own camper. Parking spot approximately 6m × 10m.",
        includes: [
          "(4) Drive-in Campground Passes, providing access from 9 to 17 August",
          "Camper parking spot measuring approximately 6m by 10m",
          "**No re-entry.** For safety reasons your camper must remain parked in the campground until final exit. If you want to explore the area before the festival, use the main parking lot.",
          "Does not include power or water hook-ups",
          "Access to nearby private WC and showers",
          HOST_STAND,
        ],
        checkOut: "17 August 2026",
      },
      {
        slug: "self-drive-rv-caravan",
        name: "Self-Drive RV or Caravan — Parking Pass",
        group: "rv",
        blurb: "Bring your own RV or caravan. Parking spot approximately 6m × 15m.",
        includes: [
          "(4) Drive-in Campground Passes, providing access from 9 to 17 August",
          "Camper parking spot measuring approximately 6m by 15m",
          "**No re-entry.** For safety reasons your camper must remain parked in the campground until final exit. If you want to explore the area before the festival, use the main parking lot.",
          "Does not include power or water hook-ups",
          "Access to nearby private WC and showers",
          HOST_STAND,
        ],
        checkOut: "17 August 2026",
      },
    ],
  },
  {
    slug: "moonrise",
    name: "Moonrise",
    icelandic: "Tunglið Rís",
    tagline: "Premium camping area. Premium glamping and turnkey RVs, campers and caravans.",
    hub: "Premium Camping Hub “MOONRISE”",
    hubAmenities: [
      "Reception desk for check-in on arrival",
      "Bathrooms and showers",
      "Charging stations",
      "Medical and security",
      "Food vendor",
    ],
    checkIn: [
      "Pick up your festival wristband and your premium camping wristband at the box office.",
      "Once you have your credentials, take a **shuttle to the Moonrise camping hub** to check into your accommodation. Our team will escort you from there.",
    ],
    boxOffice: BOX_OFFICE,
    power: [
      "Premium tents include an in-tent electrical outlet (10 Amp) for charging small electronic devices.",
      "US hair dryers, curling irons, clothing steamers and electric toothbrushes will burn out, overheat, break or cause a fire if plugged in. Don't bring them — you can use the hair dryers provided in the Moonrise hub.",
      "For charging phones, cameras and computers you need a standard European two-round-prong adapter (**type C or F**).",
    ],
    accommodations: [
      {
        slug: "premium-glamping",
        name: "Premium Glamping",
        group: "glamping",
        blurb: "Pre-set bell tent with a real bed and in-tent power.",
        includes: [
          "(2) Campground Passes, providing access from 9 to 16 August",
          "Pre-set 5m bell-style tent rental",
          "Real mattress and bedding, including pillows, pillowcases, sheets, comforter and extra blanket",
          "In-tent electrical outlet (10 Amp) for charging small electronic devices",
          "(1) side table and (2) chairs",
          "(1) battery-operated lantern and tent lock",
          "Access to free hot showers",
          HOST_STAND,
        ],
        checkOut: "17 August 2026",
        occupancy: "2 people",
      },
      {
        slug: "turnkey-camper",
        name: "Turnkey Camper",
        group: "rv",
        blurb: "Camper set up for you, for 2, 3 or 4 people.",
        includes: [
          "(2, 3 or 4) Premium Campground Passes, providing access from 9 to 16 August",
          "Access to exclusive lounge with power and wifi",
          "Private, premium restrooms and showers",
          CONCIERGE,
        ],
        checkOut: "16 August 2026",
        mustReturn: true,
      },
      {
        slug: "turnkey-caravan",
        name: "Turnkey Caravan",
        group: "rv",
        blurb: "Caravan set up for you, with power and water.",
        includes: [
          "(4) Premium Campground Passes, providing access from 9 to 16 August",
          "Power hook-ups and full tank of water",
          "Access to exclusive lounge with power and wifi",
          "Private, premium restrooms and showers",
          CONCIERGE,
        ],
        checkOut: "16 August 2026",
        mustReturn: true,
      },
      {
        slug: "turnkey-rv",
        name: "Turnkey RV",
        group: "rv",
        blurb: "RV set up for you, for 2, 4 or 6 people, with power and water.",
        includes: [
          "(2, 4 or 6) Premium Campground Passes, providing access from 9 to 16 August",
          "Power hook-ups and full tank of water",
          "Access to exclusive lounge with power and WiFi",
          "Private, premium restrooms and showers",
          CONCIERGE,
        ],
        checkOut: "16 August 2026",
        mustReturn: true,
      },
    ],
  },
];

/** Shared across every accommodation — the parts of the docs that never varied. */
export const SHARED = {
  accessBegins: ACCESS_BEGINS,
  checkOutTime: CHECKOUT_TIME,
  gettingHere: [
    "Most guests arrive through Keflavík International Airport (KEF). The drive out to the peninsula is one of the most beautiful stretches in Iceland, and we recommend giving yourself plenty of time to enjoy it.",
    "The drive from KEF is approximately 3.5 hours. Times shift with weather, road conditions and eclipse-week traffic, so a little buffer goes a long way.",
  ],
  transport: [
    "**Rent a vehicle** for full flexibility during your stay. A parking pass is required, and all parking is a short shuttle ride from the festival site and campgrounds.",
    "**Or buy an Iceland Eclipse shuttle pass**, which brings you to the Box Office.",
  ],
  gettingAround:
    "Once you're settled, the festival grounds are walkable — approximately 800 meters from your campsite to the festival entrance.",
  beforeYouArrive: [
    "As your travel plans come together, let our team know your anticipated arrival date and approximate arrival time. Arrival times vary heavily with travel delays, and it helps us know when to expect you.",
    "Add your accommodation guest to your booking so they can check in without you present if you're delayed.",
    "**Don't forget your eye mask.** It barely gets dark in August.",
  ],
  contact: "hallo@icelandeclipse.com",
};

export function getCampground(slug: string): Campground | undefined {
  return CAMPGROUNDS.find((c) => c.slug === slug);
}

export function getAccommodation(
  campgroundSlug: string,
  slug: string
): { campground: Campground; accommodation: Accommodation } | undefined {
  const campground = getCampground(campgroundSlug);
  const accommodation = campground?.accommodations.find((a) => a.slug === slug);
  return campground && accommodation ? { campground, accommodation } : undefined;
}
