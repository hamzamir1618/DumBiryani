import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { asClock, gsap, STILL, watchMinutes } from '../lib/dum';
import { Band } from '../components/Band';

/**
 * The last five minutes. Everything narrows: the count gets large, the line
 * gets short, and a disc of heat swells out of the middle until it owns the
 * screen and hands over to the break.
 */
export function Pressure() {
  const root = useRef<HTMLElement>(null);
  const [read, setRead] = useState('40:00');

  useEffect(() => watchMinutes(m => setRead(asClock(m))), []);

  useGSAP(() => {
    if (STILL) return;
    gsap.timeline({
      scrollTrigger: { trigger: root.current, start: 'top top', end: '+=200%', pin: true, scrub: 0.8, invalidateOnRefresh: true },
    })
      .fromTo('.pr-read', { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.2, ease: 'power3.out' }, 0)
      .fromTo('.pr-say span', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.07 }, 0.18)
      .fromTo('.pr-close-t', { yPercent: -120 }, { yPercent: 0, duration: 0.4, ease: 'power2.inOut' }, 0.2)
      .fromTo('.pr-close-b', { yPercent: 120 }, { yPercent: 0, duration: 0.4, ease: 'power2.inOut' }, 0.2)
      .fromTo('.pr-heat', { scale: 0 }, { scale: 1, duration: 0.5, ease: 'power2.in' }, 0.42)
      .to('.pr-read, .pr-say', { autoAlpha: 0, duration: 0.12 }, 0.72);
  }, { scope: root });

  return (
    <section id="pressure" ref={root}>
      <Band ink="walnut" h="clamp(30px, 5vmin, 56px)" className="pr-close pr-close-t" />
      <Band ink="walnut" h="clamp(30px, 5vmin, 56px)" flip className="pr-close pr-close-b" />
      <span className="pr-heat" />
      <p className="pr-read">{read}</p>
      <p className="pr-say">
        <span>Still shut.</span>
        <span>No way to hurry it.</span>
      </p>
    </section>
  );
}
