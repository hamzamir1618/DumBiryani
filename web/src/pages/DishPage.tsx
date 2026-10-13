import { useMemo, useState } from 'react';
import { byId, dishes, portions, rupees, spiceLevels } from '../data/menu';
import { lineNote, unitPrice, useBasket } from '../lib/basket';
import { to, useView } from '../lib/views';
import { addOns as allAddOns } from '../data/menu';

const SPICE_NOTE = [
  'Warm, not hot. Built for sharing with children at the table.',
  'The house setting. Chilli you can taste but still eat around.',
  'Properly hot. Green chilli left whole in the layers.',
  'The kitchen own setting. Ask for raita and mean it.',
];

export function DishPage() {
  const { where, go } = useView();
  const dish = byId(where.of ?? '') ?? dishes[0];
  const isBiryani = dish.category === 'Biryani';
  const { add } = useBasket();

  const [portion, setPortion] = useState(0);
  const [spice, setSpice] = useState(1);
  const [picked, setPicked] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const unit = useMemo(() => unitPrice(dish, portion, picked), [dish, portion, picked]);
  const alsoTry = dishes.filter(d => d.id !== dish.id && d.category === dish.category).slice(0, 3);

  const toggle = (id: string) =>
    setPicked(c => (c.includes(id) ? c.filter(x => x !== id) : [...c, id]));

  const line = { dish, portion, spice, addOns: picked, quantity, unit };

  return (
    <div className="wrap dish">
      <div className="dp-top">
        <div className="dp-shot zoom-dest"><img src={dish.photo} alt={dish.name} /></div>
        <div className="dp-head">
          <p className="label">{dish.category}{dish.dum ? ' · ' + dish.dum + ' minutes on dum' : ''}</p>
          <h1>{dish.name}</h1>
          <p className="nastaliq dp-ur">{dish.urdu}</p>
          <p className="dp-desc">{dish.description}</p>
        </div>
      </div>

      <div className="dp-grid">
        <div>
          {isBiryani && (
            <fieldset className="dp-set">
              <legend className="label">Portion</legend>
              <div className="dp-opts">
                {portions.map((p, i) => (
                  <button key={p.name} type="button" className={'opt' + (portion === i ? ' on' : '')}
                    aria-pressed={portion === i} onClick={() => setPortion(i)}>
                    <b>{p.name}</b><i>{p.serves}</i>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="dp-set">
            <legend className="label">Spice</legend>
            <div className="dp-opts">
              {spiceLevels.map((s, i) => (
                <button key={s} type="button" className={'opt' + (spice === i ? ' on' : '')}
                  aria-pressed={spice === i} onClick={() => setSpice(i)}>
                  <b>{s}</b>
                </button>
              ))}
            </div>
            <p className="dp-note">{SPICE_NOTE[spice]}</p>
          </fieldset>

          {isBiryani && (
            <fieldset className="dp-set">
              <legend className="label">Add-ons</legend>
              <div className="dp-adds">
                {allAddOns.map(a => (
                  <button key={a.id} type="button" className={'opt' + (picked.includes(a.id) ? ' on' : '')}
                    aria-pressed={picked.includes(a.id)} onClick={() => toggle(a.id)}>
                    <b>{a.name}</b><i>+ {rupees(a.price)}</i>
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        </div>

        <aside className="dp-order">
          <p className="label">{dish.name}</p>
          <p className="dp-sum">{lineNote({ ...line, key: 'x' })}</p>
          <div className="dp-qty">
            <button type="button" aria-label="Fewer" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button type="button" aria-label="More" onClick={() => setQuantity(q => Math.min(20, q + 1))}>+</button>
          </div>
          <p className="dp-total">{rupees(unit * quantity)}</p>
          <button type="button" className="btn btn-saffron dp-add"
            onClick={() => { add(line); setAdded(true); }}>
            {added ? 'In the basket' : 'Add to basket'}
          </button>
          {added && <a className="dp-go" {...to(go, 'order')}>Go to the order</a>}
          <p className="dp-small">Sealed when you order · {dish.dum ?? 20} minutes</p>
        </aside>
      </div>

      {alsoTry.length > 0 && (
        <section className="dp-also">
          <p className="label">Also on the {dish.category.toLowerCase()} list</p>
          <div className="dp-also-grid">
            {alsoTry.map(d => (
              <a key={d.id} className="dp-also-card" data-dish={d.id} {...to(go, 'dish', d.id)}>
                <span className="zoom-src"><img src={d.photo} alt={d.name} /></span>
                <b>{d.name}</b>
                <i>{rupees(d.price)}</i>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
