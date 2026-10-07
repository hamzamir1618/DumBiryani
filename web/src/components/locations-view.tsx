"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { CountUp } from "@/components/chrome";
import {
  ArchReveal,
  Depth,
  Grow,
  Rise,
  Rule,
  Turn,
  Wipe,
  WipeUp,
} from "@/components/motion";
import { LitProse } from "@/components/scenes";
import { ArchPanel, Boteh, Medallion } from "@/components/ornament";
import {
  ArchPhoto,
  Interlude,
  PageFoot,
  PageHead,
  Statement,
} from "@/components/page-parts";
import { branches, slots } from "@/data/branches";

const EASE = [0.16, 1, 0.3, 1] as const;
const sizes = [2, 4, 6, 8, 10, 12];

export function LocationsView() {
  const reduce = useReducedMotion();
  const [branch, setBranch] = useState(branches[0].id);
  const [size, setSize] = useState(4);
  const [slot, setSlot] = useState(slots[1]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [booked, setBooked] = useState(false);

  const chosen = branches.find((b) => b.id === branch) ?? branches[0];
  const valid = name.trim().length > 1 && phone.replace(/\D/g, "").length >= 10;

  return (
    <>
      <PageHead
        label="Karachi · Lahore · Islamabad"
        title="Four rooms"
        urdu="ہمارے ٹھکانے"
        photo="/photos/dining-room.jpg"
        lead="Every kitchen seals its own handis. Nothing travels between branches, which is why the menu is short and the waiting is real."
      />

      {branches.map((b, i) => (
        <section
          key={b.id}
          className={`relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 ${
            i % 2 === 0 ? "bg-band-a text-on-a" : "bg-band-b text-on-b"
          }`}
        >
          <div
            className={`field-arabesque field-fade pointer-events-none absolute inset-0 ${
              i % 2 === 0 ? "text-orn-a" : "text-orn-b"
            }`}
          />
          <Boteh
            size={110}
            className={`s-counter absolute top-[12%] hidden lg:block ${
              i % 2 === 0
                ? "right-[4%] text-orn-a/30"
                : "left-[4%] text-orn-b/30"
            }`}
            tilt={i % 2 === 0 ? 26 : -150}
          />

          <div
            className={`relative mx-auto flex max-w-[1280px] flex-col gap-12 lg:items-center lg:gap-20 ${
              i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            }`}
          >
            <Depth plane="near" className="lg:w-[46%]">
              <ArchReveal>
                <ArchPanel
                  className={i % 2 === 0 ? "text-orn-a" : "text-orn-b"}
                  thickness={4}
                >
                  <ArchPhoto
                    src={b.photo}
                    alt={`${b.name}, ${b.city}`}
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    aspect="aspect-[4/5]"
                  />
                </ArchPanel>
              </ArchReveal>
            </Depth>

            <Depth plane="far" className="lg:w-[54%]">
              <Wipe className="w-fit">
                <p
                  className={`label ${i % 2 === 0 ? "text-accent-a" : "text-accent-b"}`}
                >
                  {b.city} · since {b.opened}
                </p>
              </Wipe>
              <h2 className="display mt-3 text-[clamp(2.2rem,5.6vw,4.2rem)] font-light">
                {b.name}
              </h2>
              <WipeUp className="mt-1">
                <p
                  className={`arabic text-[clamp(1.3rem,3vw,2rem)] ${
                    i % 2 === 0 ? "text-orn-a" : "text-orn-b"
                  }`}
                >
                  {b.urdu}
                </p>
              </WipeUp>
              <Rule
                className={`mt-7 w-40 ${i % 2 === 0 ? "text-accent-a" : "text-accent-b"}`}
              />

              <LitProse
                text={b.note}
                className="mt-7 max-w-[46ch] text-[clamp(1.05rem,1.8vw,1.3rem)] leading-relaxed"
                dim={`color-mix(in srgb, var(--on-${i % 2 === 0 ? "a" : "b"}) 20%, transparent)`}
                lit={`var(--on-${i % 2 === 0 ? "a" : "b"}-2)`}
                start={8}
                step={0.8}
                span={22}
              />

              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                <Rise>
                  <p
                    className={`label ${i % 2 === 0 ? "text-on-a-2" : "text-on-b-2"}`}
                  >
                    Address
                  </p>
                  <p className="mt-1 text-sm">{b.address}</p>
                </Rise>
                <Rise from="entry 6%">
                  <p
                    className={`label ${i % 2 === 0 ? "text-on-a-2" : "text-on-b-2"}`}
                  >
                    Hours
                  </p>
                  <p className="mt-1 text-sm">{b.hours}</p>
                </Rise>
                <Rise from="entry 8%">
                  <p
                    className={`label ${i % 2 === 0 ? "text-on-a-2" : "text-on-b-2"}`}
                  >
                    Seats
                  </p>
                  <p
                    className={`display tabular mt-1 text-4xl ${
                      i % 2 === 0 ? "text-accent-a" : "text-accent-b"
                    }`}
                  >
                    <CountUp to={b.seats} />
                  </p>
                </Rise>
              </div>

              <div className="mt-9 flex flex-wrap gap-6">
                <a
                  href={`tel:${b.phone.replace(/\s/g, "")}`}
                  className={`label border-b pb-1 transition-colors ${
                    i % 2 === 0
                      ? "border-accent-a text-accent-a"
                      : "border-accent-b text-accent-b"
                  }`}
                >
                  {b.phone}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setBranch(b.id);
                    setBooked(false);
                    document
                      .getElementById("book")
                      ?.scrollIntoView({
                        behavior: reduce ? "auto" : "smooth",
                        block: "start",
                      });
                  }}
                  className="label border-b border-current/40 pb-1 transition-colors hover:border-current"
                >
                  Book this room
                </button>
              </div>
            </Depth>
          </div>
        </section>
      ))}

      <Interlude tone="a" />

      <Statement
        tone="b"
        label="One kitchen each"
        text="No handi travels between branches. Each room seals its own, which is why a table in Clifton and a table in Lahore are not the same table."
        urdu="ہر ٹھکانے کی اپنی ہانڈی"
      />

      <section
        id="book"
        className="relative overflow-hidden bg-band-a px-5 py-24 text-on-a sm:px-8 sm:py-32"
      >
        <div className="field-girih field-fade pointer-events-none absolute inset-0 text-orn-a" />

        <div className="relative mx-auto max-w-[1280px]">
          <div className="text-center">
            <Turn>
              <Medallion size={58} className="mx-auto text-orn-a" />
            </Turn>
            <Wipe className="mx-auto mt-5 w-fit">
              <p className="label text-accent-a">Book a table</p>
            </Wipe>
            <h2 className="display mt-3 text-[clamp(2.2rem,5.4vw,4.2rem)] font-light">
              Keep one for us
            </h2>
            <WipeUp className="mt-2">
              <p className="arabic text-[clamp(1.2rem,2.8vw,1.8rem)] text-orn-a">
                ایک میز ہماری
              </p>
            </WipeUp>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_380px]">
            <div className="min-w-0">
              <Rise>
                <p className="label text-accent-a">Room</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {branches.map((b) => {
                    const on = branch === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBranch(b.id)}
                        aria-pressed={on}
                        className="relative overflow-hidden rounded-full px-5 py-2.5 text-sm transition-colors"
                      >
                        {on && (
                          <motion.span
                            layoutId="branch-pill"
                            className="absolute inset-0 rounded-full bg-accent-a"
                            transition={{
                              duration: reduce ? 0 : 0.45,
                              ease: EASE,
                            }}
                          />
                        )}
                        <span
                          className={`relative ${on ? "text-band-a" : "text-on-a-2"}`}
                        >
                          {b.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Rise>

              <Rise className="mt-10">
                <p className="label text-accent-a">How many</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {sizes.map((s) => {
                    const on = size === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        aria-pressed={on}
                        className={`tabular grid h-12 w-12 place-items-center rounded-full border transition-colors ${
                          on
                            ? "border-accent-a text-accent-a"
                            : "border-current/20 hover:border-current/50"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </Rise>

              <Rise className="mt-10">
                <p className="label text-accent-a">Time</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {slots.slice(1).map((s) => {
                    const on = slot === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSlot(s)}
                        aria-pressed={on}
                        className="relative overflow-hidden rounded-full px-5 py-2.5 text-sm transition-colors"
                      >
                        {on && (
                          <motion.span
                            layoutId="booking-slot"
                            className="absolute inset-0 rounded-full bg-accent-a"
                            transition={{
                              duration: reduce ? 0 : 0.4,
                              ease: EASE,
                            }}
                          />
                        )}
                        <span
                          className={`relative ${on ? "text-band-a" : "text-on-a-2"}`}
                        >
                          {s}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Rise>

              <Rise className="mt-10 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label block text-on-a-2">Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-current/20 bg-transparent px-4 py-3 outline-none transition-colors focus:border-accent-a"
                  />
                </label>
                <label className="block">
                  <span className="label block text-on-a-2">Phone</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputMode="tel"
                    placeholder="03xx xxxxxxx"
                    className="mt-2 w-full rounded-xl border border-current/20 bg-transparent px-4 py-3 outline-none transition-colors placeholder:text-on-a-2 focus:border-accent-a"
                  />
                </label>
              </Rise>
            </div>

            <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              <Grow>
                <div className="card-depth rounded-[28px] border border-current/15 bg-band-b p-7 text-on-b">
                  <p className="label text-accent-b">Your table</p>
                  <p className="display mt-4 text-3xl">{chosen.name}</p>
                  <p className="arabic text-lg text-accent-b">{chosen.urdu}</p>
                  <p className="mt-2 text-sm text-on-b-2">{chosen.address}</p>
                  <Rule className="mt-5 w-full text-current/20" />

                  <dl className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-on-b-2">People</dt>
                      <dd className="tabular">{size}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-on-b-2">Time</dt>
                      <dd>{slot}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-on-b-2">Held for</dt>
                      <dd>15 minutes</dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    disabled={!valid}
                    onClick={() => setBooked(true)}
                    className="display mt-6 w-full rounded-full bg-accent-b px-7 py-4 text-xl text-band-b transition-transform duration-500 hover:scale-[1.03] disabled:opacity-50"
                  >
                    {booked ? "Table held" : "Hold the table"}
                  </button>

                  <AnimatePresence>
                    {booked && (
                      <motion.p
                        initial={
                          reduce ? { opacity: 0 } : { opacity: 0, y: -8 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="label mt-4 text-accent-b"
                      >
                        {chosen.name}, {size} people, {slot}. Nothing was
                        actually sent.
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {!valid && (
                    <p className="label mt-4 text-on-b-2">
                      A name and a number, and it is held.
                    </p>
                  )}
                </div>
              </Grow>
            </aside>
          </div>
        </div>
      </section>

      <Interlude tone="a" />
      <PageFoot />
    </>
  );
}
