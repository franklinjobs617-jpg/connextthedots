/** Curated evidence snapshot, not a runtime availability check.
 * All/Adults: 02 Work production browser QA, 2026-10-27.
 * Exactly 100: 02 Work production browser + 12 PDF downloads, 2026-10-29,
 * deployment FovqtU67qKFXsw4CxjdgwcvuMtYG / bd2ad512. Full D0 still has
 * HTTP/mobile gaps. C14 rechecks local routes and unchanged asset bytes.
 * 2026-10-31: Alphabet and Skip Counting are both in deployed main. Current
 * production route/PDF checks are access-blocked; HQ evidence is pending.
 * Keep their existing factual body links; promote only after that evidence.
 */
export const collectionCatalog = [
  { id: "all", path: "/printable-connect-the-dots/", englishOnly: false, productionVerified: true },
  { id: "adults", path: "/connect-the-dots-for-adults/", englishOnly: false, productionVerified: true },
  { id: "hundred", path: "/connect-the-dots-1-to-100/", englishOnly: true, productionVerified: true },
  { id: "alphabet", path: "/alphabet-dot-to-dot/", englishOnly: true, productionVerified: false },
  { id: "skip", path: "/skip-counting-dot-to-dot/", englishOnly: true, productionVerified: false },
] as const;

export const printableCollections = collectionCatalog.filter(item => item.productionVerified);

export const navigationCopy = {
  en: { title: "Free Printables", all: "All Printables", adults: "Adults", hundred: "100 Dots", alphabet: "Alphabet", skip: "Skip Counting", heading: "Browse printable collections", menu: "Navigation", worksheets: "Original PDF worksheets", preview: "Preview & details", puzzle: "Puzzle", answer: "Answer", dots: "dots", english: "English" },
  de: { title: "Kostenlose Druckvorlagen", all: "Alle Druckvorlagen", adults: "Erwachsene", hundred: "100 Punkte", alphabet: "Alphabet", skip: "Zählen in Schritten", heading: "Sammlungen entdecken", menu: "Navigation", worksheets: "Originale PDF-Arbeitsblätter", preview: "Vorschau & Details", puzzle: "Rätsel", answer: "Lösung", dots: "Punkte", english: "Englisch" },
  es: { title: "Imprimibles gratis", all: "Todos los imprimibles", adults: "Adultos", hundred: "100 puntos", alphabet: "Alfabeto", skip: "Conteo por saltos", heading: "Explorar colecciones", menu: "Navegación", worksheets: "Fichas PDF originales", preview: "Vista previa y detalles", puzzle: "Actividad", answer: "Solución", dots: "puntos", english: "Inglés" },
  pt: { title: "Imprimíveis grátis", all: "Todos os imprimíveis", adults: "Adultos", hundred: "100 pontos", alphabet: "Alfabeto", skip: "Contagem por saltos", heading: "Explorar coleções", menu: "Navegação", worksheets: "Fichas PDF originais", preview: "Prévia e detalhes", puzzle: "Atividade", answer: "Solução", dots: "pontos", english: "Inglês" },
  fr: { title: "Fiches gratuites", all: "Toutes les fiches", adults: "Adultes", hundred: "100 points", alphabet: "Alphabet", skip: "Comptage par bonds", heading: "Explorer les collections", menu: "Navigation", worksheets: "Fiches PDF originales", preview: "Aperçu et détails", puzzle: "Fiche", answer: "Solution", dots: "points", english: "Anglais" },
  it: { title: "Schede gratuite", all: "Tutte le schede", adults: "Adulti", hundred: "100 puntini", alphabet: "Alfabeto", skip: "Conteggio a salti", heading: "Esplora le raccolte", menu: "Navigazione", worksheets: "Schede PDF originali", preview: "Anteprima e dettagli", puzzle: "Schema", answer: "Soluzione", dots: "puntini", english: "Inglese" },
  nl: { title: "Gratis werkbladen", all: "Alle werkbladen", adults: "Volwassenen", hundred: "100 stippen", alphabet: "Alfabet", skip: "Tellen in sprongen", heading: "Bekijk collecties", menu: "Navigatie", worksheets: "Originele PDF-werkbladen", preview: "Voorbeeld en details", puzzle: "Puzzel", answer: "Antwoord", dots: "stippen", english: "Engels" },
} as const;

export function collectionCopy(locale: string) {
  return navigationCopy[locale as keyof typeof navigationCopy] ?? navigationCopy.en;
}

export function collectionHref(item: typeof printableCollections[number], locale: string) {
  return item.englishOnly || locale === "en" ? item.path : `/${locale}${item.path}`;
}
