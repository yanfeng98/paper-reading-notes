#!/usr/bin/env python3
"""Prepare the Kimi-skin hero from the project's AI-generated cloud-sea image.

One-off asset script (not part of the stdlib-only site build). The editable
source lives at site/tools/hero-source.jpg; this script crops it to 16:9 and
writes the 1600/2400 WebP + JPEG derivatives used by skin-kimi.css.

The source is a user-generated image, not a third-party stock asset.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

HERE = Path(__file__).resolve().parent
SOURCE = HERE / "hero-source.jpg"
ASSETS = HERE.parent / "assets"


def main() -> None:
    image = Image.open(SOURCE).convert("RGB")
    image = ImageOps.fit(image, (2400, 1350), method=Image.Resampling.LANCZOS)
    image = ImageEnhance.Brightness(image).enhance(1.03)
    image = ImageEnhance.Contrast(image).enhance(1.02)
    image = ImageEnhance.Color(image).enhance(0.96)
    image = image.filter(ImageFilter.UnsharpMask(radius=1.1, percent=45, threshold=3))

    ASSETS.mkdir(parents=True, exist_ok=True)
    for width in (1600, 2400):
        resized = image.resize(
            (width, round(width * image.height / image.width)),
            Image.Resampling.LANCZOS,
        )
        resized.save(ASSETS / f"hero-kimi-{width}.webp", quality=84, method=6)
        resized.save(
            ASSETS / f"hero-kimi-{width}.jpg",
            quality=86,
            optimize=True,
            progressive=True,
        )

    # Cut soft transparent cloud puffs from the same generated cloud sea. The
    # alpha follows the bright cloud areas; transparent padding prevents any
    # hard sprite edge from showing.
    crops = [
        (300, 650, 1500, 1150),
        (1000, 450, 2200, 950),
        (600, 800, 1800, 1300),
        (1400, 650, 2752, 1150),
    ]
    for index, box in enumerate(crops, 1):
        crop = image.crop(box)
        width, height = crop.size
        gray = np.array(ImageOps.grayscale(crop), dtype=np.float32) / 255.0
        yy, xx = np.mgrid[0:height, 0:width].astype(np.float32)
        xn, yn = xx / width * 2 - 1, yy / height * 2 - 1
        radial = np.clip(1 - (np.abs(xn) ** 2.4 + np.abs(yn) ** 2.4), 0, 1) ** 1.2
        edge = np.clip((1 - np.abs(xn)) * 8, 0, 1) * np.clip((1 - np.abs(yn)) * 8, 0, 1)
        alpha = np.clip((gray - 0.44) / 0.38, 0, 1) ** 1.1 * radial * edge
        alpha[alpha < 0.02] = 0
        alpha = np.array(
            Image.fromarray((alpha * 255).astype(np.uint8)).filter(
                ImageFilter.GaussianBlur(3)
            ),
            dtype=np.float32,
        ) / 255
        rgb = np.stack(
            [150 + 105 * gray, 165 + 85 * gray, 180 + 70 * gray], axis=-1
        )
        rgba = np.zeros((height, width, 4), dtype=np.uint8)
        rgba[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
        rgba[..., 3] = np.clip(alpha * 220, 0, 255).astype(np.uint8)
        sprite = Image.fromarray(rgba, "RGBA").resize(
            (800, round(800 * height / width)), Image.Resampling.LANCZOS
        )
        canvas = Image.new("RGBA", (960, 480), (0, 0, 0, 0))
        canvas.alpha_composite(
            sprite, ((960 - sprite.width) // 2, (480 - sprite.height) // 2)
        )
        canvas.save(
            ASSETS / f"cloud-sprite-{index}.webp",
            lossless=True,
            quality=100,
            method=6,
        )

    print("wrote hero-kimi-1600/2400 and cloud-sprite-1..4")


if __name__ == "__main__":
    main()
