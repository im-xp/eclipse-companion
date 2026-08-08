import type { Locale } from "@/lib/i18n";
import { ARTICLES_IS } from "./articles.is";

export type ArticleCategory = "quick-guides" | "highlights-news";

export type ArticleBlock =
  | { kind: "p"; text: string }
  | { kind: "lede"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "checklist"; id: string; title: string; note?: string; items: string[] }
  | { kind: "image"; src: string; alt: string }
  | { kind: "facts"; rows: { label: string; value: string }[] }
  | { kind: "cta"; label: string; href: string };

export interface ArticleSection {
  id: string;
  title?: string;
  blocks: ArticleBlock[];
}

export interface Article {
  slug: string;
  title: string;
  /** Optional deck under the hero title. */
  subtitle?: string;
  category: ArticleCategory;
  hero: string;
  heroAlt: string;
  summary: string;
  sectionNav?: boolean;
  sections: ArticleSection[];
  /**
   * Hide from the guides list and 404 the detail page for this locale only.
   * Lets an unreviewed translation sit in articles.is.ts — which check_i18n
   * requires to stay structurally mirrored 1:1 — without publishing it. Not a
   * fingerprinted key, so setting it on one side never trips the prebuild gate.
   */
  draft?: boolean;
}

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  "quick-guides": "Quick Guides",
  "highlights-news": "Highlights & News",
};

const EVERYONE_BRINGS = "Everything in the Packing Guide's Everyone Brings list";

