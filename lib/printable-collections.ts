/** Curated evidence snapshot, not a runtime availability check.
 * All/Adults: 02 Work production browser QA, 2026-10-27.
 * Exactly 100: 02 Work production browser + 12 PDF downloads, 2026-10-29,
 * deployment FovqtU67qKFXsw4CxjdgwcvuMtYG / bd2ad512. Full D0 still has
 * HTTP/mobile gaps. C14 rechecks local routes and unchanged asset bytes.
 * Alphabet: deployed, production route/download validation pending; not promoted.
 * Skip Counting: not deployed; not promoted. Do not enable from PR presence.
 */
export const printableCollections = [
  { id: "all", path: "/printable-connect-the-dots/", englishOnly: false },
  { id: "adults", path: "/connect-the-dots-for-adults/", englishOnly: false },
  { id: "hundred", path: "/connect-the-dots-1-to-100/", englishOnly: true },
] as const;

export const navigationCopy = {
  en: { title: "Free Printables", all: "All Printables", adults: "Adults", hundred: "100 Dots", heading: "Browse printable collections", menu: "Navigation", worksheets: "Original PDF worksheets", preview: "Preview & details", puzzle: "Puzzle", answer: "Answer", dots: "dots", english: "English" },
  de: { title: "Kostenlose Druckvorlagen", all: "Alle Druckvorlagen", adults: "Erwachsene", hundred: "100 Punkte", heading: "Sammlungen entdecken", menu: "Navigation", worksheets: "Originale PDF-Arbeitsblätter", preview: "Vorschau & Details", puzzle: "Rätsel", answer: "Lösung", dots: "Punkte", english: "Englisch" },
  es: { title: "Imprimibles gratis", all: "Todos los imprimibles", adults: "Adultos", hundred: "100 puntos", heading: "Explorar colecciones", menu: "Navegación", worksheets: "Fichas PDF originales", preview: "Vista previa y detalles", puzzle: "Actividad", answer: "Solución", dots: "puntos", english: "Inglés" },
  pt: { title: "Imprimíveis grátis", all: "Todos os imprimíveis", adults: "Adultos", hundred: "100 pontos", heading: "Explorar coleções", menu: "Navegação", worksheets: "Fichas PDF originais", preview: "Prévia e detalhes", puzzle: "Atividade", answer: "Solução", dots: "pontos", english: "Inglês" },
  fr: { title: "Fiches gratuites", all: "Toutes les fiches", adults: "Adultes", hundred: "100 points", heading: "Explorer les collections", menu: "Navigation", worksheets: "Fiches PDF originales", preview: "Aperçu et détails", puzzle: "Fiche", answer: "Solution", dots: "points", english: "Anglais" },
  it: { title: "Schede gratuite", all: "Tutte le schede", adults: "Adulti", hundred: "100 puntini", heading: "Esplora le raccolte", menu: "Navigazione", worksheets: "Schede PDF originali", preview: "Anteprima e dettagli", puzzle: "Schema", answer: "Soluzione", dots: "puntini", english: "Inglese" },
  nl: { title: "Gratis werkbladen", all: "Alle werkbladen", adults: "Volwassenen", hundred: "100 stippen", heading: "Bekijk collecties", menu: "Navigatie", worksheets: "Originele PDF-werkbladen", preview: "Voorbeeld en details", puzzle: "Puzzel", answer: "Antwoord", dots: "stippen", english: "Engels" },
} as const;

export function collectionCopy(locale: string) {
  return navigationCopy[locale as keyof typeof navigationCopy] ?? navigationCopy.en;
}

export function collectionHref(item: typeof printableCollections[number], locale: string) {
  return item.englishOnly || locale === "en" ? item.path : `/${locale}${item.path}`;
}
