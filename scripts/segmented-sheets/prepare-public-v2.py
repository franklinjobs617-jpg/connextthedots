#!/usr/bin/env python3
"""PR16 header-only v2 preparation. Never samples points or lays out labels.

Reads immutable v1 files, replaces the single PRIVATE PROTOTYPE PDF text token
with the existing worksheet title, and rasterizes each resulting actual PDF.
Requires PyMuPDF. Existing v1 files are never written.
"""
from pathlib import Path
import hashlib
import json
import fitz

ROOT = Path(__file__).resolve().parents[2]
BASE_COMMIT = "536f49604271683a5f3f338886f2167e73988662"
PROTOTYPE_COMMIT = "89275ec9292ade02002c8b01a582bb35bd153bb9"
IDS = ("tufted-owl-study-207", "hilltop-observatory-202")
TOKEN = b"PRIVATE PROTOTYPE"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    for id in IDS:
        folder = ROOT / "public/printables" / id
        old = folder / "v1"
        new = folder / "v2"
        new.mkdir(exist_ok=True)
        geometry_bytes = (old / "geometry.json").read_bytes()
        geometry = json.loads(geometry_bytes)
        (new / "geometry.json").write_bytes(geometry_bytes)
        exports = []
        for paper in ("A4", "Letter"):
            for kind in ("Puzzle", "Solution"):
                name = f'{geometry["id"]}-{paper}-{kind}'
                source = old / f"{name}.pdf"
                target = new / f"{name}.pdf"
                with fitz.open(source) as pdf:
                    assert len(pdf) == 1
                    replacements = 0
                    for xref in pdf[0].get_contents():
                        stream = pdf.xref_stream(xref)
                        count = stream.count(TOKEN)
                        if count:
                            pdf.update_stream(xref, stream.replace(TOKEN, geometry["title"].encode("ascii")))
                            replacements += count
                    assert replacements == 1, (source, replacements)
                    pdf.save(target, garbage=0, deflate=True, no_new_id=True)
                with fitz.open(target) as pdf:
                    pdf[0].get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False).save(target.with_suffix(".png"))
                exports.append({
                    "paper": paper, "kind": kind,
                    "v1_pdf": f"v1/{name}.pdf", "v1_pdf_sha256": digest(source),
                    "v2_pdf": f"v2/{name}.pdf", "v2_pdf_sha256": digest(target),
                    "v1_preview": f"v1/{name}.png", "v1_preview_sha256": digest(source.with_suffix(".png")),
                    "v2_preview": f"v2/{name}.png", "v2_preview_sha256": digest(target.with_suffix(".png")),
                })
        source_text = f'''# {geometry["title"]} — public-title asset v2

{geometry["license"]}

Version v2 replaces only the PDF subtitle token PRIVATE PROTOTYPE with the accurate worksheet name, {geometry["title"]}. v1 remains the original prototype; its files have not been overwritten. Prototype provenance: private source commit {PROTOTYPE_COMMIT}; imported v1 product commit {BASE_COMMIT}. Original coordinate art, no external artwork or tracing inputs. No fonts are redistributed.

The geometry.json bytes are identical to v1, SHA-256 {digest(new / "geometry.json")}. Points, label positions, numbering, segment ranges, C/O flags and answer edges have not changed. PDF page geometry and all drawing/text positions are preserved; only that subtitle text differs. The previews are rasterized from the actual v2 PDFs. Per-paper hashes and parent files are in ../VERSIONS.json. Reproduce with scripts/segmented-sheets/prepare-public-v2.py.

{geometry["count"]} dots in {len(geometry["segments"])} ranges. Connect consecutive numbers within each range. C: connect the last point to that range's first point. O: stop at the last point. Lift your pen between ranges; never bridge ranges. Follow the same rules in the page, puzzle and matching answer. A4/Letter, ordinary 9pt labels at100%,50mm ruler.

Physical printing and independent human full solve: NOT TESTED. No waiver claimed. Human person-minutes UNKNOWN; difficulty, age suitability and solve time unmeasured. Asset preparation is not publication, Merge or Deploy.
'''
        (new / "SOURCE.md").write_text(source_text)
        record = {
            "id": id, "title": geometry["title"], "current_asset_version": "v2",
            "v1_status": "preserved prototype", "v2_status": "public-title preparation; not a publication claim",
            "prototype_source_commit": PROTOTYPE_COMMIT, "parent_product_commit": BASE_COMMIT,
            "change": "Replace PRIVATE PROTOTYPE subtitle token with exact worksheet title; no layout/geometry regeneration",
            "geometry_sha256_v1_and_v2": digest(new / "geometry.json"),
            "physical_print": "NOT TESTED", "independent_human_full_solve": "NOT TESTED", "waiver": "NOT CLAIMED",
            "exports": exports,
        }
        (folder / "VERSIONS.json").write_text(json.dumps(record, indent=2) + "\n")
        print(id, "v2 prepared; v1 preserved")


if __name__ == "__main__":
    main()
