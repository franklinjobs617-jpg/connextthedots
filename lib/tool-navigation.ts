/** The name-tracing tool has one English route, independent of the site's locale. */
export const NAME_TRACING_HREF = "/name-tracing-worksheet/";

const nameTracingLabels = {
  en: "Name Tracing",
  de: "Namen nachspuren (Englisch)",
  es: "Repasar nombres (Inglés)",
  pt: "Traçar nomes (Inglês)",
  fr: "Tracer un prénom (Anglais)",
  it: "Ricalca il nome (Inglese)",
  nl: "Naam overtrekken (Engels)",
} as const;

export function nameTracingLink(locale: string) {
  return {
    href: NAME_TRACING_HREF,
    hrefLang: "en",
    label: nameTracingLabels[locale as keyof typeof nameTracingLabels] ?? nameTracingLabels.en,
  };
}
