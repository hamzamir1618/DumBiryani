import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { byId, portionPrice, portions, addOns as allAddOns, type Dish } from '../data/menu';

export interface Line {
  key: string;
  dish: Dish;
  portion: number;
  spice: number;
  addOns: string[];
  quantity: number;
  unit: number;
}

type Stored = Omit<Line, 'dish'> & { dishId: string };

interface BasketValue {
  lines: Line[];
  count: number;
  total: number;
  add: (line: Omit<Line, 'key'>) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const KEY = 'dum-basket';
const Ctx = createContext<BasketValue | null>(null);

export function useBasket() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useBasket must be used inside <BasketProvider>');
  return v;
}

/** What a line costs on its own, before quantity. */
export function unitPrice(dish: Dish, portion: number, picked: string[]) {
  const base = dish.category === 'Biryani' ? portionPrice(dish, portion) : dish.price;
  const extras = picked.reduce((sum, id) => sum + (allAddOns.find(a => a.id === id)?.price ?? 0), 0);
  return base + extras;
}

/** "Sharing · Hot · Extra raita", the way the line was ordered. */
export function lineNote(line: Line) {
  const bits: string[] = [];
  if (line.dish.category === 'Biryani') bits.push(portions[line.portion].name);
  line.addOns.forEach(id => {
    const found = allAddOns.find(a => a.id === id);
    if (found) bits.push(found.name);
  });
  return bits.join(' · ');
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      return (JSON.parse(raw) as Stored[])
        .map(({ dishId, ...rest }) => {
          const dish = byId(dishId);
          return dish ? { ...rest, dish } : null;
        })
        .filter((l): l is Line => l !== null);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines.map(({ dish, ...rest }) => ({ ...rest, dishId: dish.id }))));
    } catch {
      // private browsing: the basket simply will not survive a reload
    }
  }, [lines]);

  const value = useMemo<BasketValue>(() => {
    const signature = (l: Omit<Line, 'key'>) => `${l.dish.id}|${l.portion}|${l.spice}|${[...l.addOns].sort().join(',')}`;
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      total: lines.reduce((n, l) => n + l.unit * l.quantity, 0),
      add: line =>
        setLines(cur => {
          const sig = signature(line);
          const at = cur.findIndex(l => signature(l) === sig);
          if (at === -1) return [...cur, { ...line, key: `${sig}|${Date.now()}` }];
          const next = [...cur];
          next[at] = { ...next[at], quantity: next[at].quantity + line.quantity };
          return next;
        }),
      setQuantity: (key, quantity) =>
        setLines(cur =>
          quantity <= 0 ? cur.filter(l => l.key !== key) : cur.map(l => (l.key === key ? { ...l, quantity } : l)),
        ),
      remove: key => setLines(cur => cur.filter(l => l.key !== key)),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
