"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Photo } from "@/components/chrome";
import { Grow, Rise, Rule, Turn, Wipe, WipeUp } from "@/components/motion";
import { LitProse } from "@/components/scenes";
import {
  ArabesqueRibbon,
  FieldMedallion,
  Medallion,
} from "@/components/ornament";
import { Interlude, PageFoot, Statement } from "@/components/page-parts";
import { rupees } from "@/data/menu";
import { loadOrder, nowMs, progressOf, stages, type Order } from "@/lib/order";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Shown when the page is opened cold, so the route is never a dead end. */
const example = (id: string): Order => ({
  id,
  placedAt: nowMs() - 9 * 60000,
  mode: "delivery",
  where: "Khayaban-e-Roomi, Clifton",
  slot: "As soon as it is ready",
  lines: [
    {
      name: "Hyderabadi Kachchi Mutton",
      urdu: "کچی مٹن",
      note: "Large · Hot · Extra raita",
      quantity: 1,
      unit: 1650,
      photo: "/photos/mutton-rice.jpg",
    },
    {
      name: "Murgh Dum",
      urdu: "مرغ دم",
      note: "Regular · Medium",
      quantity: 2,
      unit: 1150,
      photo: "/photos/biryani-pan.jpg",
    },
  ],
  subtotal: 3950,
  fee: 0,
  total: 3950,
  minutes: 70,
});

