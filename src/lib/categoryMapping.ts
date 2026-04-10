import { ShopCategory } from "@/types/analysis";

export type SectionKey =
  | "prodejce"
  | "vraceni"
  | "reklamace"
  | "platby"
  | "doprava"
  | "storno"
  | "predplatne_info"
  | "ochrana_kupujiciho"
  | "licence_digital"
  | "akce_zruseni"
  | "pojisteni"
  | "jidlo_kvalita"
  | "lekarna_info";

export const CATEGORY_SECTIONS: Record<ShopCategory, SectionKey[]> = {
  eshop_zbozi: ["prodejce", "vraceni", "reklamace", "platby", "doprava"],
  marketplace: ["prodejce", "ochrana_kupujiciho", "vraceni", "reklamace", "doprava"],
  predplatne: ["prodejce", "predplatne_info", "storno", "licence_digital", "platby"],
  vstupenky: ["prodejce", "akce_zruseni", "storno", "platby"],
  cestovani: ["prodejce", "storno", "pojisteni", "platby"],
  jidlo_rozvoz: ["prodejce", "jidlo_kvalita", "storno", "platby"],
  doprava_jizdenky: ["prodejce", "storno", "pojisteni", "platby"],
  digitalni_produkt: ["prodejce", "licence_digital", "vraceni", "ochrana_kupujiciho", "platby"],
  lekarny: ["prodejce", "lekarna_info", "reklamace", "doprava", "platby"],
};

export const CATEGORY_LABELS: Record<ShopCategory, { emoji: string; label: string }> = {
  eshop_zbozi: { emoji: "🛒", label: "E-shop se zbožím" },
  marketplace: { emoji: "🏬", label: "Marketplace / Tržiště" },
  predplatne: { emoji: "🔄", label: "Předplatné / Digitální služba" },
  vstupenky: { emoji: "🎫", label: "Vstupenky na akce" },
  cestovani: { emoji: "✈️", label: "Cestování a ubytování" },
  jidlo_rozvoz: { emoji: "🍔", label: "Rozvoz jídla" },
  doprava_jizdenky: { emoji: "🚆", label: "Doprava a jízdenky" },
  digitalni_produkt: { emoji: "💾", label: "Digitální produkt" },
  lekarny: { emoji: "💊", label: "Lékárna" },
};

export const CATEGORY_DESCRIPTIONS: Record<ShopCategory, string> = {
  eshop_zbozi: "Klasický e-shop prodávající fyzické zboží (elektronika, oblečení, potraviny…)",
  marketplace: "Tržiště zprostředkovávající prodej od více prodejců (Amazon, Temu, AliExpress…)",
  predplatne: "Služba s pravidelným předplatným (Netflix, Spotify, Adobe…)",
  vstupenky: "Prodej vstupenek na koncerty, festivaly, divadlo…",
  cestovani: "Rezervace ubytování, letenek, zájezdů (Booking, Airbnb, Kiwi…)",
  jidlo_rozvoz: "Rozvoz jídla a potravin (Wolt, Rohlik, Bolt Food…)",
  doprava_jizdenky: "Prodej jízdenek na vlak, autobus, letadlo (ČD, RegioJet, FlixBus…)",
  digitalni_produkt: "Jednorázový nákup digitálního obsahu (hry, e-knihy, software…)",
  lekarny: "Online lékárna (Dr. Max, Pilulka…)",
};

export const DOMAIN_CATEGORY_MAP: Record<string, ShopCategory> = {
  "alza.cz": "eshop_zbozi",
  "czc.cz": "eshop_zbozi",
  "notino.cz": "eshop_zbozi",
  "hm.com": "eshop_zbozi",
  "ikea.cz": "eshop_zbozi",
  "mall.cz": "eshop_zbozi",
  "datart.cz": "eshop_zbozi",
  "tsbohemia.cz": "eshop_zbozi",
  "amazon.com": "marketplace",
  "amazon.de": "marketplace",
  "temu.com": "marketplace",
  "aliexpress.com": "marketplace",
  "wish.com": "marketplace",
  "ebay.com": "marketplace",
  "netflix.com": "predplatne",
  "spotify.com": "predplatne",
  "adobe.com": "predplatne",
  "apple.com": "predplatne",
  "hbomax.com": "predplatne",
  "ticketmaster.com": "vstupenky",
  "ticketmaster.cz": "vstupenky",
  "goout.net": "vstupenky",
  "nfctron.com": "vstupenky",
  "ticketportal.cz": "vstupenky",
  "booking.com": "cestovani",
  "airbnb.com": "cestovani",
  "kiwi.com": "cestovani",
  "pelikan.cz": "cestovani",
  "hotels.com": "cestovani",
  "wolt.com": "jidlo_rozvoz",
  "rohlik.cz": "jidlo_rozvoz",
  "kosik.cz": "jidlo_rozvoz",
  "dameјidlo.cz": "jidlo_rozvoz",
  "bolt.eu": "jidlo_rozvoz",
  "cd.cz": "doprava_jizdenky",
  "regiojet.cz": "doprava_jizdenky",
  "flixbus.cz": "doprava_jizdenky",
  "flixbus.com": "doprava_jizdenky",
  "idos.cz": "doprava_jizdenky",
  "store.steampowered.com": "digitalni_produkt",
  "steampowered.com": "digitalni_produkt",
  "gog.com": "digitalni_produkt",
  "epicgames.com": "digitalni_produkt",
  "palmknihy.cz": "digitalni_produkt",
  "drmax.cz": "lekarny",
  "pilulka.cz": "lekarny",
  "lekarna.cz": "lekarny",
  "benu.cz": "lekarny",
};
