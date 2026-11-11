#!/usr/bin/env python3
"""Prepare the Kimi-skin hero from the K3.1 editorial cloud-sea photograph.

One-off asset script (not part of the stdlib-only site build). The editable
source lives at site/tools/hero-source.jpg; this script crops it to 16:9 and
writes the 1600/2400 WebP + JPEG derivatives used by skin-kimi.css.

The source is the cloud-sea photograph used by the K3.1 Pro article hero
(https://www.kimi.ai/blog/kimi-k3-1-pro), archived locally so the offline site
keeps the same mountain silhouette, ridge contrast and cloud mass as the
reference. It is used here only to reproduce the reference layout.

The derivatives keep the source's 4:3 aspect ratio; skin-kimi.css uses
object-fit: cover, exactly like the reference, so narrower viewports crop the
top and bottom instead of baking a 16:9 crop into the asset.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

HERE = Path(__file__).resolve().parent
SOURCE = HERE / "hero-source.jpg"
ASSETS = HERE.parent / "assets"


def main() -> None:
    image = Image.open(SOURCE).convert("RGB")
    # The official artwork already carries the reference color grade. Keep the
    # treatment light so the cloud sea stays as dense and bright as the original.
    image = ImageEnhance.Contrast(image).enhance(1.02)
    image = ImageEnhance.Color(image).enhance(0.99)
    image = image.filter(ImageFilter.UnsharpMask(radius=1.0, percent=32, threshold=3))

    ASSETS.mkdir(parents=True, exist_ok=True)
    for width in (1600, 2400):
        resized = image.resize(
            (width, round(width * image.height / image.width)),
            Image.Resampling.LANCZOS,
        )
        resized.save(ASSETS / f"hero-kimi-{width}.webp", quality=86, method=6)
        resized.save(
            ASSETS / f"hero-kimi-{width}.jpg",
            quality=88,
            optimize=True,
            progressive=True,
        )

    # Build soft, purely white cloud puffs for the drifting tracks. Cropping
    # bright patches from the photograph also carried ridge silhouettes, which
    # read as grey stains once several sprites overlapped. Multi-octave noise
    # keeps the puffs cloud-like without any mountain detail.
    sprite_w, sprite_h = 960, 480
    yy, xx = np.mgrid[0:sprite_h, 0:sprite_w].astype(np.float32)
    xn, yn = xx / (sprite_w - 1) * 2 - 1, yy / (sprite_h - 1) * 2 - 1
    radial = np.exp(-((np.abs(xn) / 0.90) ** 3.2 + (np.abs(yn) / 0.66) ** 3.2) * 2.6)
    for index in range(1, 5):
        rng = np.random.default_rng(31 + index * 17)
        field = np.zeros((sprite_h, sprite_w), dtype=np.float32)
        weight = 1.0
        for rows, cols in ((3, 6), (6, 12), (12, 24), (24, 48)):
            seed = rng.random((rows, cols)).astype(np.float32)
            layer = Image.fromarray((seed * 255).astype(np.uint8)).resize(
                (sprite_w, sprite_h), Image.Resampling.BICUBIC
            )
            field += np.asarray(layer, dtype=np.float32) / 255.0 * weight
            weight *= 0.58
        field = (field - field.min()) / max(1e-6, field.max() - field.min())
        shape = np.zeros((sprite_h, sprite_w), dtype=np.float32)
        for _ in range(5):
            cx = rng.uniform(-0.55, 0.55)
            cy = rng.uniform(-0.32, 0.32)
            rx = rng.uniform(0.20, 0.42)
            ry = rng.uniform(0.13, 0.27)
            blob = np.exp(-((((xn - cx) / rx) ** 2 + ((yn - cy) / ry) ** 2)) * 1.7)
            shape = np.maximum(shape, blob)
        cloud = field * 0.56 + shape * 0.44
        alpha = np.clip((cloud - 0.44) / 0.22, 0, 1) ** 1.2 * radial
        alpha[alpha < 0.015] = 0
        alpha = np.asarray(
            Image.fromarray((alpha * 255).astype(np.uint8)).filter(
                ImageFilter.GaussianBlur(7)
            ),
            dtype=np.float32,
        ) / 255
        rgba = np.zeros((sprite_h, sprite_w, 4), dtype=np.uint8)
        rgba[..., 0] = np.clip(238 + 14 * field, 0, 255).astype(np.uint8)
        rgba[..., 1] = np.clip(243 + 10 * field, 0, 255).astype(np.uint8)
        rgba[..., 2] = np.clip(247 + 7 * field, 0, 255).astype(np.uint8)
        rgba[..., 3] = np.clip(alpha * 210, 0, 255).astype(np.uint8)
        Image.fromarray(rgba, "RGBA").save(
            ASSETS / f"cloud-sprite-{index}.webp",
            lossless=True,
            quality=100,
            method=6,
        )

    print("wrote hero-kimi-1600/2400 and cloud-sprite-1..4")


if __name__ == "__main__":
    main()
