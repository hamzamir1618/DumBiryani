"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArchReveal,
  Pan,
  Rise,
  Rule,
  Turn,
  Wipe,
  WipeUp,
} from "@/components/motion";
import { PinnedRun, RunPanel } from "@/components/scenes";
import { Photo } from "@/components/chrome";
import { ArchPanel, Boteh, Medallion, Spandrel } from "@/components/ornament";
import {
  ArchPhoto,
  Interlude,
  PageFoot,
  PageHead,
  Statement,
} from "@/components/page-parts";
import {
  categories,
  categoryUrdu,
  dishes,
  rupees,
  type Category,
} from "@/data/menu";

const filters = [
  { id: "all", label: "Everything" },
  { id: "mutton", label: "Mutton" },
  { id: "chicken", label: "Chicken" },
  { id: "veg", label: "Veg" },
  { id: "under", label: "Under Rs 1,200" },
] as const;

type FilterId = (typeof filters)[number]["id"];

/** The biryanis that sit longest under the seal, slowest first. */
const longest = dishes
  .filter((d) => d.category === "Biryani" && d.dum)
  .sort((a, b) => (b.dum ?? 0) - (a.dum ?? 0));

export function MenuView() {
  const [filter, setFilter] = useState<FilterId>("all");
  const reduce = useReducedMotion();

  const shown = useMemo(() => {
    if (filter === "all") return dishes;
    if (filter === "under") return dishes.filter((d) => d.price < 1200);
    return dishes.filter((d) => d.tags.includes(filter));
  }, [filter]);

  const sections = categories
    .map((category: Category) => ({
      category,
      items: shown.filter((d) => d.category === category),
    }))
    .filter((s) => s.items.length > 0);

  return (
    <>
      <PageHead
        label={`${dishes.length} dishes · sealed to order`}
        title="The Menu"
        urdu="کھانے کی فہرست"
        photo="/photos/spices-flatlay.jpg"
        lead="Every handi is sealed when you order it, so the kitchen needs the time it needs. Nothing here is reheated."
      />

      {/* the filters hold at the top as the list runs under them, and let go
          at the end of the list rather than riding over the rest of the page */}
      <div className="relative">
        <div className="sticky top-[68px] z-[60] border-y border-current/12 bg-band-b/92 text-on-b backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
            <div className="flex gap-1.5 overflow-x-auto">
              {filters.map((f) => {
                const on = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    aria-pressed={on}
                    className="relative shrink-0 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors"
                  >
                    {on && (
                      <motion.span
                        layoutId="menu-filter"
                        className="absolute inset-0 rounded-full bg-accent-b"
                        transition={{
                          duration: reduce ? 0 : 0.45,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                    )}
                    <span
                      className={`relative ${on ? "text-band-b" : "text-on-b-2"}`}
                    >
                      {f.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="label hidden shrink-0 text-on-b-2 sm:block">
              {shown.length} shown
            </p>
          </div>
        </div>

        <section className="relative bg-band-b px-5 pb-24 text-on-b sm:px-8">
          <Boteh
            size={110}
            className="s-counter absolute top-[8%] right-[3%] hidden text-orn-b/25 lg:block"
            tilt={28}
          />

          <div className="mx-auto max-w-[1280px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {sections.map(({ category, items }) => (
                <motion.div
                  key={category}
                  layout={!reduce}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{
                    duration: reduce ? 0 : 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="pt-20"
                  id={category.toLowerCase()}
                >
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <Wipe className="w-fit">
                        <p className="label text-accent-b">
                          {category} · {items.length}
                        </p>
                      </Wipe>
                      <WipeUp className="mt-1">
                        <h2 className="arabic text-[clamp(1.6rem,4vw,2.6rem)] text-orn-b">
                          {categoryUrdu[category]}
                        </h2>
                      </WipeUp>
                    </div>
                    <Medallion
                      size={38}
                      className="s-turn mb-2 text-orn-b"
                      rings={false}
                    />
                  </div>
                  <Rule className="mt-5 w-full text-current/25" />

                  <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((dish, i) => (
                      <ArchReveal
                        key={dish.id}
                        from={`entry ${4 + (i % 3) * 4}%`}
                        to={`cover ${38 + (i % 3) * 4}%`}
                      >
                        <Link href={`/dish/${dish.id}`} className="group block">
                          <ArchPanel
                            className="text-orn-b"
                            thickness={3}
                            stack={false}
                          >
                            <ArchPhoto
                              src={dish.photo}
                              alt={dish.name}
                              sizes="(max-width: 640px) 100vw, 400px"
                            />
                          </ArchPanel>
                          <div className="mt-5 flex items-baseline justify-between gap-4">
                            <h3 className="display text-2xl transition-colors group-hover:text-accent-b">
                              {dish.name}
                            </h3>
                            <span className="tabular display shrink-0 text-xl">
                              {rupees(dish.price)}
                            </span>
                          </div>
                          <p className="arabic text-lg text-accent-b">
                            {dish.urdu}
                          </p>
                          <p className="mt-2 text-sm text-on-b-2">
                            {dish.blurb}
                            {dish.dum ? ` · ${dish.dum} min on dum` : ""}
                          </p>
                        </Link>
                      </ArchReveal>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {sections.length === 0 && (
              <Rise className="flex flex-col items-start gap-4 pt-28">
                <Medallion size={70} className="text-orn-b" />
                <p className="display text-4xl">Nothing matches that</p>
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="label border-b border-accent-b pb-1 text-accent-b"
                >
                  Show everything
                </button>
              </Rise>
            )}
          </div>
        </section>
      </div>

      <Interlude tone="b" />

      {/* the long ones, walked through sideways as you scroll down */}
      <section className="relative overflow-hidden bg-band-a px-5 pt-28 text-on-a sm:px-8">
        <div className="field-girih field-fade pointer-events-none absolute inset-0 text-orn-a" />
        <Spandrel
          corner="tr"
          className="hidden md:block absolute top-0 right-0 text-orn-a"
          size={190}
        />
        <div className="relative mx-auto max-w-[1280px]">
          <Turn>
            <Medallion size={48} className="text-orn-a" />
          </Turn>
          <Wipe className="mt-6 w-fit">
            <p className="label text-accent-a">Longest on dum</p>
          </Wipe>
          <h2 className="display mt-3 text-[clamp(2rem,5.4vw,4rem)] font-light">
            The slow end of the list
          </h2>
          <WipeUp className="mt-2">
            <p className="arabic text-[clamp(1.2rem,3vw,1.9rem)] text-orn-a">
              سب سے لمبی دم
            </p>
          </WipeUp>
          <Rise className="mt-5">
            <p className="max-w-[48ch] text-on-a-2">
              Keep scrolling and the row walks sideways, longest seal first.
            </p>
          </Rise>
        </div>
      </section>

      <PinnedRun
        count={longest.length}
        label="Longest on dum"
        className="bg-band-a text-on-a"
        panelVw={32}
        panelMin={260}
      >
        {longest.map((dish) => (
          <RunPanel key={dish.id}>
            <Link href={`/dish/${dish.id}`} className="group block">
              <ArchPanel className="text-orn-a" thickness={3}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Pan className="absolute inset-0">
                    <Photo
                      src={dish.photo}
                      alt={dish.name}
                      fill
                      sizes="(max-width: 640px) 80vw, 32vw"
                      className="object-cover"
                    />
                  </Pan>
                </div>
              </ArchPanel>
              <p className="label mt-5 text-accent-a">{dish.dum} min on dum</p>
              <h3 className="display mt-1 text-2xl transition-colors group-hover:text-accent-a">
                {dish.name}
              </h3>
              <p className="arabic text-lg text-orn-a">{dish.urdu}</p>
              <p className="tabular mt-1 text-sm text-on-a-2">
                {rupees(dish.price)}
              </p>
            </Link>
          </RunPanel>
        ))}
      </PinnedRun>

      <Statement
        tone="b"
        label="Why the list is short"
        text="Every handi on this page is sealed when you order it. Nothing is cooked ahead, nothing is held under a lamp, and nothing is reheated. That is the whole reason this list stays short instead of running to four pages."
        urdu="ہر ہانڈی آرڈر پر بند ہوتی ہے"
      />

      <PageFoot />
    </>
  );
}
