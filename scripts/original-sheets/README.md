# Original worksheet contract v1

Separate from the legacy generator, catalog and dynamic printable route.

- Author a distinct closed silhouette in `designs.json`, in millimetres with y down. Include pre-drawn details explicitly. Preserve every authored corner; distribute the requested count while maintaining at least 3.3 mm center spacing.
- Run `python scripts/original-sheets/build.py` with Python 3, reportlab 4.4.9 and PyMuPDF 1.26.6 (compatible installed versions may also work). It generates a versioned `geometry.json`, provenance, four one-page PDFs and four exact PDF raster previews per item.
- One common 210 × 279.4 mm coordinate frame: center unchanged physical artwork on A4 and US Letter. Nine-point standard PDF Helvetica, no bundled fonts. Constraint layout rejects label/label, label/dot and label/solution-line collisions. Generation fails if spacing or layout cannot be satisfied; do not reduce minimums to force a count.
- Add a typed English-only item in `lib/original-sheets.ts` and an explicit route importing `OriginalSheetPage`. No legacy data insertion. New IDs also restrict middleware alternates to prevent fictitious translations; translated routes return 404.
- Run `python scripts/original-sheets/audit.py`; then production build, TypeScript, scoped ESLint and anonymous browser download/SSR checks against the final tree. Inspect actual puzzle/solution previews. Physical print and independent human full-solve remain NOT TESTED until independently performed.
- Increase asset version when changing a released source; never silently overwrite stable released downloads. No sitemap/hub edits or release actions are implied by adding an item.

© 2026 ConnectTheDotsPrintable.online. Usage for this release: personal and educational downloading and printing; commercial use requires prior written permission. See the website Terms of Service. This pipeline is original source code supplied with the product repository. No competitor images, AI image-generation outputs or old site art are inputs. C08 effort and private QA evidence belong in the private reporting repository.

Existing versioned geometry is authoritative during re-export: preserve its points, label boxes, fixed details, sequence and dimensions. This usage statement applies to this release; it does not claim to revoke rights granted previously. Historical evidence and earlier Git versions remain preserved.
