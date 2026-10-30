import { localizedCopy, localizedLocale } from "@/lib/localized-copy";

export default function LocalizedHomeGuide({ locale }: { locale: string }) {
  const language = localizedLocale(locale);
  if (!language) return null;
  const copy = localizedCopy[language];
  return <section lang={language} aria-labelledby="localized-home-guide" data-localized-home className="mx-auto max-w-6xl rounded-2xl bg-indigo-50 px-6 py-10">
    <h2 id="localized-home-guide" className="text-2xl font-bold text-slate-900">{copy.homeHeading}</h2>
    <p className="mt-4 max-w-4xl leading-7 text-slate-700">{copy.homeIntro}</p>
    <ol className="mt-5 list-decimal space-y-2 pl-5 text-slate-700">{copy.steps.map(step => <li key={step}>{step}</li>)}</ol>
    <div className="mt-6 flex flex-wrap gap-4">
      <a href="#hero-upload-btn" className="rounded-lg bg-brand-blue px-5 py-3 font-semibold text-white">{copy.upload}</a>
      <a href={`/${language}/printable-connect-the-dots/`} className="rounded-lg border border-brand-blue bg-white px-5 py-3 font-semibold text-brand-blue">{copy.browse}</a>
    </div>
  </section>;
}
