import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);
export { gsap, ScrollTrigger };

export const STILL = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const POINTER = matchMedia('(pointer: fine)').matches;

/** The whole dish, and the whole page, is this long. */
export const DUM = 45;

/* ------------------------------------------------------------ the clock */

let minutes = 0;
const watchers = new Set<(m: number) => void>();

/**
 * How far through the forty-five minutes the reader is.
 *
 * One number drives the entire landing page: the arc, the digits, the strata,
 * the pressure, and finally the break. Sections do not own scroll positions of
 * their own — they subscribe to this and render whatever minute it is. That is
 * what makes the page feel like one machine rather than a stack of effects.
 */
export const elapsed = () => minutes;

export function watchMinutes(fn: (m: number) => void) {
  watchers.add(fn);
  fn(minutes);
  return () => void watchers.delete(fn);
}

export function setMinutes(m: number) {
  const next = Math.max(0, Math.min(DUM, m));
  if (next === minutes) return;
  minutes = next;
  // exposed as a custom property too, so flat CSS can follow the clock
  document.documentElement.style.setProperty('--min', next.toFixed(2));
  watchers.forEach(fn => fn(next));
}

/** mm:ss, the way a kitchen timer reads. */
export function asClock(m: number) {
  const whole = Math.floor(m);
  const secs = Math.round((m - whole) * 60);
  return `${String(whole).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
}

/* ------------------------------------------------------------- the ride */

let lenis: Lenis | null = null;

/** Weighted scrolling, on the GSAP ticker so scrubs never drift out of step. */
export function startRide() {
  if (STILL || lenis) return;
  lenis = new Lenis({ duration: 1.25, easing: t => 1 - Math.pow(1 - t, 4) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function rideTo(target: number | string) {
  if (lenis) lenis.scrollTo(target as never, { duration: 1.5 });
  else if (typeof target === 'number') scrollTo({ top: target, behavior: STILL ? 'auto' : 'smooth' });
}

export function toTop(glide = false) {
  if (lenis) lenis.scrollTo(0, glide && !STILL ? { duration: 1.1 } : { immediate: true, force: true });
  else scrollTo({ top: 0, behavior: glide && !STILL ? 'smooth' : 'auto' });
}

export function holdPage(on: boolean) {
  document.documentElement.classList.toggle('held', on);
  if (lenis) (on ? lenis.stop() : lenis.start());
}

/* ------------------------------------------------------------- helpers */

/** A jagged line across a box, for cracking things open. Seeded, so it is stable. */
export function crackPath(steps = 26, jitter = 2.4, seed = 7) {
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    const y = 50 + (rnd() - 0.5) * jitter * 2;
    pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  return pts;
}

export function expose() {
  if (!import.meta.env.DEV) return;
  Object.assign(window, { lenis, ScrollTrigger, gsap, elapsed });
}
