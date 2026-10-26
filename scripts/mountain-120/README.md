# Mountain Landscape 120, candidate v0.2

This is an isolated original worksheet derived from the supplied v0.1 source.
The 58 anchors, 120 ordered coordinates and 9.2pt label placements are preserved.
The two PDFs, SVGs and PDF-rendered previews are generated together. The only
visible revisions are the v0.2 worksheet label and the identical brand footer;
PDF author metadata no longer carries internal testing labels.

Run from the repository root:

```sh
python -m pip install -r scripts/mountain-120/requirements.txt
python scripts/mountain-120/build.py
python scripts/mountain-120/render.py
python scripts/mountain-120/audit.py
```

Install DejaVu Sans and DejaVu Sans Bold (Debian/Ubuntu: `fonts-dejavu-core`).
The builder uses `scripts/mountain-120/fonts/` if supplied locally, otherwise
`/usr/share/fonts/truetype/dejavu/`. It verifies the exact font SHA-256 values
against the v0.1 files before drawing. Do not commit font binaries. Their license
is retained in `FONTS-LICENSE.txt`; the PDFs contain embedded font subsets.

Public outputs: `public/printables/mountain-landscape-120/v0.2/` (six files).
Editable source/point manifests remain here. Temporary audit output goes to
`work/mountain-120/`; it must not be staged wholesale. The checked-in audit is
selected digital evidence only, not a playtest or physical print approval.
`v0.1-points-and-labels.json` is the supplied baseline for sequence/layout checks.

The original geometry was authored directly for the v0.1 commission, with no
third-party artwork or reuse of the old Mountain/Mandala assets. ReportLab exports
vectors and embedded fonts; PyMuPDF audits and renders the results. Physical
printing and non-author playtesting remain **Pending**. Difficulty is **Unrated**.
