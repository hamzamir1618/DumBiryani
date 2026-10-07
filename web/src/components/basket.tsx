"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { byId, type Dish } from "@/data/menu";

export type BasketLine = {
  key: string;
  dish: Dish;
  portion: number;
  spice: number;
  addOns: string[];
  quantity: number;
  unit: number;
};

/** What goes to storage: the dish is looked up again on the way back. */
type StoredLine = Omit<BasketLine, "dish"> & { dishId: string };

type BasketContext = {
  lines: BasketLine[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (line: Omit<BasketLine, "key">) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const KEY = "dum-basket";
const Ctx = createContext<BasketContext | null>(null);

export const useBasket = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBasket must be used inside <BasketProvider>");
  return ctx;
};

export const FREE_DELIVERY_OVER = 3000;
export const DELIVERY_FEE = 199;
export const deliveryFee = (total: number) =>
  total === 0 || total >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;

/** Mock basket. It survives a reload, but there is no server behind it. */
export function BasketProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BasketLine[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Read a tick after mount: the server has no idea what is in the basket, so
  // this cannot be part of the first render without a hydration mismatch.
  useEffect(() => {
    const restore = () => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const stored = JSON.parse(raw) as StoredLine[];
          const back = stored
            .map(({ dishId, ...rest }) => {
              const dish = byId(dishId);
              return dish ? { ...rest, dish } : null;
            })
            .filter((l): l is BasketLine => l !== null);
          if (back.length) setLines(back);
        }
      } catch {
        // corrupt or unavailable storage: start empty
      }
      setLoaded(true);
    };
    const id = window.setTimeout(restore, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      const stored: StoredLine[] = lines.map(({ dish, ...rest }) => ({
        ...rest,
        dishId: dish.id,
      }));
      localStorage.setItem(KEY, JSON.stringify(stored));
    } catch {
      // the basket simply will not survive the reload
    }
  }, [lines, loaded]);

  const add = useCallback((line: Omit<BasketLine, "key">) => {
    const key = [
      line.dish.id,
      line.portion,
      line.spice,
      [...line.addOns].sort().join("+"),
    ].join("|");
    setLines((current) => {
      const found = current.find((l) => l.key === key);
      if (found) {
        return current.map((l) =>
          l.key === key
            ? { ...l, quantity: Math.min(20, l.quantity + line.quantity) }
            : l,
        );
      }
      return [...current, { ...line, key }];
    });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((l) => l.key !== key)
        : current.map((l) =>
            l.key === key ? { ...l, quantity: Math.min(20, quantity) } : l,
          ),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((current) => current.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    const total = lines.reduce((sum, l) => sum + l.unit * l.quantity, 0);
    return {
      lines,
      count,
      total,
      open,
      setOpen,
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [lines, open, add, setQuantity, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
