import Link from "next/link";
import type { CSSProperties } from "react";
import { ChapterRail, CountUp, Photo, type Chapter } from "@/components/chrome";
import {
  ArchReveal,
  Chars,
  Depth,
  Pan,
  Rise,
  Rule,
  Settle,
  Turn,
  Wipe,
  WipeUp,
} from "@/components/motion";
import {
  ArabesqueRibbon,
  ArchPanel,
  BorderBand,
  Boteh,
  FieldMedallion,
  Medallion,
  Spandrel,
} from "@/components/ornament";
import {
  LitProse,
  PinnedRun,
  RunPanel,
  StackedCards,
} from "@/components/scenes";
import { branches } from "@/data/branches";
import { dishes, rupees } from "@/data/menu";

const handis = dishes.filter((d) => d.category === "Biryani");

const chapters: Chapter[] = [
  { id: "open", label: "Dum Biryani", urdu: "دم بریانی" },
  { id: "what", label: "What dum is", urdu: "دم کیا ہے" },
  { id: "handis", label: "The handis", urdu: "ہانڈیاں" },
  { id: "method", label: "How it is made", urdu: "طریقہ" },
  { id: "time", label: "The time it takes", urdu: "وقت" },
  { id: "inside", label: "What goes in", urdu: "اجزاء" },
  { id: "rooms", label: "Where to find us", urdu: "ٹھکانے" },
  { id: "questions", label: "Questions", urdu: "سوالات" },
  { id: "close", label: "Come and eat", urdu: "تشریف لائیے" },
];

const steps = [
  {
    n: "01",
    title: "Marinate",
    urdu: "مصالحہ",
    stat: "12 hours",
    photo: "/photos/spice-spoons.jpg",
    copy: "Mutton goes into yoghurt, red chilli and green papaya and is left overnight. By morning it is soft enough to cook through in the time the rice takes, which is the whole reason the dish works.",
  },
  {
    n: "02",
    title: "Seal",
    urdu: "دم",
    stat: "one rope of atta",
    photo: "/photos/biryani-handi.jpg",
    copy: "Aged rice goes over the raw meat, saffron and fried onion over that, and a rope of dough closes the handi. The lid does not come off again until it reaches you.",
  },
  {
    n: "03",
    title: "Lift",
    urdu: "تیار",
    stat: "forty-five minutes",
    photo: "/photos/embers.jpg",
    copy: "Over embers, untouched. The rice cooks in steam that cannot escape, then the seal is broken in front of you and all of it arrives at once.",
  },
];

const ingredients = [
  "Aged basmati",
  "Raw mutton",
  "Yoghurt",
  "Green papaya",
  "Saffron",
  "Fried onion",
  "Mint",
  "Kewra",
  "Ghee",
  "A rope of dough",
];

const questions = [
  {
    q: "How long does a handi take?",
    a: "Between thirty and fifty-five minutes, depending on what is in it. The meat goes in raw and cooks in the same sealed pot as the rice, and that is the part that takes the time.",
  },
  {
    q: "Can I order for a table of ten?",
    a: "Yes. The family handi serves six to eight and most large tables take two, one mutton and one chicken. Give the kitchen an hour if you can.",
  },
  {
    q: "What if I cannot take the heat?",
    a: "Four levels, and mild genuinely is mild. The house setting is one above that. The kitchen's own setting is two above that and comes with a warning.",
  },
  {
    q: "Is the handi sealed for delivery too?",
    a: "Yes, with dough, every time. On delivery it is broken at your door rather than at your table, which is not quite the same thing but is close.",
  },
  {
    q: "Where does the rice come from?",
    a: "Aged basmati, twelve months, from the same supplier since 2019. Rice that has sat is drier, and drier rice takes on more of what is underneath it.",
  },
];

