#!/usr/bin/env python3
"""Approved task-only exports. Reuse the hash-pinned segmented adapter unchanged."""
from pathlib import Path
import argparse
import hashlib
import importlib.util
import json
import math

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
IDS = {"dragonfly-water-lily", "christmas-candle-window"}


def sha(data):
    return hashlib.sha256(data).hexdigest()


for source in json.loads((HERE / "FROZEN-SOURCES.json").read_text()):
    assert sha((HERE / source["file"]).read_bytes()) == source["sha256"], source
spec = importlib.util.spec_from_file_location("segmented", HERE / "frozen-adapter.py")
adapter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(adapter)


def export(id, papers, evidence):
    assert id in IDS
    design = json.loads((HERE / "designs.json").read_text())[id]
    segments = [adapter.path(s["name"], s["anchors"], s["closed"], s["maxStepMm"]) for s in design["segments"]]
    points, edges = [], []
    for s in segments:
        s["start"] = len(points) + 1
        points += s["points"]
        s["end"] = len(points)
        edges += list(zip(s["points"], s["points"][1:] + s["points"][:1])) if s["closed"] else list(zip(s["points"], s["points"][1:]))
    d = dict(id=id, title=design["title"], count=len(points), segments=segments, points=points, edges=edges,
             details=[], eyes=[], units="mm", frame=[210, 279.4], labelFontPt=9, dotRadiusMm=adapter.u.R,
             license=adapter.u.SOURCE_USAGE,
             provenance="Original coordinates authored for Founder-approved C11 Adults second wave, 2026-11-07; no external artwork, tracing or image-generation inputs.",
             authoringDesignSha256=sha(json.dumps(design, sort_keys=True).encode()))
    evidence.mkdir(parents=True, exist_ok=True)
    (evidence / f"{id}-candidate.json").write_text(json.dumps(d, indent=2) + "\n")
    minimum = min(math.dist(a, b) for i, a in enumerate(points) for b in points[i + 1:])
    assert minimum >= 3.3, ("point centers", minimum)
    d["labels"] = adapter.u.layout(points, edges)
    # Explicit authored label corrections, audited against the unchanged constraints.
    for number, (dx, dy) in design.get("labelAdjustmentsMm", {}).items():
        label = d["labels"][int(number) - 1]
        b = label["box"]
        label["box"] = [b[0] + dx, b[1] + dy, b[2] + dx, b[3] + dy]
    folder = ROOT / "public/printables" / id / "v1"
    folder.mkdir(parents=True, exist_ok=True)
    geometry = json.dumps(d, indent=2) + "\n"
    (folder / "geometry.json").write_text(geometry)
    resource = dict(id=id, assetStem=id, assetVersion="v1", title=d["title"], count=d["count"], hasPreDrawnDetails=False,
                    task=dict(type="segmented", segments=[{k: s[k] for k in ["name", "start", "end", "closed"]} for s in segments]),
                    geometry=f"/printables/{id}/v1/geometry.json", geometrySha256=sha(geometry.encode()),
                    labelFontPtByPaper={paper: 9 for paper in papers}, exports=[],
                    notTested=["physical printing", "independent human full solve", "real mobile", "integrated browser download"])
    for paper in papers:
        for kind in ["Puzzle", "Solution"]:
            file = folder / f"{id}-{paper}-{kind}.pdf"
            adapter.render(d, paper, kind == "Solution", file)
            pdf = adapter.u.fitz.open(file)
            count = 0
            for xref in pdf[0].get_contents():
                stream = pdf.xref_stream(xref)
                count += stream.count(b"PRIVATE PROTOTYPE")
                pdf.update_stream(xref, stream.replace(b"PRIVATE PROTOTYPE", d["title"].encode("ascii")))
            assert count == 1
            pdf.xref_set_key(pdf.pdf_catalog(), "Lang", "(en)")
            data = pdf.tobytes(garbage=0, deflate=True, no_new_id=True)
            pdf.close()
            file.write_bytes(data)
            with adapter.u.fitz.open(file) as final:
                assert "PRIVATE PROTOTYPE" not in final[0].get_text()
                pix = final[0].get_pixmap(matrix=adapter.u.fitz.Matrix(1.5, 1.5), alpha=False)
                pix.save(file.with_suffix(".png"))
                resource["exports"].append(dict(paper=paper, kind=kind, pdf="/" + str(file.relative_to(ROOT / "public")),
                    preview="/" + str(file.with_suffix(".png").relative_to(ROOT / "public")),
                    mime="application/pdf", bytes=len(data), sha256=sha(data),
                    previewSha256=sha(file.with_suffix(".png").read_bytes()), previewPixels=[pix.width, pix.height],
                    pages=len(final), pageBoxPt=list(final[0].rect), labelFontPt=9))
    (folder / "task-contract.json").write_text(json.dumps(resource, indent=2) + "\n")
    (folder / "SOURCE.md").write_text(f'# {d["title"]} — original C11 source, 2026-11-07\n\n{d["license"]}\n\n{d["provenance"]} Source: scripts/adults-second-wave-20261107/designs.json. geometry.json is authoritative for global numbering, label positions, segment C/O ranges and answer edges. The task contract is derived from that same geometry.\n\n{d["count"]} points in {len(segments)} ranges. Connect consecutive numbers within each range; C closes only to that range\'s first point, O stops. Lift your pen between ranges. Never bridge ranges or apply a global N-to-1 rule. No pre-drawn interior details.\n\nUses the unchanged, hash-pinned existing segmented adapter/upstream source pair; no new renderer or font dependency. Standard PDF Helvetica 9pt numbers, native A4/Letter at 100%, 50mm ruler. Each PNG is rasterized from its own final PDF at 108dpi for display; PDF artwork is vector.\n\nPhysical printing, independent human full solve and real mobile: NOT TESTED. Difficulty, age suitability, solve time and human actual effort UNKNOWN. No prior waiver inherited. Preparation is not publication/Merge/Deploy.\n')
    return dict(id=id, count=len(points), segments=len(segments), minimumCentersMm=minimum, exportedPapers=papers)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("id", choices=sorted(IDS))
    parser.add_argument("--paper", nargs="+", choices=["A4", "Letter"], default=["A4", "Letter"])
    parser.add_argument("--evidence", type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(export(args.id, args.paper, args.evidence)))
