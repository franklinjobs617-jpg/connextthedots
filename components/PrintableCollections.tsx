import { collectionCopy, collectionHref, printableCollections } from "@/lib/printable-collections";

export default function PrintableCollections({ locale }: { locale: string }) {
  const copy = collectionCopy(locale);
  return <section className="mx-auto max-w-6xl px-6 py-10" aria-label={copy.heading} data-verified-collections>
    <h2 className="text-2xl font-bold text-slate-900">{copy.heading}</h2>
    <ul className="mt-5 grid gap-3 sm:grid-cols-3">
      {printableCollections.map(item => <li key={item.id}>
        <a href={collectionHref(item, locale)} hrefLang={item.englishOnly ? "en" : locale}
          className="block rounded-xl border border-slate-200 bg-white px-5 py-4 font-semibold text-brand-blue hover:border-brand-blue focus-visible:outline-2 focus-visible:outline-offset-4">
          {copy[item.id]}{item.englishOnly && <span className="ml-2 text-sm font-normal">({copy.english})</span>}
        </a>
      </li>)}
    </ul>
  </section>;
}