export default function Home() {
  return (
    <>
      <ChapterRail chapters={chapters} />

      {/* ============================================================ 01 open
          Always a dark field: it is a photograph, in either theme. */}
      <section
        id="open"
        className="on-photo relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-night px-5 text-center sm:px-8"
      >
        <div className="absolute inset-0">
          <Photo
            src="/photos/biryani-spoon.jpg"
            alt="A spoonful of biryani lifted from a handi"
            fill
            priority
            sizes="100vw"
            className="drift object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-night/62 via-night/50 to-night" />
        </div>

        <div className="field-arabesque field-fade pointer-events-none absolute inset-0 text-turquoise" />
        <FieldMedallion className="text-turquoise" opacity={0.26} />
        <Spandrel
          corner="tl"
          className="hidden md:block absolute -top-10 -left-10 text-turquoise"
          size={300}
          star={false}
        />
        <Spandrel
          corner="br"
          className="hidden md:block absolute -right-10 -bottom-16 text-turquoise"
          size={260}
        />

        <div className="relative z-10 flex flex-col items-center">
          <p
            className="label enter text-saffron-light"
            style={{ "--in": "120ms" } as CSSProperties}
          >
            Karachi · Lahore · Islamabad · since 2019
          </p>

          <h1 className="mt-7">
            <span
              className="kufi enter s-float block text-[clamp(4.5rem,16vw,13rem)] leading-[1.05] text-saffron"
              style={{ "--in": "240ms" } as CSSProperties}
            >
              دم
            </span>
            <span
              className="display gilded enter mt-1 block text-[clamp(3rem,10vw,8.5rem)] font-light"
              style={
                { "--in": "380ms", "--gild-base": "#ffffff" } as CSSProperties
              }
            >
              Dum Biryani
            </span>
          </h1>

          <p
            className="display-italic enter mt-6 text-[clamp(1.2rem,2.8vw,2rem)] text-turquoise-light"
            style={{ "--in": "520ms" } as CSSProperties}
          >
            Sealed with dough. Opened at your table.
          </p>

          <p
            className="arabic enter mt-3 text-[clamp(1.1rem,2.4vw,1.7rem)] text-white/70"
            style={{ "--in": "620ms" } as CSSProperties}
          >
            خوش آمدید
          </p>

          <div
            className="enter mt-10 flex flex-wrap items-center justify-center gap-3"
            style={{ "--in": "720ms" } as CSSProperties}
          >
            <Link
              href="/menu"
              className="display rounded-full bg-saffron px-9 py-3.5 text-lg text-night transition-transform duration-500 hover:scale-[1.05]"
            >
              See the menu
            </Link>
            <Link
              href="/locations"
              className="display rounded-full border border-white/45 px-9 py-3.5 text-lg transition-colors duration-500 hover:bg-white hover:text-night"
            >
              Find a room
            </Link>
          </div>
        </div>

        <ArabesqueRibbon
          className="enter absolute inset-x-0 bottom-0 z-10 text-turquoise/45"
          height={78}
          style={{ "--in": "840ms" } as CSSProperties}
        />
      </section>

      {/* ============================================================ 02 what */}
      <section
        id="what"
        className="relative flex min-h-[100svh] items-center overflow-hidden bg-band-a px-5 py-32 text-on-a sm:px-8"
      >
        <FieldMedallion className="text-orn-a" opacity={0.26} />
        <Boteh
          size={120}
          className="s-turn s-float absolute top-[12%] left-[6%] text-orn-a/45"
          tilt={-18}
        />
        <Boteh
          size={96}
          className="s-turn absolute right-[7%] bottom-[14%] text-orn-a/40"
          tilt={150}
        />

        <div className="relative mx-auto w-full max-w-[1080px] text-center">
          <Turn>
            <Medallion size={64} className="mx-auto text-orn-a" />
          </Turn>
          <Wipe className="mx-auto mt-5 w-fit">
            <p className="arabic text-[clamp(1.3rem,3vw,2rem)] text-accent-a">
              دم کیا ہے
            </p>
          </Wipe>
          <Rise className="mt-2">
            <p className="label text-on-a-2">What dum is</p>
          </Rise>
          <Rule className="mx-auto mt-6 w-40 text-accent-a" />

          <LitProse
            className="display mt-12 text-[clamp(1.7rem,4.6vw,3.9rem)] leading-[1.14] font-light"
            dim="color-mix(in srgb, var(--on-a) 16%, transparent)"
            lit="var(--on-a)"
            text="Dum is a seal. Raw meat goes into the handi, aged rice goes over it, and a rope of dough closes the lid. For forty-five minutes nothing is stirred and nothing is added. The rice takes on the saffron, the fried onion and everything the meat gives up, and none of it leaves the pot."
          />
        </div>
      </section>

      {/* ========================================================== 03 handis */}
      <div id="handis" className="relative bg-band-b text-on-b">
        <div className="overflow-hidden">
          <BorderBand className="s-band text-orn-b" height={30} />
        </div>

        <div className="px-5 pt-20 text-center sm:px-8">
          <Wipe className="mx-auto w-fit">
            <p className="label text-accent-b">Five handis</p>
          </Wipe>
          <h2 className="display mt-3 text-[clamp(2.4rem,6vw,4.6rem)] font-light">
            <Chars>Choose your pot</Chars>
          </h2>
          <WipeUp className="mt-2">
            <p className="arabic text-[clamp(1.2rem,2.6vw,1.7rem)] text-orn-b">
              پانچ ہانڈیاں
            </p>
          </WipeUp>
          <Rule className="mx-auto mt-7 w-48 text-accent-b" />
          <Rise className="mt-5">
            <p className="label motion-only text-on-b-2">
              Keep scrolling · the row moves with you
            </p>
          </Rise>
        </div>

        <PinnedRun
          count={handis.length + 1}
          label="The handis"
          panelVw={34}
          panelMin={268}
        >
          {handis.map((dish, i) => (
            <RunPanel key={dish.id}>
              <Link href={`/dish/${dish.id}`} className="group block">
                <ArchPanel className="text-orn-b" thickness={3}>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Pan className="absolute inset-0">
                      <Photo
                        src={dish.photo}
                        alt={dish.name}
                        fill
                        sizes="(max-width: 640px) 80vw, 34vw"
                        className="object-cover"
                      />
                    </Pan>
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night via-night/80 to-transparent px-5 pt-16 pb-5 text-left text-white">
                      <span className="label block text-saffron-light">
                        {String(i + 1).padStart(2, "0")} · {dish.dum} min on dum
                      </span>
                      <span className="display mt-1 block text-[clamp(1.5rem,3vw,2.2rem)] leading-tight transition-colors group-hover:text-saffron-light">
                        {dish.name}
                      </span>
                    </span>
                  </div>
                </ArchPanel>

                <div className="mt-5 flex items-baseline justify-between gap-4 px-1">
                  <span className="arabic text-xl text-accent-b">
                    {dish.urdu}
                  </span>
                  <span className="tabular display text-xl">
                    {rupees(dish.price)}
                  </span>
                </div>
                <p className="mt-1 px-1 text-left text-sm text-on-b-2">
                  {dish.blurb}
                </p>
              </Link>
            </RunPanel>
          ))}

          <RunPanel className="justify-center">
            <Link
              href="/menu"
              className="ogee-soft card-depth group flex h-full w-full flex-col items-center justify-center gap-4 border border-current/20 bg-band-a px-8 py-16 text-center text-on-a transition-colors hover:border-accent-a"
            >
              <Medallion size={78} className="s-turn-slow text-orn-a" />
              <p className="display text-[clamp(1.6rem,3vw,2.3rem)] font-light">
                Sides, sweets and chai
              </p>
              <p className="arabic text-lg text-accent-a">اور بھی بہت کچھ</p>
              <p className="label mt-2 text-on-a-2">Seven more on the menu</p>
              <span className="label mt-3 border-b border-accent-a pb-1 text-accent-a">
                Open the menu
              </span>
            </Link>
          </RunPanel>
        </PinnedRun>

        <div className="overflow-hidden">
          <BorderBand className="s-band text-orn-b" height={30} />
        </div>
      </div>

      {/* ========================================================== 04 method */}
      <section
        id="method"
        className="relative bg-band-a px-5 pt-24 pb-40 text-on-a sm:px-8"
      >
        <div className="field-girih field-fade pointer-events-none absolute inset-0 text-orn-a" />

        <div className="relative mx-auto max-w-[1080px] text-center">
          <Wipe className="mx-auto w-fit">
            <p className="label text-accent-a">How it is made</p>
          </Wipe>
          <h2 className="display mt-3 text-[clamp(2.4rem,6vw,4.6rem)] font-light">
            <Chars>Three movements</Chars>
          </h2>
          <WipeUp className="mt-2">
            <p className="arabic text-[clamp(1.2rem,2.6vw,1.7rem)] text-orn-a">
              طریقہ
            </p>
          </WipeUp>
          <Rule className="mx-auto mt-7 w-48 text-accent-a" />
        </div>

        <StackedCards className="relative mx-auto mt-16 max-w-[1020px] space-y-[26vh]">
          {steps.map((step) => (
            /* Rise, not Grow: scaling a card this size re-renders its shadow
               every frame, and this section was the slowest on the page. */
            <Rise key={step.n}>
              <div className="panel-dome card-depth border border-current/15 bg-band-b text-on-b">
                <div className="grid min-h-[58vh] gap-0 sm:grid-cols-[1fr_0.85fr]">
                  <div className="p-8 text-left sm:p-12">
                    <div className="flex items-baseline gap-4">
                      <span className="display text-[clamp(3rem,7vw,5rem)] leading-none text-accent-b">
                        {step.n}
                      </span>
                      <span className="arabic text-2xl text-orn-b">
                        {step.urdu}
                      </span>
                    </div>
                    <h3 className="display mt-3 text-[clamp(2rem,5vw,3.4rem)] font-light">
                      <Chars step={1.1}>{step.title}</Chars>
                    </h3>
                    <Rule className="mt-6 w-28 text-accent-b" />
                    <Rise className="mt-6">
                      <p className="max-w-[42ch] leading-relaxed text-on-b-2">
                        {step.copy}
                      </p>
                    </Rise>
                    <Wipe className="mt-7 w-fit">
                      <p className="label text-accent-b">{step.stat}</p>
                    </Wipe>
                  </div>
                  <div className="dome-corner relative min-h-[260px] overflow-hidden">
                    <Pan className="absolute inset-0">
                      <Photo
                        src={step.photo}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 420px"
                        className="object-cover"
                      />
                    </Pan>
                    <span className="absolute inset-0 bg-gradient-to-t from-band-b via-band-b/25 to-transparent sm:bg-gradient-to-r sm:via-band-b/15" />
                  </div>
                </div>
              </div>
            </Rise>
          ))}
        </StackedCards>
      </section>

      {/* ============================================================ 05 time */}
      <section
        id="time"
        className="relative overflow-hidden bg-band-b px-5 py-28 text-on-b sm:px-8 sm:py-36"
      >
        <div className="field-arabesque field-fade pointer-events-none absolute inset-0 text-orn-b" />
        <Spandrel
          corner="tr"
          className="hidden md:block absolute top-0 right-0 text-orn-b"
          size={240}
        />
        <Boteh
          size={90}
          className="s-counter absolute bottom-[8%] left-[4%] hidden text-orn-b/40 lg:block"
          tilt={-30}
        />

        <div className="relative mx-auto max-w-[1180px]">
          <div className="text-center">
            <Wipe className="mx-auto w-fit">
              <p className="label text-accent-b">The time it takes</p>
            </Wipe>
            <h2 className="display mt-3 text-[clamp(2.2rem,5.4vw,4.2rem)] font-light">
              <Chars>Nothing here is hurried</Chars>
            </h2>
            <WipeUp className="mt-2">
              <p className="arabic text-[clamp(1.2rem,2.6vw,1.7rem)] text-orn-b">
                وقت ہی ذائقہ ہے
              </p>
            </WipeUp>
            <Rule className="mx-auto mt-7 w-48 text-accent-b" />
          </div>

          <div className="mt-20 grid gap-12 sm:grid-cols-3">
            {[
              {
                to: 12,
                unit: "hours",
                label: "in the marinade, overnight",
                plane: "far",
              },
              {
                to: 45,
                unit: "minutes",
                label: "under the seal, over embers",
                plane: "near",
              },
              {
                to: 4,
                unit: "kitchens",
                label: "across three cities",
                plane: "far",
              },
            ].map((stat) => (
              <Depth key={stat.label} plane={stat.plane as "near" | "far"}>
                <div className="text-center">
                  <Turn>
                    <Medallion
                      size={52}
                      className="mx-auto text-orn-b"
                      rings={false}
                    />
                  </Turn>
                  <p className="display tabular mt-5 text-[clamp(4rem,11vw,7.5rem)] leading-none text-orn-b">
                    <CountUp to={stat.to} />
                  </p>
                  <WipeUp>
                    <p className="display-italic text-2xl text-accent-b">
                      {stat.unit}
                    </p>
                  </WipeUp>
                  <Rise className="mt-3">
                    <p className="text-sm text-on-b-2">{stat.label}</p>
                  </Rise>
                </div>
              </Depth>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================== 06 inside */}
      <section
        id="inside"
        className="relative overflow-hidden bg-band-a px-5 py-28 text-on-a sm:px-8 sm:py-36"
      >
        <FieldMedallion className="text-orn-a" opacity={0.22} />
        <Boteh
          size={110}
          className="s-turn s-float absolute top-[14%] right-[8%] text-orn-a/35"
          tilt={24}
        />
        <Boteh
          size={88}
          className="s-turn absolute bottom-[12%] left-[7%] text-orn-a/30"
          tilt={-140}
        />

        <div className="relative mx-auto max-w-[1080px] text-center">
          <Wipe className="mx-auto w-fit">
            <p className="label text-accent-a">What goes in</p>
          </Wipe>
          <h2 className="display mt-3 text-[clamp(2.4rem,6vw,4.6rem)] font-light">
            <Chars>Ten things, no more</Chars>
          </h2>
          <WipeUp className="mt-2">
            <p className="arabic text-[clamp(1.2rem,2.6vw,1.7rem)] text-orn-a">
              ہانڈی میں کیا جاتا ہے
            </p>
          </WipeUp>

          <ArabesqueRibbon className="mt-10 text-orn-a/60" height={70} draw />

          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {ingredients.map((item, i) => (
              <li key={item}>
                <WipeUp
                  as="span"
                  className="display block text-[clamp(1.4rem,3.6vw,2.9rem)] font-light"
                  from={`entry ${6 + i * 2}%`}
                  to={`cover ${34 + i * 2}%`}
                >
                  <span className={i % 3 === 1 ? "text-accent-a" : ""}>
                    {item}
                  </span>
                </WipeUp>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =========================================================== 07 rooms */}
      <section
        id="rooms"
        className="relative bg-band-b px-5 py-28 text-on-b sm:px-8 sm:py-36"
      >
        <div className="absolute inset-x-0 top-0 overflow-hidden">
          <BorderBand className="s-band text-orn-b" height={26} />
        </div>

        <div className="mx-auto max-w-[1180px]">
          <div className="text-center">
            <Wipe className="mx-auto w-fit">
              <p className="label text-accent-b">Where to find us</p>
            </Wipe>
            <h2 className="display mt-3 text-[clamp(2.2rem,5.4vw,4.2rem)] font-light">
              <Chars>Four rooms</Chars>
            </h2>
            <WipeUp className="mt-2">
              <p className="arabic text-[clamp(1.2rem,2.6vw,1.7rem)] text-orn-b">
                ہمارے ٹھکانے
              </p>
            </WipeUp>
            <Rule className="mx-auto mt-7 w-48 text-accent-b" />
          </div>

          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {branches.map((branch, i) => (
              <ArchReveal
                key={branch.id}
                from={`entry ${4 + i * 4}%`}
                to={`cover ${40 + i * 4}%`}
              >
                <Link href="/locations" className="group block text-center">
                  <ArchPanel className="text-orn-b" thickness={3} stack={false}>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Settle className="absolute inset-0">
                        <Photo
                          src={branch.photo}
                          alt={`${branch.name}, ${branch.city}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 280px"
                          className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110"
                        />
                      </Settle>
                    </div>
                  </ArchPanel>
                  <p className="label mt-5 text-accent-b">{branch.city}</p>
                  <h3 className="display mt-1 text-2xl">{branch.name}</h3>
                  <p className="arabic text-lg text-orn-b">{branch.urdu}</p>
                  <p className="mt-3 text-sm text-on-b-2">{branch.hours}</p>
                  <p className="label mt-3 text-accent-b">{branch.phone}</p>
                </Link>
              </ArchReveal>
            ))}
          </div>

          <Rise className="mt-16 text-center">
            <Link
              href="/locations"
              className="display inline-block rounded-full border border-current/40 px-10 py-4 text-lg transition-colors duration-500 hover:bg-on-b hover:text-band-b"
            >
              All four rooms, and book a table
            </Link>
          </Rise>
        </div>
      </section>

      {/* ======================================================= 08 questions */}
      <section
        id="questions"
        className="relative bg-band-a px-5 py-28 text-on-a sm:px-8 sm:py-36"
      >
        <div className="field-girih field-fade pointer-events-none absolute inset-0 text-orn-a" />

        <div className="relative mx-auto max-w-[900px]">
          <div className="text-center">
            <Wipe className="mx-auto w-fit">
              <p className="label text-accent-a">Questions</p>
            </Wipe>
            <h2 className="display mt-3 text-[clamp(2.2rem,5.4vw,4.2rem)] font-light">
              <Chars>Before you order</Chars>
            </h2>
            <WipeUp className="mt-2">
              <p className="arabic text-[clamp(1.2rem,2.6vw,1.7rem)] text-orn-a">
                سوالات
              </p>
            </WipeUp>
          </div>

          <div className="mt-14 border-t border-current/15">
            {questions.map((item, i) => (
              <Rise
                key={item.q}
                from={`entry ${4 + i * 3}%`}
                to={`cover ${34 + i * 3}%`}
              >
                <details className="group border-b border-current/15">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-7 marker:hidden">
                    <span className="display text-[clamp(1.3rem,3vw,2.1rem)] font-light transition-colors group-hover:text-accent-a">
                      {item.q}
                    </span>
                    <span className="mt-2 shrink-0 text-accent-a transition-transform duration-500 group-open:rotate-135">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="max-w-[62ch] pb-7 leading-relaxed text-on-a-2">
                    {item.a}
                  </p>
                </details>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================== 09 close */}
      <section
        id="close"
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-band-a px-5 py-28 text-center text-on-a sm:px-8"
      >
        <FieldMedallion className="text-accent-a" opacity={0.2} />
        <Spandrel
          corner="tl"
          className="hidden md:block absolute top-0 left-0 text-orn-a"
          size={250}
        />
        <Spandrel
          corner="br"
          className="hidden md:block absolute right-0 bottom-0 text-orn-a"
          size={250}
        />

        <Turn>
          <Medallion size={84} className="mx-auto text-orn-a" />
        </Turn>
        <h2 className="display mt-8 text-[clamp(2.8rem,9vw,7rem)] font-light">
          <Chars step={2.4}>Come and eat</Chars>
        </h2>
        <WipeUp className="mt-4">
          <p className="arabic text-[clamp(1.4rem,3.4vw,2.4rem)] text-accent-a">
            تشریف لائیے
          </p>
        </WipeUp>
        <Rule className="mx-auto mt-7 w-56 text-accent-a" />
        <Rise className="mt-7">
          <p className="max-w-[46ch] text-on-a-2">
            The kitchen seals the last handi at eleven. Everything before that
            is made the long way, as it has been since the first pot in Clifton.
          </p>
        </Rise>

        <Rise className="mt-11" from="entry 10%" to="cover 46%">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/menu"
              className="display rounded-full bg-accent-a px-10 py-4 text-lg text-band-a transition-transform duration-500 hover:scale-[1.05]"
            >
              Order now
            </Link>
            <Link
              href="/locations"
              className="display rounded-full border border-current/45 px-10 py-4 text-lg transition-colors duration-500 hover:bg-on-a hover:text-band-a"
            >
              Book a table
            </Link>
          </div>
        </Rise>

        <div className="relative mt-20">
          <span className="kufi s-float block text-[44px] leading-none text-accent-a">
            دم
          </span>
          <span className="display mt-2 block text-2xl text-on-a-2">
            Biryani
          </span>
        </div>

        <ArabesqueRibbon
          className="absolute inset-x-0 bottom-0 text-orn-a/45"
          height={70}
        />
      </section>
    </>
  );
}