export function OrderView({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const find = () => setOrder(loadOrder(id) ?? example(id));
    const first = window.setTimeout(find, 0);
    return () => window.clearTimeout(first);
  }, [id]);

  useEffect(() => {
    const tick = () => setNow(nowMs());
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 5000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  if (!order || now === null)
    return <section className="min-h-[80svh] bg-band-a" aria-busy />;

  const { fraction, stage, remaining, done } = progressOf(order, now);
  const live = order.mode === "delivery" ? stages : stages.slice(0, 3);

  return (
    <>
      <section className="on-photo relative flex min-h-[70svh] flex-col justify-end overflow-hidden bg-night px-5 pt-24 pb-14 sm:px-8">
        <div className="absolute inset-0">
          <Photo
            src="/photos/embers.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="drift object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/40" />
        </div>
        <FieldMedallion className="text-turquoise" opacity={0.24} />

        <div className="relative z-10 mx-auto w-full max-w-[1280px]">
          <Wipe className="w-fit">
            <p className="label text-saffron-light">Order {order.id}</p>
          </Wipe>
          <h1 className="display mt-4 text-[clamp(2.6rem,8vw,6rem)] font-light">
            {done ? "At your door" : stages[stage].title}
          </h1>
          <WipeUp className="mt-2">
            <p className="arabic text-[clamp(1.3rem,3.2vw,2rem)] text-turquoise-light">
              {done ? "پہنچ گیا" : stages[stage].urdu}
            </p>
          </WipeUp>

          <div className="mt-9 flex flex-wrap items-end gap-x-12 gap-y-5">
            <div>
              <p className="label text-white/60">
                {done
                  ? "Handed over"
                  : order.mode === "delivery"
                    ? "Arriving in"
                    : "Ready in"}
              </p>
              <p className="display tabular text-[clamp(2.6rem,7vw,4.6rem)] leading-none text-white">
                {done ? "—" : `${remaining} min`}
              </p>
            </div>
            <div className="max-w-[34ch]">
              <p className="label text-white/60">
                {order.mode === "delivery" ? "Delivering to" : "Collect from"}
              </p>
              <p className="mt-1 text-white/85">{order.where}</p>
            </div>
          </div>
        </div>
        <ArabesqueRibbon
          className="absolute inset-x-0 bottom-0 z-10 text-turquoise/40"
          height={54}
        />
      </section>

      <section className="relative bg-band-a px-5 py-20 text-on-a sm:px-8">
        <div className="field-girih field-fade pointer-events-none absolute inset-0 text-orn-a" />

        <div className="relative mx-auto max-w-[1280px]">
          {/* the rail fills in real time */}
          <div className="relative h-px overflow-hidden bg-current/20">
            <motion.div
              className="absolute inset-y-0 left-0 bg-accent-a"
              initial={false}
              animate={{ width: `${Math.round(fraction * 100)}%` }}
              transition={{ duration: reduce ? 0 : 1.1, ease: EASE }}
            />
          </div>

          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {live.map((s, i) => {
              const state = i < stage ? "done" : i === stage ? "now" : "todo";
              return (
                <Rise
                  key={s.key}
                  as="li"
                  from={`entry ${4 + i * 5}%`}
                  to={`cover ${34 + i * 5}%`}
                >
                  <Medallion
                    size={34}
                    className={
                      state === "todo" ? "text-current/30" : "text-orn-a"
                    }
                    rings={false}
                  />
                  <div className="mt-4 flex items-center gap-3">
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full text-xs ${
                        state === "todo"
                          ? "border border-current/25 text-on-a-2"
                          : "bg-accent-a text-band-a"
                      }`}
                    >
                      {state === "done" ? "✓" : i + 1}
                    </span>
                    <p className="display text-xl">{s.title}</p>
                  </div>
                  <p className="arabic text-base text-accent-a">{s.urdu}</p>
                  <p className="mt-2 text-sm text-on-a-2">{s.note}</p>
                  {state === "now" && !done && (
                    <motion.p
                      className="label s-pulse mt-3 text-accent-a"
                      animate={reduce ? undefined : { opacity: [1, 0.4, 1] }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      Happening now
                    </motion.p>
                  )}
                </Rise>
              );
            })}
          </ol>

          <LitProse
            text="Nothing is cooked ahead, so the clock above is the kitchen's and not an estimate. When the seal comes off, it leaves."
            className="display mt-20 max-w-[30ch] text-[clamp(1.4rem,3.4vw,2.6rem)] leading-[1.18] font-light"
            dim="color-mix(in srgb, var(--on-a) 18%, transparent)"
            lit="var(--on-a)"
          />

          <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_380px]">
            <div className="min-w-0">
              <Wipe className="w-fit">
                <p className="label text-accent-a">In this order</p>
              </Wipe>
              <Rule className="mt-4 w-full text-current/20" />
              <ul>
                {order.lines.map((l, i) => (
                  <Rise
                    key={`${l.name}-${i}`}
                    from={`entry ${4 + i * 3}%`}
                    to={`cover ${34 + i * 3}%`}
                  >
                    <li className="flex items-center gap-5 border-b border-current/12 py-6">
                      <span className="ogee relative block h-20 w-16 shrink-0 overflow-hidden">
                        <Photo
                          src={l.photo}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="display block truncate text-xl">
                          {l.quantity} × {l.name}
                        </span>
                        <span className="arabic block text-base text-accent-a">
                          {l.urdu}
                        </span>
                        <span className="mt-1 block truncate text-xs text-on-a-2">
                          {l.note}
                        </span>
                      </span>
                      <span className="tabular shrink-0 text-sm">
                        {rupees(l.unit * l.quantity)}
                      </span>
                    </li>
                  </Rise>
                ))}
              </ul>
            </div>

            <aside className="min-w-0">
              <Grow>
                <div className="card-depth rounded-[28px] border border-current/15 bg-band-b p-7 text-on-b">
                  <Turn>
                    <Medallion size={44} className="text-orn-b" rings={false} />
                  </Turn>
                  <p className="label mt-4 text-accent-b">Summary</p>
                  <Rule className="mt-4 w-full text-current/20" />
                  <dl className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-on-b-2">Subtotal</dt>
                      <dd className="tabular">{rupees(order.subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-on-b-2">
                        {order.mode === "delivery" ? "Delivery" : "Collection"}
                      </dt>
                      <dd className="tabular">
                        {order.fee === 0 ? "Free" : rupees(order.fee)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-on-b-2">Requested</dt>
                      <dd>{order.slot}</dd>
                    </div>
                  </dl>
                  <div className="mt-6 flex items-baseline justify-between border-t border-current/15 pt-5">
                    <span className="display text-2xl">Paid</span>
                    <span className="tabular display text-4xl">
                      {rupees(order.total)}
                    </span>
                  </div>
                  <Link
                    href="/menu"
                    className="label mt-6 inline-block border-b border-accent-b pb-1 text-accent-b"
                  >
                    Order something else
                  </Link>
                </div>
              </Grow>
            </aside>
          </div>
        </div>
      </section>

      <Interlude tone="a" />

      <Statement
        tone="b"
        label="While you wait"
        text="The handi does not open between here and your door. Whatever the kitchen sealed is what you will lift the lid on."
        urdu="ہانڈی بند رہے گی"
      />

      <PageFoot />
    </>
  );
}
