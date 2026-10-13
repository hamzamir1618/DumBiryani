import { useEffect, useRef, useState } from 'react';
import { asClock, STILL, watchMinutes } from '../lib/dum';
import { to, useView, type View } from '../lib/views';
import { useBasket } from '../lib/basket';
import { Band } from './Band';

const LINKS: [View, string][] = [['menu', 'Menu'], ['story', 'Method'], ['visit', 'Visit']];

/**
 * A thin rule across the top that doubles as the dum timer: on the landing
 * page it fills with the clock, so the one piece of persistent chrome is also
 * the one mechanic the page runs on. Elsewhere it is just a bar.
 */
export function Bar() {
  const { where, go } = useView();
  const { count } = useBasket();
  const [read, setRead] = useState('00:00');
  const fill = useRef<HTMLSpanElement>(null);
  const onHome = where.view === 'home';

  useEffect(() => {
    if (!onHome) return;
    return watchMinutes(m => {
      setRead(asClock(m));
      if (fill.current) fill.current.style.transform = `scaleX(${m / 45})`;
    });
  }, [onHome]);

  useEffect(() => {
    if (STILL) return;
    let last = 0;
    const onScroll = () => {
      const y = scrollY;
      document.documentElement.classList.toggle('bar-away', y > last && y > 200);
      last = y;
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="bar">
      <span className="bar-rule">
        <Band ink="sage" h="10px" tile="auto 260%" />
        <span className="bar-fill" ref={fill} />
      </span>

      <div className="bar-in">
        <a className="bar-mark" {...to(go, 'home')} aria-label="Dum Biryani, home">
          <span className="nastaliq">دم</span>
          <b>Biryani</b>
        </a>

        {onHome && <p className="bar-clock" aria-hidden="true">{read}</p>}

        <nav className="bar-links">
          {LINKS.map(([v, label]) => (
            <a key={v} className={`bar-link${where.view === v ? ' on' : ''}`} {...to(go, v)}>{label}</a>
          ))}
          <a className="bar-order" {...to(go, 'order')}>
            Order{count > 0 && <i>{count}</i>}
          </a>
        </nav>
      </div>
    </header>
  );
}
