import type { CSSProperties } from 'react';
import { ART, type ArtName } from '../data/art';

type Props = {
  /** Which piece of ornament. */
  of: ArtName;
  /** A palette token name: madder, indigo, ivory, walnut, larkspur, sage. */
  ink?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * A piece of ornament, painted rather than drawn.
 *
 * The file is an alpha mask with no colour in it, so the ink is a CSS variable
 * and the same motif can be madder here and sage there without another file.
 */
export function Orn({ of, ink = 'larkspur', className = '', style }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`orn ${className}`}
      style={{ '--orn': `url(${ART[of]})`, '--ink': `var(--${ink})`, ...style } as CSSProperties}
    />
  );
}
