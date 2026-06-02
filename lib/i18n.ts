"use client";

import { useCallback } from "react";
import { useSettings } from "./useSettings";
import type { Lang } from "./types";

/**
 * Lightweight i18n. UI chrome strings live in the dictionary below; longer
 * devotional content is translated in its own content modules (each exports an
 * `{ en, es }` map). Anything not yet translated falls back to English.
 */
type Entry = { en: string; es: string };

const UI = {
  // Bottom nav
  "nav.home": { en: "Home", es: "Inicio" },
  "nav.examine": { en: "Examine", es: "Examen" },
  "nav.contrition": { en: "Contrition", es: "Contrición" },
  "nav.resources": { en: "Resources", es: "Recursos" },
  "nav.notes": { en: "Notes", es: "Notas" },

  // Home
  "home.sinceLast": { en: "Since last confession", es: "Desde la última confesión" },
  "home.notRecorded": { en: "Not yet recorded", es: "Aún no registrada" },
  "home.notRecordedBody": {
    en: "Begin by recording your last confession. From there, Reconcile keeps the count for you.",
    es: "Comienza registrando tu última confesión. A partir de ahí, Reconcile lleva la cuenta por ti.",
  },
  "home.history": { en: "History", es: "Historial" },

  // Record flow
  "record.cta": { en: "I just went to confession", es: "Acabo de confesarme" },
  "record.logPast": { en: "Log a past confession", es: "Registrar una confesión anterior" },

  // Settings
  "settings.title": { en: "Settings", es: "Configuración" },
  "settings.language": { en: "Language", es: "Idioma" },
  "settings.textSize": { en: "Text size", es: "Tamaño del texto" },
  "common.normal": { en: "Normal", es: "Normal" },
  "common.large": { en: "Large", es: "Grande" },
} as const satisfies Record<string, Entry>;

export type UIKey = keyof typeof UI;

export function translate(lang: Lang, key: UIKey): string {
  const entry = UI[key];
  return entry[lang] ?? entry.en;
}

export function useLang() {
  const { settings } = useSettings();
  const lang: Lang = settings.language ?? "en";
  const t = useCallback((key: UIKey) => translate(lang, key), [lang]);
  return { lang, t };
}

/** Pick the language variant of a content map, falling back to English. */
export function pick<T>(map: Record<Lang, T>, lang: Lang): T {
  return map[lang] ?? map.en;
}
