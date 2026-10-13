import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, STILL } from '../lib/dum';
import { Band } from '../components/Band';

/** A cut straight down through a sealed handi, top to bottom. */
const LAYERS = [
  { k: 'Dough', u: 'آٹا', n: 'Pressed round the rim by hand.', c: 'walnut' },
  { k: 'Saffron', u: 'زعفران', n: 'Soaked in warm milk first.', c: 'larkspur' },
  { k: 'Rice', u: 'چاول', n: 'Aged basmati, boiled most of the way.', c: 'ivory' },
  { k: 'Onion', u: 'پیاز', n: 'Fried dark. This is where the colour comes from.', c: 'madder' },
  { k: 'Meat', u: 'گوشت', n: 'Goes in raw, sitting in its yoghurt.', c: 'indigo-l' },
];

/**
 * While the clock runs, the page shows the one thing it can honestly show: the
 * order of the layers. The bands draw apart as you read so each one can be
 * named, then close again — the pot is still shut.
 */
export function Strata() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (STILL) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root.current, start: 'top top', end: '+=260%', pin: true, scrub: 0.8, invalidateOnRefresh: true },
    });

    // the band slides off the label rather than carrying it along
    gsap.utils.toArray<HTMLElement>('.st-layer').forEach((el, i) => {
      const dir = i % 2 === 0 ? -1 : 1;
      tl.fromTo(el.querySelector('.st-band'),
        { xPercent: 0 }, { xPercent: dir * 42, duration: 0.5, ease: 'power2.inOut' }, 0.05 + i * 0.05)
        .fromTo(el.querySelector('.st-name'),
          { autoAlpha: 0, x: dir * -18 }, { autoAlpha: 1, x: 0, duration: 0.2 }, 0.16 + i * 0.05);
    });
    // and the pot closes again
    tl.to('.st-band', { xPercent: 0, duration: 0.4, ease: 'power2.inOut' }, 0.74)
      .to('.st-name', { autoAlpha: 0, duration: 0.18 }, 0.74)
      .fromTo('.st-shut', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.86);
  }, { scope: root });

  return (
    <section id="strata" ref={root}>
      <div className="st-head">
        <p className="label">Top to bottom</p>
        <h2 className="st-title">How it is packed</h2>
      </div>

      <div className="st-stack">
        {LAYERS.map((l, i) => (
          <div className={`st-layer${i % 2 === 0 ? ' to-left' : ' to-right'}`} key={l.k} data-ink={l.c}>
            <Band ink={l.c} h="clamp(26px, 5.2vmin, 58px)" tile="auto 190%" className="st-band" />
            <span className="st-name">
              <b>{l.k}</b>
              <span className="nastaliq st-ur">{l.u}</span>
              <i>{l.n}</i>
            </span>
          </div>
        ))}
      </div>

      <p className="st-shut">Then the lid goes on.</p>
    </section>
  );
}
