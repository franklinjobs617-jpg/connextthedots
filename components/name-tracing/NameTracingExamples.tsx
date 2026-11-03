import type { ExampleAsset } from './example-types';
import { hasPngPreview, hasReadyDownload } from './example-types';

/** Server-rendered fixed resources, independent of the custom worksheet state. */
export default function NameTracingExamples({ examples }: { examples: readonly ExampleAsset[] }) {
  return <section id="name-tracing-examples" className="nt-display-examples" aria-labelledby="nt-examples-title">
    <div className="nt-display-section-head"><div><p className="nt-display-eyebrow">TRY A READY-MADE PAGE</p><h2 id="nt-examples-title">Download an example</h2></div><a href="#name-tracing-main">Use your own name ↑</a></div>
    <p>Choose Emma or Alex, then the paper you use. These example files are separate from the custom worksheet you generate above.</p>
    {(['Emma', 'Alex'] as const).map(name => <div key={name} className="nt-display-name-card">
      <div className="nt-display-name-title"><h3>{name}</h3><span>Example name</span></div>
      <div className="nt-display-paper-pair">{(['a4', 'letter'] as const).map(paper => {
        const id = `${name.toLowerCase()}-${paper}`;
        const matches = examples.filter(asset => asset.id === id && asset.displayName === name && asset.paper === paper);
        const asset = matches.length === 1 ? matches[0] : undefined;
        const preview = asset && hasPngPreview(asset) ? asset.preview : undefined;
        const ready = asset && hasReadyDownload(asset);
        const label = paper === 'a4' ? 'A4' : 'US Letter';
        return <article key={paper} className="nt-display-resource" aria-label={`${name} ${label} example`}>
          <div className="nt-display-thumbnail">{preview ? <>
            {/* eslint-disable-next-line @next/next/no-img-element -- Static PNG data URI preserves the tool's img-src data: blob: CSP; no optimizer request. */}
            <img src={preview.dataUri} width={preview.width} height={preview.height} alt={preview.alt || `${name} ${label} worksheet preview`} loading="lazy" decoding="async" />
          </> : <div className="nt-display-resource-placeholder"><span>{name}</span><small>{label}<br />Preview pending</small></div>}</div>
          <div className="nt-display-resource-info"><h4>{label}</h4>
            <p>{paper === 'a4' ? '210 × 297 mm' : '8.5 × 11 in'}<br />1 page · Guide lines on</p>
            {asset?.actualRows && <p>{asset.actualRows} practice rows{asset.fontSizePt ? ` · ${Math.round(asset.fontSizePt)} pt lettering` : ''}</p>}
            {ready ? <a className="nt-display-resource-download" href={asset.pdfHref!} download rel="noreferrer">Download {name} · {label} PDF <span aria-hidden="true">↓</span></a>
              : <><p className="nt-display-pending">{asset?.status === 'g0-prototype' ? 'Prototype preview · final PDF pending' : 'Example not yet available'}</p><button type="button" disabled>Download {name} · {label} PDF</button></>}
          </div>
        </article>;
      })}</div>
    </div>)}
  </section>;
}
