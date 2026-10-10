import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { crackPath, gsap, STILL } from '../lib/dum';
import { dishes, rupees } from '../data/menu';
import { to, useView } from '../lib/views';
import { Band } from '../components/Band';

const HANDIS = dishes.filter(d => d.category === 'Biryani');

/**
 * 45:00. The only place on this page where food appears.
 *
 * Everything above has withheld it on purpose, so this has to land all at
 * once: the seam splits, the heat drains away, and the pots arrive together.
 */
export function Break() {
  const { go } = useView();
  const root = useRef<HTMLElement>(null);
  const seam = crackPath(36, 2.6, 23);

  useGSAP(() => {
    if (STILL) return;
    const upper = `polygon(0% 0%, 100% 0%, ${[...seam].reverse().join(', ')})`;
    const lower = `polygon(${seam.join(', ')}, 100% 100%, 0% 100%)`;
    gsap.set('.bk-u', { clipPath: upper });
    gsap.set('.bk-l', { clipPath: lower });

    gsap.timeline({
      scrollTrigger: { trigger: root.current, start: 'top 85%', end: '+=90%', scrub: 0.7, invalidateOnRefresh: true },
    })
      .to('.bk-u', { yPercent: -108, duration: 0.5, ease: 'power3.inOut' }, 0)
      .to('.bk-l', { yPercent: 108, duration: 0.5, ease: 'power3.inOut' }, 0)
      .fromTo('.bk-word', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.18);

    gsap.fromTo('.bk-pot',
      { autoAlpha: 0, y: 70 },
      {
        autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out',
        scrollTrigger: { trigger: '.bk-grid', start: 'top 80%' },
      });
  }, { scope: root });

  return (
    <section id="break" ref={root}>
      <div className="bk-lid">
        <span className="bk-half bk-u" />
        <span className="bk-half bk-l" />
      </div>

      <div className="bk-head">
        <p className="label bk-word">45:00</p>
        <h2 className="bk-title bk-word">Opened at your table</h2>
        <p className="nastaliq bk-ur bk-word">ڈھکن کھل گیا</p>
      </div>

      <Band ink="sage" h="clamp(26px, 4vmin, 48px)" drift={14} className="bk-rule" />

      <div className="bk-grid">
        {HANDIS.map(d => (
          <a className="bk-pot" key={d.id} {...to(go, 'dish', d.id)}>
            <span className="bk-shot"><img src={d.photo} alt={d.name} loading="lazy" /></span>
            <b>{d.name}</b>
            <span className="nastaliq bk-name">{d.urdu}</span>
            <span className="bk-row"><i>{d.dum} min</i><i>{rupees(d.price)}</i></span>
          </a>
        ))}
      </div>
      <Band ink="sage" h="clamp(26px, 4vmin, 48px)" drift={-14} flip className="bk-rule bk-rule-b" />
    </section>
  );
}