export const ARTICLES: Article[] = [
  {
    slug: "know-before-you-go",
    title: "Arrival Guide",
    subtitle: "Know Before You Go",
    category: "quick-guides",
    hero: "/articles/know-before-you-go.jpg",
    heroAlt: "Aerial view of the Snæfellsnes coast at dusk, the road running in past the village",
    summary:
      "Addresses, shuttles, parking, box office hours, and everything else you need for the journey in.",
    sectionNav: true,
    sections: [
      {
        id: "arrival",
        title: "Arrival & Address",
        blocks: [
          {
            kind: "facts",
            rows: [
              { label: "Festival", value: "Útnesvegur 360, 360 Hellissandur, Iceland" },
              { label: "Baggage", value: "Snæfellsás 2, 360 Hellissandur (delayed baggage delivery)" },
              { label: "Campground", value: "Opens 9 August, 12:00" },
              { label: "Ceremony", value: "Opening Ceremony 11 August, 16:00" },
            ],
          },
        ],
      },
      {
        id: "getting-there",
        title: "Getting There",
        blocks: [
          {
            kind: "list",
            items: [
              "**Reykjavík shuttle pickup** — Bus Stop #5, Harpa Concert Hall, Faxagata, 101 Reykjavík.",
              "**KEF Airport** — look for the Iceland Eclipse sign at Arrivals and the team will point you in the right direction.",
              "**Traffic on eclipse day (12 August) will be heavy.** Arrive before the 12th if possible.",
              "One shuttle runs on 12 August: departs KEF at 10:30, stops in Reykjavík at 11:30.",
            ],
          },
        ],
      },
      {
        id: "by-car",
        title: "Arriving by Car",
        blocks: [
          {
            kind: "list",
            items: [
              "When arriving at Rif Airport to park, you'll be issued a vehicle decal based on your accommodation and receive instructions from the attendant at the checkpoint.",
              "Cars cannot be brought into the campsite itself.",
              "Park in the designated lot and take the shuttle to load your belongings and get to your camping spot.",
            ],
          },
        ],
      },
      {
        id: "parking",
        title: "Parking",
        blocks: [
          {
            kind: "list",
            items: [
              "Off-site parking at Rif Airport: BIRF, W57J+33Q, Flugplatz, 360 Rif.",
              "The main lot is park-in-and-stay for the duration of the festival.",
              "A day visitor lot is available for in/out flexibility.",
              "**Parking pass required: US$50.**",
            ],
          },
        ],
      },
      {
        id: "box-office",
        title: "Box Office",
        blocks: [
          {
            kind: "facts",
            rows: [
              { label: "9 Aug", value: "**Camping box office**, outside the Daybreak hub · 12:00 – 22:00" },
              { label: "10–12 Aug", value: "**Camping box office**, outside the Daybreak hub · 10:00 – 22:00" },
              { label: "13–15 Aug", value: "**Festival box office**, next to the main gate · 10:00 – 22:00" },
            ],
          },
          {
            kind: "list",
            items: [
              "**From 13 August the camping box office is closed.** Collect your credentials at the festival box office next to the main gate.",
              "Guests not arriving on shuttles must plan to arrive within these hours.",
              "Guests arriving on shuttles will receive their credentials upon arrival, regardless of time.",
              "Questions: [hallo@icelandeclipse.com](mailto:hallo@icelandeclipse.com)",
            ],
          },
        ],
      },
      {
        id: "local-shuttle",
        title: "Local Shuttle",
        blocks: [
          {
            kind: "list",
            items: [
              "Runs every 45 minutes to an hour, connecting the festival grounds, the parking area, Rif, and Ólafsvík.",
              "Schedule varies by day — full schedule available in [the Schedule in this app](https://app.icelandeclipse.com/schedule).",
            ],
          },
        ],
      },
      {
        id: "campground-zones",
        title: "Campground Zones",
        blocks: [
          {
            kind: "list",
            items: [
              "**Daybreak zone** — Easy Camping, Base Glamping, BYO Tent, Grab n Go, and Self Drive guests.",
              "**Moonrise zone** — Premium Glamping, Turnkey RV, and Turnkey Camper guests.",
              "Wristbands will be checked at entry points.",
            ],
          },
        ],
      },
      {
        id: "food-market",
        title: "Food & Market",
        blocks: [
          {
            kind: "list",
            items: [
              "Breakfast and light lunch options available for purchase at the hubs from 9–11 August.",
              "Market vendors open from 11 August.",
              "Food vendors open 12:00 – 04:00 during the festival (12–15 August).",
              "Stock up on groceries in Reykjavík or Borgarnes on the drive in.",
              "An N1 store will be available with gas canisters, drinks, snacks, and more.",
            ],
          },
        ],
      },
      {
        id: "campsite-hubs",
        title: "Campsite Hubs",
        blocks: [
          {
            kind: "list",
            items: [
              "Hot water available in both the Daybreak and Moonrise hubs.",
              "Charging stations available in both hubs.",
              "Wi-Fi available in both hubs.",
              "Bring a power bank or solar charger as backup.",
            ],
          },
        ],
      },
      {
        id: "showers",
        title: "Showers",
        blocks: [
          {
            kind: "list",
            items: ["Showers available at 2,000 ISK per use."],
          },
        ],
      },
      {
        id: "atm",
        title: "ATM",
        blocks: [
          {
            kind: "list",
            items: ["ATMs available at the Mayor's office in Hellissandur and in Ólafsvík."],
          },
        ],
      },
      {
        id: "alcohol",
        title: "Alcohol",
        blocks: [
          {
            kind: "list",
            items: [
              "The limit is one case of beer and one box of wine per person.",
              "A limited personal quantity of spirits is permitted.",
              "No glass containers.",
              "The Duty Free store at KEF is located after Customs and just before baggage claim. The Duty Free store in the terminal is for departures only.",
            ],
          },
        ],
      },
      {
        id: "substances",
        title: "Substances",
        blocks: [
          {
            kind: "list",
            items: ["**Detection dogs will be on site. Substances are not permitted.**"],
          },
        ],
      },
      {
        id: "accessibility",
        title: "Accessibility",
        blocks: [
          {
            kind: "list",
            items: [
              "Accessibility credentials will be provided during check-in.",
              "Accessible restrooms across the site.",
              "Designated accessible viewing platforms at stages.",
              "First row of the local shuttle reserved for guests with accessibility needs.",
              "Mobility transport will be available on site — additional information will be shared at check-in.",
            ],
          },
        ],
      },
      {
        id: "laundry",
        title: "Laundry",
        blocks: [
          {
            kind: "list",
            items: [
              "No laundry facilities on site.",
              "Hand wash and hang dry only.",
            ],
          },
        ],
      },
      {
        id: "weather-packing",
        title: "Weather & Packing",
        blocks: [
          {
            kind: "list",
            items: [
              "Pack layers, a waterproof jacket, and warm sleepwear.",
              "August temps: 8–15°C days, 5–8°C nights.",
              "Sleep mask recommended (it barely gets dark in August).",
              "For charging phones, cameras and computers you need a standard European two-round-prong adapter (**type C or F**).",
              "**Iceland runs 230V. Leave US hair dryers, curling irons, clothing steamers and electric toothbrushes at home** — they will burn out, overheat, break or cause a fire. Hair dryers are provided in the Moonrise hub.",
              "Full packing guide available in [the Guides in this app](https://app.icelandeclipse.com/guides/packing-guide).",
            ],
          },
        ],
      },
      {
        id: "cameras",
        title: "Cameras",
        blocks: [
          {
            kind: "list",
            items: [
              "Personal cameras welcome for eclipse viewing on 12 August.",
              "Eclipse glasses provided to all attendees.",
            ],
          },
        ],
      },
      {
        id: "general",
        title: "General",
        blocks: [
          {
            kind: "list",
            items: [
              "Cashless festival — card payments only.",
              "Small portable gas stoves permitted in the campground.",
              "Gas canisters available at the N1 store.",
              "Questions about your booking, your accommodation, or anything else: [hallo@icelandeclipse.com](mailto:hallo@icelandeclipse.com)",
              "Festival Schedule: [app.icelandeclipse.com/schedule](https://app.icelandeclipse.com/schedule)",
              "Festival & Campground Map: [app.icelandeclipse.com/map](https://app.icelandeclipse.com/map)",
              "Festival Guides: [app.icelandeclipse.com/guides](https://app.icelandeclipse.com/guides)",
              "Download the official Iceland Eclipse app: [Eclipse Festival 2026 on the App Store](https://apps.apple.com/app/id6769218865)",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "packing-guide",
    title: "Packing Guide",
    category: "quick-guides",
    hero: "/articles/packing-guide.jpg",
    heroAlt: "Aerial view of Hellissandur on the Snæfellsnes coast",
    summary:
      "Layers, boots and everything else for Iceland's unpredictable weather. Tap items to check them off as you pack.",
    sections: [
      {
        id: "packing-list",
        title: "Packing List",
        blocks: [
          {
            kind: "lede",
            text:
              "You're preparing for a journey into Iceland's unpredictable weather and striking volcanic terrain. Whether you're layering up or finding your footing on the trails, our friends at Icelandic brand [66 North](http://66north.is) and global footwear brand [Vivo Barefoot](https://www.vivobarefoot.com/us/) are proud partners of Iceland Eclipse and have everything you need to adventure comfortably.",
          },
          {
            kind: "checklist",
            id: "clothing",
            title: "Clothing",
            note: "avoid cotton",
            items: [
              "Base layers (thermal or moisture-wicking)",
              "Wool or moisture-wicking socks (pack extras)",
              "Swimwear (for geothermal pools)",
              "Sunglasses",
            ],
          },
          {
            kind: "checklist",
            id: "outerwear",
            title: "Outerwear",
            items: [
              "Waterproof outer layer (jacket and pants)",
              "Warm mid-layer (fleece or wool)",
              "Warm hat and gloves",
            ],
          },
          {
            kind: "checklist",
            id: "footwear",
            title: "Footwear",
            items: [
              "Comfortable footwear for walking on site",
              "Sturdy, broken-in waterproof boots",
            ],
          },
          {
            kind: "checklist",
            id: "health",
            title: "Health & Toiletries",
            items: [
              "Sunscreen (UV is strong even on overcast days)",
              "Multi-purpose balm with SPF (Aquafor or Vaseline)",
              "Insect repellent (midges near water are harmless but persistent)",
              "Personal medications",
              "Basic first aid: blister pads, pain relievers, antacids",
              "Earplugs (one for music, one for sleeping)",
              "Eye mask (August nights are short)",
              "Hand sanitizer",
            ],
          },
          {
            kind: "checklist",
            id: "tech",
            title: "Tech & Power",
            items: [
              "Power bank",
              "Standard European two-round-prong adapter, type C or F (Iceland runs 230V)",
              "Waterproof case or dry bag for your phone",
              "Eclipse glasses (we'll provide certified viewers on-site)",
            ],
          },
          {
            kind: "checklist",
            id: "essentials",
            title: "Festival Essentials",
            items: [
              "Valid government-issued ID",
              "Bank card (cashless festival; ATM in Ólafsvík ~10 min away)",
              "Small day bag or backpack for carrying layers",
              "Secure bag or fanny pack for valuables on the main grounds",
              "Reusable water bottle (Icelandic tap water is exceptional)",
              "Snacks for travel days",
            ],
          },
        ],
      },
      {
        id: "leave-home",
        title: "Leave These at Home",
        blocks: [
          {
            kind: "list",
            items: [
              "Glass bottles or containers",
              "Drones",
              "Pets",
              "Chairs on the main festival grounds (fine in the campground)",
              "Outside alcohol into the main festival area",
              "**US hair dryers, curling irons, clothing steamers and electric toothbrushes.** On Iceland's 230V sockets they will burn out, overheat, break or cause a fire. Hair dryers are provided in the Moonrise hub.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "camping-guide",
    title: "Camping Guide",
    category: "quick-guides",
    hero: "/articles/camping-guide.jpg",
    heroAlt: "Rows of glamping bell tents at dusk",
    summary:
      "What's provided and what to bring for every accommodation, from general camping to turnkey RVs.",
    sectionNav: true,
    sections: [
      {
        id: "general-camping",
        title: "General Camping",
        blocks: [
          {
            kind: "lede",
            text:
              "You're setting up your own space. Pack for variable weather, volcanic terrain, and a few nights of genuine adventure.",
          },
          {
            kind: "checklist",
            id: "gc-shelter",
            title: "Shelter & Sleep",
            items: [
              "Tent rated for wind and rain (freestanding recommended)",
              "Sleeping bag rated to at least 0°C / 32°F",
              "Sleeping mat or pad",
              "Tent stakes rated for hard ground",
              "Dry bags to protect gear inside your tent",
              "Headlamp and extra batteries",
              "Tent lock",
              "Eye mask (it barely gets dark in August)",
            ],
          },
          {
            kind: "checklist",
            id: "gc-clothing",
            title: "Clothing",
            items: [
              EVERYONE_BRINGS,
              "Extra layers (conditions change quickly)",
              "Camp sandals or shoes for inside the tent area",
            ],
          },
          {
            kind: "checklist",
            id: "gc-food",
            title: "Food & Cooking",
            items: [
              "Small portable stove and fuel (permitted in campground)",
              "Gas canisters available at the on-site general store",
              "Lightweight cookware",
              "Utensils, a bowl, and a mug",
              "Biodegradable soap for washing up",
              "Snacks and non-perishable food",
              "Small cooler or insulated bag if needed",
            ],
          },
          {
            kind: "checklist",
            id: "gc-comfort",
            title: "Comfort & Organization",
            items: [
              "Folding camp chair (campground only, not festival grounds)",
              "Quick-dry towel",
              "Ziplock bags for keeping things dry",
              "Trash bags (leave no trace)",
            ],
          },
          {
            kind: "p",
            text:
              "**Renting instead? Grab N Go Kits** — a 1-Person Kit (2-person tent, foam pad, sleeping bag) or a 2-Person Kit (4-person tent, two foam pads, two sleeping bags). *Kits available for pickup on site. Not pre-set. No furniture included. Bring a tent lock and cooking supplies.*",
          },
        ],
      },
      {
        id: "easy-camping",
        title: "Easy Camping",
        blocks: [
          {
            kind: "lede",
            text: "Your tent is already waiting for you. Arrive and settle in without the setup.",
          },
          {
            kind: "list",
            items: [
              "Pre-set 5m tipi-style tent",
              "Closed-cell foam sleeping pads",
              "Insulated sleeping bags",
              "Battery-operated lantern and tent lock",
              "Towels",
              "Access to restrooms",
              "Hot showers (small fee)",
            ],
          },
          {
            kind: "checklist",
            id: "ec-clothing",
            title: "Clothing",
            items: [
              EVERYONE_BRINGS,
              "Extra layers (conditions change quickly)",
              "Camp sandals or shoes for inside the tent",
            ],
          },
          {
            kind: "checklist",
            id: "ec-food",
            title: "Food & Cooking",
            items: [
              "Small portable stove and fuel (permitted in campground)",
              "Gas canisters available at the on-site general store",
              "Lightweight cookware, utensils, a bowl, and a mug",
              "Biodegradable soap for washing up",
              "Snacks and non-perishable food for early mornings or late nights",
              "Insulated bag if needed",
            ],
          },
          {
            kind: "checklist",
            id: "ec-comfort",
            title: "Comfort & Organization",
            items: [
              "Folding camp chair (campground only, not festival grounds)",
              "Ziplock bags for keeping things dry",
              "Trash bags (leave no trace)",
            ],
          },
        ],
      },
      {
        id: "self-drive",
        title: "Self-Drive",
        blocks: [
          {
            kind: "lede",
            text:
              "You're bringing your own camper or caravan. Your spot includes parking and shared showers and restrooms. No power or water hookups are provided.",
          },
          {
            kind: "list",
            items: [
              "Designated parking space (6m × 10m for campers; 6m × 15m for RVs and caravans)",
              "Access to shared showers and restrooms",
            ],
          },
          {
            kind: "checklist",
            id: "sd-sleep",
            title: "Shelter & Sleep",
            items: [
              "Bedding, pillows, and towels (not provided)",
              "Extra blankets (August nights get cold)",
            ],
          },
          {
            kind: "checklist",
            id: "sd-clothing",
            title: "Clothing",
            items: [
              EVERYONE_BRINGS,
              "Extra layers (conditions change quickly)",
              "Camp sandals or shoes for inside your vehicle",
            ],
          },
          {
            kind: "checklist",
            id: "sd-food",
            title: "Food & Cooking",
            items: [
              "Your vehicle likely has a kitchen, but stock up before you arrive",
              "Groceries are not sold on site; Ólafsvík is about 10 minutes away",
              "Gas canisters available at the on-site general store",
              "Dish soap and a small drying rack",
              "Extra water if your tank needs topping up before arrival",
            ],
          },
          {
            kind: "checklist",
            id: "sd-tech",
            title: "Tech & Power",
            items: [
              EVERYONE_BRINGS,
              "No power hookups provided, so come with a fully charged power bank",
            ],
          },
          {
            kind: "checklist",
            id: "sd-comfort",
            title: "Comfort & Organization",
            items: [
              "Folding camp chair (campground only, not festival grounds)",
              "Ziplock bags for keeping things dry",
              "Trash bags (leave no trace)",
            ],
          },
        ],
      },
      {
        id: "glamping",
        title: "Glamping",
        blocks: [
          {
            kind: "lede",
            text:
              "Your tent is set up and your bed is made. You're arriving at a proper home base. What you bring is mostly personal.",
          },
          {
            kind: "list",
            items: [
              "Pre-set 5m bell-style tent",
              "Real bed (Queen or Twin configuration available)",
              "Full bedding: pillows, pillowcases, sheets, comforter, and extra blanket",
              "Towels",
              "Side table and two chairs",
              "Battery-operated lantern and tent lock",
              "Access to free hot showers",
              "24/7 on-site host support",
            ],
          },
          {
            kind: "checklist",
            id: "gl-clothing",
            title: "Clothing",
            items: [
              EVERYONE_BRINGS,
              "Extra layers (conditions change quickly)",
              "Camp sandals or slippers for inside the tent",
            ],
          },
          {
            kind: "checklist",
            id: "gl-food",
            title: "Food & Cooking",
            items: [
              "Snacks and non-perishable food for early mornings or late nights",
              "Small portable stove and fuel if you plan to cook (permitted in campground)",
              "Gas canisters available at the on-site general store",
              "Groceries are not sold on site; Ólafsvík is about 10 minutes away",
            ],
          },
          {
            kind: "checklist",
            id: "gl-tech",
            title: "Tech & Power",
            items: [
              EVERYONE_BRINGS,
              "Base Glamping has no in-tent power outlet, so come with a fully charged power bank and charge at the lounge",
            ],
          },
          {
            kind: "checklist",
            id: "gl-comfort",
            title: "Comfort & Organization",
            items: [
              "Folding camp chair if you'd like an extra seat (campground only)",
              "Ziplock bags for keeping things dry",
              "Trash bags (leave no trace)",
            ],
          },
        ],
      },
      {
        id: "premium-glamping",
        title: "Premium Glamping",
        blocks: [
          {
            kind: "lede",
            text:
              "Everything Base Glamping has, plus an in-tent power outlet, lounge with Wi-Fi, premium restrooms, and concierge service.",
          },
          {
            kind: "list",
            items: [
              "Pre-set 5m bell-style tent",
              "Real bed (Queen or Twin configuration available)",
              "Full bedding: pillows, pillowcases, sheets, comforter, and extra blanket",
              "Towels",
              "Side table and two chairs",
              "Battery-operated lantern and tent lock",
              "In-tent power outlet (10 Amp)",
              "Access to free hot showers and premium restrooms",
              "Exclusive lounge with Wi-Fi",
              "24/7 concierge support",
            ],
          },
          {
            kind: "checklist",
            id: "pg-clothing",
            title: "Clothing",
            items: [
              EVERYONE_BRINGS,
              "Extra layers (conditions change quickly)",
              "Camp sandals or slippers for inside the tent",
            ],
          },
          {
            kind: "checklist",
            id: "pg-food",
            title: "Food & Cooking",
            items: [
              "Snacks and non-perishable food for early mornings or late nights",
              "Small portable stove and fuel if you plan to cook (permitted in campground)",
              "Gas canisters available at the on-site general store",
              "Groceries are not sold on site; Ólafsvík is about 10 minutes away",
            ],
          },
          {
            kind: "checklist",
            id: "pg-comfort",
            title: "Comfort & Organization",
            items: [
              "Folding camp chair if you'd like an extra seat (campground only)",
              "Ziplock bags for keeping things dry",
              "Trash bags (leave no trace)",
            ],
          },
        ],
      },
      {
        id: "turnkey-rv",
        title: "Turnkey RV & Caravan",
        blocks: [
          {
            kind: "lede",
            text:
              "Everything is ready when you arrive. Your unit is stocked, your bed is made, and power and water are connected. Pack light.",
          },
          {
            kind: "list",
            items: [
              "Fully equipped kitchen (stove, sink, refrigerator, cookware, and silverware)",
              "Bedding, pillows, and towels",
              "Private bathroom with shower and toilet",
              "Power hookup and full water tank on arrival",
              "Exclusive lounge with Wi-Fi",
              "24/7 concierge support",
              "Access to campground hot showers and restrooms",
            ],
          },
          {
            kind: "checklist",
            id: "rv-clothing",
            title: "Clothing",
            items: [
              EVERYONE_BRINGS,
              "Extra layers (conditions change quickly)",
              "Camp sandals or slippers for inside your unit",
            ],
          },
          {
            kind: "checklist",
            id: "rv-food",
            title: "Food & Cooking",
            items: [
              "Your unit comes with a full kitchen, but you'll need to stock it",
              "Groceries are not sold on site; Ólafsvík is about 10 minutes away",
              "Gas canisters available at the on-site general store if needed",
            ],
          },
          {
            kind: "checklist",
            id: "rv-comfort",
            title: "Comfort & Organization",
            items: [
              "Folding camp chair if you'd like an extra seat (campground only)",
              "Ziplock bags for organization",
              "Trash bags (leave no trace)",
            ],
          },
        ],
      },
      {
        id: "turnkey-camper",
        title: "Turnkey Camper & Teardrop",
        blocks: [
          {
            kind: "lede",
            text:
              "Your unit is stocked and your bed is made. You'll share campground facilities and there are no onboard power hookups, so come prepared to charge on the go.",
          },
          {
            kind: "list",
            items: [
              "Gas stove and basic cookware",
              "Cutlery, dinnerware, and cooking utensils",
              "Sleeping bags, pillows, and towels",
              "USB and 12V outlets for device charging",
              "Access to campground hot showers and restrooms",
              "Exclusive lounge with Wi-Fi",
              "24/7 concierge support",
            ],
          },
          {
            kind: "checklist",
            id: "tc-clothing",
            title: "Clothing",
            items: [
              EVERYONE_BRINGS,
              "Extra layers (conditions change quickly)",
              "Camp sandals or slippers for inside your unit",
            ],
          },
          {
            kind: "checklist",
            id: "tc-food",
            title: "Food & Cooking",
            items: [
              "Your unit has a gas stove, but you'll need to stock it with food",
              "Groceries are not sold on site; Ólafsvík is about 10 minutes away",
              "Gas canisters available at the on-site general store if needed",
            ],
          },
          {
            kind: "checklist",
            id: "tc-tech",
            title: "Tech & Power",
            items: [
              EVERYONE_BRINGS,
              "No onboard power hookup, so come with a fully charged power bank and charge at the lounge",
            ],
          },
          {
            kind: "checklist",
            id: "tc-comfort",
            title: "Comfort & Organization",
            items: [
              "Folding camp chair if you'd like an extra seat (campground only)",
              "Ziplock bags for organization",
              "Trash bags (leave no trace)",
            ],
          },
        ],
      },
      {
        id: "off-site",
        title: "Off-Site Lodging",
        blocks: [
          {
            kind: "lede",
            text:
              "You're staying in a hotel, guesthouse, or rental property near the festival. Pack like you're traveling to Iceland, not camping in it.",
          },
          {
            kind: "list",
            items: [
              "Your lodging provides bed, bedding, and bathroom facilities",
              "Check with your specific property for what's included",
              "Off-site guests use designated entrances for entry and re-entry each day",
              "There is no on-site parking; vehicles park at an off-site lot with a complimentary shuttle",
            ],
          },
          {
            kind: "checklist",
            id: "os-clothing",
            title: "Clothing",
            items: [
              EVERYONE_BRINGS,
              "A compact day bag for carrying layers to and from the festival each day",
            ],
          },
          {
            kind: "checklist",
            id: "os-food",
            title: "Food & Drink",
            items: [
              "Snacks for festival days",
              "Groceries in Ólafsvík (~10 min away); Hellissandur has a mini-market and café",
            ],
          },
        ],
      },
      {
        id: "prohibited",
        title: "Prohibited Items",
        blocks: [
          {
            kind: "lede",
            text:
              "To ensure the safety and comfort of all attendees, the following items are strictly prohibited on festival grounds and in the campground.",
          },
          {
            kind: "list",
            items: [
              "Illegal substances, weapons, fireworks, drones, or hazardous materials",
              "Open flames, large stoves, or grills (only RV-connected equipment or small camping stoves allowed)",
              "Glass bottles or containers (except within RV kitchens)",
              "Professional recording equipment without prior approval",
              "Unauthorized streaming or reproduction of performances",
              "Non-accredited vehicles, trailers, or motorized scooters",
              "Large sound systems, high-powered lighting, or lasers",
              "Unauthorized vending, flyers, or branded promotional materials",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "side-quests",
    title: "Side Quests",
    category: "quick-guides",
    hero: "/articles/side-quests.jpg",
    heroAlt: "Blue ice inside the Langjökull glacier tunnel",
    summary:
      "Intimate performances inside a glacier, a lava cave, and a historic church. Limited-capacity add-ons with transport included.",
    sections: [
      {
        id: "overview",
        blocks: [
          {
            kind: "p",
            text:
              "Side Quests are exclusive, limited-capacity add-ons for the festival pass, offering intimate performances in unique Icelandic settings. Each experience includes roundtrip transport from the festival, ensuring a seamless journey to these remote venues.",
          },
          {
            kind: "list",
            items: [
              "**Into the Glacier:** performances within Langjökull, Europe's second-largest glacier ($600)",
              "**The Lava Cave:** acoustic sets inside the 8,000-year-old Vatnshellir Lava Cave ($400)",
              "**Ingjaldshólskirkja:** midday concerts held in a historic local church ($150)",
              "**Sólmyrkvafoss:** eclipse-viewing at a glacial waterfall (SOLD OUT)",
            ],
          },
        ],
      },
      {
        id: "into-the-glacier",
        title: "Into the Glacier",
        blocks: [
          { kind: "image", src: "/articles/embeds/side-quest-glacier-1.jpg", alt: "Performance inside the Langjökull ice chamber" },
          {
            kind: "p",
            text:
              "Within the breathtaking surroundings of Langjökull, Europe's second-largest glacier, guests enter 500+ metres of paths carved through layers of blue glacial ice more than 10,000 years old. The journey descends into an ice chamber, where the natural acoustics of the crystal caves and ice tunnel formations become the venue for the performance.",
          },
          {
            kind: "p",
            text:
              "Includes roundtrip transport to and from Langjökull on the day of the event, plus a short tour of the glacier cave system.",
          },
          {
            kind: "facts",
            rows: [
              { label: "Thu 13 Aug", value: "Hólmar “Acid Tourist” b2b DJ Margeir" },
              { label: "Fri 14 Aug", value: "Nightmares on Wax (DJ set)" },
              { label: "Capacity", value: "100 guests" },
              { label: "Price", value: "$600" },
            ],
          },
          { kind: "cta", label: "Secure your spot", href: "http://feverup.com/m/474974" },
        ],
      },
      {
        id: "the-lava-cave",
        title: "The Lava Cave",
        blocks: [
          { kind: "image", src: "/articles/embeds/side-quest-lava-cave-1.jpg", alt: "Inside Vatnshellir lava cave" },
          {
            kind: "p",
            text:
              "A small handful of guests are transported from the festival to an intimate, acoustic performance inside Vatnshellir Lava Cave, an 8,000-year-old lava tube nestled beside the Snæfellsjökull stratovolcano and shaped by an eruption from the Purkhólar crater family, just 500 metres away. Snæfellsjökull gained worldwide fame as the fictional gateway to the subterranean world in Jules Verne's *Journey to the Centre of the Earth*. This Side Quest retraces those footsteps, stepping into the dark depths of the lava tube to uncover the story carved into its walls by nature's most powerful forces.",
          },
          { kind: "p", text: "Includes roundtrip transport to and from Vatnshellir Lava Cave." },
          {
            kind: "facts",
            rows: [
              { label: "Thu 13 Aug", value: "Ásgeir" },
              { label: "Fri 14 Aug", value: "Emilíana Torrini" },
              { label: "Capacity", value: "50 guests" },
              { label: "Price", value: "$400" },
            ],
          },
          { kind: "cta", label: "Secure your spot", href: "http://feverup.com/m/474974" },
        ],
      },
      {
        id: "ingjaldsholskirkja",
        title: "Ingjaldshólskirkja",
        blocks: [
          { kind: "image", src: "/articles/embeds/side-quest-church.jpg", alt: "Ingjaldshólskirkja church beneath Snæfellsjökull" },
          {
            kind: "p",
            text:
              "An intimate midday performance inside Ingjaldshólskirkja, a historic church just a short walk from the festival grounds.",
          },
          {
            kind: "p",
            text:
              "Högni first rose to prominence in 2007 with his indie rock band Hjaltalín and has since become one of Iceland's most celebrated contemporary composers. His work as a vocalist, multi-instrumentalist, and songwriter with the electronic group GusGus earned him an international following, and his 2017 solo debut *Two Trains* brought together string orchestra, male chorus, and electronics in a single ambitious work.",
          },
          {
            kind: "facts",
            rows: [
              { label: "Sat 15 Aug", value: "Högni" },
              { label: "Capacity", value: "80 guests" },
              { label: "Price", value: "$150" },
            ],
          },
          { kind: "cta", label: "Secure your spot", href: "http://feverup.com/m/474974" },
        ],
      },
      {
        id: "solmyrkvafoss",
        title: "Sólmyrkvafoss (Totality at the Waterfall)",
        blocks: [
          {
            kind: "p",
            text:
              "An intimate eclipse-viewing gathering at Svöðufoss, where glacial waters from Snæfellsjökull plunge toward the sea, accompanied by a totality-themed live musical performance.",
          },
          {
            kind: "list",
            items: [
              "Total Solar Eclipse viewing at Svöðufoss waterfall",
              "Thematic live musical performance",
              "Light refreshments and food",
              "Roundtrip transport from the festival",
            ],
          },
          {
            kind: "facts",
            rows: [
              { label: "Wed 12 Aug", value: "Eclipse viewing" },
              { label: "Capacity", value: "20 guests" },
              { label: "Status", value: "SOLD OUT" },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "eclipse-viewing",
    title: "Eclipse Viewing",
    category: "quick-guides",
    hero: "/articles/eclipse-viewing.jpg",
    heroAlt: "Total solar eclipse with corona visible",
    summary:
      "12 August, 17:47 UTC: day turns to night for just over two minutes. How to watch totality safely.",
    sections: [
      {
        id: "overview",
        blocks: [
          {
            kind: "p",
            text:
              "On 12 August, at 17:47 UTC, the Moon passes fully in front of the Sun over the Snæfellsnes Peninsula. For a little over two minutes, day turns to night. This has not happened in Iceland since 1954, and it will not happen again until 2196. Totality is the reason we are all gathered on this peninsula, and everything about the day is built around it.",
          },
        ],
      },
      {
        id: "glasses",
        title: "Eclipse Viewing Glasses",
        blocks: [
          {
            kind: "p",
            text:
              "**Free for everyone:** certified eclipse viewing glasses will be shared with every attendee at wristband pickup. Wear them any time part of the Sun is visible, and only remove them during totality, when the Sun is fully covered.",
          },
        ],
      },
      {
        id: "timeline",
        title: "The Timeline of Totality",
        blocks: [
          {
            kind: "facts",
            rows: [
              { label: "≈ 16:44", value: "First Contact — partial eclipse begins. Barely noticeable to the eye. Glasses on from here." },
              { label: "≈ 17:44", value: "Second Contact — totality begins. The only moment it is safe to remove your glasses." },
              { label: "≈ 17:45", value: "Maximum eclipse — the peak of totality over Hellissandur." },
              { label: "≈ 17:47", value: "Third Contact — totality ends. Glasses back on immediately." },
              { label: "≈ 18:44", value: "Fourth Contact — partial eclipse ends. The eclipse is over." },
            ],
          },
          { kind: "p", text: "Totality in Hellissandur lasts about **2 minutes 7 seconds**." },
        ],
      },
      {
        id: "main-stage",
        title: "The Main Stage Pauses for Totality",
        blocks: [
          {
            kind: "p",
            text:
              "As totality nears, the Main Stage will pause. This moment is not one we want competing with a set. When the Moon fully covers the Sun, we ask everyone, wherever they are on-site, to look up.",
          },
        ],
      },
      {
        id: "meditation-symphony",
        title: "The Eclipse Meditation Symphony",
        blocks: [
          {
            kind: "p",
            text:
              "For those who want to mark totality with ceremony, the Eclipse Meditation Symphony takes place in the Cosmic Connection garden. Live musicians and a choir guide participants through a 45-minute journey into the eclipse, alongside a ritual performance drawing on Icelandic mythological traditions. The experience builds to a silent climax as totality forms overhead, then closes with sound healing and moves into a dance set.",
          },
        ],
      },
      {
        id: "find-what-fits",
        title: "Find What Fits You",
        blocks: [
          {
            kind: "p",
            text:
              "Totality can be experienced however feels right. Some will want the ceremony in Cosmic Connection. Some will want a quiet spot on the black sand or lava fields, away from any stage. Some have booked a Side Quest, like the totality viewing at Svöðufoss waterfall. There is no wrong way to watch the Sun disappear. We encourage everyone to find the experience that fits them best, and to be in place well before totality begins.",
          },
        ],
      },
    ],
  },
  {
    slug: "icelandic-folklore",
    title: "Icelandic Folklore",
    category: "quick-guides",
    hero: "/articles/icelandic-folklore.jpg",
    heroAlt: "Kirkjufell mountain under a starry sky",
    summary:
      "Guardian spirits, hidden people, and the glacier Jules Verne chose as his portal to the center of the Earth.",
    sections: [
      {
        id: "overview",
        blocks: [
          {
            kind: "p",
            text:
              "Snæfellsjökull glacier is widely regarded as a source of mystical energy due to its prominent role in Icelandic folklore and literature, its reputation as an earthly power center, and the personal spiritual experiences reported by some visitors. The volcano is a 700,000-year-old stratovolcano, and its geological features are intertwined with the legends that give it its mystical aura.",
          },
        ],
      },
      {
        id: "sagas",
        title: "Ancient Folklore and Sagas",
        blocks: [
          {
            kind: "list",
            items: [
              "**The guardian spirit:** the most famous legend is from the *Bárðar saga Snæfellsáss*, a 14th-century Icelandic saga. It tells the story of Bárður, a half-human, half-troll from Norway who became the guardian spirit (*áss*) of the Snæfellsnes peninsula after disappearing into the ice cap. For centuries, locals would call on Bárður in times of need, reinforcing the mountain's protective and spiritual reputation.",
              "**Hidden people and trolls:** the Snæfellsnes peninsula is rich with tales of elves (*huldufólk*) and trolls. According to legend, some of the peninsula's unique rock formations and cliffs are petrified trolls caught by the sun. Visitors sometimes explore caves and rock formations that are said to be the homes of these “hidden people.” [This directory of huldufólk stories](https://www.snerpa.is/net/thjod/alfa.htm) was created by Jon Bjarni, the co-founder of Secret Solstice, Iceland Eclipse's on-site production partner.",
            ],
          },
        ],
      },
      {
        id: "energy-center",
        title: "Global Energy Center",
        blocks: [
          {
            kind: "list",
            items: [
              "**Earth's chakras:** Snæfellsjökull is considered to be one of the seven main energy centers, or “chakras,” of the Earth. It's been said that visiting the area can offer spiritual inspiration and enlightenment, with some even reporting difficulty sleeping due to the strong energy they sense.",
              "**Heart chakra:** the glacier is also believed by some to hold the heart chakra of the planet, where visiting can open one's heart and foster love.",
            ],
          },
        ],
      },
      {
        id: "literary",
        title: "Literary Symbolism",
        blocks: [
          {
            kind: "list",
            items: [
              "**Jules Verne's portal:** Snæfellsjökull's global fame as a mystical place was cemented by Jules Verne's 1864 novel, *A Journey to the Center of the Earth*. In the book, the protagonists find an entrance to a subterranean world inside the volcano's crater. While Verne never visited Iceland, his descriptions cemented the glacier's image as a portal to the unknown and a place of wonder.",
              "**Other works:** the glacier has continued to inspire authors and artists, including Iceland's Nobel laureate, Halldór Laxness, in his novel *Under the Glacier*.",
            ],
          },
        ],
      },
      {
        id: "modern",
        title: "Modern Spiritual Significance",
        blocks: [
          {
            kind: "list",
            items: [
              "**Gatherings:** the glacier has long attracted spiritual seekers. This culminated in the 1993 gathering of paranormal enthusiasts who came hoping to [greet alien visitors](https://www.whatson.is/aliens-iceland-ufos-almost-came-snaefellsjokull/). Though the supposed meeting never happened, the incident highlights the strong reputation of the glacier as a place where the physical and spiritual worlds are thought to overlap.",
              "**Personal experiences:** even today, many visitors report feeling a special energy or sense of peace when visiting the Snæfellsjökull region. This feeling, combined with the dramatic natural beauty and layers of history, ensures the glacier's enduring mystical status.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "stage-takeovers",
    title: "Stage Takeovers",
    category: "highlights-news",
    hero: "/articles/stage-takeovers.jpg",
    heroAlt: "Illuminated dome stage at night",
    summary:
      "Amnesia Ibiza and Free From Sleep each take over the Aurora tent for a full night of electronic music.",
    sections: [
      {
        id: "overview",
        blocks: [
          {
            kind: "p",
            text:
              "A stage takeover is a full night handed over to one outside collective or brand, who curate the lineup, sound, and identity of the Aurora tent for that evening. Rather than a single guest set folded into the regular schedule, the whole night becomes theirs.",
          },
          {
            kind: "p",
            text:
              "Aurora (Norðurljós) is Iceland Eclipse's electronic music tent, running deep and continuous through the early morning hours, from techno to drum and bass to melodic house. As the day opens up, the tent shifts into talks, workshops, and lighter programming before the music takes over again each night. Celestial Voyager pass holders have a dedicated lounge, bar, and viewing area inside Aurora.",
          },
          { kind: "image", src: "/articles/embeds/aurora-tent.jpg", alt: "The Aurora tent lit up at night" },
        ],
      },
      {
        id: "amnesia-pyramid",
        title: "Amnesia Ibiza presents Pyramid",
        blocks: [
          {
            kind: "p",
            text:
              "**Thursday, 13 August.** The night after totality, Amnesia Ibiza brings their Pyramid night to Aurora for a full takeover. Pyramid emerged in 2018 and has become one of Ibiza's most respected club concepts, built on music first, freedom through dance, and genuine human connection. This year's takeover also marks Amnesia's 50th anniversary.",
          },
          {
            kind: "facts",
            rows: [
              { label: "16:50", value: "Cell7" },
              { label: "18:00", value: "Cici" },
              { label: "19:30", value: "Nitin" },
              { label: "21:00", value: "Mar-T b2b Luca Donzelli" },
              { label: "22:30", value: "Art Department" },
              { label: "00:00", value: "Tiga" },
            ],
          },
        ],
      },
      {
        id: "free-from-sleep",
        title: "Free From Sleep",
        blocks: [
          { kind: "image", src: "/articles/embeds/takeover-free-from-sleep.jpg", alt: "Free From Sleep takeover artwork" },
          {
            kind: "p",
            text:
              "**Friday, 14 August.** London collective Free From Sleep has curated a full evening at Aurora. Founded in 2017, Free From Sleep has spent nearly a decade building one of the UK's most respected independent event platforms, known for techno, house, drum and bass, prog, and electro, at venues including Printworks, Ministry of Sound, and Corsica Studios.",
          },
          {
            kind: "facts",
            rows: [
              { label: "18:00", value: "Sisý Ey" },
              { label: "19:00", value: "Ali Love" },
              { label: "20:00", value: "Freedom Fighters" },
              { label: "21:30", value: "Desert Hearts" },
              { label: "23:00", value: "ANNA" },
              { label: "00:30", value: "Nick Warren" },
              { label: "02:00", value: "Dave Clarke" },
              { label: "03:30", value: "Exos" },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "community-guide",
    title: "Community Guide",
    category: "highlights-news",
    hero: "/articles/community-guide.jpg",
    heroAlt: "Festival crowd with hands raised at golden hour",
    summary:
      "Our intention and the four Prime Directives that guide how we show up for each other and for this place.",
    sections: [
      {
        id: "intention",
        title: "Our Intention",
        blocks: [
          {
            kind: "p",
            text:
              "To co-create moments of genuine connection with each other and with the Cosmos. While preparing for and basking in the afterglow of our celestial gathering, we co-create a series of transformative experiences that encourage us to reflect, celebrate, and explore what it means to be a human in this time and space.",
          },
          {
            kind: "p",
            text:
              "All participants, whether eclipse seeker, music fan, speaker, or artist, come away from this experience with a new planetary perspective that enhances their quality of life. Ultimately, this is about building a strong community of co-creation, a space where we explore, celebrate, and dream together, setting intentions for a positive future.",
          },
          {
            kind: "p",
            text:
              "The following are our shared cosmology, the non-negotiable principles that guide how we show up for each other and for this place.",
          },
        ],
      },
      {
        id: "one-crew",
        title: "1. We Are One Crew",
        blocks: [
          {
            kind: "p",
            text:
              "We travel together on a fragile vessel through space and time, every system interdependent. Astronauts call this realization “The Overview Effect.” Indigenous peoples have long lived it. From Earth and from orbit, the truth is the same. Guided by this cosmic perspective, we practice collective responsibility.",
          },
        ],
      },
      {
        id: "stewards",
        title: "2. We Are Stewards of All Worlds",
        blocks: [
          {
            kind: "p",
            text:
              "What we practice here ripples beyond this moment. How we listen, care, and collaborate shapes what comes next. We gather to rehearse the futures we wish to inhabit on Earth, in community, and across the Cosmos.",
          },
        ],
      },
      {
        id: "honor-the-land",
        title: "3. We Honor the Land",
        blocks: [
          {
            kind: "p",
            text:
              "The land is our host, teacher, and a central presence of our gathering. We co-design in relationship with Iceland's people, culture, and living ecosystems. We arrive with humility and care, practice reciprocity, and hold ourselves accountable to stewardship that leaves no trace.",
          },
        ],
      },
      {
        id: "co-create",
        title: "4. We Co-Create the Future",
        blocks: [
          {
            kind: "p",
            text:
              "For millennia, eclipses have transformed humanity's understanding of its place in the Cosmos, marking essential moments of reckoning, awe, and renewal. In the afterglow of totality, we experiment with new ways of being human together, exploring through music, art, science, movement, ritual, and conversation. What we co-create extends beyond this gathering, informed by awe, shaping the futures we are actively building.",
          },
        ],
      },
    ],
  },
  {
    slug: "ceremonies",
    title: "Ceremonies",
    category: "highlights-news",
    hero: "/articles/ceremonies.jpg",
    heroAlt: "Ceremonial gathering in the Circle of Tröð",
    summary:
      "The Ceremony Garden, the Circle of Tröð, and the ritual journey into totality.",
    sections: [
      {
        id: "overview",
        blocks: [
          {
            kind: "p",
            text:
              "At the heart of the festival is the Ceremony Garden, a series of experiences built around personal intention, live ceremonial music, and collective stillness. The centerpiece is the Circle of Tröð, a large ceremonial mandala built in an amphitheater sloped meadow.",
          },
          {
            kind: "p",
            text:
              "You enter through one of four pyramid gates, each held by a spirit keeper of Icelandic mythology: **the Eagle, the Ox, the Dragon, and the Fire Giant.**",
          },
          {
            kind: "p",
            text:
              "Inside, fifteen rings of seating curve around a six foot tall water altar. A fountain sits at its center, with lava rocks and crystals on an eighteen foot diameter star tetrahedron base, and wildflowers radiating outward in a living mandala. Fifteen hundred of us face inward together. This is the portal we step into as the Earth, the Moon, and the Sun align.",
          },
          { kind: "cta", label: "Learn more", href: "https://icelandeclipse.com/ceremony" },
        ],
      },
      {
        id: "the-welcoming",
        title: "The Welcoming",
        blocks: [
          { kind: "image", src: "/articles/embeds/ceremony-welcoming.jpg", alt: "The Welcoming ceremony artwork" },
          {
            kind: "p",
            text:
              "**11 August 2026, 17:00 UTC.** The opening ceremony sets the foundation for the week. Icelandic elders and singers guide us through mythology, story, and ancient folk songs, bringing to life the myths of glaciers, elves, dwarves, whales, fire giants, and water dragons. The cacao and elixir bar runs alongside the experience, offering warm drinks as intentions are set for the week ahead.",
          },
          {
            kind: "p",
            text:
              "The ceremony closes with a set from AWARË, carrying the circle into sunset from the central Water Altar.",
          },
          {
            kind: "list",
            items: [
              "Hosted by Unify.org",
              "Dr. Haraldur Eriendsson, Icelandic Elder",
              "Bless Sing, local Icelandic musicians performing ancient folkloric music",
              "Closing set with AWARË",
            ],
          },
        ],
      },
      {
        id: "the-eclipse-ceremony",
        title: "The Eclipse Ceremony",
        blocks: [
          { kind: "image", src: "/articles/embeds/ceremony-eclipse.jpg", alt: "The Eclipse Ceremony in the Circle of Tröð" },
          {
            kind: "p",
            text:
              "**12 August 2026, 16:00 UTC.** More than fifteen live musicians, a choir of eighteen women, and a drum crew of twelve men guide a forty five minute journey into the eclipse, built around ritual performance rooted in Icelandic mythological tradition. The ceremony moves through a multi chapter musical storyline, building toward a shared climax in silence during totality.",
          },
          {
            kind: "p",
            text:
              "Hosted by Patrick Kronfli of Unify.org and Isis Indriya of the Academy of Oracle Arts, featuring Poranguí, Snow Raven, Marakame Rogelio Carrillo, Ruby Chase, Tina Rodriguez, Emily Fletcher, Ashley Klein, Franko Heke, Júlía Óttarsdóttir, Scarlett de la Torre, Dr. Haraldur, Diana Carr, local Icelandic musicians, and a choir of eighteen women with twelve drummers.",
          },
        ],
      },
      {
        id: "evening-dance",
        title: "Evening Dance with Poranguí",
        blocks: [
          { kind: "image", src: "/articles/embeds/ceremony-dance.jpg", alt: "Evening dance as light returns" },
          {
            kind: "p",
            text:
              "**12 August 2026, following the Eclipse Ceremony.** As light returns to the land, the circle moves from stillness into motion. Poranguí leads the transition, blending rhythm, breath, and voice into a living ceremonial soundscape. What was held in silence is released through dance, carrying the moment forward as the circle celebrates together.",
          },
        ],
      },
    ],
  },
];

export function getArticles(locale: Locale = "en"): Article[] {
  return (locale === "is" ? ARTICLES_IS : ARTICLES).filter((a) => !a.draft);
}

export function getArticle(slug: string, locale: Locale = "en"): Article | undefined {
  return getArticles(locale).find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return getArticles().filter((a) => a.category === category);
}
