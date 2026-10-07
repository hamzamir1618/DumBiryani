"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Drives the scroll choreography in browsers that do not have CSS
 * scroll-driven animations, or that only half have them.
 *
 * Support is not one switch. Nearly every effect here rides an anonymous
 * `view()` timeline, but the pinned horizontal run rides a *named* one
 * (`--scene`), declared on the section and used by the row inside it. A
 * browser can do the first and not the second, and then the whole page
 * animates except that one set-piece, which sits perfectly still.
 *
 * So the two are checked separately, by looking at what a real animation on
 * the page actually got rather than by asking `CSS.supports` — which can
 * answer yes and still not wire anything up. Whichever half is dead gets
 * driven from here; a browser that does both is left alone entirely.
 */

const VIEW_CLASSES = [
  "s-rise",
  "s-wipe",
  "s-wipe-up",
  "s-arch",
  "s-rule",
  "s-turn",
  "s-grow",
  "s-settle",
  "s-pan",
  "s-near",
  "s-far",
  "s-counter",
  "s-band",
  "s-draw",
];

const VIEW_SELECTOR = VIEW_CLASSES.map((c) => `.${c}`).join(",");
/* The field medallions are static now, so the only thing left riding the
   document's own scroll is the rail across the top. */
const DOC_SELECTOR = ".scroll-rail";
const ANON_PROBE = ".s-rise, .s-wipe, .s-wipe-up, .s-turn";

const clamp = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Whether this element's animation is really running off a scroll timeline.
 *
 * `null` means "cannot tell yet". Note that an element with no animation at
 * all is only undecided in a browser that claims support: where the property
 * is unknown the effects are never declared in the first place, because they
 * live inside `@supports (animation-timeline: view())`, so waiting for one to
 * appear would wait forever.
 */
function isDriven(el: Element | null) {
  if (!el) return null;
  const anims = el.getAnimations();
  if (anims.length === 0)
    return CSS.supports("animation-timeline: view()") ? null : false;
  return anims.some((a) => a.timeline && a.timeline !== document.timeline);
}

/**
 * Takes over the parts of the page the browser is not driving, and returns
 * the undo. `runsOnly` covers the case where everything works except the
 * pinned run's named timeline.
 */
function engage(runsOnly: boolean): () => void {
  const root = document.documentElement;
  root.classList.add(runsOnly ? "no-scene-timeline" : "no-timeline");

  let viewEls: HTMLElement[] = [];
  let runs: HTMLElement[] = [];
  let docEls: HTMLElement[] = [];
  let chrome: HTMLElement[] = [];
  let wordGroups = new Map<HTMLElement, HTMLElement[]>();

  /**
   * Finds everything to drive. This runs again whenever the page changes,
   * because plenty of it arrives after the first paint — the checkout form,
   * for one, waits for the basket to come back out of storage.
   */
  const collect = () => {
    runs = Array.from(document.querySelectorAll<HTMLElement>(".scene-run"));
    if (runsOnly) return;

    viewEls = Array.from(document.querySelectorAll<HTMLElement>(VIEW_SELECTOR));
    docEls = Array.from(document.querySelectorAll<HTMLElement>(DOC_SELECTOR));
    chrome = Array.from(document.querySelectorAll<HTMLElement>(".chrome-fade"));

    // Words are lit in sequence, so each one is offset inside its paragraph.
    wordGroups = new Map();
    document.querySelectorAll<HTMLElement>(".s-word").forEach((w) => {
      const parent = w.parentElement as HTMLElement | null;
      if (!parent) return;
      const list = wordGroups.get(parent) ?? [];
      list.push(w);
      wordGroups.set(parent, list);
    });
  };

  // Scrubbing by animation-delay is unreliable once an animation is already
  // paused, so each one is held through its animation object instead.
  const held = new WeakMap<HTMLElement, Animation>();
  const hold = (el: HTMLElement, p: number) => {
    let anim = held.get(el);
    if (!anim) {
      anim = el.getAnimations()[0];
      if (!anim) return;
      anim.pause();
      held.set(el, anim);
    }
    anim.currentTime = clamp(p) * 1000;
  };

  /** How far an element has travelled up the window, 0 at the bottom edge. */
  const viewProgress = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const from = vh * 0.98;
    const to = vh * 0.3;
    return clamp((from - r.top) / (from - to));
  };

  let frame = 0;
  const update = () => {
    frame = 0;
    const vh = window.innerHeight;

    // the run travels exactly as far as its section is pinned
    for (const run of runs) {
      const scene = run.closest<HTMLElement>(".scene");
      if (!scene) continue;
      const r = scene.getBoundingClientRect();
      const span = Math.max(1, r.height - vh);
      hold(run, clamp(-r.top / span));
    }
    if (runsOnly) return;

    const docSpan = Math.max(1, root.scrollHeight - vh);
    const docP = clamp(window.scrollY / docSpan);

    for (const el of viewEls) {
      const r = el.getBoundingClientRect();
      // skip anything far outside the window
      if (r.bottom < -vh || r.top > vh * 2) continue;
      hold(el, viewProgress(el));
    }

    wordGroups.forEach((words, parent) => {
      const r = parent.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      const p = viewProgress(parent);
      const n = words.length;
      words.forEach((w, i) => hold(w, clamp(p * (n + 6) - i)));
    });

    for (const el of docEls) hold(el, docP);
    for (const el of chrome) hold(el, clamp(window.scrollY / (vh * 0.7)));
  };

  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  };

  let recollect = 0;
  const onMutate = () => {
    if (recollect) return;
    recollect = requestAnimationFrame(() => {
      recollect = 0;
      collect();
      update();
    });
  };

  collect();
  update();
  // the fallback rules have only just been applied; the animations they
  // declare may not exist until the next style resolution
  const settle = requestAnimationFrame(() => {
    collect();
    update();
  });
  const watcher = new MutationObserver(onMutate);
  watcher.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  return () => {
    watcher.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (frame) cancelAnimationFrame(frame);
    if (recollect) cancelAnimationFrame(recollect);
    cancelAnimationFrame(settle);
    root.classList.remove("no-timeline", "no-scene-timeline");
  };
}

export function ScrollDriver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let undo: (() => void) | null = null;
    let settled = false;

    /**
     * Styles may not have resolved yet, and on some routes the animated
     * content only arrives after mount, so this keeps looking until there is
     * something real to inspect.
     */
    const decide = () => {
      if (settled) return;
      const anon = isDriven(document.querySelector(ANON_PROBE));
      if (anon === null) return; // nothing to read yet

      // Where the ordinary effects are dead, so is the run: take the lot.
      if (anon === false) {
        settled = true;
        watcher.disconnect();
        undo = engage(false);
        return;
      }

      // The run rides a named timeline, which is a separate capability. Only
      // decide once there is a run on the page to look at.
      const run = document.querySelector(".scene-run");
      if (!run) return;
      const named = isDriven(run);
      if (named === null) return;

      settled = true;
      watcher.disconnect();
      if (named === false) undo = engage(true);
    };

    const watcher = new MutationObserver(decide);
    watcher.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    const first = requestAnimationFrame(decide);

    return () => {
      settled = true;
      watcher.disconnect();
      cancelAnimationFrame(first);
      undo?.();
    };
  }, [pathname]);

  return null;
}
