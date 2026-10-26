#!/usr/bin/env python3
"""Render canonical A4 PDF exports to 144dpi PNG previews, without altering them."""
from pathlib import Path
import fitz

root=Path(__file__).resolve().parent
for role in ['Puzzle','Solution']:
    document=fitz.open(root.parent.parent/f'public/printables/mountain-landscape-120/v0.2/Mountain-Landscape-120-{role}.pdf')
    document[0].get_pixmap(matrix=fitz.Matrix(2,2),alpha=False).save(str(root.parent.parent/f'public/printables/mountain-landscape-120/v0.2/Mountain-Landscape-120-{role}-preview.png'))
