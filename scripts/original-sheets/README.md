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

## Frozen C09 imports

Wave B uses schemaVersion 2 geometry with exact native per-paper points/label baselines and the original normalized source hash. It is not resampled through the authoring sampler or fitted into the Wave A common-mm frame. `original-source.json` preserves the frozen accepted source; per-paper coordinates and all marker/answer parameters are in `geometry.json`. Export with `python scripts/original-sheets/build.py --ids flamingo-150 chameleon-160 cactus-160 swan-90 maple-leaf-90` using this same renderer. Compact headers respect the original top art margin. Footer usage/ruler are added in the reserved lower margin. Validate final outputs against frozen native layouts and prior PDF drawing/text primitives, not a new design.

Do not run the Wave A-only audit to claim Wave B passed: its common-frame assumptions differ. Original C09 geometry feasibility is reusable; changed final PDF/PNG outputs, native sizes, exact numbering, labels, solution geometry, margins, current usage and UI clicked downloads must be audited against the final integration tree. Source labor/physical/human-solve unknowns do not become passes.
