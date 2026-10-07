"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useBasket } from "@/components/basket";
import {
  ArchReveal,
  Grow,
  Rule,
  Turn,
  Wipe,
  WipeUp,
} from "@/components/motion";
import { LitProse, StackedCards } from "@/components/scenes";
import {
  ArchPanel,
  Boteh,
  FieldMedallion,
  Medallion,
} from "@/components/ornament";
import {
  ArchPhoto,
  Interlude,
  PageFoot,
  Statement,
} from "@/components/page-parts";
import { Stepper } from "@/components/site-nav";
import {
  addOns as allAddOns,
  dishes,
  portionPrice,
  portions,
  rupees,
  spiceLevels,
  type Dish,
} from "@/data/menu";

const EASE = [0.16, 1, 0.3, 1] as const;

/** What each level actually tastes like, in one line. */
const spiceNote = [
  "Warm, not hot. Built for sharing with children at the table.",
  "The house setting. Chilli you can taste but still eat around.",
  "Properly hot. Green chilli left whole in the layers.",
  "The kitchen's own. Ask for raita and mean it.",
];

export function DishView({ dish }: { dish: Dish }) {
  const isBiryani = dish.category === "Biryani";
  const [portion, setPortion] = useState(0);
  const [spice, setSpice] = useState(1);
  const [picked, setPicked] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { add, setOpen } = useBasket();
  const reduce = useReducedMotion();

  const unit = useMemo(() => {
    const base = isBiryani ? portionPrice(dish, portion) : dish.price;
    const extras = picked.reduce(
      (sum, id) => sum + (allAddOns.find((a) => a.id === id)?.price ?? 0),
      0,
    );
    return base + extras;
  }, [dish, isBiryani, picked, portion]);

  const alsoTry = dishes
    .filter((d) => d.id !== dish.id && d.category === dish.category)
    .slice(0, 3);

  const facts = [
    {
      n: "01",
      title: "What is in it",
      urdu: "اجزاء",
      stat: dish.blurb,
      photo: "/photos/spice-spoons.jpg",
      copy: dish.description,
    },
    {
      n: "02",
      title: "How long it takes",
      urdu: "وقت",
      stat: dish.dum ? `${dish.dum} minutes on dum` : "Made to order",
      photo: "/photos/embers.jpg",
      copy: dish.dum
        ? "The handi is sealed when you order and nothing comes off the lid until the time is up. That is the wait, and there is no way to shorten it."
        : "Nothing here sits waiting under a lamp. It is made when you ask for it and it comes out when it is ready.",
    },
    {
      n: "03",
      title: "How it arrives",
      urdu: "پیشکش",
      stat: "Opened at the table",
      photo: dish.photo,
      copy: "The seal is broken in front of you, so the first steam off the rice is yours. Everything in the handi arrives at once.",
    },
  ];

  const toggle = (id: string) =>
    setPicked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const addToBasket = () => {
    add({ dish, portion, spice, addOns: picked, quantity, unit });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2400);
  };

  return (
    <>
      <section className="on-photo relative flex min-h-[78svh] flex-col justify-end overflow-hidden bg-night px-5 pt-24 pb-14 sm:px-8">
        <div className="absolute inset-0">
          <ArchPhoto
            src={dish.photo}
            alt={dish.name}
            sizes="100vw"
            aspect="h-full w-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/30" />
        </div>
        <FieldMedallion className="text-turquoise" opacity={0.2} />

        <div className="relative z-10 mx-auto w-full max-w-[1280px]">
          <Wipe className="w-fit">
            <p className="label text-saffron-light">
              {dish.category}
              {dish.dum ? ` · ${dish.dum} minutes on dum` : ""}
            </p>
          </Wipe>
          <h1 className="display mt-4 max-w-[16ch] text-[clamp(2.6rem,8vw,6rem)] leading-[0.98] font-light">
            {dish.name}
          </h1>
          <WipeUp className="mt-2">
            <p className="arabic text-[clamp(1.3rem,3.4vw,2.2rem)] text-turquoise-light">
              {dish.urdu}
            </p>
          </WipeUp>
        </div>
      </section>

      <section className="relative bg-band-a px-5 pb-40 text-on-a sm:px-8">
        <div className="field-girih field-fade pointer-events-none absolute inset-0 text-orn-a" />
        <Boteh
          size={100}
          className="s-counter absolute top-[6%] right-[4%] hidden text-orn-a/30 lg:block"
          tilt={-26}
        />

        <div className="relative mx-auto grid max-w-[1280px] gap-16 pt-16 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <LitProse
              text={dish.description}
              className="display max-w-[54ch] text-[clamp(1.3rem,2.6vw,2rem)] leading-relaxed font-light"
              dim="color-mix(in srgb, var(--on-a) 18%, transparent)"
              lit="var(--on-a)"
              start={6}
              step={1.1}
              span={24}
            />
            <Rule className="mt-10 w-48 text-accent-a" />

            {isBiryani && (
              <div className="mt-14">
                <Wipe className="w-fit">
                  <p className="label text-accent-a">
                    Portion · {portions[portion].serves}
                  </p>
                </Wipe>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {portions.map((p, i) => {
                    const on = portion === i;
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setPortion(i)}
                        aria-pressed={on}
                        className={`relative overflow-hidden rounded-2xl border px-5 py-5 text-left transition-colors ${
                          on
                            ? "border-accent-a"
                            : "border-current/18 hover:border-current/45"
                        }`}
                      >
                        {on && (
                          <motion.span
                            layoutId="portion-fill"
                            className="absolute inset-0 bg-accent-a/12"
                            transition={{
                              duration: reduce ? 0 : 0.45,
                              ease: EASE,
                            }}
                          />
                        )}
                        <span className="display relative block text-2xl">
                          {p.name}
                        </span>
                        <span className="tabular relative mt-1 block text-sm text-on-a-2">
                          {rupees(portionPrice(dish, i))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {(isBiryani || dish.category === "Sides") && (
              <div className="mt-14">
                <div className="flex items-baseline justify-between">
                  <Wipe className="w-fit">
                    <p className="label text-accent-a">Spice</p>
                  </Wipe>
                  <div className="relative h-9 overflow-hidden text-right">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.p
                        key={spice}
                        className="display text-2xl text-accent-a"
                        initial={reduce ? false : { y: 28, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={reduce ? undefined : { y: -28, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        {spiceLevels[spice]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-4 gap-2">
                  {spiceLevels.map((level, i) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSpice(i)}
                      aria-pressed={spice === i}
                      aria-label={`Spice: ${level}`}
                      className="group relative h-14 overflow-hidden rounded-xl border border-current/18"
                    >
                      <motion.span
                        className="absolute inset-0 origin-bottom bg-accent-a"
                        initial={false}
                        animate={{
                          scaleY: i <= spice ? 1 : 0,
                          opacity: i <= spice ? 1 : 0,
                        }}
                        transition={{
                          duration: reduce ? 0 : 0.45,
                          ease: EASE,
                          delay: i * 0.04,
                        }}
                      />
                      <span
                        className={`relative text-xs transition-colors ${
                          i <= spice ? "text-band-a" : "text-on-a-2"
                        }`}
                      >
                        {`0${i + 1}`}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="relative mt-4 h-10 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={spice}
                      className="absolute inset-0 text-sm text-on-a-2"
                      initial={reduce ? false : { y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={reduce ? undefined : { y: -16, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      {spiceNote[spice]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            )}

            {isBiryani && (
              <div className="mt-14">
                <Wipe className="w-fit">
                  <p className="label text-accent-a">Add-ons</p>
                </Wipe>
                <div className="mt-4">
                  {allAddOns.map((a) => {
                    const on = picked.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggle(a.id)}
                        aria-pressed={on}
                        className="flex w-full items-center justify-between gap-4 border-b border-current/12 py-4 text-left transition-colors hover:text-accent-a"
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`grid h-5 w-5 place-items-center rounded-full border transition-colors ${
                              on
                                ? "border-accent-a bg-accent-a"
                                : "border-current/40"
                            }`}
                          >
                            <motion.span
                              className="block h-2 w-2 rounded-full bg-band-a"
                              initial={false}
                              animate={{ scale: on ? 1 : 0 }}
                              transition={{ duration: reduce ? 0 : 0.25 }}
                            />
                          </span>
                          <span>{a.name}</span>
                        </span>
                        <span className="tabular text-sm text-on-a-2">
                          + {rupees(a.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* the order panel rides alongside */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card-depth rounded-[28px] border border-current/15 bg-band-b p-7 text-on-b">
              <Turn>
                <Medallion size={46} className="text-orn-b" rings={false} />
              </Turn>
              <p className="display mt-4 text-3xl">{dish.name}</p>
              <p className="arabic text-lg text-accent-b">{dish.urdu}</p>
              <Rule className="mt-5 w-full text-current/20" />

              <div className="mt-6 flex items-center justify-between">
                <p className="label text-on-b-2">Quantity</p>
                <Stepper
                  value={quantity}
                  size="lg"
                  onChange={(q) => setQuantity(Math.max(1, Math.min(20, q)))}
                />
              </div>

              <div className="mt-7 flex items-baseline justify-between">
                <span className="display text-2xl">Total</span>
                <span className="tabular display text-4xl">
                  {rupees(unit * quantity)}
                </span>
              </div>

              <button
                type="button"
                onClick={addToBasket}
                className="display mt-6 w-full rounded-full bg-accent-b px-7 py-4 text-xl text-band-b transition-transform duration-500 hover:scale-[1.03]"
              >
                <span className="relative block h-7 overflow-hidden">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.span
                      key={added ? "done" : "add"}
                      className="block"
                      initial={{ y: reduce ? 0 : 28, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: reduce ? 0 : -28, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      {added ? "In the basket" : "Add to basket"}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </button>

              <AnimatePresence>
                {added && (
                  <motion.button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="label mt-4 w-full text-accent-b underline underline-offset-4"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Open the basket
                  </motion.button>
                )}
              </AnimatePresence>

              <p className="label mt-5 text-on-b-2">
                Sealed when you order · {dish.dum ?? 20} minutes
              </p>
            </div>
          </aside>
        </div>

        {/* three cards that hold and pile up as you read down */}
        <div className="relative mx-auto mt-28 max-w-[1280px]">
          <Rule className="w-full text-current/20" />
          <Turn>
            <Medallion size={46} className="mt-12 text-orn-a" />
          </Turn>
          <Wipe className="mt-6 w-fit">
            <p className="label text-accent-a">This one, in three</p>
          </Wipe>
          <h2 className="display mt-3 text-[clamp(1.8rem,4.6vw,3.2rem)] font-light">
            What you are ordering
          </h2>
          <WipeUp className="mt-2">
            <p className="arabic text-[clamp(1.1rem,2.6vw,1.7rem)] text-orn-a">
              تین باتیں
            </p>
          </WipeUp>

          <StackedCards className="mt-14 space-y-[24vh]" top={16} step={2.6}>
            {facts.map((fact) => (
              <Grow key={fact.n}>
                <div className="panel-dome card-depth border border-current/15 bg-band-b text-on-b">
                  <div className="grid min-h-[52vh] sm:grid-cols-[1fr_0.8fr]">
                    <div className="p-8 sm:p-12">
                      <div className="flex items-baseline gap-4">
                        <span className="display text-[clamp(2.6rem,6vw,4.2rem)] leading-none text-accent-b">
                          {fact.n}
                        </span>
                        <div>
                          <p className="display text-3xl">{fact.title}</p>
                          <p className="arabic text-lg text-orn-b">
                            {fact.urdu}
                          </p>
                        </div>
                      </div>
                      <Rule className="mt-7 w-full text-current/20" />
                      <p className="mt-7 max-w-[44ch] text-on-b-2">
                        {fact.copy}
                      </p>
                      <p className="display mt-8 text-[clamp(1.4rem,3vw,2.2rem)] text-accent-b">
                        {fact.stat}
                      </p>
                    </div>
                    <div className="dome-corner relative min-h-[220px] overflow-hidden">
                      <ArchPhoto
                        src={fact.photo}
                        alt=""
                        sizes="(max-width: 640px) 100vw, 40vw"
                        aspect="h-full w-full"
                      />
                    </div>
                  </div>
                </div>
              </Grow>
            ))}
          </StackedCards>
        </div>

        {alsoTry.length > 0 && (
          <div className="relative mx-auto mt-28 max-w-[1280px]">
            <Rule className="w-full text-current/20" />
            <Wipe className="mt-10 w-fit">
              <p className="label text-accent-a">
                Also on the {dish.category.toLowerCase()} list
              </p>
            </Wipe>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {alsoTry.map((other, i) => (
                <ArchReveal
                  key={other.id}
                  from={`entry ${4 + i * 4}%`}
                  to={`cover ${38 + i * 4}%`}
                >
                  <Link
                    href={`/dish/${other.id}`}
                    className="group block text-center"
                  >
                    <ArchPanel
                      className="text-orn-a"
                      thickness={3}
                      stack={false}
                    >
                      <ArchPhoto
                        src={other.photo}
                        alt={other.name}
                        sizes="(max-width: 640px) 100vw, 380px"
                      />
                    </ArchPanel>
                    <h3 className="display mt-4 text-xl transition-colors group-hover:text-accent-a">
                      {other.name}
                    </h3>
                    <p className="arabic text-base text-accent-a">
                      {other.urdu}
                    </p>
                    <p className="tabular mt-1 text-sm text-on-a-2">
                      {rupees(other.price)}
                    </p>
                  </Link>
                </ArchReveal>
              ))}
            </div>
          </div>
        )}
      </section>

      <Interlude tone="a" />

      <Statement
        tone="b"
        label="The seal"
        text="Nothing on this page is cooked ahead. The lid goes on when you order and comes off at your table, which is why the wait is real and why it is worth it."
        urdu="ڈھکن آپ کے سامنے کھلے گا"
      />

      <PageFoot />
    </>
  );
}
