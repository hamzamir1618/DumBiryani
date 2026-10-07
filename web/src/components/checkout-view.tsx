"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deliveryFee, useBasket } from "@/components/basket";
import { Grow, Rise, Rule, Turn, Wipe, WipeUp } from "@/components/motion";
import { Boteh, FieldMedallion, Medallion } from "@/components/ornament";
import {
  Interlude,
  PageFoot,
  PageHead,
  Statement,
} from "@/components/page-parts";
import { lineNote } from "@/components/site-nav";
import { areas, branches, slots } from "@/data/branches";
import { rupees } from "@/data/menu";
import {
  newOrderId,
  nowMs,
  saveOrder,
  type Order,
  type OrderLine,
} from "@/lib/order";

const EASE = [0.16, 1, 0.3, 1] as const;

const payments = [
  { id: "cash", label: "Cash on handover" },
  { id: "card", label: "Card" },
  { id: "wallet", label: "Wallet" },
] as const;

export function CheckoutView() {
  const { lines, total, clear } = useBasket();
  const router = useRouter();
  const reduce = useReducedMotion();

  const [mode, setMode] = useState<"delivery" | "collection">("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState(areas[0]);
  const [branch, setBranch] = useState(branches[0].id);
  const [slot, setSlot] = useState(slots[0]);
  const [payment, setPayment] =
    useState<(typeof payments)[number]["id"]>("cash");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const [placing, setPlacing] = useState(false);

  const fee = mode === "delivery" ? deliveryFee(total) : 0;
  const longest = lines.reduce((max, l) => Math.max(max, l.dish.dum ?? 20), 20);
  const minutes = longest + (mode === "delivery" ? 25 : 10);

  const missing = {
    name: name.trim().length < 2,
    phone: phone.replace(/\D/g, "").length < 10,
    street: mode === "delivery" && street.trim().length < 6,
  };
  const valid =
    !missing.name && !missing.phone && !missing.street && lines.length > 0;

  const place = () => {
    if (!valid) {
      setTouched(true);
      return;
    }
    setPlacing(true);
    const id = newOrderId();
    const orderLines: OrderLine[] = lines.map((l) => ({
      name: l.dish.name,
      urdu: l.dish.urdu,
      note: lineNote(
        l.portion,
        l.spice,
        l.addOns,
        l.dish.category === "Biryani",
      ),
      quantity: l.quantity,
      unit: l.unit,
      photo: l.dish.photo,
    }));
    const order: Order = {
      id,
      placedAt: nowMs(),
      mode,
      where:
        mode === "delivery"
          ? `${street.trim()}, ${area}`
          : (branches.find((b) => b.id === branch)?.name ?? branches[0].name),
      slot,
      lines: orderLines,
      subtotal: total,
      fee,
      total: total + fee,
      minutes,
    };
    saveOrder(order);
    router.push(`/order/${id}`);
    window.setTimeout(clear, 400);
  };

  if (lines.length === 0 && !placing) {
    return (
      <>
        <PageHead
          label="Checkout"
          title="Nothing to pay for"
          urdu="ٹوکری خالی ہے"
        />
        <section className="bg-band-b px-5 py-20 text-on-b sm:px-8">
          <div className="mx-auto max-w-[1280px]">
            <Link
              href="/menu"
              className="display rounded-full bg-accent-b px-9 py-3.5 text-lg text-band-b transition-transform duration-500 hover:scale-[1.04]"
            >
              Open the menu
            </Link>
          </div>
        </section>
        <PageFoot />
      </>
    );
  }

  return (
    <>
      <PageHead
        label="Checkout"
        title="Nearly sealed"
        urdu="بس سیل ہونے والی ہے"
        lead="Nothing is charged here. This is a front end on made-up data."
      />

      <section className="relative overflow-hidden bg-band-b px-5 py-20 text-on-b sm:px-8">
        <div className="field-girih field-fade pointer-events-none absolute inset-0 text-orn-b" />
        <FieldMedallion className="text-orn-b" opacity={0.14} />
        <Boteh
          size={120}
          className="s-counter absolute top-[8%] right-[3%] hidden text-orn-b/25 lg:block"
          tilt={24}
        />

        <div className="relative mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <Step n="01" title="How it reaches you" urdu="کیسے پہنچے">
              <div className="grid grid-cols-2 gap-3">
                {(["delivery", "collection"] as const).map((m) => {
                  const on = mode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      aria-pressed={on}
                      className={`relative overflow-hidden rounded-2xl border px-5 py-5 text-left transition-colors ${
                        on
                          ? "border-accent-b"
                          : "border-current/18 hover:border-current/45"
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="mode-fill"
                          className="absolute inset-0 bg-accent-b/12"
                          transition={{
                            duration: reduce ? 0 : 0.45,
                            ease: EASE,
                          }}
                        />
                      )}
                      <span className="display relative block text-2xl capitalize">
                        {m}
                      </span>
                      <span className="relative mt-1 block text-sm text-on-b-2">
                        {m === "delivery"
                          ? fee === 0
                            ? "Free to your door"
                            : `${rupees(fee)} to your door`
                          : "Collect from the counter"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step
              n="02"
              title={mode === "delivery" ? "Where to" : "Who is collecting"}
              urdu={mode === "delivery" ? "کہاں" : "کون لے گا"}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Name"
                  value={name}
                  onChange={setName}
                  error={
                    touched && missing.name
                      ? "We need a name for the order."
                      : undefined
                  }
                />
                <Field
                  label="Phone"
                  value={phone}
                  onChange={setPhone}
                  inputMode="tel"
                  placeholder="03xx xxxxxxx"
                  error={
                    touched && missing.phone
                      ? "A number the rider can call."
                      : undefined
                  }
                />
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {mode === "delivery" ? (
                  <motion.div
                    key="delivery"
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="mt-4 grid gap-4 sm:grid-cols-2"
                  >
                    <Field
                      label="Street and house"
                      value={street}
                      onChange={setStreet}
                      error={
                        touched && missing.street
                          ? "Enough for a rider to find it."
                          : undefined
                      }
                    />
                    <label className="block">
                      <span className="label block text-on-b-2">Area</span>
                      <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-current/20 bg-transparent px-4 py-3 outline-none transition-colors focus:border-accent-b"
                      >
                        {areas.map((a) => (
                          <option
                            key={a}
                            value={a}
                            className="bg-band-b text-on-b"
                          >
                            {a}
                          </option>
                        ))}
                      </select>
                    </label>
                  </motion.div>
                ) : (
                  <motion.div
                    key="collection"
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="mt-4 grid gap-3 sm:grid-cols-2"
                  >
                    {branches.map((b) => {
                      const on = branch === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setBranch(b.id)}
                          aria-pressed={on}
                          className={`rounded-2xl border px-5 py-4 text-left transition-colors ${
                            on
                              ? "border-accent-b"
                              : "border-current/18 hover:border-current/45"
                          }`}
                        >
                          <span className="display block text-xl">
                            {b.name}
                          </span>
                          <span className="arabic block text-base text-accent-b">
                            {b.urdu}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </Step>

            <Step n="03" title="When" urdu="کب">
              <div className="flex flex-wrap gap-2">
                {slots.map((s) => {
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
                          layoutId="slot-fill"
                          className="absolute inset-0 rounded-full bg-accent-b"
                          transition={{
                            duration: reduce ? 0 : 0.4,
                            ease: EASE,
                          }}
                        />
                      )}
                      <span
                        className={`relative ${on ? "text-band-b" : "text-on-b-2"}`}
                      >
                        {s}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="label mt-5 text-on-b-2">
                About {minutes} minutes from now, because the handi has to sit
                on dum.
              </p>
            </Step>

            <Step n="04" title="Payment" urdu="ادائیگی">
              <div className="grid gap-3 sm:grid-cols-3">
                {payments.map((p) => {
                  const on = payment === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPayment(p.id)}
                      aria-pressed={on}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-colors ${
                        on
                          ? "border-accent-b"
                          : "border-current/18 hover:border-current/45"
                      }`}
                    >
                      <span
                        className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                          on ? "border-accent-b" : "border-current/40"
                        }`}
                      >
                        <motion.span
                          className="block h-2 w-2 rounded-full bg-accent-b"
                          initial={false}
                          animate={{ scale: on ? 1 : 0 }}
                          transition={{
                            duration: reduce ? 0 : 0.25,
                            ease: EASE,
                          }}
                        />
                      </span>
                      <span className="text-sm">{p.label}</span>
                    </button>
                  );
                })}
              </div>
              <label className="mt-4 block">
                <span className="label block text-on-b-2">
                  Anything the kitchen should know
                </span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Gate code, allergies, how hot you really want it."
                  className="mt-2 w-full resize-none rounded-xl border border-current/20 bg-transparent px-4 py-3 outline-none transition-colors placeholder:text-on-b-2 focus:border-accent-b"
                />
              </label>
            </Step>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <Grow>
              <div className="card-depth rounded-[28px] border border-current/15 bg-band-a p-7 text-on-a">
                <Turn>
                  <Medallion size={44} className="text-orn-a" rings={false} />
                </Turn>
                <p className="label mt-4 text-accent-a">{lines.length} lines</p>
                <Rule className="mt-4 w-full text-current/20" />

                <ul className="mt-5 space-y-4">
                  {lines.map((l) => (
                    <li
                      key={l.key}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span className="min-w-0">
                        <span className="block truncate">
                          {l.quantity} × {l.dish.name}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-on-a-2">
                          {lineNote(
                            l.portion,
                            l.spice,
                            l.addOns,
                            l.dish.category === "Biryani",
                          )}
                        </span>
                      </span>
                      <span className="tabular shrink-0">
                        {rupees(l.unit * l.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-6 space-y-3 border-t border-current/15 pt-5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-on-a-2">Subtotal</dt>
                    <dd className="tabular">{rupees(total)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-on-a-2">
                      {mode === "delivery" ? "Delivery" : "Collection"}
                    </dt>
                    <dd className="tabular">
                      {fee === 0 ? "Free" : rupees(fee)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex items-baseline justify-between border-t border-current/15 pt-5">
                  <span className="display text-2xl">Total</span>
                  <span className="tabular display text-4xl">
                    {rupees(total + fee)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={place}
                  disabled={placing}
                  className="display mt-6 w-full rounded-full bg-accent-a px-7 py-4 text-xl text-band-a transition-transform duration-500 hover:scale-[1.03] disabled:opacity-70"
                >
                  {placing ? "Sealing…" : "Place the order"}
                </button>

                <AnimatePresence>
                  {touched && !valid && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="label mt-4 text-accent-a"
                    >
                      A few details are still missing.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </Grow>
          </aside>
        </div>
      </section>

      <Interlude tone="b" />

      <Statement
        tone="a"
        label="What happens next"
        text="The moment this is sent, a handi is filled and closed with a rope of dough. From then on the kitchen is working to a clock, and so are you."
        urdu="اس کے بعد ہانڈی بند"
      />

      <PageFoot />
    </>
  );
}

function Step({
  n,
  title,
  urdu,
  children,
}: {
  n: string;
  title: string;
  urdu: string;
  children: React.ReactNode;
}) {
  return (
    <Rise className="border-t border-current/15 py-10 first:border-t-0 first:pt-0">
      <div className="flex items-start gap-5">
        <Turn className="shrink-0">
          <Medallion size={40} className="text-orn-b" rings={false} />
        </Turn>
        <div className="min-w-0">
          <Wipe className="w-fit">
            <span className="label text-accent-b">Step {n}</span>
          </Wipe>
          <h2 className="display mt-1 text-[clamp(1.5rem,3vw,2.2rem)] font-light">
            {title}
          </h2>
          <WipeUp className="mt-1">
            <p className="arabic text-base text-orn-b">{urdu}</p>
          </WipeUp>
        </div>
      </div>
      <Rule className="mt-6 w-full text-current/20" />
      <div className="mt-7">{children}</div>
    </Rise>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  inputMode?: "text" | "tel";
}) {
  return (
    <label className="block">
      <span className="label block text-on-b-2">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        className={`mt-2 w-full rounded-xl border bg-transparent px-4 py-3 outline-none transition-colors placeholder:text-on-b-2 focus:border-accent-b ${
          error ? "border-accent-b" : "border-current/20"
        }`}
      />
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="label mt-2 block text-accent-b"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}
