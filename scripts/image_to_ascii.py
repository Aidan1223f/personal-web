#!/usr/bin/env python3
"""Resize image to character grid and map luminance to ASCII ramp."""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps

# Dark → light (works on light backgrounds; snow/water reads lighter)
RAMP = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"


def image_to_ascii(
    path: Path,
    width: int,
    char_aspect: float = 0.48,
    *,
    autocontrast: bool = True,
    lighten: float = 0.0,
    trim_dark: int = 0,
) -> str:
    img = Image.open(path).convert("L")
    if autocontrast:
        img = ImageOps.autocontrast(img, cutoff=1)
    w, h = img.size
    aspect = h / w
    new_w = width
    new_h = max(1, int(aspect * new_w * char_aspect))
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    px = img.load()
    lines: list[str] = []
    n = len(RAMP) - 1
    cap = max(0, n - trim_dark) if trim_dark else n
    for y in range(new_h):
        row: list[str] = []
        for x in range(new_w):
            lum = min(1.0, px[x, y] / 255.0 + lighten)
            idx = int((1.0 - lum) * n)
            if trim_dark:
                idx = min(idx, cap)
            idx = max(0, min(n, idx))
            row.append(RAMP[idx])
        lines.append("".join(row))
    return "\n".join(lines)


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("input", type=Path)
    p.add_argument("-o", "--output", type=Path, default=None)
    p.add_argument("-w", "--width", type=int, default=76)
    p.add_argument(
        "--aspect",
        type=float,
        default=0.48,
        help="Row count vs width (lower = shorter image / fewer rows)",
    )
    p.add_argument("--no-autocontrast", action="store_true")
    p.add_argument(
        "--lighten",
        type=float,
        default=0.0,
        help="Add to normalized luminance (0–1) before mapping; lifts shadows",
    )
    p.add_argument(
        "--trim-dark",
        type=int,
        default=0,
        help="Never use the darkest N glyphs (stays lighter overall)",
    )
    args = p.parse_args()
    text = image_to_ascii(
        args.input,
        args.width,
        args.aspect,
        autocontrast=not args.no_autocontrast,
        lighten=args.lighten,
        trim_dark=args.trim_dark,
    )
    if args.output:
        args.output.write_text(text, encoding="utf-8")
        print(f"Wrote {args.output} ({len(text)} chars)")
    else:
        print(text)


if __name__ == "__main__":
    main()
