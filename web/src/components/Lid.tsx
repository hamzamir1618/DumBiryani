import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { crackPath, gsap } from '../lib/dum';

export interface LidHandle {
  close: () => Promise<void>;
  open: () => Promise<void>;
}

/**
 * The one transition this site has: the lid goes back on.
 *
 * Two halves of dough sweep in and meet along the same ragged seam the opening
 * seal cracks along, the join presses shut, and then it parts again on the new
 * page. It is the only page-change gesture because the whole site has only one
 * idea — the pot is shut, and then it is not.
 *
 * Clip paths and translation only: nothing here turns, folds or skews.
 */
export const Lid = forwardRef<LidHandle>(function Lid(_, ref) {
  const root = useRef<HTMLDivElement>(null);

  const seam = crackPath(30, 2.1);
  // the top half owns everything above the seam, the bottom half everything below
  const upper = `polygon(0% -1%, 100% -1%, ${[...seam].reverse().join(', ')})`;
  const lower = `polygon(${seam.join(', ')}, 100% 101%, 0% 101%)`;

  const { contextSafe } = useGSAP(() => {
    gsap.set('.lid-u', { clipPath: upper, yPercent: -102 });
    gsap.set('.lid-l', { clipPath: lower, yPercent: 102 });
    gsap.set('.lid-seam', { autoAlpha: 0, scaleX: 0 });
  }, { scope: root });

  useImperativeHandle(ref, () => ({
    close: contextSafe(async () => {
      await gsap.timeline()
        .set(root.current, { pointerEvents: 'auto' })
        .to('.lid-u', { yPercent: 0, duration: 0.42, ease: 'power3.in' }, 0)
        .to('.lid-l', { yPercent: 0, duration: 0.42, ease: 'power3.in' }, 0)
        .fromTo('.lid-seam', { autoAlpha: 1, scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' })
        .to('.lid-mark', { autoAlpha: 1, scale: 1, duration: 0.26, ease: 'back.out(2.2)' }, '-=.18')
        .then(() => undefined);
    }) as () => Promise<void>,

    open: contextSafe(async () => {
      await gsap.timeline()
        .to('.lid-mark', { autoAlpha: 0, scale: 0.8, duration: 0.18, ease: 'power2.in' })
        .to('.lid-seam', { autoAlpha: 0, duration: 0.16 }, '<')
        .to('.lid-u', { yPercent: -102, duration: 0.6, ease: 'power3.inOut' }, '>-.05')
        .to('.lid-l', { yPercent: 102, duration: 0.6, ease: 'power3.inOut' }, '<')
        .set(root.current, { pointerEvents: 'none' })
        .then(() => undefined);
    }) as () => Promise<void>,
  }));

  return (
    <div className="lid" ref={root} aria-hidden="true">
      <div className="lid-half lid-u" />
      <div className="lid-half lid-l" />
      <span className="lid-seam" />
      <span className="lid-mark">دم</span>
    </div>
  );
});
