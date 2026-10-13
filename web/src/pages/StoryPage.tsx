import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, STILL } from '../lib/dum';
import { Head } from '../components/Head';
import { Orn } from '../components/Orn';

const BEATS = [
  { k: 'The pot', u: 'ہانڈی', t: 'A handi is a round-bottomed pot with a heavy lid. Round so the heat moves, heavy so the steam stays.' },
  { k: 'The seal', u: 'دم', t: 'A rope of dough is run around the rim and pressed down. It bakes hard in the first minutes and holds everything in.' },
  { k: 'The wait', u: 'وقت', t: 'Forty-five minutes over embers. Nothing is stirred, nothing is checked, nothing is added.' },
  { k: 'The break', u: 'پیشکش', t: 'The seal is cracked at the table. The first steam off the rice is yours.' },
];

export function StoryPage() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (STILL) return;
    gsap.fromTo('.sy-beat',
      { xPercent: -6, autoAlpha: 0 },
      { xPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.sy-beats', start: 'top 80%' } });

    gsap.fromTo('.sy-feast', { yPercent: 12 }, { yPercent: -12, ease: 'none',
      scrollTrigger: { trigger: '.sy-feast-wrap', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  }, { scope: root });

  return (
    <div className="wrap" ref={root}>
      <Head
        label="How it is made"
        title="Method"
        urdu="طریقہ"
        lead="Dum is not a recipe, it is a way of closing a pot. Everything else follows from the seal."
      />

      <div className="sy-feast-wrap">
        <Orn of="vault" ink="walnut" className="sy-feast" />
      </div>

      <ol className="sy-beats">
        {BEATS.map((b, i) => (
          <li className="sy-beat" key={b.k}>
            <span className="sy-no">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2>{b.k}</h2>
              <p className="nastaliq sy-ur">{b.u}</p>
              <p>{b.t}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
