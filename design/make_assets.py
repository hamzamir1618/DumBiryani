"""
Turns the generated source art into the masks the site uses.

    python design/make_assets.py

The art in design/source-art/ is flat line work drawn in one dark ink on a
black ground. Rather than bake a colour into it, each piece is converted to an
alpha mask: the ink becomes opaque, the ground becomes transparent, and the RGB
is left white. The page then paints it with `mask-image` and a palette token,
so the colour lives in tokens.css and changing it costs nothing.

The carpet is additionally cut into three concentric planes — border, field,
medallion — which the hero drifts at different rates for depth.
"""
import os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "source-art")
OUT = os.path.join(HERE, os.pardir, "web", "public", "img")

# Longest edge in the shipped file. The art is ornament, not photography: past
# this it only costs bytes.
WIDTHS = {
    "carpet": 1600,
    "iwan": 1800,
    "vault": 1400,
    "shamsa": 1100,
    "boteh": 900,
    "band": 2400,
}


def mask(path, floor=16):
    """Luminance to alpha, stretched so the ink reaches full opacity."""
    im = Image.open(path).convert("RGB")
    a = np.asarray(im, dtype=np.float32)
    lum = a @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    peak = float(np.percentile(lum, 99.7))
    if peak <= floor:
        peak = float(lum.max())
    alpha = np.clip((lum - floor) / max(peak - floor, 1.0), 0, 1)
    return alpha


def save(alpha, name, width):
    h, w = alpha.shape
    rgb = np.full((h, w, 3), 255, dtype=np.uint8)
    img = Image.fromarray(np.dstack([rgb, (alpha * 255).astype(np.uint8)]), "RGBA")
    if w > width:
        img = img.resize((width, round(h * width / w)), Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name + ".png")
    img.save(path, optimize=True)
    print(f"  {name + '.png':<22} {img.size[0]}x{img.size[1]}  {os.path.getsize(path)//1024} KB")


def chebyshev(h, w):
    """Distance from centre as a square ring, which is how a carpet is built."""
    y, x = np.mgrid[0:h, 0:w]
    return np.maximum(np.abs(x - (w - 1) / 2) / ((w - 1) / 2),
                      np.abs(y - (h - 1) / 2) / ((h - 1) / 2))


def band(d, lo, hi, feather=0.04):
    """A soft-edged ring between two radii."""
    inner = np.clip((d - lo) / feather, 0, 1) if lo > 0 else np.ones_like(d)
    outer = np.clip((hi - d) / feather, 0, 1) if hi < 1.5 else np.ones_like(d)
    return inner * outer


def tight(alpha, pad=6):
    """Crop the empty margins off, so a strip can be used as a thin rule."""
    rows = np.where(alpha.mean(1) > 0.015)[0]
    if not len(rows):
        return alpha
    top = max(0, rows.min() - pad)
    bottom = min(alpha.shape[0], rows.max() + pad)
    return alpha[top:bottom]


def main():
    print("ornament masks:")
    for stem in ("iwan", "vault", "shamsa", "boteh"):
        path = os.path.join(SRC, stem + ".jpg")
        if not os.path.exists(path):
            print(f"  {stem}.jpg missing — skipped")
            continue
        save(mask(path), stem, WIDTHS[stem])

    # the band is a repeating rule: crop the dead space so it can be tiled thin
    strip = os.path.join(SRC, "band.jpg")
    if os.path.exists(strip):
        save(tight(mask(strip)), "band", WIDTHS["band"])

    carpet = os.path.join(SRC, "carpet.jpg")
    if os.path.exists(carpet):
        print("carpet, cut into planes:")
        alpha = mask(carpet)
        d = chebyshev(*alpha.shape)
        # the medallion, the field and spandrels, the border frame
        for name, lo, hi in (("carpet-front", 0.0, 0.38),
                             ("carpet-mid", 0.38, 0.74),
                             ("carpet-back", 0.74, 2.0)):
            save(alpha * band(d, lo, hi), name, WIDTHS["carpet"])
    else:
        print("  carpet.jpg missing — skipped")


if __name__ == "__main__":
    main()
