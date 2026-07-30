import type { Locale } from "./locales";
import en from "@/dictionaries/en.json";
import cz from "@/dictionaries/cz.json";

const dictionaries = { en, cz };

export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
