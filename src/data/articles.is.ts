// Icelandic article content — the ARTICLES array of data/articles.ts,
// translated. Machine-drafted (Claude, 2026-07-15): NEEDS NATIVE REVIEW.
// Structure must mirror articles.ts 1:1 (slugs, section ids, checklist ids,
// block kinds/order, image srcs, hrefs) — enforced by scripts/check_i18n.mjs
// as a prebuild step. Checklist ids are localStorage keys, so keeping them
// identical means a half-packed checklist survives a language flip.

import type { Article } from "./articles";

const EVERYONE_BRINGS_IS =
  "Allt á „Allir taka með“-listanum í pökkunarhandbókinni";

export const ARTICLES_IS: Article[] = [
  {
    slug: "know-before-you-go",
    title: "Komuleiðarvísir",
    subtitle: "Gott að vita fyrir ferðina",
    category: "quick-guides",
    // Machine-drafted Icelandic, not yet natively reviewed — hidden from the
    // /is tree until it is. Remove this line to publish.
    draft: true,
    hero: "/articles/know-before-you-go.jpg",
    heroAlt: "Loftmynd af strönd Snæfellsness í kvöldljósi, vegurinn liggur inn framhjá byggðinni",
    summary:
      "Heimilisföng, skutlur, bílastæði, opnunartími miðasölu og allt annað sem þú þarft fyrir ferðina á staðinn.",
    sectionNav: true,
    sections: [
      {
        id: "arrival",
        title: "Koma og heimilisföng",
        blocks: [
          {
            kind: "facts",
            rows: [
              { label: "Hátíðin", value: "Útnesvegur 360, 360 Hellissandur" },
              { label: "Farangur", value: "Snæfellsás 2, 360 Hellissandur (afhending á seinkuðum farangri)" },
              { label: "Tjaldsvæði", value: "Opnar 9. ágúst kl. 12:00" },
              { label: "Athöfn", value: "Opnunarathöfn 11. ágúst kl. 16:00" },
            ],
          },
        ],
      },
      {
        id: "getting-there",
        title: "Að komast á staðinn",
        blocks: [
          {
            kind: "list",
            items: [
              "**Skutla frá Reykjavík** — stoppistöð nr. 5, Harpa, Faxagata, 101 Reykjavík.",
              "**Keflavíkurflugvöllur** — leitaðu að Iceland Eclipse-skiltinu í komusal og starfsfólkið vísar þér veginn.",
              "**Mikil umferð verður á sólmyrkvadaginn (12. ágúst).** Komdu fyrir 12. ef mögulegt er.",
              "Ein skutla fer 12. ágúst: frá Keflavíkurflugvelli kl. 10:30, með stoppi í Reykjavík kl. 11:30.",
            ],
          },
        ],
      },
      {
        id: "by-car",
        title: "Að koma á bíl",
        blocks: [
          {
            kind: "list",
            items: [
              "Þegar þú kemur á Rifsflugvöll til að leggja færðu límmerki á bílinn eftir gistingu þinni og leiðbeiningar frá starfsmanni á eftirlitsstöðinni.",
              "Ekki er hægt að koma með bíla inn á tjaldsvæðið sjálft.",
              "Leggðu á tilgreindu stæði og taktu skutluna til að flytja búnaðinn og komast á tjaldstæðið þitt.",
            ],
          },
        ],
      },
      {
        id: "parking",
        title: "Bílastæði",
        blocks: [
          {
            kind: "list",
            items: [
              "Bílastæði utan svæðis á Rifsflugvelli: BIRF, W57J+33Q, Flugplatz, 360 Rif.",
              "Aðalstæðið er lagt í upphafi og stendur alla hátíðina.",
              "Dagsstæði er í boði fyrir þá sem þurfa að koma og fara.",
              "**Bílastæðapassi er skylda: 50 USD.**",
            ],
          },
        ],
      },
      {
        id: "box-office",
        title: "Miðasala",
        blocks: [
          {
            kind: "facts",
            rows: [
              { label: "9. ágúst", value: "**Miðasala tjaldsvæðisins**, fyrir utan Daybreak-miðstöðina · 12:00 – 22:00" },
              { label: "10.–12. ágúst", value: "**Miðasala tjaldsvæðisins**, fyrir utan Daybreak-miðstöðina · 10:00 – 22:00" },
              { label: "13.–15. ágúst", value: "**Miðasala hátíðarinnar**, við aðalhliðið · 12:00 – 22:00" },
            ],
          },
          {
            kind: "list",
            items: [
              "**Frá 13. ágúst er miðasala tjaldsvæðisins lokuð.** Sæktu skilríkin þín í miðasölu hátíðarinnar við aðalhliðið.",
              "Gestir sem koma ekki með skutlu þurfa að skipuleggja komu sína innan þessara tíma.",
              "Gestir sem koma með skutlu fá sín skilríki við komuna, óháð tíma.",
              "Spurningar: [hallo@icelandeclipse.com](mailto:hallo@icelandeclipse.com)",
            ],
          },
        ],
      },
      {
        id: "local-shuttle",
        title: "Skutla á svæðinu",
        blocks: [
          {
            kind: "list",
            items: [
              "Fer á 30 til 60 mínútna fresti í hring milli hátíðarsvæðisins, Rif Freezer, sundlaugarinnar og verslunarinnar í Ólafsvík og bílastæðis hátíðarinnar.",
              "Fyrsta og síðasta brottför er ólík frá degi til dags — sjá [tíma skutlunnar](/shuttle).",
              "**Dagur sólmyrkvans (12. ágúst): minni þjónusta, búast má við töfum og engin skutla gengur milli 17:00 og 18:30.**",
            ],
          },
        ],
      },
      {
        id: "campground-zones",
        title: "Svæði á tjaldstæðinu",
        blocks: [
          {
            kind: "list",
            items: [
              "**Daybreak-svæðið** — Easy Camping, Base Glamping, BYO Tent, Grab n Go og Self Drive gestir.",
              "**Moonrise-svæðið** — Premium Glamping, Turnkey RV og Turnkey Camper gestir.",
              "Armbönd eru athuguð við innganga.",
            ],
          },
        ],
      },
      {
        id: "food-market",
        title: "Matur og markaður",
        blocks: [
          {
            kind: "list",
            items: [
              "Morgunmatur og léttur hádegismatur er til sölu í miðstöðvunum 9.–11. ágúst.",
              "Markaðssalar opna 11. ágúst.",
              "Matsalar eru opnir kl. 12:00 – 04:00 á hátíðinni (12.–15. ágúst).",
              "Kauptu matvörur í Reykjavík eða Borgarnesi á leiðinni.",
              "N1-verslun verður á svæðinu með gaskúta, drykki, snarl og fleira.",
            ],
          },
        ],
      },
      {
        id: "campsite-hubs",
        title: "Miðstöðvar á tjaldsvæðinu",
        blocks: [
          {
            kind: "list",
            items: [
              "Heitt vatn er í bæði Daybreak- og Moonrise-miðstöðinni.",
              "Hleðslustöðvar eru í báðum miðstöðvum.",
              "Wi-Fi er í báðum miðstöðvum.",
              "Taktu með hleðslubanka eða sólarhleðslu til vara.",
            ],
          },
        ],
      },
      {
        id: "showers",
        title: "Sturtur",
        blocks: [
          {
            kind: "list",
            items: ["Sturtur kosta 2.000 kr. í hvert skipti."],
          },
        ],
      },
      {
        id: "atm",
        title: "Hraðbankar",
        blocks: [
          {
            kind: "list",
            items: ["Hraðbankar eru við bæjarstjórnarhúsið á Hellissandi og í Ólafsvík."],
          },
        ],
      },
      {
        id: "alcohol",
        title: "Áfengi",
        blocks: [
          {
            kind: "list",
            items: [
              "Hámarkið er einn kassi af bjór og einn kassi af víni á mann.",
              "Takmarkað magn sterkra drykkja til einkanota er leyft.",
              "Engar glerumbúðir.",
              "Duty Free-verslunin á Keflavíkurflugvelli er eftir tollinum, rétt fyrir farangursbandið. Verslunin í flugstöðinni sjálfri er eingöngu fyrir farþega á förum.",
            ],
          },
        ],
      },
      {
        id: "substances",
        title: "Vímuefni",
        blocks: [
          {
            kind: "list",
            items: ["**Fíkniefnahundar verða á svæðinu. Vímuefni eru ekki leyfð.**"],
          },
        ],
      },
      {
        id: "accessibility",
        title: "Aðgengi",
        blocks: [
          {
            kind: "list",
            items: [
              "Aðgengisskilríki eru afhent við innritun.",
              "Aðgengileg snyrting víðs vegar á svæðinu.",
              "Sérstakir aðgengilegir útsýnispallar við sviðin.",
              "Fremsta röðin í skutlunni er ætluð gestum með aðgengisþarfir.",
              "Ferðaþjónusta innan svæðisins er í boði — nánari upplýsingar við innritun.",
            ],
          },
        ],
      },
      {
        id: "laundry",
        title: "Þvottur",
        blocks: [
          {
            kind: "list",
            items: [
              "Engin þvottahús eru á svæðinu.",
              "Handþvottur og þurrkun á snúru eingöngu.",
            ],
          },
        ],
      },
      {
        id: "weather-packing",
        title: "Veður og pökkun",
        blocks: [
          {
            kind: "list",
            items: [
              "Pakkaðu lögum, vatnsheldri jakka og hlýjum náttfötum.",
              "Hiti í ágúst: 8–15°C á daginn, 5–8°C á nóttunni.",
              "Svefngríma er ráðlögð (það verður varla dimmt í ágúst).",
              "Til að hlaða síma, myndavélar og tölvur þarftu venjulegt evrópskt millistykki með tveimur kringlóttum pinnum (**gerð C eða F**).",
              "**Á Íslandi er 230V rafmagn. Skildu bandarískar hárblásara, krullujárn, fatagufara og rafmagnstannbursta eftir heima** — þeir brenna yfir, ofhitna, bila eða valda eldsvoða. Hárblásarar eru í boði í Moonrise-miðstöðinni.",
              "Heildarpökkunarlistann má finna í [leiðarvísunum í þessu appi](https://app.icelandeclipse.com/guides/packing-guide).",
            ],
          },
        ],
      },
      {
        id: "cameras",
        title: "Myndavélar",
        blocks: [
          {
            kind: "list",
            items: [
              "Eigin myndavélar eru velkomnar til að fylgjast með sólmyrkvanum 12. ágúst.",
              "Sólmyrkvagleraugu eru afhent öllum gestum.",
            ],
          },
        ],
      },
      {
        id: "general",
        title: "Almennt",
        blocks: [
          {
            kind: "list",
            items: [
              "Hátíðin er reiðufjárlaus — eingöngu kortagreiðslur.",
              "Litlar færanlegar gashellur eru leyfðar á tjaldsvæðinu.",
              "Gaskútar fást í N1-versluninni.",
              "Spurningar um bókunina, gistinguna eða hvað sem er: [hallo@icelandeclipse.com](mailto:hallo@icelandeclipse.com)",
              "Dagskrá hátíðarinnar: [app.icelandeclipse.com/schedule](https://app.icelandeclipse.com/schedule)",
              "Hátíðar- og tjaldsvæðiskort: [app.icelandeclipse.com/map](https://app.icelandeclipse.com/map)",
              "Leiðarvísar hátíðarinnar: [app.icelandeclipse.com/guides](https://app.icelandeclipse.com/guides)",
              "Sæktu opinbera Iceland Eclipse-appið: [Eclipse Festival 2026 í App Store](https://apps.apple.com/app/id6769218865)",
            ],
          },
        ],
      },
    ],
  },
{
  slug: "packing-guide",
  title: "Pökkunarhandbók",
  category: "quick-guides",
  hero: "/articles/packing-guide.jpg",
  heroAlt: "Loftmynd af Hellissandi við strönd Snæfellsness",
  summary:
    "Lög, stígvél og allt annað fyrir óútreiknanlegt veðrið á Íslandi. Ýttu á hlutina til að haka við þá jafnóðum og þú pakkar.",
  sections: [
    {
      id: "packing-list",
      title: "Pökkunarlisti",
      blocks: [
        {
          kind: "lede",
          text:
            "Þú ert að undirbúa ferð inn í óútreiknanlegt veður Íslands og stórbrotið eldfjallalandslag. Hvort sem þú klæðir þig í lög eða fótar þig á gönguleiðunum eru vinir okkar hjá íslenska merkinu [66 North](http://66north.is) og alþjóðlega skómerkinu [Vivo Barefoot](https://www.vivobarefoot.com/us/) stoltir samstarfsaðilar Iceland Eclipse og eiga allt sem þú þarft til að njóta ævintýrsins í þægindum.",
        },
        {
          kind: "checklist",
          id: "clothing",
          title: "Fatnaður",
          note: "forðastu bómull",
          items: [
            "Innsta lag (hitanærföt eða rakadræg efni)",
            "Ullarsokkar eða rakadrægir sokkar (taktu auka með)",
            "Sundföt (fyrir jarðhitalaugar)",
            "Sólgleraugu",
          ],
        },
        {
          kind: "checklist",
          id: "outerwear",
          title: "Yfirhafnir",
          items: [
            "Vatnshelt ysta lag (jakki og buxur)",
            "Hlýtt millilag (flís eða ull)",
            "Hlý húfa og vettlingar",
          ],
        },
        {
          kind: "checklist",
          id: "footwear",
          title: "Skófatnaður",
          items: [
            "Þægilegir skór til að ganga um svæðið",
            "Vandaðir vatnsheldir gönguskór sem þú hefur þegar gengið til",
          ],
        },
        {
          kind: "checklist",
          id: "health",
          title: "Heilsa og snyrtivörur",
          items: [
            "Sólarvörn (útfjólubláir geislar eru sterkir jafnvel í skýjuðu veðri)",
            "Fjölnota smyrsl með sólarvörn (Aquafor eða Vaseline)",
            "Skordýrafæla (mýið við vatnið er meinlaust en þrálátt)",
            "Persónuleg lyf",
            "Einföld skyndihjálp: blöðruplástrar, verkjalyf, sýrubindandi lyf",
            "Eyrnatappar (einir fyrir tónlistina, aðrir fyrir svefninn)",
            "Augngríma (ágústnætur eru stuttar)",
            "Handspritt",
          ],
        },
        {
          kind: "checklist",
          id: "tech",
          title: "Tækni og rafmagn",
          items: [
            "Hleðslubanki",
            "Venjulegt evrópskt millistykki með tveimur kringlóttum pinnum, gerð C eða F (á Íslandi er 230V rafmagn)",
            "Vatnshelt hulstur eða þurrpoki fyrir símann",
            "Sólmyrkvagleraugu (við útvegum vottuð gleraugu á staðnum)",
          ],
        },
        {
          kind: "checklist",
          id: "essentials",
          title: "Nauðsynjar á hátíðinni",
          items: [
            "Gild persónuskilríki",
            "Bankakort (hátíðin er peningalaus; hraðbanki í Ólafsvík í um 10 mín fjarlægð)",
            "Lítil dagtaska eða bakpoki fyrir aukalög",
            "Örugg taska eða mittistaska fyrir verðmæti á hátíðarsvæðinu",
            "Margnota vatnsflaska (íslenska kranavatnið er frábært)",
            "Nasl fyrir ferðadagana",
          ],
        },
      ],
    },
    {
      id: "leave-home",
      title: "Skildu þetta eftir heima",
      blocks: [
        {
          kind: "list",
          items: [
            "Glerflöskur eða glerílát",
            "Drónar",
            "Gæludýr",
            "Stólar á aðalhátíðarsvæðinu (í lagi á tjaldsvæðinu)",
            "Áfengi að utan inn á aðalhátíðarsvæðið",
            "**Bandarískir hárblásarar, krullujárn, fatagufarar og rafmagnstannburstar.** Í 230V innstungum á Íslandi brenna þeir yfir, ofhitna, bila eða valda eldsvoða. Hárblásarar eru í boði í Moonrise-miðstöðinni.",
          ],
        },
      ],
    },
  ],
},
{
  slug: "camping-guide",
  title: "Útileguhandbók",
  category: "quick-guides",
  hero: "/articles/camping-guide.jpg",
  heroAlt: "Raðir af glamping-bjöllutjöldum í ljósaskiptunum",
  summary:
    "Hvað fylgir og hvað þú þarft að taka með fyrir hverja tegund gistingar, frá almennri útilegu til fullbúinna húsbíla.",
  sectionNav: true,
  sections: [
    {
      id: "general-camping",
      title: "Almenn útilega",
      blocks: [
        {
          kind: "lede",
          text:
            "Þú setur upp þitt eigið svæði. Pakkaðu fyrir breytilegt veður, eldfjallalandslag og nokkrar nætur af alvöru ævintýri.",
        },
        {
          kind: "checklist",
          id: "gc-shelter",
          title: "Skjól og svefn",
          items: [
            "Tjald sem þolir vind og rigningu (mælt með sjálfstandandi tjaldi)",
            "Svefnpoki sem þolir að minnsta kosti 0°C / 32°F",
            "Svefndýna eða undirlag",
            "Tjaldhælar sem henta hörðu undirlagi",
            "Þurrpokar til að verja búnað inni í tjaldinu",
            "Höfuðljós og auka rafhlöður",
            "Tjaldlás",
            "Svefngríma (það verður varla dimmt í ágúst)",
          ],
        },
        {
          kind: "checklist",
          id: "gc-clothing",
          title: "Fatnaður",
          items: [
            EVERYONE_BRINGS_IS,
            "Aukalög (aðstæður breytast hratt)",
            "Sandalar eða skór til að nota við tjaldið",
          ],
        },
        {
          kind: "checklist",
          id: "gc-food",
          title: "Matur og eldamennska",
          items: [
            "Lítill ferðaprímus og eldsneyti (leyfilegt á tjaldsvæðinu)",
            "Gaskútar fást í versluninni á svæðinu",
            "Léttir pottar og pönnur",
            "Hnífapör, skál og bolli",
            "Lífbrjótanleg sápa fyrir uppvaskið",
            "Nasl og geymsluþolinn matur",
            "Lítið kælibox eða kælitaska ef þörf er á",
          ],
        },
        {
          kind: "checklist",
          id: "gc-comfort",
          title: "Þægindi og skipulag",
          items: [
            "Samanbrjótanlegur útilegustóll (aðeins á tjaldsvæðinu, ekki á hátíðarsvæðinu)",
            "Fljótþornandi handklæði",
            "Rennilásapokar til að halda hlutum þurrum",
            "Ruslapokar (skiljum ekkert eftir)",
          ],
        },
        {
          kind: "p",
          text:
            "**Viltu frekar leigja? Grab N Go-settin** — sett fyrir einn (2ja manna tjald, svampdýna, svefnpoki) eða sett fyrir tvo (4ra manna tjald, tvær svampdýnur, tveir svefnpokar). *Settin eru sótt á staðnum. Ekki uppsett fyrirfram. Húsgögn fylgja ekki. Taktu með tjaldlás og eldunarbúnað.*",
        },
      ],
    },
    {
      id: "easy-camping",
      title: "Einföld útilega",
      blocks: [
        {
          kind: "lede",
          text: "Tjaldið þitt bíður þín. Mættu og komdu þér fyrir án fyrirhafnar.",
        },
        {
          kind: "list",
          items: [
            "Uppsett 5m tjald í tipi-stíl",
            "Þéttar svampsvefndýnur",
            "Einangraðir svefnpokar",
            "Rafhlöðuljósker og tjaldlás",
            "Aðgangur að salernum",
            "Heitar sturtur (vægt gjald)",
          ],
        },
        {
          kind: "checklist",
          id: "ec-clothing",
          title: "Fatnaður",
          items: [
            EVERYONE_BRINGS_IS,
            "Aukalög (aðstæður breytast hratt)",
            "Sandalar eða skór til að nota inni í tjaldinu",
          ],
        },
        {
          kind: "checklist",
          id: "ec-food",
          title: "Matur og eldamennska",
          items: [
            "Lítill ferðaprímus og eldsneyti (leyfilegt á tjaldsvæðinu)",
            "Gaskútar fást í versluninni á svæðinu",
            "Léttir pottar, hnífapör, skál og bolli",
            "Lífbrjótanleg sápa fyrir uppvaskið",
            "Nasl og geymsluþolinn matur fyrir árla morgna eða síðla nætur",
            "Kælitaska ef þörf er á",
          ],
        },
        {
          kind: "checklist",
          id: "ec-comfort",
          title: "Þægindi og skipulag",
          items: [
            "Samanbrjótanlegur útilegustóll (aðeins á tjaldsvæðinu, ekki á hátíðarsvæðinu)",
            "Rennilásapokar til að halda hlutum þurrum",
            "Ruslapokar (skiljum ekkert eftir)",
            // Appended, not inserted — GuideChecklist persists by index.
            "Fljótþornandi handklæði",
          ],
        },
      ],
    },
    {
      id: "self-drive",
      title: "Eigin húsbíll eða vagn",
      blocks: [
        {
          kind: "lede",
          text:
            "Þú kemur með eigin ferðabíl eða hjólhýsi. Stæðinu þínu fylgja bílastæði og sameiginlegar sturtur og salerni. Hvorki rafmagns- né vatnstengingar eru í boði.",
        },
        {
          kind: "list",
          items: [
            "Merkt stæði (6m × 10m fyrir ferðabíla; 6m × 15m fyrir húsbíla og hjólhýsi)",
            "Aðgangur að sameiginlegum sturtum og salernum",
          ],
        },
        {
          kind: "checklist",
          id: "sd-sleep",
          title: "Skjól og svefn",
          items: [
            "Sængurföt, koddar og handklæði (fylgja ekki)",
            "Auka teppi (ágústnætur verða kaldar)",
          ],
        },
        {
          kind: "checklist",
          id: "sd-clothing",
          title: "Fatnaður",
          items: [
            EVERYONE_BRINGS_IS,
            "Aukalög (aðstæður breytast hratt)",
            "Sandalar eða skór til að nota inni í bílnum",
          ],
        },
        {
          kind: "checklist",
          id: "sd-food",
          title: "Matur og eldamennska",
          items: [
            "Bíllinn þinn er líklega með eldhús, en birgðu þig upp áður en þú kemur",
            "Matvörur eru ekki seldar á svæðinu; Ólafsvík er í um 10 mínútna fjarlægð",
            "Gaskútar fást í versluninni á svæðinu",
            "Uppþvottalögur og lítil þurrkgrind",
            "Auka vatn ef þarf að fylla á tankinn fyrir komu",
          ],
        },
        {
          kind: "checklist",
          id: "sd-tech",
          title: "Tækni og rafmagn",
          items: [
            EVERYONE_BRINGS_IS,
            "Engar rafmagnstengingar í boði, svo komdu með fullhlaðinn hleðslubanka",
          ],
        },
        {
          kind: "checklist",
          id: "sd-comfort",
          title: "Þægindi og skipulag",
          items: [
            "Samanbrjótanlegur útilegustóll (aðeins á tjaldsvæðinu, ekki á hátíðarsvæðinu)",
            "Rennilásapokar til að halda hlutum þurrum",
            "Ruslapokar (skiljum ekkert eftir)",
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
            "Tjaldið þitt er uppsett og rúmið umbúið. Þú kemur að alvöru bækistöð. Það sem þú tekur með er að mestu persónulegir munir.",
        },
        {
          kind: "list",
          items: [
            "Uppsett 5m bjöllutjald",
            "Alvöru rúm (Queen- eða Twin-uppröðun í boði)",
            "Full sængurföt: koddar, koddaver, lök, sæng og auka teppi",
            "Handklæði",
            "Hliðarborð og tveir stólar",
            "Rafhlöðuljósker og tjaldlás",
            "Aðgangur að ókeypis heitum sturtum",
            "Gestgjafaþjónusta á staðnum allan sólarhringinn",
          ],
        },
        {
          kind: "checklist",
          id: "gl-clothing",
          title: "Fatnaður",
          items: [
            EVERYONE_BRINGS_IS,
            "Aukalög (aðstæður breytast hratt)",
            "Sandalar eða inniskór til að nota inni í tjaldinu",
          ],
        },
        {
          kind: "checklist",
          id: "gl-food",
          title: "Matur og eldamennska",
          items: [
            "Nasl og geymsluþolinn matur fyrir árla morgna eða síðla nætur",
            "Lítill ferðaprímus og eldsneyti ef þú ætlar að elda (leyfilegt á tjaldsvæðinu)",
            "Gaskútar fást í versluninni á svæðinu",
            "Matvörur eru ekki seldar á svæðinu; Ólafsvík er í um 10 mínútna fjarlægð",
          ],
        },
        {
          kind: "checklist",
          id: "gl-tech",
          title: "Tækni og rafmagn",
          items: [
            EVERYONE_BRINGS_IS,
            "Í Base Glamping er engin innstunga í tjaldinu, svo komdu með fullhlaðinn hleðslubanka og hladdu tækin í setustofunni",
          ],
        },
        {
          kind: "checklist",
          id: "gl-comfort",
          title: "Þægindi og skipulag",
          items: [
            "Samanbrjótanlegur útilegustóll ef þú vilt auka sæti (aðeins á tjaldsvæðinu)",
            "Rennilásapokar til að halda hlutum þurrum",
            "Ruslapokar (skiljum ekkert eftir)",
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
            "Allt sem Base Glamping býður, auk innstungu í tjaldinu, setustofu með Wi-Fi, glæsilegri salernisaðstöðu og concierge-þjónustu.",
        },
        {
          kind: "list",
          items: [
            "Uppsett 5m bjöllutjald",
            "Alvöru rúm (Queen- eða Twin-uppröðun í boði)",
            "Full sængurföt: koddar, koddaver, lök, sæng og auka teppi",
            "Handklæði",
            "Hliðarborð og tveir stólar",
            "Rafhlöðuljósker og tjaldlás",
            "Innstunga í tjaldinu (10 amper)",
            "Aðgangur að ókeypis heitum sturtum og glæsilegri salernisaðstöðu",
            "Sérstök setustofa með Wi-Fi",
            "Concierge-þjónusta allan sólarhringinn",
          ],
        },
        {
          kind: "checklist",
          id: "pg-clothing",
          title: "Fatnaður",
          items: [
            EVERYONE_BRINGS_IS,
            "Aukalög (aðstæður breytast hratt)",
            "Sandalar eða inniskór til að nota inni í tjaldinu",
          ],
        },
        {
          kind: "checklist",
          id: "pg-food",
          title: "Matur og eldamennska",
          items: [
            "Nasl og geymsluþolinn matur fyrir árla morgna eða síðla nætur",
            "Lítill ferðaprímus og eldsneyti ef þú ætlar að elda (leyfilegt á tjaldsvæðinu)",
            "Gaskútar fást í versluninni á svæðinu",
            "Matvörur eru ekki seldar á svæðinu; Ólafsvík er í um 10 mínútna fjarlægð",
          ],
        },
        {
          kind: "checklist",
          id: "pg-comfort",
          title: "Þægindi og skipulag",
          items: [
            "Samanbrjótanlegur útilegustóll ef þú vilt auka sæti (aðeins á tjaldsvæðinu)",
            "Rennilásapokar til að halda hlutum þurrum",
            "Ruslapokar (skiljum ekkert eftir)",
          ],
        },
      ],
    },
    {
      id: "turnkey-rv",
      title: "Fullbúinn húsbíll og hjólhýsi",
      blocks: [
        {
          kind: "lede",
          text:
            "Allt er tilbúið þegar þú mætir. Vagninn þinn er fullbúinn, rúmið umbúið og rafmagn og vatn tengt. Pakkaðu létt.",
        },
        {
          kind: "list",
          items: [
            "Fullbúið eldhús (eldavél, vaskur, ísskápur, pottar og hnífapör)",
            "Sængurföt, koddar og handklæði",
            "Sérbaðherbergi með sturtu og salerni",
            "Rafmagnstenging og fullur vatnstankur við komu",
            "Sérstök setustofa með Wi-Fi",
            "Concierge-þjónusta allan sólarhringinn",
            "Aðgangur að heitum sturtum og salernum tjaldsvæðisins",
          ],
        },
        {
          kind: "checklist",
          id: "rv-clothing",
          title: "Fatnaður",
          items: [
            EVERYONE_BRINGS_IS,
            "Aukalög (aðstæður breytast hratt)",
            "Sandalar eða inniskór til að nota inni í vagninum",
          ],
        },
        {
          kind: "checklist",
          id: "rv-food",
          title: "Matur og eldamennska",
          items: [
            "Vagninn þinn er með fullbúið eldhús, en þú þarft að fylla á birgðirnar",
            "Matvörur eru ekki seldar á svæðinu; Ólafsvík er í um 10 mínútna fjarlægð",
            "Gaskútar fást í versluninni á svæðinu ef þarf",
          ],
        },
        {
          kind: "checklist",
          id: "rv-comfort",
          title: "Þægindi og skipulag",
          items: [
            "Samanbrjótanlegur útilegustóll ef þú vilt auka sæti (aðeins á tjaldsvæðinu)",
            "Rennilásapokar fyrir skipulagið",
            "Ruslapokar (skiljum ekkert eftir)",
          ],
        },
      ],
    },
    {
      id: "turnkey-camper",
      title: "Fullbúinn ferðabíll og teardrop-vagn",
      blocks: [
        {
          kind: "lede",
          text:
            "Vagninn þinn er fullbúinn og rúmið umbúið. Þú deilir aðstöðu tjaldsvæðisins og engin rafmagnstenging er í vagninum, svo vertu klár í að hlaða tækin á ferðinni.",
        },
        {
          kind: "list",
          items: [
            "Gaseldavél og helstu pottar og pönnur",
            "Hnífapör, matarstell og eldunaráhöld",
            "Svefnpokar, koddar og handklæði",
            "USB- og 12V-tengi til að hlaða tæki",
            "Aðgangur að heitum sturtum og salernum tjaldsvæðisins",
            "Sérstök setustofa með Wi-Fi",
            "Concierge-þjónusta allan sólarhringinn",
          ],
        },
        {
          kind: "checklist",
          id: "tc-clothing",
          title: "Fatnaður",
          items: [
            EVERYONE_BRINGS_IS,
            "Aukalög (aðstæður breytast hratt)",
            "Sandalar eða inniskór til að nota inni í vagninum",
          ],
        },
        {
          kind: "checklist",
          id: "tc-food",
          title: "Matur og eldamennska",
          items: [
            "Vagninn þinn er með gaseldavél, en þú þarft sjálf(ur) að taka með mat",
            "Matvörur eru ekki seldar á svæðinu; Ólafsvík er í um 10 mínútna fjarlægð",
            "Gaskútar fást í versluninni á svæðinu ef þarf",
          ],
        },
        {
          kind: "checklist",
          id: "tc-tech",
          title: "Tækni og rafmagn",
          items: [
            EVERYONE_BRINGS_IS,
            "Engin rafmagnstenging í vagninum, svo komdu með fullhlaðinn hleðslubanka og hladdu tækin í setustofunni",
          ],
        },
        {
          kind: "checklist",
          id: "tc-comfort",
          title: "Þægindi og skipulag",
          items: [
            "Samanbrjótanlegur útilegustóll ef þú vilt auka sæti (aðeins á tjaldsvæðinu)",
            "Rennilásapokar fyrir skipulagið",
            "Ruslapokar (skiljum ekkert eftir)",
          ],
        },
      ],
    },
    {
      id: "off-site",
      title: "Gisting utan svæðis",
      blocks: [
        {
          kind: "lede",
          text:
            "Þú gistir á hóteli, gistiheimili eða í leiguhúsnæði nálægt hátíðinni. Pakkaðu eins og þú sért að ferðast til Íslands, ekki að tjalda þar.",
        },
        {
          kind: "list",
          items: [
            "Gististaðurinn þinn sér um rúm, sængurföt og baðaðstöðu",
            "Kannaðu hjá þínum gististað hvað er innifalið",
            "Gestir sem gista utan svæðis nota merkta innganga til að komast inn og út á hverjum degi",
            "Engin bílastæði eru á svæðinu; bílum er lagt á stæði utan svæðis og ókeypis skutla gengur á milli",
          ],
        },
        {
          kind: "checklist",
          id: "os-clothing",
          title: "Fatnaður",
          items: [
            EVERYONE_BRINGS_IS,
            "Nett dagtaska til að bera aukalög til og frá hátíðinni á hverjum degi",
          ],
        },
        {
          kind: "checklist",
          id: "os-food",
          title: "Matur og drykkur",
          items: [
            "Nasl fyrir hátíðardagana",
            "Matvörur fást í Ólafsvík (í um 10 mín fjarlægð); á Hellissandi er lítil verslun og kaffihús",
          ],
        },
      ],
    },
    {
      id: "prohibited",
      title: "Bannaðir hlutir",
      blocks: [
        {
          kind: "lede",
          text:
            "Til að tryggja öryggi og vellíðan allra gesta eru eftirfarandi hlutir stranglega bannaðir á hátíðarsvæðinu og á tjaldsvæðinu.",
        },
        {
          kind: "list",
          items: [
            "Ólögleg efni, vopn, flugeldar, drónar eða hættuleg efni",
            "Opinn eldur, stórar eldavélar eða grill (aðeins búnaður tengdur húsbíl eða litlir ferðaprímusar leyfðir)",
            "Glerflöskur eða glerílát (nema í eldhúsum húsbíla)",
            "Atvinnuupptökubúnaður án fyrirframsamþykkis",
            "Óleyfilegt streymi eða afritun á tónlistarflutningi og atriðum",
            "Farartæki, kerrur eða vélknúin hlaupahjól án aðgangsheimildar",
            "Stór hljóðkerfi, öflug lýsing eða leysigeislar",
            "Óleyfileg sala, dreifimiðar eða merkt kynningarefni",
          ],
        },
      ],
    },
  ],
},
{
    slug: "side-quests",
    title: "Hliðarævintýri",
    category: "quick-guides",
    hero: "/articles/side-quests.jpg",
    heroAlt: "Blár ís inni í ísgöngunum í Langjökli",
    summary:
      "Nándartónleikar inni í jökli, hraunhelli og sögufrægri kirkju. Viðbætur með takmörkuðu plássi — ferðir innifaldar.",
    sections: [
      {
        id: "overview",
        blocks: [
          {
            kind: "p",
            text:
              "Hliðarævintýrin eru einstakar viðbætur við hátíðarpassann með takmörkuðu plássi og bjóða upp á nándartónleika á einstökum íslenskum stöðum. Hverri upplifun fylgja ferðir fram og til baka frá hátíðinni, svo leiðin á þessa afskekktu staði er áhyggjulaus.",
          },
          {
            kind: "list",
            items: [
              "**Inn í jökulinn:** tónleikar inni í Langjökli, næststærsta jökli Evrópu ($600)",
              "**Hraunhellirinn:** órafmagnaðir tónleikar í Vatnshelli, 8.000 ára gömlum hraunhelli ($400)",
              "**Ingjaldshólskirkja:** hádegistónleikar í sögufrægri sveitakirkju ($150)",
              "**Sólmyrkvafoss:** sólmyrkvaskoðun við jökulfoss (UPPSELT)",
            ],
          },
        ],
      },
      {
        id: "into-the-glacier",
        title: "Inn í jökulinn",
        blocks: [
          { kind: "image", src: "/articles/embeds/side-quest-glacier-1.jpg", alt: "Tónleikar inni í íshvelfingu Langjökuls" },
          {
            kind: "p",
            text:
              "Í stórbrotnu umhverfi Langjökuls, næststærsta jökuls Evrópu, ganga gestir inn í rúmlega 500 metra löng göng sem höggvin hafa verið gegnum lög af bláum jökulís sem er meira en 10.000 ára gamall. Leiðin liggur niður í íshvelfingu þar sem náttúrulegur hljómburður kristalhellanna og ísganganna verður að sjálfum tónleikastaðnum.",
          },
          {
            kind: "p",
            text:
              "Innifaldar eru ferðir að og frá Langjökli á viðburðardaginn ásamt stuttri skoðunarferð um íshellakerfi jökulsins.",
          },
          {
            kind: "facts",
            rows: [
              { label: "Fim 13. ágúst", value: "Hólmar “Acid Tourist” b2b DJ Margeir" },
              { label: "Fös 14. ágúst", value: "Nightmares on Wax (DJ-sett)" },
              { label: "Fjöldi gesta", value: "100 gestir" },
              { label: "Verð", value: "$600" },
            ],
          },
          { kind: "cta", label: "Tryggðu þér miða", href: "http://feverup.com/m/474974" },
        ],
      },
      {
        id: "the-lava-cave",
        title: "Hraunhellirinn",
        blocks: [
          { kind: "image", src: "/articles/embeds/side-quest-lava-cave-1.jpg", alt: "Inni í hraunhellinum Vatnshelli" },
          {
            kind: "p",
            text:
              "Lítill hópur gesta er ferjaður frá hátíðinni á órafmagnaða nándartónleika inni í Vatnshelli, 8.000 ára gömlum hraunhelli sem kúrir við hlið eldkeilunnar Snæfellsjökuls og myndaðist í gosi úr Purkhólagígunum, aðeins 500 metrum frá. Snæfellsjökull öðlaðist heimsfrægð sem skáldaður inngangur að undirheimum jarðar í *Leyndardómum Snæfellsjökuls* eftir Jules Verne. Í þessu hliðarævintýri er fetað í þau fótspor, gengið niður í myrk djúp hraunhellisins og saga hans lesin úr veggjunum, rituð af máttugustu öflum náttúrunnar.",
          },
          { kind: "p", text: "Innifaldar eru ferðir að og frá Vatnshelli." },
          {
            kind: "facts",
            rows: [
              { label: "Fim 13. ágúst", value: "Ásgeir" },
              { label: "Fös 14. ágúst", value: "Emilíana Torrini" },
              { label: "Fjöldi gesta", value: "50 gestir" },
              { label: "Verð", value: "$400" },
            ],
          },
          { kind: "cta", label: "Tryggðu þér miða", href: "http://feverup.com/m/474974" },
        ],
      },
      {
        id: "ingjaldsholskirkja",
        title: "Ingjaldshólskirkja",
        blocks: [
          { kind: "image", src: "/articles/embeds/side-quest-church.jpg", alt: "Ingjaldshólskirkja undir Snæfellsjökli" },
          {
            kind: "p",
            text:
              "Nándartónleikar um hádegisbil í Ingjaldshólskirkju, sögufrægri kirkju í stuttu göngufæri frá hátíðarsvæðinu.",
          },
          {
            kind: "p",
            text:
              "Högni vakti fyrst athygli árið 2007 með indírokksveitinni Hjaltalín og hefur síðan skipað sér í röð fremstu samtímatónskálda Íslands. Störf hans sem söngvari, fjölhljóðfæraleikari og lagahöfundur með raftónlistarsveitinni GusGus öfluðu honum aðdáenda um allan heim, og á fyrstu sólóplötu sinni, *Two Trains* frá 2017, fléttaði hann saman strengjasveit, karlakór og raftónlist í einu metnaðarfullu verki.",
          },
          {
            kind: "facts",
            rows: [
              { label: "Lau 15. ágúst", value: "Högni" },
              { label: "Fjöldi gesta", value: "80 gestir" },
              { label: "Verð", value: "$150" },
            ],
          },
          { kind: "cta", label: "Tryggðu þér miða", href: "http://feverup.com/m/474974" },
        ],
      },
      {
        id: "solmyrkvafoss",
        title: "Sólmyrkvafoss (almyrkvi við fossinn)",
        blocks: [
          {
            kind: "p",
            text:
              "Fámenn sólmyrkvasamvera við Svöðufoss, þar sem jökulvatn úr Snæfellsjökli steypist fram á leið sinni til sjávar, með lifandi tónlistarflutningi í anda almyrkvans.",
          },
          {
            kind: "list",
            items: [
              "Almyrkvi á sólu skoðaður við Svöðufoss",
              "Lifandi tónlistarflutningur í þema myrkvans",
              "Léttar veitingar og matur",
              "Ferðir fram og til baka frá hátíðinni",
            ],
          },
          {
            kind: "facts",
            rows: [
              { label: "Mið 12. ágúst", value: "Sólmyrkvaskoðun" },
              { label: "Fjöldi gesta", value: "20 gestir" },
              { label: "Staða", value: "UPPSELT" },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "eclipse-viewing",
    title: "Sólmyrkvaskoðun",
    category: "quick-guides",
    hero: "/articles/eclipse-viewing.jpg",
    heroAlt: "Almyrkvi á sólu þar sem kórónan sést",
    summary:
      "12. ágúst kl. 17:47 UTC: dagur verður að nóttu í rúmar tvær mínútur. Svona horfir þú á almyrkvann á öruggan hátt.",
    sections: [
      {
        id: "overview",
        blocks: [
          {
            kind: "p",
            text:
              "Þann 12. ágúst kl. 17:47 UTC gengur tunglið alveg fyrir sólu yfir Snæfellsnesi. Í rúmar tvær mínútur verður dagur að nóttu. Þetta hefur ekki gerst á Íslandi síðan 1954 og gerist ekki aftur fyrr en árið 2196. Almyrkvinn er ástæðan fyrir því að við söfnumst öll saman á nesinu og allur dagurinn er skipulagður í kringum hann.",
          },
        ],
      },
      {
        id: "glasses",
        title: "Sólmyrkvagleraugu",
        blocks: [
          {
            kind: "p",
            text:
              "**Ókeypis fyrir alla:** vottuð sólmyrkvagleraugu verða afhent öllum gestum við afhendingu armbanda. Notaðu þau alltaf þegar einhver hluti sólarinnar er sýnilegur og taktu þau aðeins niður meðan á almyrkvanum stendur, þegar tunglið hylur sólina alveg.",
          },
        ],
      },
      {
        id: "timeline",
        title: "Tímalína almyrkvans",
        blocks: [
          {
            kind: "facts",
            rows: [
              { label: "≈ 16:44", value: "Fyrsta snerting — deildarmyrkvi hefst. Varla greinanlegt með berum augum. Gleraugun á frá þessari stundu." },
              { label: "≈ 17:44", value: "Önnur snerting — almyrkvinn hefst. Eina stundin sem óhætt er að taka gleraugun af." },
              { label: "≈ 17:45", value: "Hámark myrkvans — hápunktur almyrkvans yfir Hellissandi." },
              { label: "≈ 17:47", value: "Þriðja snerting — almyrkvanum lýkur. Gleraugun strax á aftur." },
              { label: "≈ 18:44", value: "Fjórða snerting — deildarmyrkvanum lýkur. Myrkvinn er yfirstaðinn." },
            ],
          },
          { kind: "p", text: "Almyrkvinn á Hellissandi varir í um **2 mínútur og 7 sekúndur**." },
        ],
      },
      {
        id: "main-stage",
        title: "Aðalsviðið gerir hlé fyrir almyrkvann",
        blocks: [
          {
            kind: "p",
            text:
              "Þegar almyrkvinn nálgast verður gert hlé á dagskrá aðalsviðsins. Þetta augnablik viljum við ekki láta keppa við tónleika. Þegar tunglið hylur sólina alveg biðjum við öll, hvar sem þau eru á svæðinu, að líta upp.",
          },
        ],
      },
      {
        id: "meditation-symphony",
        title: "Hugleiðslusinfónía sólmyrkvans",
        blocks: [
          {
            kind: "p",
            text:
              "Fyrir þau sem vilja fagna almyrkvanum með athöfn fer Hugleiðslusinfónía sólmyrkvans fram í Cosmic Connection-garðinum. Lifandi tónlistarfólk og kór leiða þátttakendur í 45 mínútna ferðalag inn í myrkvann, ásamt helgiathöfn sem sækir innblástur í íslenskar goðsagnahefðir. Upplifunin rís í þöglum hápunkti þegar almyrkvinn myndast yfir höfðum okkar, lýkur svo með hljóðheilun og rennur yfir í danssett.",
          },
        ],
      },
      {
        id: "find-what-fits",
        title: "Finndu það sem hentar þér",
        blocks: [
          {
            kind: "p",
            text:
              "Almyrkvann má upplifa á hvern þann hátt sem þér finnst réttur. Sum vilja athöfnina í Cosmic Connection. Sum vilja rólegan stað á svarta sandinum eða úti í hrauni, fjarri öllum sviðum. Sum hafa bókað hliðarævintýri, eins og almyrkvaskoðunina við Svöðufoss. Það er engin röng leið til að horfa á sólina hverfa. Við hvetjum öll til að finna þá upplifun sem hentar þeim best og vera komin á sinn stað í góðum tíma áður en almyrkvinn hefst.",
          },
        ],
      },
    ],
  },
  {
    slug: "icelandic-folklore",
    title: "Íslensk þjóðtrú",
    category: "quick-guides",
    hero: "/articles/icelandic-folklore.jpg",
    heroAlt: "Kirkjufell undir stjörnubjörtum himni",
    summary:
      "Verndarvættir, huldufólk og jökullinn sem Jules Verne valdi sem hlið sitt að miðju jarðar.",
    sections: [
      {
        id: "overview",
        blocks: [
          {
            kind: "p",
            text:
              "Snæfellsjökull er víða talinn uppspretta dulrænnar orku, bæði vegna áberandi hlutverks síns í íslenskri þjóðtrú og bókmenntum, orðspors síns sem orkustöð jarðar og þeirra andlegu upplifana sem sumir gestir segjast hafa orðið fyrir. Eldfjallið er 700.000 ára gömul eldkeila og jarðfræði þess fléttast saman við sagnirnar sem gefa því dulúðlegan blæ.",
          },
        ],
      },
      {
        id: "sagas",
        title: "Forn þjóðtrú og sögur",
        blocks: [
          {
            kind: "list",
            items: [
              "**Verndarvætturinn:** frægasta sögnin er úr *Bárðar sögu Snæfellsáss*, íslenskri sögu frá 14. öld. Hún segir frá Bárði, hálfum manni og hálfu trölli frá Noregi, sem varð verndarvættur (*ás*) Snæfellsness eftir að hann hvarf í jökulinn. Öldum saman hétu heimamenn á Bárð þegar á reyndi og styrkti það orðspor fjallsins sem verndara og andlegs staðar.",
              "**Huldufólk og tröll:** Snæfellsnes er auðugt af sögum um álfa (*huldufólk*) og tröll. Samkvæmt þjóðtrúnni eru sumar af sérkennilegum klettamyndunum og björgum nessins steinrunnin tröll sem dagaði uppi í sólinni. Gestir skoða stundum hella og klettamyndanir sem sagðar eru heimkynni huldufólksins. [Þetta safn huldufólkssagna](https://www.snerpa.is/net/thjod/alfa.htm) tók saman Jón Bjarni, annar stofnenda Secret Solstice, sem annast framleiðslu á staðnum fyrir Iceland Eclipse.",
            ],
          },
        ],
      },
      {
        id: "energy-center",
        title: "Orkustöð jarðar",
        blocks: [
          {
            kind: "list",
            items: [
              "**Orkustöðvar jarðar:** Snæfellsjökull er talinn ein af sjö helstu orkustöðvum jarðar, svokölluðum „sjökrum“ hennar. Sagt er að heimsókn á svæðið geti veitt andlegan innblástur og uppljómun og sumir segjast jafnvel eiga erfitt með svefn vegna hinnar sterku orku sem þeir skynja.",
              "**Hjartastöðin:** sumir trúa því einnig að jökullinn geymi hjartastöð jarðarinnar og að heimsókn þangað geti opnað hjartað og eflt kærleika.",
            ],
          },
        ],
      },
      {
        id: "literary",
        title: "Táknmynd í bókmenntum",
        blocks: [
          {
            kind: "list",
            items: [
              "**Hlið Jules Verne:** heimsfrægð Snæfellsjökuls sem dulmagnaðs staðar var innsigluð með skáldsögu Jules Verne frá 1864, *Leyndardómum Snæfellsjökuls*. Í bókinni finna söguhetjurnar inngang að undirheimum í gíg eldfjallsins. Þótt Verne hafi aldrei komið til Íslands festu lýsingar hans í sessi ímynd jökulsins sem hliðs að hinu óþekkta og staðar undra.",
              "**Önnur verk:** jökullinn hefur haldið áfram að veita rithöfundum og listafólki innblástur, þar á meðal nóbelsskáldinu Halldóri Laxness í skáldsögunni *Kristnihald undir Jökli*.",
            ],
          },
        ],
      },
      {
        id: "modern",
        title: "Andlegt vægi í nútímanum",
        blocks: [
          {
            kind: "list",
            items: [
              "**Samkomur:** jökullinn hefur lengi dregið að sér andlega leitendur. Hápunkturinn var samkoma áhugafólks um dulræn fyrirbæri árið 1993, sem kom í von um að [taka á móti geimverum](https://www.whatson.is/aliens-iceland-ufos-almost-came-snaefellsjokull/). Þótt fundurinn margumtalaði hafi aldrei átt sér stað undirstrikar atvikið sterkt orðspor jökulsins sem staðar þar sem efnisheimurinn og andlegi heimurinn eru taldir skarast.",
              "**Persónuleg upplifun:** enn þann dag í dag segjast margir gestir finna fyrir sérstakri orku eða friðsæld þegar þeir heimsækja svæðið í kringum Snæfellsjökul. Þessi tilfinning, ásamt stórbrotinni náttúrufegurð og mörgum lögum sögunnar, tryggir jöklinum dulúðlega stöðu sína um ókomna tíð.",
            ],
          },
        ],
      },
    ],
  },
{
    slug: "stage-takeovers",
    title: "Sviðsyfirtökur",
    category: "highlights-news",
    hero: "/articles/stage-takeovers.jpg",
    heroAlt: "Upplýst hvolfsvið að nóttu til",
    summary:
      "Amnesia Ibiza og Free From Sleep taka hvort um sig yfir Aurora-tjaldið í heila nótt af raftónlist.",
    sections: [
      {
        id: "overview",
        blocks: [
          {
            kind: "p",
            text:
              "Sviðsyfirtaka er heil nótt sem er afhent einum utanaðkomandi hópi eða vörumerki, sem mótar dagskrána, hljóðheiminn og yfirbragð Aurora-tjaldsins það kvöld. Í stað þess að eitt gestasett sé fellt inn í hefðbundna dagskrá verður nóttin öll þeirra.",
          },
          {
            kind: "p",
            text:
              "Aurora (Norðurljós) er raftónlistartjald Iceland Eclipse, þar sem spilað er djúpt og samfellt fram á morgun, allt frá teknói yfir í drum and bass og melódískt house. Þegar líður á daginn breytist tjaldið í vettvang fyrir fyrirlestra, vinnustofur og léttari dagskrá áður en tónlistin tekur völdin á ný hvert kvöld. Handhafar Celestial Voyager-passa hafa sérstakt setusvæði, bar og útsýnissvæði inni í Aurora.",
          },
          { kind: "image", src: "/articles/embeds/aurora-tent.jpg", alt: "Aurora-tjaldið upplýst að nóttu til" },
        ],
      },
      {
        id: "amnesia-pyramid",
        title: "Amnesia Ibiza kynnir Pyramid",
        blocks: [
          {
            kind: "p",
            text:
              "**Fimmtudagur 13. ágúst.** Nóttina eftir almyrkvann flytur Amnesia Ibiza Pyramid-kvöldið sitt í Aurora og tekur tjaldið alfarið yfir. Pyramid varð til árið 2018 og er orðið eitt virtasta klúbbakonsept Ibiza, byggt á tónlistinni fyrst og fremst, frelsi í gegnum dans og einlægum mannlegum tengslum. Yfirtakan í ár markar jafnframt 50 ára afmæli Amnesia.",
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
          { kind: "image", src: "/articles/embeds/takeover-free-from-sleep.jpg", alt: "Myndefni fyrir yfirtöku Free From Sleep" },
          {
            kind: "p",
            text:
              "**Föstudagur 14. ágúst.** Lundúnahópurinn Free From Sleep hefur sett saman heilt kvöld í Aurora. Free From Sleep var stofnað árið 2017 og hefur á tæpum áratug byggt upp einn virtasta óháða viðburðavettvang Bretlands, þekktan fyrir teknó, house, drum and bass, prog og elektró, á stöðum á borð við Printworks, Ministry of Sound og Corsica Studios.",
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
    title: "Samfélagsleiðarvísir",
    category: "highlights-news",
    hero: "/articles/community-guide.jpg",
    heroAlt: "Hátíðargestir með hendur á lofti í kvöldsólinni",
    summary:
      "Ásetningur okkar og meginreglurnar fjórar sem móta hvernig við mætum hvert öðru og þessum stað.",
    sections: [
      {
        id: "intention",
        title: "Ásetningur okkar",
        blocks: [
          {
            kind: "p",
            text:
              "Að skapa saman stundir einlægra tengsla hvert við annað og við alheiminn. Á meðan við undirbúum okkur fyrir himneska samkomu okkar og böðum okkur í eftirljóma hennar sköpum við saman röð umbreytandi upplifana sem hvetja okkur til að íhuga, fagna og kanna hvað það þýðir að vera manneskja á þessum tíma og stað.",
          },
          {
            kind: "p",
            text:
              "Allir þátttakendur, hvort sem það eru myrkvafarar, tónlistarunnendur, fyrirlesarar eða listafólk, fara frá þessari upplifun með nýja plánetusýn sem eykur lífsgæði þeirra. Þegar öllu er á botninn hvolft snýst þetta um að byggja upp sterkt samfélag samsköpunar, rými þar sem við könnum, fögnum og dreymum saman og setjum okkur ásetning um bjarta framtíð.",
          },
          {
            kind: "p",
            text:
              "Hér á eftir fer sameiginleg heimsmynd okkar, ófrávíkjanlegu meginreglurnar sem móta hvernig við mætum hvert öðru og þessum stað.",
          },
        ],
      },
      {
        id: "one-crew",
        title: "1. Við erum ein áhöfn",
        blocks: [
          {
            kind: "p",
            text:
              "Við ferðumst saman á brothættu fari gegnum tíma og rúm, þar sem hvert kerfi er öðru háð. Geimfarar kalla þessa uppgötvun „yfirsýnaráhrifin“ (The Overview Effect). Frumbyggjar hafa lengi lifað eftir henni. Frá jörðu og úr geimnum er sannleikurinn sá sami. Með þessa kosmísku sýn að leiðarljósi iðkum við sameiginlega ábyrgð.",
          },
        ],
      },
      {
        id: "stewards",
        title: "2. Við erum verndarar allra heima",
        blocks: [
          {
            kind: "p",
            text:
              "Það sem við iðkum hér teygir sig út fyrir þessa stund. Hvernig við hlustum, sýnum umhyggju og vinnum saman mótar það sem koma skal. Við komum saman til að æfa okkur í þeirri framtíð sem við viljum búa í — á jörðinni, í samfélagi og um allan alheiminn.",
          },
        ],
      },
      {
        id: "honor-the-land",
        title: "3. Við heiðrum landið",
        blocks: [
          {
            kind: "p",
            text:
              "Landið er gestgjafi okkar, kennari og miðlæg nærvera í samkomu okkar. Við mótum hátíðina í samvinnu við fólkið, menninguna og lifandi vistkerfi Íslands. Við komum af auðmýkt og alúð, iðkum gagnkvæmni og öxlum ábyrgð á umgengni sem skilur engin spor eftir sig.",
          },
        ],
      },
      {
        id: "co-create",
        title: "4. Við sköpum framtíðina saman",
        blocks: [
          {
            kind: "p",
            text:
              "Í árþúsundir hafa sólmyrkvar umbreytt skilningi mannkyns á stöðu sinni í alheiminum og markað mikilvægar stundir uppgjörs, lotningar og endurnýjunar. Í eftirljóma almyrkvans gerum við tilraunir með nýjar leiðir til að vera manneskjur saman og könnum þær í gegnum tónlist, list, vísindi, hreyfingu, helgisiði og samtöl. Það sem við sköpum saman nær út fyrir þessa samkomu, mótað af lotningu, og mótar þá framtíð sem við erum í óðaönn að byggja.",
          },
        ],
      },
    ],
  },
  {
    slug: "ceremonies",
    title: "Athafnir",
    category: "highlights-news",
    hero: "/articles/ceremonies.jpg",
    heroAlt: "Helgistund í Hring Traðar",
    summary:
      "Athafnagarðurinn, Hringur Traðar og helgiferðalagið inn í almyrkvann.",
    sections: [
      {
        id: "overview",
        blocks: [
          {
            kind: "p",
            text:
              "Í hjarta hátíðarinnar er Athafnagarðurinn, röð upplifana sem byggjast á persónulegum ásetningi, lifandi helgitónlist og sameiginlegri kyrrð. Miðpunkturinn er Hringur Traðar, stór helgimandala sem er byggð í aflíðandi engi sem myndar náttúrulegt hringleikahús.",
          },
          {
            kind: "p",
            text:
              "Þú gengur inn um eitt af fjórum pýramídahliðum, hvert þeirra gætt af verndarvætti úr íslenskri goðafræði: **erninum, uxanum, drekanum og eldjötninum.**",
          },
          {
            kind: "p",
            text:
              "Inni í hringnum sveigjast fimmtán sætaraðir um tæplega tveggja metra hátt vatnsaltari. Í miðju þess er gosbrunnur, með hraungrýti og kristöllum á stjörnutetraeder-grunni sem er um fimm og hálfur metri í þvermál, og villiblóm geisla út frá honum í lifandi mandölu. Fimmtán hundruð okkar snúa saman inn á við. Þetta er gáttin sem við göngum inn í þegar jörðin, tunglið og sólin raðast í beina línu.",
          },
          { kind: "cta", label: "Nánar", href: "https://icelandeclipse.com/ceremony" },
        ],
      },
      {
        id: "the-welcoming",
        title: "Móttökuathöfnin",
        blocks: [
          { kind: "image", src: "/articles/embeds/ceremony-welcoming.jpg", alt: "Myndefni fyrir Móttökuathöfnina" },
          {
            kind: "p",
            text:
              "**11. ágúst 2026, kl. 17:00 UTC.** Opnunarathöfnin leggur grunninn að vikunni. Íslenskir öldungar og söngvarar leiða okkur gegnum goðafræði, sögur og forn þjóðlög og vekja til lífsins sagnir af jöklum, álfum, dvergum, hvölum, eldjötnum og vatnadrekum. Kakó- og elixírbarinn er opinn meðan á upplifuninni stendur og býður upp á heita drykki á meðan ásetningur er settur fyrir vikuna fram undan.",
          },
          {
            kind: "p",
            text:
              "Athöfninni lýkur með setti frá AWARË sem leiðir hringinn inn í sólsetrið frá Vatnsaltarinu í miðjunni.",
          },
          {
            kind: "list",
            items: [
              "Í umsjón Unify.org",
              "Dr. Haraldur Eriendsson, íslenskur öldungur",
              "Bless Sing, íslenskt tónlistarfólk sem flytur forna þjóðlagatónlist",
              "Lokasett með AWARË",
            ],
          },
        ],
      },
      {
        id: "the-eclipse-ceremony",
        title: "Myrkvaathöfnin",
        blocks: [
          { kind: "image", src: "/articles/embeds/ceremony-eclipse.jpg", alt: "Myrkvaathöfnin í Hring Traðar" },
          {
            kind: "p",
            text:
              "**12. ágúst 2026, kl. 16:00 UTC.** Fleiri en fimmtán tónlistarmenn, átján kvenna kór og tólf manna trommusveit leiða fjörutíu og fimm mínútna ferðalag inn í myrkvann, byggt á helgiflutningi með rætur í íslenskri goðsagnahefð. Athöfnin fylgir tónlistarsöguþræði í mörgum köflum og stigmagnast upp í sameiginlegan hápunkt í þögn á meðan á almyrkvanum stendur.",
          },
          {
            kind: "p",
            text:
              "Í umsjón Patricks Kronfli hjá Unify.org og Isis Indriya frá Academy of Oracle Arts. Fram koma Poranguí, Snow Raven, Marakame Rogelio Carrillo, Ruby Chase, Tina Rodriguez, Emily Fletcher, Ashley Klein, Franko Heke, Júlía Óttarsdóttir, Scarlett de la Torre, Dr. Haraldur, Diana Carr, íslenskt tónlistarfólk og átján kvenna kór ásamt tólf trommuleikurum.",
          },
        ],
      },
      {
        id: "evening-dance",
        title: "Kvölddans með Poranguí",
        blocks: [
          { kind: "image", src: "/articles/embeds/ceremony-dance.jpg", alt: "Kvölddans þegar birtan snýr aftur" },
          {
            kind: "p",
            text:
              "**12. ágúst 2026, í kjölfar Myrkvaathafnarinnar.** Þegar birtan snýr aftur yfir landið færist hringurinn úr kyrrð yfir í hreyfingu. Poranguí leiðir umskiptin og fléttar saman takti, andardrætti og rödd í lifandi helgihljóðheim. Það sem var haldið í þögn losnar úr læðingi í dansi og ber stundina áfram á meðan hringurinn fagnar saman.",
          },
        ],
      },
    ],
  },
];
