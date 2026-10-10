import { useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, STILL } from '../lib/dum';
import { categories, categoryUrdu, dishes, rupees, type Category } from '../data/menu';
import { to, useView } from '../lib/views';
import { Head } from '../components/Head';

const FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'mutton', label: 'Mutton' },
  { id: 'chicken', label: 'Chicken' },
  { id: 'veg', label: 'Veg' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

export function MenuPage() {
  const { go } = useView();
  const [filter, setFilter] = useState<FilterId>('all');
  const root = useRef<HTMLDivElement>(null);

  const shown = useMemo(
    () => (filter === 'all' ? dishes : dishes.filter(d => d.tags.includes(filter))),
    [filter],
  );

  useGSAP(() => {
    if (STILL) return;
    gsap.fromTo('.mn-row',
      { yPercent: 40, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05, ease: 'power3.out' });
  }, { scope: root, dependencies: [filter] });

  const sections = categories
    .map((c: Category) => ({ category: c, items: shown.filter(d => d.category === c) }))
    .filter(s => s.items.length > 0);

  return (
    <div className="wrap" ref={root}>
      <Head
        label={dishes.length + ' dishes · sealed to order'}
        title="The Menu"
        urdu="کھانے کی فہرست"
        lead="Every handi is sealed when you order it, so the kitchen needs the time it needs. Nothing here is reheated."
      />

      <div className="mn-filters">
        {FILTERS.map(f => (
          <button
            key={f.id}
            type="button"
            className={'chip' + (filter === f.id ? ' on' : '')}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {sections.map(({ category, items }) => (
        <section className="mn-cat" key={category}>
          <div className="mn-cat-head">
            <h2>{category}</h2>
            <span className="nastaliq">{categoryUrdu[category]}</span>
          </div>
          <ul className="mn-list">
            {items.map(dish => (
              <li key={dish.id}>
                <a className="mn-row" data-dish={dish.id} {...to(go, 'dish', dish.id)}>
                  <span className="mn-shot zoom-src"><img src={dish.photo} alt={dish.name} /></span>
                  <span className="mn-body">
                    <b>{dish.name}</b>
                    <span className="nastaliq mn-urdu">{dish.urdu}</span>
                    <i>{dish.blurb}{dish.dum ? ' · ' + dish.dum + ' min on dum' : ''}</i>
                  </span>
                  <span className="mn-price">{rupees(dish.price)}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
