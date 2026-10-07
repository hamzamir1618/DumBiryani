export type OrderLine = {
  name: string;
  urdu: string;
  note: string;
  quantity: number;
  unit: number;
  photo: string;
};

export type Order = {
  id: string;
  placedAt: number;
  mode: "delivery" | "collection";
  where: string;
  slot: string;
  lines: OrderLine[];
  subtotal: number;
  fee: number;
  total: number;
  /** How long the whole thing is promised to take, from placing to handover. */
  minutes: number;
};

const key = (id: string) => `dum-order-${id}`;

/** Kept out of components so their bodies stay free of impure calls. */
export const nowMs = () => Date.now();

export const newOrderId = () => "DB" + Math.random().toString(36).slice(2, 7).toUpperCase();

export function saveOrder(order: Order) {
  try {
    sessionStorage.setItem(key(order.id), JSON.stringify(order));
  } catch {
    // no storage: the tracking page falls back to its own example
  }
}

export function loadOrder(id: string): Order | null {
  try {
    const raw = sessionStorage.getItem(key(id));
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}

export const stages = [
  { key: "taken", title: "Order taken", urdu: "آرڈر موصول", note: "The kitchen has it." },
  { key: "sealed", title: "Sealed", urdu: "سیل بند", note: "Dough on the handi. Nothing gets in or out now." },
  { key: "dum", title: "On dum", urdu: "دم پر", note: "Over embers, untouched." },
  { key: "out", title: "On the way", urdu: "راستے میں", note: "Out of the kitchen and moving." },
] as const;

/** Where an order is now, from how long ago it was placed. */
export function progressOf(order: Order, now: number) {
  const elapsed = Math.max(0, (now - order.placedAt) / 60000);
  const fraction = Math.min(1, elapsed / order.minutes);
  const last = order.mode === "delivery" ? stages.length - 1 : stages.length - 2;
  const stage = Math.min(last, Math.floor(fraction * (last + 1)));
  const remaining = Math.max(0, Math.ceil(order.minutes - elapsed));
  return { fraction, stage, remaining, done: fraction >= 1 };
}
