import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, STILL } from '../lib/dum';
import { to, useView } from '../lib/views';

export function DonePage() {
  const { go } = useView();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (STILL) return;
    gsap.timeline()
      .fromTo('.dn-seal', { scale: 2.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.34, ease: 'power4.in' }, 0.1)
      .fromTo('.dn-line', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0.4);
  }, { scope: root });

  return (
    <div className="wrap dn" ref={root}>
      <span className="dn-seal">دم</span>
      <h1 className="dn-line">The lid is on</h1>
      <p className="nastaliq dn-line dn-ur">ہانڈی بند ہے</p>
      <p className="dn-line dn-text">
        Forty-five minutes from now a rider leaves with a sealed pot. It will not be opened
        between here and your door.
      </p>
      <div className="dn-line dn-cta">
        <a className="btn btn-line" {...to(go, 'menu')}>Order something else</a>
      </div>
    </div>
  );
}
