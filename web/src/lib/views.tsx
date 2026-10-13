import { createContext, useContext } from 'react';
import type React from 'react';

export type View = 'home' | 'menu' | 'dish' | 'story' | 'visit' | 'order' | 'done';
const ALL: View[] = ['home', 'menu', 'dish', 'story', 'visit', 'order', 'done'];

export interface Where { view: View; of?: string }

interface Value {
  where: Where;
  go: (view: View, of?: string) => void;
  /** False while the seal is still over the page on first arrival. */
  open: boolean;
}

export const ViewContext = createContext<Value>({ where: { view: 'home' }, go: () => {}, open: true });
export const useView = () => useContext(ViewContext);

export const hashOf = (w: Where) => `#${w.view}${w.of ? `/${w.of}` : ''}`;

export function whereFromHash(): Where {
  const [v, of] = location.hash.slice(1).split('/');
  return ALL.includes(v as View) ? { view: v as View, of } : { view: 'home' };
}

/** A real href that animates when clicked normally, so it still opens in a new tab. */
export function to(go: Value['go'], view: View, of?: string) {
  return {
    href: hashOf({ view, of }),
    onClick: (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      go(view, of);
    },
  };
}
