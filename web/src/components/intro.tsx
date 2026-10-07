"use client";

import { useEffect } from "react";
import { Medallion } from "@/components/ornament";

/**
 * The title card the landing page opens on.
 *
 * Whether it runs at all is settled by `introScript` before first paint, which
 * sets `data-intro` on the document — so the card is already covering the page
 * when the first pixel lands, rather than appearing after hydration and
 * covering a hero the reader has already seen. It plays once a session;
 * `?intro` forces it.
 *
 * The sequence is pure CSS. This only clears the attribute when it is over, so
 * if the JavaScript never arrives the card still ends on its own.
 */

const RUN = 2600;
/** When the veil starts lifting: the hero is released a moment before. */
const REVEAL = 1600;

export function HomeIntro() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute("data-intro") !== "1") return;

    // The card starts animating the moment the document is parsed, not when
    // React gets here, so the clock is the page's and not this effect's —
    // otherwise a slow hydration leaves it holding the page long after the
    // animation has visibly finished.
    const since = performance.now();
    const left = (at: number) => Math.max(0, at - since);

    const previous = root.style.overflow;
    // the page must not move underneath the card
    root.style.overflow = "hidden";

    let reveal = 0;
    const end = () => {
      window.clearTimeout(reveal);
      window.clearTimeout(timer);
      root.removeAttribute("data-intro");
      root.style.overflow = previous;
    };

    // step one releases the hero's own animations, step two takes the card away
    reveal = window.setTimeout(
      () => root.setAttribute("data-intro", "2"),
      left(REVEAL),
    );
    const timer = window.setTimeout(end, left(RUN));

    window.addEventListener("keydown", end);
    window.addEventListener("wheel", end, { passive: true });
    window.addEventListener("touchstart", end, { passive: true });
    window.addEventListener("pointerdown", end);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(reveal);
      root.style.overflow = previous;
      // deliberately not clearing data-intro here: in development React mounts,
      // unmounts and remounts effects, and tearing the card down on that first
      // unmount would end the sequence before it had begun
      window.removeEventListener("keydown", end);
      window.removeEventListener("wheel", end);
      window.removeEventListener("touchstart", end);
      window.removeEventListener("pointerdown", end);
    };
  }, []);

  return (
    <div className="intro-root" role="presentation" aria-hidden>
      <div className="intro-veil" />

      <div className="intro-halo text-turquoise">
        <div className="intro-medallion">
          {/* drawn at the size it finishes on; the sequence only scales it down */}
          <Medallion size={980} />
        </div>
      </div>

      <div className="intro-lockup">
        <span className="kufi intro-mark block text-[clamp(4rem,13vw,9rem)] leading-none text-saffron">
          دم
        </span>
        <span className="intro-rule mt-5 block h-px w-40 bg-saffron/70" />
        <span className="display intro-word mt-5 block text-[clamp(2rem,7vw,4.5rem)] leading-none font-light text-white">
          Biryani
        </span>
        <span className="label intro-sub mt-6 block text-turquoise-light">
          Sealed with dough
        </span>
      </div>
    </div>
  );
}
