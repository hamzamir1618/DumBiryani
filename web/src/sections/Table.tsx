import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, STILL } from '../lib/dum';
import { branches } from '../data/branches';
import { to, useView } from '../lib/views';
import { Band } from '../components/Band';

/** Where to sit, and the way out of the page. */
export function Table() {
  const { go } = useView();
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (STILL) return;
    gsap.fromTo('.tb-room',
      { autoAlpha: 0, y: 36 },
      { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.tb-rooms', start: 'top 82%' } });

    gsap.fromTo('.tb-call',
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.tb-end', start: 'top 80%' } });
  }, { scope: root });

  return (
    <section id="table" ref={root}>
      <div className="tb-rooms">
        <p className="label">Where to find us</p>
        <div className="tb-grid">
          {branches.map(b => (
            <a className="tb-room" key={b.id} {...to(go, 'visit')}>
              <b>{b.name}</b>
              <span className="nastaliq tb-ur">{b.urdu}</span>
              <i>{b.city} · {b.hours}</i>
            </a>
          ))}
        </div>
      </div>

      <div className="tb-end">
        <Band ink="sage" h="clamp(34px, 5vmin, 64px)" drift={12} className="tb-band" />
        <div className="tb-call">
          <h2>Order a pot</h2>
          <p className="nastaliq tb-ur-big">دم لگائیے</p>
          <div className="tb-cta">
            <a className="btn btn-fill" {...to(go, 'menu')}>See the menu</a>
            <a className="btn btn-edge" {...to(go, 'visit')}>Find a room</a>
          </div>
        </div>
      </div>
    </section>
  );
}
