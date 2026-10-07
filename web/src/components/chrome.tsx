"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image, { type ImageProps } from "next/image";
import { flushSync } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { blurFor } from "@/data/blur";

/* -------------------------------------------------------------------- photo */

/** next/image with its own placeholder attached, so pictures blur up. */
export function Photo({
  src,
  alt,
  ...rest
}: Omit<ImageProps, "src"> & { src: string }) {
  const blur = blurFor(src);
  return (
    <Image
      src={src}
      alt={alt}
      quality={86}
      placeholder={blur ? "blur" : "empty"}
      blurDataURL={blur}
      {...rest}
    />
  );
}

/* -------------------------------------------------------------------- theme */

const THEME_KEY = "dum-theme";

export const themeScript = `(function(){try{var t=localStorage.getItem('dum-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`;

/**
 * Decides before first paint whether the title card runs, the same way the
 * theme is settled before first paint. Waiting for hydration would let the
 * hero show first and then be covered, which looks like a mistake.
 */
export const introScript = `(function(){try{if(location.pathname!=='/')return;var f=location.search.indexOf('intro')>-1;if(!f&&sessionStorage.getItem('dum-intro-seen')==='1')return;sessionStorage.setItem('dum-intro-seen','1');document.documentElement.setAttribute('data-intro','1');}catch(e){}})();`;

/** Sun and moon. The page turns over behind it as a growing circle. */
export function ThemeToggle({ className }: { className?: string }) {
  const [light, setLight] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const sync = () =>
      setLight(document.documentElement.dataset.theme === "light");
    const id = window.setTimeout(sync, 0);
    return () => window.clearTimeout(id);
  }, []);

  const toggle = useCallback(
    (origin: DOMRect) => {
      const next =
        document.documentElement.dataset.theme === "light" ? "dark" : "light";
      const apply = () => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch {
          // private browsing: the choice simply will not be remembered
        }
        setLight(next === "light");
      };

      if (reduce || typeof document.startViewTransition !== "function") {
        apply();
        return;
      }

      const x = origin.left + origin.width / 2;
      const y = origin.top + origin.height / 2;
      const radius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      );
      document
        .startViewTransition(() => flushSync(apply))
        .ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${radius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 640,
              easing: "cubic-bezier(.16,1,.3,1)",
              pseudoElement: "::view-transition-new(root)",
            },
          );
        });
    },
    [reduce],
  );

  return (
    <button
      type="button"
      onClick={(e) => toggle(e.currentTarget.getBoundingClientRect())}
      aria-label={
        light ? "Switch to the dark theme" : "Switch to the light theme"
      }
      className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-current/30 transition-colors hover:border-current/70 ${className ?? ""}`}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={light ? "sun" : "moon"}
          className="absolute grid place-items-center"
          initial={reduce ? false : { opacity: 0, rotate: -60, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, rotate: 60, scale: 0.6 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {light ? (
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
            </svg>
          ) : (
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5a8.5 8.5 0 1 0 10.8 10.8Z" />
            </svg>
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/* ---------------------------------------------------------------- chapters */

export type Chapter = { id: string; label: string; urdu: string };

/**
 * The reading rail. It names the chapter you are in and fills as the page is
 * read, and it is the only navigation the story has.
 */
/** A gilded hairline across the top that fills with the document. */
export function ScrollRail() {
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[80] h-[2px]">
      <div className="scroll-rail h-full origin-left bg-saffron" />
    </div>
  );
}

export function ChapterRail({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target.id, e.intersectionRatio));
        let best = 0;
        let bestRatio = -1;
        chapters.forEach((c, i) => {
          const r = ratios.get(c.id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = i;
          }
        });
        setActive(best);
      },
      { threshold: [0, 0.2, 0.45, 0.7, 1], rootMargin: "-18% 0px -18% 0px" },
    );
    chapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <>
      <ScrollRail />

      <nav
        aria-label="Chapters"
        className="pointer-events-none fixed top-1/2 right-5 z-[70] hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
      >
        {chapters.map((c, i) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="pointer-events-auto group flex items-center gap-3"
            aria-current={i === active ? "true" : undefined}
          >
            <span className="relative h-4 overflow-hidden text-right">
              <AnimatePresence initial={false}>
                {i === active && (
                  <motion.span
                    className="label block whitespace-nowrap text-accent-ink"
                    initial={reduce ? false : { opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? undefined : { opacity: 0, x: 10 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {c.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <motion.span
              className="block rounded-full bg-current"
              animate={{
                width: i === active ? 22 : 7,
                height: i === active ? 3 : 3,
                opacity: i === active ? 1 : i < active ? 0.5 : 0.25,
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ color: "var(--accent)" }}
            />
          </a>
        ))}
      </nav>
    </>
  );
}

/* ------------------------------------------------------------------ counter */

/** Counts up the first time the figure is seen. */
export function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      const id = window.setTimeout(() => setShown(to), 0);
      return () => window.clearTimeout(id);
    }
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const started = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - started) / 1500);
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(Math.round(to * eased));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, reduce]);

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString("en-US")}
    </span>
  );
}
