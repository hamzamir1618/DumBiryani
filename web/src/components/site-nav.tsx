"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  deliveryFee,
  FREE_DELIVERY_OVER,
  useBasket,
} from "@/components/basket";
import { Photo, ScrollRail, ThemeToggle } from "@/components/chrome";
import { Medallion } from "@/components/ornament";
import {
  addOns as allAddOns,
  portions,
  rupees,
  spiceLevels,
} from "@/data/menu";

const EASE = [0.16, 1, 0.3, 1] as const;

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
];

/** "Large · Hot · Extra raita", the way the line was ordered. */
export function lineNote(
  portion: number,
  spice: number,
  picked: string[],
  isBiryani: boolean,
) {
  const bits: string[] = [];
  if (isBiryani) bits.push(portions[portion].name);
  bits.push(spiceLevels[spice]);
  picked.forEach((id) => {
    const found = allAddOns.find((a) => a.id === id);
    if (found) bits.push(found.name);
  });
  return bits.join(" · ");
}

/**
 * The bar the inner pages carry. The landing page has its own masthead that
 * gets out of the way, so this stays off it.
 */
export function SiteNav() {
  const pathname = usePathname();
  const { count, total, setOpen } = useBasket();
  if (pathname === "/") return null;

  return (
    <>
      <ScrollRail />
      <header className="sticky top-0 z-[70] border-b border-current/12 bg-band-a/85 text-on-a backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-8">
          <Link
            href="/"
            className="flex items-baseline gap-2.5"
            aria-label="Dum Biryani, home"
          >
            <span className="kufi text-[24px] leading-none text-accent-a">
              دم
            </span>
            <span className="display hidden text-xl tracking-wide sm:inline">
              Biryani
            </span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`label relative transition-colors hover:text-accent-a ${
                  pathname.startsWith(l.href) ? "text-accent-a" : "text-on-a-2"
                }`}
              >
                {l.label}
                {pathname.startsWith(l.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 h-px w-full bg-accent-a"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Basket, ${count} items`}
              className="flex items-center gap-3 rounded-full border border-current/25 px-3.5 py-2 sm:px-4 transition-colors hover:border-accent-a"
            >
              <span className="label hidden sm:inline">Basket</span>
              <span className="tabular text-sm">{count}</span>
              <span className="hidden h-3 w-px bg-current/25 sm:block" />
              <span className="tabular hidden text-sm sm:inline">
                {rupees(total)}
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

/** A quantity stepper, used in the drawer and on the basket page. */
export function Stepper({
  value,
  onChange,
  size = "sm",
}: {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "lg";
}) {
  const box = size === "lg" ? "h-12 w-12 text-xl" : "h-8 w-8 text-base";
  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Fewer"
        onClick={() => onChange(value - 1)}
        className={`grid place-items-center rounded-full border border-current/30 leading-none transition-colors hover:border-accent-a hover:text-accent-a ${box}`}
      >
        −
      </button>
      <span
        className={`tabular text-center ${size === "lg" ? "w-10 text-xl" : "w-6 text-sm"}`}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="More"
        onClick={() => onChange(value + 1)}
        className={`grid place-items-center rounded-full border border-current/30 leading-none transition-colors hover:border-accent-a hover:text-accent-a ${box}`}
      >
        +
      </button>
    </span>
  );
}

/** The basket, slid in from the side under its own arch. */
export function BasketDrawer() {
  const { lines, count, total, open, setOpen, setQuantity, remove } =
    useBasket();
  const reduce = useReducedMotion();
  const fee = deliveryFee(total);
  const toFree = Math.max(0, FREE_DELIVERY_OVER - total);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95]">
          <motion.button
            type="button"
            aria-label="Close the basket"
            className="absolute inset-0 bg-night/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
          />

          <motion.aside
            role="dialog"
            aria-label="Basket"
            className="absolute inset-y-0 right-0 flex w-full max-w-[470px] flex-col bg-band-a text-on-a shadow-2xl"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <header className="flex items-center justify-between border-b border-current/12 px-6 py-5">
              <div className="flex items-center gap-3">
                <Medallion size={30} className="text-orn-a" rings={false} />
                <h2 className="display text-2xl">Your basket</h2>
                <span className="arabic text-base text-accent-a">ٹوکری</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="label text-on-a-2 transition-colors hover:text-on-a"
              >
                Close
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-start justify-center gap-4 py-16">
                  <Medallion size={64} className="text-orn-a" />
                  <p className="display text-3xl">Nothing in here yet</p>
                  <p className="text-on-a-2">The handis are sealed to order.</p>
                  <Link
                    href="/menu"
                    onClick={() => setOpen(false)}
                    className="label mt-2 border-b border-accent-a pb-1 text-accent-a"
                  >
                    Open the menu
                  </Link>
                </div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map((line, i) => (
                      <motion.li
                        key={line.key}
                        layout={!reduce}
                        initial={reduce ? false : { opacity: 0, x: 28 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={
                          reduce
                            ? { opacity: 0 }
                            : { opacity: 0, x: 36, height: 0 }
                        }
                        transition={{
                          duration: 0.4,
                          ease: EASE,
                          delay: reduce ? 0 : i * 0.04,
                        }}
                        className="flex gap-4 border-b border-current/12 py-5"
                      >
                        <span className="ogee relative block h-24 w-20 shrink-0 overflow-hidden">
                          <Photo
                            src={line.dish.photo}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="display truncate text-lg">
                              {line.dish.name}
                            </p>
                            <p className="tabular shrink-0 text-sm">
                              {rupees(line.unit * line.quantity)}
                            </p>
                          </div>
                          <p className="arabic text-sm text-accent-a">
                            {line.dish.urdu}
                          </p>
                          <p className="mt-1 text-xs text-on-a-2">
                            {lineNote(
                              line.portion,
                              line.spice,
                              line.addOns,
                              line.dish.category === "Biryani",
                            )}
                          </p>
                          <div className="mt-3 flex items-center gap-3">
                            <Stepper
                              value={line.quantity}
                              onChange={(q) => setQuantity(line.key, q)}
                            />
                            <button
                              type="button"
                              onClick={() => remove(line.key)}
                              className="label text-on-a-2 transition-colors hover:text-accent-a"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-current/12 px-6 py-5">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-on-a-2">Subtotal</span>
                  <span className="tabular">{rupees(total)}</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between text-sm">
                  <span className="text-on-a-2">Delivery</span>
                  <span className="tabular">
                    {fee === 0 ? "Free" : rupees(fee)}
                  </span>
                </div>

                {toFree > 0 && (
                  <div className="mt-4">
                    <p className="label text-on-a-2">
                      {rupees(toFree)} more for free delivery
                    </p>
                    <div className="mt-2 h-px overflow-hidden bg-current/20">
                      <motion.div
                        className="h-full origin-left bg-accent-a"
                        initial={false}
                        animate={{
                          scaleX: Math.min(1, total / FREE_DELIVERY_OVER),
                        }}
                        transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
                        style={{ transformOrigin: "left" }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-5 flex items-baseline justify-between">
                  <span className="display text-2xl">Total</span>
                  <span className="tabular display text-3xl">
                    {rupees(total + fee)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="display mt-5 flex items-center justify-between rounded-full bg-accent-a px-7 py-4 text-xl text-band-a transition-transform duration-500 hover:scale-[1.02]"
                >
                  <span>Checkout</span>
                  <span className="tabular text-base">
                    {count} {count === 1 ? "item" : "items"}
                  </span>
                </Link>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
