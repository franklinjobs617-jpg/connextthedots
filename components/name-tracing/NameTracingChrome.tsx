/* eslint-disable @next/next/no-html-link-for-pages -- Native document links preserve the isolated root and avoid RSC prefetch under connect-src none. */
import type { ReactNode } from 'react';
import { nameTracingLogo } from './brand-logo';
import NameTracingExamples from './NameTracingExamples';
import NameTracingContent from './NameTracingContent';
import type { ExampleAsset } from './example-types';

const collections = [
  ['All printables', '/printable-connect-the-dots/'],
  ['Adults', '/connect-the-dots-for-adults/'],
  ['100 dots · English', '/connect-the-dots-1-to-100/'],
  ['Alphabet · English', '/alphabet-dot-to-dot/'],
  ['Skip counting · English', '/skip-counting-dot-to-dot/'],
] as const;

/** C11 supplies exactly one heading and its workspace in tool, controls before preview.
 * This component creates no H1 and never reads the user's name or result state.
 * Import the scoped presentation CSS after the existing isolated tool stylesheet. */
export default function NameTracingChrome({ tool, examples }: { tool: ReactNode; examples: readonly ExampleAsset[] }) {
  return <div className="nt-shell">
    <a className="nt-display-skip" href="#name-tracing-main">Skip to the worksheet generator</a>
    <header className="nt-display-header"><div className="nt-display-header-inner">
      <a className="nt-display-brand" href="/" rel="noreferrer" aria-label="ConnectTheDots home"><span className="nt-display-logo">
        {/* eslint-disable-next-line @next/next/no-img-element -- Small first-party PNG data URI, no network request or next/image dependency. */}
        <img src={nameTracingLogo} width="24" height="24" alt="" /></span><span>ConnectTheDots</span></a>
      <span className="nt-display-language">EN</span>
      <nav className="nt-display-navigation" aria-label="Main navigation"><a href="/printable-connect-the-dots/" rel="noreferrer">Free Printables</a><a href="/alphabet-dot-to-dot/" hrefLang="en" rel="noreferrer">Alphabet</a><a href="/skip-counting-dot-to-dot/" hrefLang="en" rel="noreferrer">Skip Counting</a><a href="#name-tracing-examples">Example PDFs ↓</a></nav>
    </div></header>
    <main id="name-tracing-main" className="nt-display-main"><div className="nt-display-tool">{tool}</div><NameTracingExamples examples={examples} /><NameTracingContent /></main>
    <footer className="nt-display-footer"><div className="nt-display-footer-inner"><div className="nt-display-footer-grid"><div><a href="/" className="nt-display-footer-brand" rel="noreferrer">ConnectTheDots</a><p>Your source for high-quality, free connect the dots printables for kids and adults.</p><p>This tool is in English.</p></div><nav aria-label="Footer printables"><h2>PRINTABLES</h2>{collections.map(([label, href]) => <a key={href} href={href} rel="noreferrer">{label}</a>)}</nav><nav aria-label="Legal and lettering"><h2>LEGAL &amp; LETTERING</h2><a href="/privacy/" rel="noreferrer">Privacy Policy</a><a href="/terms/" rel="noreferrer">Terms of Service</a><a href="/dmca/" rel="noreferrer">DMCA Policy</a><a href="/fonts/name-tracing/v1/OFL.txt" rel="noreferrer">SIL Open Font License</a><a href="/name-tracing-worksheet/" rel="noreferrer">Open a clean worksheet</a></nav></div><div className="nt-display-copyright"><p>© 2026 ConnectTheDotsPrintable.online. All rights reserved.</p><p>All printables are for personal and educational use only.</p></div></div></footer>
  </div>;
}
