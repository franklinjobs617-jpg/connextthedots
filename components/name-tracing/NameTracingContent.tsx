/* eslint-disable @next/next/no-html-link-for-pages -- Native links preserve the isolated root without RSC prefetch under connect-src none. */
/** Static useful body copy. No form state, providers, SDKs or schema injection. */
export default function NameTracingContent() {
  return <>
    <section className="nt-display-section" aria-labelledby="nt-how-title"><p className="nt-display-eyebrow">FROM SCREEN TO PRACTICE</p><h2 id="nt-how-title">A name worksheet in three steps</h2>
      <ol className="nt-display-steps"><li><h3>Choose your settings</h3><p>Enter one name and choose A4 or US Letter. Full page is recommended; choose fewer rows for a shorter practice session.</p></li><li><h3>Generate and check</h3><p>Check the spelling and current preview. Changing a setting clears the old result. Generate again before downloading.</p></li><li><h3>Download and print</h3><p>Save the current PDF and choose matching paper. Use Actual size (100%) in your PDF viewer’s print settings.</p></li></ol>
    </section>
    <section className="nt-display-section nt-display-print-help" aria-labelledby="nt-print-title"><h2 id="nt-print-title">Before you print</h2><div className="nt-display-help-grid">
      <article><h3>A4 or US Letter?</h3><p>Use the paper size loaded in your printer: A4 is 210 × 297 mm; US Letter is 8.5 × 11 in. Check the print preview and turn off “Fit to page” if it changes the scale.</p></article>
      <article><h3>Full page or fewer rows?</h3><p>Full page uses the available practice area with readable lettering and safe margins. Check the actual row count shown after generation. Choosing fewer rows leaves more white space.</p></article>
      <article><h3>Long names and supported characters</h3><p>Use up to 40 characters: Latin letters, supported accents, spaces, hyphens and apostrophes. Lettering fits the available width. If it would become too small, shorten the name. Remove unsupported symbols when prompted.</p></article>
      <article><h3>Does it teach stroke order?</h3><p>No. The worksheet provides dotted lettering with optional top, middle and baseline guides. It does not show stroke order or provide handwriting instruction.</p></article>
      <article><h3>If generation fails</h3><p>Read the error, check the name and select Try again. A failed or changed worksheet cannot be downloaded as a current result. Your browser may pause while preparing a PDF.</p></article>
      <article><h3>Examples and your custom PDF</h3><p>The ready-made examples use Emma and Alex. Choose a paper size to download an available example without entering a name. Your custom worksheet is created with the tool above.</p></article>
    </div></section>
    <section className="nt-display-section" aria-labelledby="nt-related-title"><div className="nt-display-section-head"><h2 id="nt-related-title">Keep exploring</h2><a href="/printable-connect-the-dots/" rel="noreferrer">All printables →</a></div><div className="nt-display-related">
      <a href="/alphabet-dot-to-dot/" hrefLang="en" rel="noreferrer"><span className="nt-display-mark" aria-hidden="true">Aa</span><h3>Alphabet dot-to-dot</h3><p>Try a letter-based printable activity.</p><span>English collection →</span></a>
      <a href="/skip-counting-dot-to-dot/" hrefLang="en" rel="noreferrer"><span className="nt-display-mark" aria-hidden="true">2 · 4 · 6</span><h3>Skip counting</h3><p>Explore puzzles that count in steps.</p><span>English collection →</span></a>
      <a href="/connect-the-dots-for-adults/" rel="noreferrer"><span className="nt-display-mark" aria-hidden="true">1 · 2 · 3</span><h3>More detailed puzzles</h3><p>Browse the adult dot-to-dot collection.</p><span>Browse Adults →</span></a>
    </div></section>
    <section className="nt-display-section nt-display-privacy" aria-labelledby="nt-display-privacy-title"><h2 id="nt-display-privacy-title">About your name and privacy</h2><p>The name you type is used in this browser to make the preview and PDF. This tool does not add it to the web address or download file name, or send it to an application API.</p><p>Keep names out of links. A name placed manually in a web address may reach hosting logs or appear in an initial framework response before the clean entry opens. Clearing the address later does not undo that initial handling.</p><p className="nt-display-font-credit">Dotted lettering: Raleway Dots, under the <a href="/fonts/name-tracing/v1/OFL.txt" rel="noreferrer">SIL Open Font License</a>.</p></section>
  </>;
}
