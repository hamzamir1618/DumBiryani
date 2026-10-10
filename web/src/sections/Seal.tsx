import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { crackPath, gsap, STILL } from '../lib/dum';
import { Orn } from '../components/Orn';

/**
 * 00:00. A closed pot, seen from directly above: a field of dough with the
 * mark pressed into it. The reader cannot see the food and will not be able to
 * for the whole page. Scrolling cracks the seal just enough to show that there
 * is something underneath, and no further.
 */
export function Seal() {
  const root = useRef<HTMLElement>(null);
  const seam = crackPath(34, 1.8, 11);
  const upper = `polygon(0% 0%, 100% 0%, ${[...seam].reverse().join(', ')})`;
  const lower = `polygon(${seam.join(', ')}, 100% 100%, 0% 100%)`;

  useGSAP(() => {
    gsap.set('.sl-u', { clipPath: upper });
    gsap.set('.sl-l', { clipPath: lower });
    if (STILL) return;

    gsap.timeline({
      scrollTrigger: { trigger: root.current, start: 'top top', end: '+=180%', pin: true, scrub: 0.8, invalidateOnRefresh: true },
    })
      .fromTo('.sl-line', { scaleX: 0 }, { scaleX: 1, duration: 0.34, ease: 'power2.inOut' }, 0)
      .to('.sl-mark', { autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, 0.3)
      .to('.sl-u', { yPercent: -54, duration: 0.5, ease: 'power2.inOut' }, 0.36)
      .to('.sl-l', { yPercent: 54, duration: 0.5, ease: 'power2.inOut' }, 0.36)
      .fromTo('.sl-under', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.4)
      .fromTo('.sl-hint', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.62);
  }, { scope: root });

  return (
    <section id="seal" ref={root}>
      <div className="sl-under">
        <p className="sl-hint">Once the dough goes round the rim, nobody opens it again until it is in front of you.</p>
      </div>

      <div className="sl-half sl-u">
        <Orn of="shamsa" ink="walnut-d" className="sl-press" />
      </div>
      <div className="sl-half sl-l">
        <Orn of="shamsa" ink="walnut-d" className="sl-press sl-press-b" />
      </div>

      <span className="sl-line" />

      <div className="sl-mark">
        <span className="nastaliq sl-ur">دم</span>
        <h1 className="sl-title">Dum Biryani</h1>
        <p className="sl-sub">Karachi · Lahore · Islamabad</p>
      </div>
    </section>
  );
}
