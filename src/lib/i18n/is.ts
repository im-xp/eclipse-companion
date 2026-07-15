// Icelandic UI strings. Machine-drafted (Claude, 2026-07-15) — NEEDS NATIVE
// REVIEW before the festival. Typed against Dict so a missing key fails the
// build.

import type { Dict } from "./en";

const is: Dict = {
  meta: {
    title: "Iceland Eclipse — Hátíðarappið",
    ogTitle: "Iceland Eclipse — Hátíðarhandbók",
    description:
      "Hátíðarkort, dagskrá og leiðarvísar. Iceland Eclipse á Snæfellsnesi, 11.–15. ágúst 2026.",
    baseUrl: "https://app.eclipse.is",
  },
  nav: {
    home: "Heim",
    map: "Kort",
    schedule: "Dagskrá",
    guides: "Leiðarvísar",
    dates: "11.–15. ágúst 2026",
  },
  home: {
    eyebrow: "Almyrkvi á sólu · Snæfellsnes",
    heroTitle: "Förunautur þinn á hátíðinni",
    heroBody:
      "Allt sem þú þarft á staðnum: hátíðarkortið, öll dagskráin og leiðarvísar um hátíðina.",
    ticketPre: "Ertu ekki með miða?",
    ticketCta: "Tryggðu þér miða núna",
    ticketHref:
      "https://tickets.moment.is/event/iceland-eclipse-2026-juvfyj?utm_source=eclipse.is&utm_medium=Ticket+button&utm_campaign=Get+Tickets+Button",
    planTrip: "Skipuleggðu ferðina",
    shuttlesTitle: "Rútuferðir",
    shuttlesBlurb: "Bókaðu far á hátíðarsvæðið og til baka.",
    experiencesTitle: "Upplifanir",
    experiencesBlurb: "Ferðir og upplifanir um Snæfellsnes.",
    featured: "Valdar greinar",
    seeAll: "Sjá allt",
    open: "Opna",
    mapTitle: "Hátíðarkort",
    mapBlurb: "Svið, matur, vatn og fyrsta hjálp — rataðu um svæðið.",
    scheduleTitle: "Dagskrá",
    scheduleBlurb: "Öll erindi, athafnir og atriði á fimm dögum og níu sviðum.",
    guidesTitle: "Leiðarvísar",
    guidesBlurb: "Fróðleikur og nauðsynjar um sólmyrkvann, landið og hátíðina.",
    faqTitle: "Spurt og svarað",
    faqBlurb: "Svör um ferðalög, pökkun, tjaldsvæði, mat og dagskrána.",
    faqHref: "https://eclipse.is/#faq",
    sponsorsTitle: "Samstarfsaðilar",
    sponsorsBlurb:
      "Samstarfsaðilarnir og framleiðendurnir sem gera hátíðina mögulega.",
  },
  schedule: {
    metaTitle: "Dagskrá — Iceland Eclipse",
    tabSchedule: "Dagskrá",
    tabLineup: "Listafólk",
    timeline: "Tímalína",
    list: "Listi",
    allStages: "Öll svið",
    late: "Nótt",
    now: "Núna",
    live: "Í beinni",
    tbc: "Óstaðfest",
    panel: "Pallborð",
    nothingScheduled: "Ekkert á dagskrá þennan dag ennþá.",
    searchPlaceholder: "Leita að þátttakendum…",
    noMatch: "Engir þátttakendur fundust.",
    nParticipants: (n: number) =>
      `${n} ${n === 1 ? "þátttakandi" : "þátttakendur"}`,
    nSpeakers: (n: number) => `${n} þátttakendur`,
    speakersTapHint: (n: number) =>
      `${n} þátttakendur · smelltu fyrir nánari upplýsingar`,
    alsoAppearing: "Kemur einnig fram",
    noBio: "Engin lýsing ennþá.",
  },
  guides: {
    metaTitle: "Leiðarvísar — Iceland Eclipse",
    eyebrow: "Gott að vita fyrir ferðina",
    title: "Leiðarvísar",
    intro:
      "Allt sem vert er að lesa fyrir hátíðina og á meðan á henni stendur: pökkun, tjaldbúðir, sólmyrkvinn sjálfur og það sem gerir Snæfellsnes einstakt.",
    allGuides: "Allir leiðarvísar",
    categoryLabels: {
      "quick-guides": "Stuttir leiðarvísar",
      "highlights-news": "Hápunktar og fréttir",
    },
  },
  map: {
    metaTitle: "Hátíðarkort — Iceland Eclipse",
  },
  sponsors: {
    metaTitle: "Samstarfsaðilar — Iceland Eclipse",
    metaDescription:
      "Samstarfsaðilarnir og framleiðendurnir sem gera Iceland Eclipse mögulega.",
    eyebrow: "Iceland Eclipse",
    title: "Samstarfsaðilar og framleiðendur",
    intro: "Samstarfsaðilarnir og framleiðendurnir sem gera hátíðina mögulega.",
    groupTitles: {
      "Iceland Partners": "Íslenskir samstarfsaðilar",
      Partners: "Samstarfsaðilar",
      Producers: "Framleiðendur",
    },
    categoryLabels: {
      "Apparel Partner": "Fatnaður",
      "Beverage Partner": "Drykkjarvörur",
      "Cause Partner": "Góðgerðarmál",
      "Ceremony/Program Partner": "Athafnir og dagskrá",
      "Co-Producer": "Meðframleiðandi",
      "Footwear Partner": "Skófatnaður",
      "Municipal Partner": "Sveitarfélag",
      "Music/Tech Partner": "Tónlist og tækni",
      "National Park": "Þjóðgarður",
      "Talent/Programming Partner": "Listafólk og dagskrá",
      "Tourism Partner": "Ferðaþjónusta",
    },
  },
  categories: {
    Dance: "Dans",
    "Inner Space": "Innra rými",
    "Cosmic Space": "Kosmískt rými",
    "Outer Space": "Ytra rými",
    "Digital Space": "Stafrænt rými",
    "Community Space": "Samfélagsrými",
  },
  stageSubs: {
    // STAGE_STYLES.sub is already the Icelandic name for most stages; these two
    // carry English descriptors that need a translated counterpart.
    "Film Premieres": "Frumsýningar",
    "Ticketed Add-On": "Aukadagskrá með miða",
  },
  sw: {
    updated: "Dagskrá uppfærð",
    refresh: "Endurhlaða",
  },
  notFound: {
    title: "Síða fannst ekki",
    body: "Þessi síða er ekki til — hún gæti hafa verið færð.",
    backHome: "Aftur heim",
  },
  dateLocale: "is-IS",
};

export default is;
