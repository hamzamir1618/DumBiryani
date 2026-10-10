import { useState } from 'react';
import { rupees } from '../data/menu';
import { lineNote, useBasket } from '../lib/basket';
import { to, useView } from '../lib/views';
import { Head } from '../components/Head';

const FEE = 150;
const FREE_OVER = 3000;

export function OrderPage() {
  const { go } = useView();
  const { lines, total, setQuantity, remove, clear } = useBasket();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [where, setWhere] = useState('');
  const [touched, setTouched] = useState(false);

  const fee = total >= FREE_OVER || total === 0 ? 0 : FEE;
  const valid = name.trim().length > 1 && phone.replace(/\D/g, '').length >= 10 && where.trim().length > 5 && lines.length > 0;

  const place = () => {
    if (!valid) { setTouched(true); return; }
    clear();
    go('done');
  };

  if (lines.length === 0) {
    return (
      <div className="wrap">
        <Head label="Empty" title="Nothing in the pot" urdu="ٹوکری خالی ہے"
          lead="Handis are sealed to order, so nothing sits waiting. Pick one and the kitchen starts on it." />
        <a className="btn btn-saffron" {...to(go, 'menu')}>Open the menu</a>
      </div>
    );
  }

  return (
    <div className="wrap">
      <Head label={lines.length + ' in the basket'} title="Your order" urdu="آپ کا آرڈر"
        lead="Once this is sent the handi is sealed, and a sealed handi cannot be changed." />

      <div className="or-grid">
        <ul className="or-lines">
          {lines.map(l => (
            <li key={l.key}>
              <span className="or-shot"><img src={l.dish.photo} alt="" /></span>
              <span className="or-body">
                <b>{l.dish.name}</b>
                <span className="nastaliq or-ur">{l.dish.urdu}</span>
                <i>{lineNote(l)}</i>
              </span>
              <span className="or-qty">
                <button type="button" aria-label="Fewer" onClick={() => setQuantity(l.key, l.quantity - 1)}>-</button>
                <span>{l.quantity}</span>
                <button type="button" aria-label="More" onClick={() => setQuantity(l.key, l.quantity + 1)}>+</button>
              </span>
              <span className="or-price">{rupees(l.unit * l.quantity)}</span>
              <button type="button" className="or-rm" onClick={() => remove(l.key)}>Remove</button>
            </li>
          ))}
        </ul>

        <aside className="or-side">
          <label className="field">
            <span>Name</span>
            <input value={name} onChange={e => setName(e.target.value)} />
            {touched && name.trim().length < 2 && <em>We need a name.</em>}
          </label>
          <label className="field">
            <span>Phone</span>
            <input value={phone} inputMode="tel" onChange={e => setPhone(e.target.value)} />
            {touched && phone.replace(/\D/g, '').length < 10 && <em>A number the rider can call.</em>}
          </label>
          <label className="field">
            <span>Where to</span>
            <input value={where} onChange={e => setWhere(e.target.value)} />
            {touched && where.trim().length <= 5 && <em>Street and area, please.</em>}
          </label>

          <dl className="or-sum">
            <div><dt>Subtotal</dt><dd>{rupees(total)}</dd></div>
            <div><dt>Delivery</dt><dd>{fee === 0 ? 'Free' : rupees(fee)}</dd></div>
            <div className="or-tot"><dt>Total</dt><dd>{rupees(total + fee)}</dd></div>
          </dl>

          <button type="button" className="btn btn-saffron" onClick={place}>Seal the handi</button>
        </aside>
      </div>
    </div>
  );
}
