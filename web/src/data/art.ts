/**
 * Every piece of ornament the page uses, in one place.
 *
 * These are alpha masks, not pictures: the drawing is opaque, the ground is
 * transparent, and there is no colour in the file at all. The page paints them
 * with `mask-image` and a palette token, so the colour lives in tokens.css and
 * the same motif can be a different colour in two places.
 *
 * Regenerate from design/source-art with `python design/make_assets.py`.
 */
export const ART = {
  /** The iwan portal the page opens through. */
  iwan: '/img/iwan.png',
  /** One carpet, cut into three planes for depth behind the hero. */
  carpetBack: '/img/carpet-back.png',
  carpetMid: '/img/carpet-mid.png',
  carpetFront: '/img/carpet-front.png',
  /** A muqarnas dome, looking straight up. */
  vault: '/img/vault.png',
  /** The illuminated rosette pressed at section breaks. */
  shamsa: '/img/shamsa.png',
  /** Paisley. */
  boteh: '/img/boteh.png',
  /** A horizontal arabesque band for section edges. */
  band: '/img/band.png',
  /** Eight-fold strapwork for background fields. Constructed, not generated:
      an image model cannot hold true geometry. See design/make_assets.py. */
  girih: '/img/girih.svg',
} as const;

export type ArtName = keyof typeof ART;
