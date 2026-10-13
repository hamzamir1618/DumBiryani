import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ScrollTrigger, STILL, toTop } from './lib/dum';
import { hashOf, ViewContext, whereFromHash, type View, type Where } from './lib/views';
import { BasketProvider } from './lib/basket';
import { Lid, type LidHandle } from './components/Lid';
import { Bar } from './components/Bar';
import { Home } from './pages/Home';
import { MenuPage } from './pages/MenuPage';
import { DishPage } from './pages/DishPage';
import { StoryPage } from './pages/StoryPage';
import { VisitPage } from './pages/VisitPage';
import { OrderPage } from './pages/OrderPage';
import { DonePage } from './pages/DonePage';

const PAGES: Record<View, () => JSX.Element> = {
  home: Home, menu: MenuPage, dish: DishPage, story: StoryPage, visit: VisitPage, order: OrderPage, done: DonePage,
};

const same = (a: Where, b: Where) => a.view === b.view && (a.of ?? '') === (b.of ?? '');

/** A wipe that never finishes must not be allowed to wedge navigation. */
const atMost = (p: Promise<unknown>, ms = 3500) =>
  Promise.race([p, new Promise(r => setTimeout(r, ms))]);

export default function App() {
  const [where, setWhere] = useState<Where>(whereFromHash);
  const lid = useRef<LidHandle>(null);
  const now = useRef(where);
  const busy = useRef(false);

  const go = useCallback(async (view: View, of?: string) => {
    const next: Where = { view, of };
    if (busy.current) return;
    if (same(next, now.current)) { toTop(true); return; }
    busy.current = true;
    try { history.pushState(null, '', hashOf(next)); } catch { /* sandboxed frames refuse */ }
    try {
      if (!STILL && lid.current) await atMost(lid.current.close());
      // commit while the lid is down, then re-measure everything behind it
      flushSync(() => setWhere(next));
      now.current = next;
      toTop();
      ScrollTrigger.refresh();
      if (!STILL && lid.current) await atMost(lid.current.open());
    } finally {
      busy.current = false;
    }
  }, []);

  useEffect(() => {
    const onPop = () => {
      const w = whereFromHash();
      if (!same(w, now.current)) go(w.view, w.of);
    };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, [go]);

  // fonts and photographs land late and move everything; measure again once
  useEffect(() => {
    const again = () => ScrollTrigger.refresh();
    addEventListener('load', again);
    document.fonts?.ready.then(again);
    return () => removeEventListener('load', again);
  }, []);

  const value = useMemo(() => ({ where, go, open: true }), [where, go]);
  const Page = PAGES[where.view];

  return (
    <ViewContext.Provider value={value}>
      <BasketProvider>
        <Bar />
        <main key={hashOf(where)} className={`view view-${where.view}`}>
          <Page />
        </main>
        <Lid ref={lid} />
      </BasketProvider>
    </ViewContext.Provider>
  );
}
