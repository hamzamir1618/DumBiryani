import type { ReactNode } from "react";
import { Photo } from "@/components/chrome";
import {
  Chars,
  Grow,
  Pan,
  Rise,
  Rule,
  Turn,
  Wipe,
  WipeUp,
} from "@/components/motion";
import { LitProse } from "@/components/scenes";
import {
  ArabesqueRibbon,
  BorderBand,
  Boteh,
  FieldMedallion,
  Medallion,
  Spandrel,
} from "@/components/ornament";

/**
 * The pieces every inner page is built from, so the screens stay of a piece
 * with the landing page without each one re-inventing the furniture.
 */

/** The header band an inner page opens with: ornament, label, title, Urdu. */
export function PageHead({
  label,
  title,
  urdu,
  lead,
  photo,
  children,
}: {
  label: string;
  title: string;
  urdu: string;
  lead?: string;
  photo?: string;
  children?: ReactNode;
}) {
  if (photo) {
    return (
      <section className="on-photo relative flex min-h-[64svh] flex-col justify-end overflow-hidden bg-night px-5 pt-28 pb-28 sm:px-8">
        <div className="absolute inset-0">
          <Photo
            src={photo}
            alt=""
            fill
            priority
            sizes="100vw"
            className="drift object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/35" />
        </div>
        <div className="field-arabesque field-fade pointer-events-none absolute inset-0 text-turquoise" />
        <FieldMedallion className="text-turquoise" opacity={0.2} />

        <div className="relative z-10 mx-auto w-full max-w-[1280px]">
          <Wipe className="w-fit">
            <p className="label text-saffron-light">{label}</p>
          </Wipe>
          <h1 className="display mt-4 text-[clamp(2.6rem,8vw,6rem)] font-light">
            <Chars>{title}</Chars>
          </h1>
          <WipeUp className="mt-2">
            <p className="arabic text-[clamp(1.2rem,3vw,1.9rem)] text-turquoise-light">
              {urdu}
            </p>
          </WipeUp>
          {lead && (
            <Rise className="mt-5">
              <p className="max-w-[52ch] text-white/75">{lead}</p>
            </Rise>
          )}
          {children}
        </div>
        <ArabesqueRibbon
          className="absolute inset-x-0 bottom-0 z-10 text-turquoise/40"
          height={54}
        />
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-band-a px-5 pt-16 pb-12 text-on-a sm:px-8 sm:pt-20">
      <div className="field-girih field-fade pointer-events-none absolute inset-0 text-orn-a" />
      <Spandrel
        corner="tr"
        className="hidden md:block absolute top-0 right-0 text-orn-a"
        size={200}
      />
      <div className="relative mx-auto w-full max-w-[1280px]">
        <Medallion size={44} className="text-orn-a" rings={false} />
        <Wipe className="mt-5 w-fit">
          <p className="label text-accent-a">{label}</p>
        </Wipe>
        <h1 className="display mt-3 text-[clamp(2.4rem,7vw,5rem)] font-light">
          <Chars>{title}</Chars>
        </h1>
        <WipeUp className="mt-2">
          <p className="arabic text-[clamp(1.2rem,3vw,1.8rem)] text-orn-a">
            {urdu}
          </p>
        </WipeUp>
        <Rule className="mt-7 w-40 text-accent-a" />
        {lead && (
          <Rise className="mt-5">
            <p className="max-w-[52ch] text-on-a-2">{lead}</p>
          </Rise>
        )}
        {children}
      </div>
    </section>
  );
}

/**
 * A band of prose lit one word at a time as it passes. The inner pages use it
 * the way the landing page does: to break a long screen with something that
 * only happens because you are scrolling.
 */
export function Statement({
  text,
  urdu,
  label,
  tone = "b",
}: {
  text: string;
  urdu?: string;
  label?: string;
  tone?: "a" | "b";
}) {
  const on = tone === "a" ? "a" : "b";
  return (
    <section
      className={`relative overflow-hidden px-5 py-28 sm:px-8 sm:py-36 ${
        tone === "a" ? "bg-band-a text-on-a" : "bg-band-b text-on-b"
      }`}
    >
      <div
        className={`field-arabesque field-fade pointer-events-none absolute inset-0 ${
          tone === "a" ? "text-orn-a" : "text-orn-b"
        }`}
      />
      <FieldMedallion
        className={tone === "a" ? "text-orn-a" : "text-orn-b"}
        opacity={0.16}
      />
      <Boteh
        size={130}
        className={`s-counter absolute top-[14%] right-[4%] hidden lg:block ${
          tone === "a" ? "text-orn-a/25" : "text-orn-b/25"
        }`}
        tilt={22}
      />

      <div className="relative mx-auto max-w-[1280px]">
        <Turn>
          <Medallion
            size={54}
            className={tone === "a" ? "text-orn-a" : "text-orn-b"}
          />
        </Turn>
        {label && (
          <Wipe className="mt-7 w-fit">
            <p
              className={`label ${tone === "a" ? "text-accent-a" : "text-accent-b"}`}
            >
              {label}
            </p>
          </Wipe>
        )}
        <LitProse
          text={text}
          className="display mt-6 max-w-[24ch] text-[clamp(1.7rem,4.4vw,3.6rem)] leading-[1.14] font-light"
          dim={`color-mix(in srgb, var(--on-${on}) 16%, transparent)`}
          lit={`var(--on-${on})`}
        />
        {urdu && (
          <WipeUp className="mt-7">
            <p
              className={`arabic text-[clamp(1.2rem,3vw,2rem)] ${
                tone === "a" ? "text-orn-a" : "text-orn-b"
              }`}
            >
              {urdu}
            </p>
          </WipeUp>
        )}
        <Rule
          className={`mt-12 w-full ${tone === "a" ? "text-accent-a" : "text-accent-b"}`}
        />
      </div>
    </section>
  );
}

/** A ruled ornament band that slides as it passes, between two sections. */
export function Interlude({ tone = "b" }: { tone?: "a" | "b" }) {
  return (
    <div
      className={`overflow-hidden ${tone === "a" ? "bg-band-a" : "bg-band-b"}`}
    >
      <BorderBand
        className={`s-band ${tone === "a" ? "text-orn-a" : "text-orn-b"}`}
        height={28}
      />
    </div>
  );
}

/** A photograph under an arch, panning gently as it crosses the window. */
export function ArchPhoto({
  src,
  alt,
  sizes,
  aspect = "aspect-[3/4]",
  priority,
}: {
  src: string;
  alt: string;
  sizes: string;
  aspect?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${aspect}`}>
      <Pan className="absolute inset-0">
        <Photo
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </Pan>
    </div>
  );
}

/** A bordered panel in the page's own idiom. */
export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Grow>
      <div
        className={`card-depth rounded-[28px] border border-current/15 ${className ?? ""}`}
      >
        {children}
      </div>
    </Grow>
  );
}

/** The closing band every inner page ends on. */
export function PageFoot() {
  return (
    <footer className="relative overflow-hidden bg-band-a px-5 py-16 text-on-a sm:px-8">
      <div className="field-arabesque field-fade pointer-events-none absolute inset-0 text-orn-a" />
      <div className="relative mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-8">
        <div>
          <span className="kufi block text-[34px] leading-none text-accent-a">
            دم
          </span>
          <span className="display mt-1 block text-2xl">Biryani</span>
        </div>
        <p className="label text-on-a-2">
          Clifton · DHA Phase 6 · MM Alam Road · F-7 Markaz
        </p>
      </div>
      <ArabesqueRibbon className="mt-10 text-orn-a/40" height={48} />
    </footer>
  );
}
