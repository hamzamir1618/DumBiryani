"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/chrome";

/**
 * The landing page's own masthead. It belongs to the hero and fades out once
 * the page has moved past it: the landing page is a scroll story and a bar
 * riding over it gets in the way. The way on to the rest of the site is the
 * links inside the page — the hero's two buttons, every handi in the pot run,
 * the rooms, and the pair at the close.
 */
export function HomeMasthead() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <header className="chrome-fade fixed inset-x-0 top-0 z-[75] flex items-center justify-between px-5 py-5 sm:px-8">
      <a
        href="#open"
        className="on-photo flex items-baseline gap-2.5"
        aria-label="Dum Biryani"
      >
        <span className="kufi text-[26px] leading-none text-saffron">دم</span>
        <span className="display text-xl tracking-wide text-white">
          Biryani
        </span>
      </a>
      <ThemeToggle className="on-photo" />
    </header>
  );
}
