# Localized printable exports — v1

These French, Italian and Spanish PDFs localize instructions and credit/license text in existing English worksheets. They introduce no new drawing geometry. English files remain unchanged.

- French: Tufted Owl Study, 207 points in 10 segments; Hilltop Observatory, 202 points in 9 segments. Source: `/printables/{id}/v2/`.
- Italian and Spanish: Elephant, Hot-air Balloon and Seahorse, each exactly 100 points. Source: `/printables/{id}/v1/`.
- Every A4 / US Letter puzzle has a separate matching answer PDF and a PNG rasterized from that final translated PDF. `manifest.json` lists the exact source geometry/PDF, version, language, new PDF and preview paths and SHA-256 hashes.
- Number positions, point order, plot marks, existing details, segment ranges and closed/open rules are copied from the source PDF. `scripts/localized-printables/build.py` only replaces nonnumeric instruction and credit text. It never samples points or places labels.
- The translated text uses embedded subsets of DejaVu Sans, a freely licensed font. Its source is the system `fonts-dejavu-core` distribution; font project and license: https://dejavu-fonts.github.io/License.html . No font binaries are distributed as separate website files. Original standard PDF fonts used by the retained numeric labels remain as in the source PDFs.

© 2026 ConnectTheDotsPrintable.online. Free download and printing for personal and educational use. Commercial use requires prior written permission. The translations retain the original credit and license meaning. See the website Terms of Service.

Physical printing and independent complete human solving are NOT TESTED. Difficulty, age suitability and human solve times have not been measured. Static PDF resources have URLs and may be indexed by search engines; this export adds no HTML pages or sitemap entries and introduces no indexing control.
