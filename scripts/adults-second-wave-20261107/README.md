# Adults second wave: isolated asset exporter

Founder-approved November 7, 2026 scope: Dragonfly and Water Lily, then Christmas
Candle Window. This directory owns only new authoring inputs and selective
exports, never shared page registries, navigation, sitemaps or legacy assets.

Python 3, existing ReportLab 4.4.9 and PyMuPDF 1.26.6. No new dependency or font.

```sh
python -B scripts/adults-second-wave-20261107/build.py dragonfly-water-lily --evidence /tmp/dragonfly-source-evidence
python -B scripts/adults-second-wave-20261107/build.py christmas-candle-window --evidence /tmp/candle-source-evidence
python -B scripts/adults-second-wave-20261107/audit.py --ids dragonfly-water-lily christmas-candle-window --report /tmp/adults-digital-audit.json
```

The two original segmented source files are preserved byte for byte with their
SHA256 and original private commit/path in FROZEN-SOURCES.json. The task wrapper
imports them without invoking their old main loop or designs. It uses the same
path parameters, segment-aware collision solver and renderer. Only task inputs,
directories, exact title token, PDF language and derived source contract differ.
The audit derives from that source's independent PDF-primitive audit with an
explicit ID allowlist and external report path. No solver threshold is reduced.

The design SHA is over JSON with sorted keys for the individual design, so adding
the second resource does not invalidate the first design's provenance. The
geometry SHA in each lightweight task-contract.json binds the exact frozen
points, labels, range rules and answer edges. C14 should use this small contract
for facts, not import all point coordinates into client components.

The dragonfly has 177 points, 7 closed and 5 open segments. The candle window has
104 points, 8 closed and 4 open segments. The latter is below the initial search
range because straight frames retain corners rather than filler points. Counts
are factual, not difficulty ratings. Major features and inner wing veins are
numbered; no interior features are pre-drawn.

Each resource has four native, one-page vector PDFs and four matching final-PDF
PNG previews. Helvetica labels are 9pt; range/footer text is at least 8pt. A4 and
Letter preserve the same physical artwork. Display PNGs are 108dpi; use PDFs at
100% and measure the 50mm ruler when printing.

Physical printing, independent complete human solve, real mobile and integrated
browser download remain NOT TESTED. Producer digital checks do not waive these
gates or authorize publication, Merge or Deploy. Failure evidence and effort
records belong in the private reporting repository, never public assets.
