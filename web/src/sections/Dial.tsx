import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { DUM, gsap, setMinutes, STILL } from '../lib/dum';

/**
 * The clock the whole page runs on.
 *
 * One ScrollTrigger spans everything from the seal to the moment it breaks and
 * publishes a single number — minutes elapsed. Nothing else on the page owns a
 * scroll position; every section subscribes to this. That is what keeps it one
 * machine instead of a stack of separate effects.
 */
export function Dial() {
  const held = useRef({ m: 0 });

  useGSAP(() => {
    if (STILL) { setMinutes(DUM); return; }
    const start = document.getElementById('seal');
    const end = document.getElementById('break');
    if (!start || !end) return;

    gsap.to(held.current, {
      m: DUM,
      ease: 'none',
      onUpdate: () => setMinutes(held.current.m),
      scrollTrigger: {
        trigger: start,
        endTrigger: end,
        start: 'top top',
        // 45:00 lands exactly where the seal breaks, not a pixel either side
        end: 'top top',
        scrub: 0.6,
        invalidateOnRefresh: true,
        // every pinned section adds a spacer to the page, so this has to be
        // measured after them or it reads the pre-pin height and the clock
        // runs out a third of the way down
        refreshPriority: -1,
      },
    });
  });

  return null;
}
