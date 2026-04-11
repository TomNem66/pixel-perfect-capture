export const DISPLAY_DEFAULTS = {
  vraceni: {
    lhuta_dny: 14,
    kdo_plati_postovne: "zákazník" as const,
    vyjimky: [] as string[],
    sankce: null as string | null,
    lhuta_vraceni_penez_dny: 14,
  },
  reklamace: {
    zarucni_doba_mesice: 24,
    reklamace_v_zahranici: false,
    lhuta_vyrizeni_dny: 30,
    lhuta_vraceni_penez_dny: null as number | null,
  },
  platby: {
    ceny_vcetne_dph: true,
    skryte_poplatky: [] as string[],
    sankce_nevyzvedni: null as string | null,
  },
  doprava: {
    sledovani_zasilky: true,
  },
} as const;

type Primitive = string | number | boolean | null | undefined;

export function isDefaultValue(
  section: keyof typeof DISPLAY_DEFAULTS,
  field: string,
  value: Primitive | string[]
): boolean {
  const defaults = DISPLAY_DEFAULTS[section] as Record<string, unknown>;
  if (!(field in defaults)) return false;

  const defaultVal = defaults[field];

  if (Array.isArray(value) && Array.isArray(defaultVal)) {
    return value.length === defaultVal.length;
  }

  return value === defaultVal;
}

export function isBetterThanDefault(
  section: string,
  field: string,
  value: Primitive
): boolean {
  if (section === "vraceni" && field === "lhuta_dny" && typeof value === "number") {
    return value > 14;
  }
  if (section === "vraceni" && field === "kdo_plati_postovne") {
    return value === "e-shop";
  }
  if (section === "reklamace" && field === "zarucni_doba_mesice" && typeof value === "number") {
    return value > 24;
  }
  if (section === "reklamace" && field === "lhuta_vyrizeni_dny" && typeof value === "number") {
    return value < 30;
  }
  return false;
}
