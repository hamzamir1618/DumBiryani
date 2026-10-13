import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { asClock, DUM, gsap, STILL, watchMinutes } from '../lib/dum';
import { Orn } from '../components/Orn';
import { Band } from '../components/Band';

/** What is happening in a pot nobody can see into. */
const STAGES: [number, string, string][] = [
  [0, 'The dough sets hard around the rim', 'آٹا سخت ہو جاتا ہے'],
  [8, 'Fat starts coming off the mutton', 'گوشت سے چربی نکلتی ہے'],
  [18, 'Steam has nowhere to go but into the rice', 'بھاپ چاول میں جاتی ہے'],
  [30, 'The fried onion turns sweet', 'تلی پیاز میٹھی ہو جاتی ہے'],
  [40, 'Last five minutes. Nobody touches it.', 'آخری پانچ منٹ'],
];

const R = 150;
const CIRC = 2 * Math.PI * R;

/**
 * The long middle of the page: a face, an arc closing, and a running count.
 * The pot never opens here. The only thing that changes is how much time has
 * gone, which is the honest answer to what a dum kitchen is doing.
 */
export function Clock() {
  const root = useRef<HTMLElement>(null);
  const [read, setRead] = useState('00:00');
  const [stage, setStage] = useState(0);

  useEffect(() =>
    watchMinutes(m => {
      setRead(asClock(m));
      let at = 0;
      STAGES.forEach(([from], i) => { if (m >= from) at = i; });
      setStage(at);
      const arc = root.current?.querySelector<SVGCircleElement>('.ck-arc');
      if (arc) arc.style.strokeDashoffset = String(CIRC * (1 - m / DUM));
    }), []);

  useGSAP(() => {
    if (STILL) return;
    gsap.timeline({
      scrollTrigger: { trigger: root.current, start: 'top top', end: '+=320%', pin: true, scrub: 0.8, invalidateOnRefresh: true },
    })
      .fromTo('.ck-face', { scale: 0.86 }, { scale: 1, duration: 1, ease: 'none' }, 0)
      .fromTo('.ck-say', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.04);
  }, { scope: root });

  return (
    <section id="clock" ref={root}>
      <div className="ck-field">
        <Orn of="girih" ink="indigo-l" className="ck-girih" />
      </div>

      <Band ink="sage" h="clamp(38px, 5.5vw, 78px)" drift={10} upright className="ck-rail ck-rail-l" />
      <Band ink="sage" h="clamp(38px, 5.5vw, 78px)" drift={-10} upright flip className="ck-rail ck-rail-r" />

      <div className="ck-face">
        <Orn of="shamsa" ink="sage" className="ck-shamsa" />
        <svg className="ck-ring" viewBox="0 0 360 360" aria-hidden="true">
          <circle className="ck-track" cx="180" cy="180" r={R} />
          <circle
            className="ck-arc"
            cx="180" cy="180" r={R}
            style={{ strokeDasharray: CIRC, strokeDashoffset: CIRC }}
          />
        </svg>
        <p className="ck-read" aria-live="off">{read}</p>
      </div>

      <div className="ck-say">
        <p className="label">In the pot</p>
        <p className="ck-stage">{STAGES[stage][1]}</p>
        <p className="nastaliq ck-ur">{STAGES[stage][2]}</p>
      </div>
    </section>
  );
}
