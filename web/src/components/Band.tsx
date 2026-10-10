import { useRef, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, STILL } from '../lib/dum';
import { ART } from '../data/art';

type Props = {
  /** A palette token name. */
  ink?: string;
  /** Strip height — any CSS length. */
  h?: string;
  /** How tall one repeat is drawn; the width follows, so this sets the density. */
  tile?: string;
  /** Travel with the scroll, in percent of its own width. Sign sets direction. */
  drift?: number;
  /** Mirror it, so a pair can face each other across a section. */
  flip?: boolean;
  /** Stand it on end, for a rail down the side of a section. */
  upright?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * The arabesque strip, tiled.
 *
 * One drawing repeated end to end makes a continuous rule, the way a carpet
 * border runs the length of the cloth. It carries no colour of its own — like
 * the rest of the ornament it is a mask, painted with a palette token — and it
 * can travel against the scroll, which is what stops a long page of them
 * reading as a row of identical dividers.
 */
export function Band({
  ink = 'sage', h = '2rem', tile, drift = 0, flip = false, upright = false, className = '', style,
}: Props) {
  const root = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!drift || STILL) return;
    gsap.fromTo(
      root.current!.firstElementChild,
      { xPercent: -drift },
      {
        xPercent: drift,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      },
    );
  }, { scope: root, dependencies: [drift] });

  return (
    <span
      ref={root}
      aria-hidden="true"
      className={`band${flip ? ' flip' : ''}${upright ? ' upright' : ''} ${className}`}
      style={{ '--band-h': h, ...style } as CSSProperties}
    >
      <span
        className="band-in"
        style={{
          '--orn': `url(${ART.band})`,
          '--ink': `var(--${ink})`,
          ...(tile ? { '--band-tile': tile } : {}),
        } as CSSProperties}
      />
    </span>
  );
}
