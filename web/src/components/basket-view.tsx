"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  deliveryFee,
  FREE_DELIVERY_OVER,
  useBasket,
} from "@/components/basket";
import { Photo } from "@/components/chrome";
import { Grow, Rise, Rule, Turn, Wipe, WipeUp } from "@/components/motion";
import { Boteh, FieldMedallion, Medallion } from "@/components/ornament";
import {
  Interlude,
  PageFoot,
  PageHead,
  Statement,
} from "@/components/page-parts";
import { lineNote, Stepper } from "@/components/site-nav";
import { rupees } from "@/data/menu";

const EASE = [0.16, 1, 0.3, 1] as const;

export function BasketView() {
  const { lines, count, total, setQuantity, remove, clear } = useBasket();
  const reduce = useReducedMotion();
  const fee = deliveryFee(total);
  const toFree = Math.max(0, FREE_DELIVERY_OVER - total);

  return (
    <>
      <PageHead
        label={
          count === 0 ? "Empty" : `${count} ${count === 1 ? "item" : "items"}`
        }
        title="Your basket"
        urdu="آپ کی ٹوکری"
        lead={
          lines.length
            ? "Handis are sealed after checkout, so this is the last point anything can change."
            : undefined
        }
      />

      <section className="relative min-h-[46svh] overflow-hidden bg-band-b px-5 py-20 text-on-b sm:px-8">
        <div className="field-girih field-fade pointer-events-none absolute inset-0 text-orn-b" />
        <FieldMedallion className="text-orn-b" opacity={0.14} />
        <Boteh
          size={120}
          className="s-counter absolute top-[10%] right-[3%] hidden text-orn-b/25 lg:block"
          tilt={-24}
        />

        <div className="relative mx-auto max-w-[1280px]">
          {lines.length === 0 ? (
            <Rise className="flex flex-col items-start gap-5">
              <Medallion size={78} className="text-orn-b" />
              <p className="display text-4xl font-light">Nothing in here yet</p>
              <p className="max-w-[44ch] text-on-b-2">
                Handis are sealed to order, so nothing sits waiting. Pick one
                and the kitchen starts on it.
              </p>
              <Link
                href="/menu"
                className="display mt-3 rounded-full bg-accent-b px-9 py-3.5 text-lg text-band-b transition-transform duration-500 hover:scale-[1.04]"
              >
                Open the menu
              </Link>
            </Rise>
          ) : (
            <div className="grid gap-14 lg:grid-cols-[1fr_380px]">
              <div className="min-w-0">
                <ul className="border-t border-current/15">
                  <AnimatePresence initial={false}>
                    {lines.map((line, i) => (
                      <motion.li
                        key={line.key}
                        layout={!reduce}
                        initial={reduce ? false : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          reduce
                            ? { opacity: 0 }
                            : { opacity: 0, x: 36, height: 0 }
                        }
                        transition={{
                          duration: 0.45,
                          ease: EASE,
                          delay: reduce ? 0 : i * 0.05,
                        }}
                        className="flex gap-6 border-b border-current/15 py-7"
                      >
                        <Link
                          href={`/dish/${line.dish.id}`}
                          className="group ogee relative block h-36 w-28 shrink-0 overflow-hidden"
                        >
                          <Photo
                            src={line.dish.photo}
                            alt={line.dish.name}
                            fill
                            sizes="112px"
                            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110"
                          />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-baseline justify-between gap-4">
                              <p className="display text-2xl">
                                {line.dish.name}
                              </p>
                              <p className="tabular shrink-0 text-lg">
                                {rupees(line.unit * line.quantity)}
                              </p>
                            </div>
                            <p className="arabic text-lg text-accent-b">
                              {line.dish.urdu}
                            </p>
                            <p className="mt-1 text-sm text-on-b-2">
                              {lineNote(
                                line.portion,
                                line.spice,
                                line.addOns,
                                line.dish.category === "Biryani",
                              )}
                            </p>
                          </div>
                          <div className="mt-5 flex items-center justify-between gap-4">
                            <Stepper
                              value={line.quantity}
                              onChange={(q) => setQuantity(line.key, q)}
                            />
                            <button
                              type="button"
                              onClick={() => remove(line.key)}
                              className="label text-on-b-2 transition-colors hover:text-accent-b"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href="/menu"
                    className="label border-b border-current/40 pb-1 text-on-b-2"
                  >
                    Keep looking
                  </Link>
                  <button
                    type="button"
                    onClick={clear}
                    className="label text-on-b-2 transition-colors hover:text-accent-b"
                  >
                    Empty the basket
                  </button>
                </div>
              </div>

              <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
                <Grow>
                  <div className="card-depth rounded-[28px] border border-current/15 bg-band-a p-7 text-on-a">
                    <Turn>
                      <Medallion
                        size={44}
                        className="text-orn-a"
                        rings={false}
                      />
                    </Turn>
                    <Wipe className="mt-4 w-fit">
                      <p className="label text-accent-a">Summary</p>
                    </Wipe>
                    <WipeUp className="mt-1">
                      <p className="arabic text-lg text-orn-a">خلاصہ</p>
                    </WipeUp>
                    <Rule className="mt-4 w-full text-current/20" />

                    <dl className="mt-5 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-on-a-2">Subtotal</dt>
                        <dd className="tabular">{rupees(total)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-on-a-2">Delivery</dt>
                        <dd className="tabular">
                          {fee === 0 ? "Free" : rupees(fee)}
                        </dd>
                      </div>
                    </dl>

                    {toFree > 0 && (
                      <div className="mt-6">
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
                            transition={{
                              duration: reduce ? 0 : 0.6,
                              ease: EASE,
                            }}
                            style={{ transformOrigin: "left" }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-7 flex items-baseline justify-between border-t border-current/15 pt-6">
                      <span className="display text-2xl">Total</span>
                      <span className="tabular display text-4xl">
                        {rupees(total + fee)}
                      </span>
                    </div>

                    <Link
                      href="/checkout"
                      className="display mt-6 flex items-center justify-between rounded-full bg-accent-a px-7 py-4 text-xl text-band-a transition-transform duration-500 hover:scale-[1.03]"
                    >
                      <span>Checkout</span>
                      <span aria-hidden>→</span>
                    </Link>
                    <p className="label mt-4 text-on-a-2">
                      Handis are sealed after checkout and cannot be changed.
                    </p>
                  </div>
                </Grow>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Interlude tone="b" />

      <Statement
        tone="a"
        label="Before you go on"
        text="Once this is sent the handi is sealed, and a sealed handi cannot be changed or added to. Everything you want from the kitchen has to be in the list above."
        urdu="بند ہانڈی کھل نہیں سکتی"
      />

      <PageFoot />
    </>
  );
}
