import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, STILL } from '../lib/dum';
import { branches } from '../data/branches';
import { Head } from '../components/Head';

export function VisitPage() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (STILL) return;
    gsap.utils.toArray<HTMLElement>('.vs-room').forEach(room => {
      gsap.fromTo(room.querySelector('.vs-shot img'),
        { yPercent: -8, scale: 1.12 },
        { yPercent: 8, scale: 1.12, ease: 'none',
          scrollTrigger: { trigger: room, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.fromTo(room.querySelector('.vs-body'),
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: room, start: 'top 72%' } });
    });
  }, { scope: root });

  return (
    <div className="wrap" ref={root}>
      <Head
        label="Karachi · Lahore · Islamabad"
        title="Four rooms"
        urdu="ہمارے ٹھکانے"
        lead="Every kitchen seals its own handis. Nothing travels between branches, which is why the menu is short and the waiting is real."
      />

      {branches.map((b, i) => (
        <section className={'vs-room' + (i % 2 ? ' flip' : '')} key={b.id}>
          <div className="vs-shot"><img src={b.photo} alt={b.name + ', ' + b.city} /></div>
          <div className="vs-body">
            <p className="label">{b.city} · since {b.opened}</p>
            <h2>{b.name}</h2>
            <p className="nastaliq vs-ur">{b.urdu}</p>
            <p className="vs-note">{b.note}</p>
            <dl className="vs-facts">
              <div><dt>Address</dt><dd>{b.address}</dd></div>
              <div><dt>Hours</dt><dd>{b.hours}</dd></div>
              <div><dt>Seats</dt><dd>{b.seats}</dd></div>
            </dl>
            <a className="vs-tel" href={'tel:' + b.phone.replace(/\s/g, '')}>{b.phone}</a>
          </div>
        </section>
      ))}
    </div>
  );
}
