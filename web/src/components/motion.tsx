import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Scroll choreography.
 *
 * Nearly all of it is a class plus a range, handed to the browser's own view
 * timeline. That keeps these as server components, costs no JavaScript, and —
 * the reason it matters — means the animation cannot fall behind the scroll
 * the way a transform computed in a scroll listener does.
 */

type Range = { from?: string; to?: string };

const range = ({ from, to }: Range): CSSProperties =>
  ({
    "--r-from": from,
    "--r-to": to,
  }) as CSSProperties;

/** Rises and fades in as it crosses the fold. */
export function Rise({
  children,
  className,
  as: Tag = "div",
  from = "entry 4%",
  to = "cover 36%",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  from?: string;
  to?: string;
}) {
  return (
    <Tag className={`s-rise ${className ?? ""}`} style={range({ from, to })}>
      {children}
    </Tag>
  );
}

/**
 * The same arrival, but each letter has its own slice of the scroll, so the
 * word assembles itself as you read down to it rather than on a timer.
 */
export function Chars({
  children,
  className,
  step = 1.6,
  start = 4,
  span = 30,
}: {
  children: string;
  className?: string;
  step?: number;
  start?: number;
  span?: number;
}) {
  return (
    <span className={`inline-block ${className ?? ""}`} aria-label={children}>
      {children.split("").map((char, i) => (
        <span
          key={`${i}-${char}`}
          aria-hidden
          className="s-rise inline-block"
          style={range({
            from: `entry ${start + i * step}%`,
            to: `cover ${start + span + i * step}%`,
          })}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}

/** A photograph settling into its frame as the frame crosses the window. */
export function Settle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`s-settle ${className ?? ""}`}>{children}</div>;
}

/** Two planes at different rates, so a group of cards has real depth. */
export function Depth({
  children,
  plane = "near",
  className,
}: {
  children: ReactNode;
  plane?: "near" | "far";
  className?: string;
}) {
  return (
    <div
      className={`${plane === "near" ? "s-near" : "s-far"} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/** A panel cut open as an arch and widening into its frame. */
export function ArchReveal({
  children,
  className,
  from = "entry 8%",
  to = "cover 48%",
}: {
  children: ReactNode;
  className?: string;
  from?: string;
  to?: string;
}) {
  return (
    <div className={`s-arch ${className ?? ""}`} style={range({ from, to })}>
      {children}
    </div>
  );
}

/** Unveiled from its left edge: labels, rules, small headings. */
export function Wipe({
  children,
  className,
  as: Tag = "div",
  from = "entry 6%",
  to = "cover 34%",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  from?: string;
  to?: string;
}) {
  return (
    <Tag className={`s-wipe ${className ?? ""}`} style={range({ from, to })}>
      {children}
    </Tag>
  );
}

/** A line of type pushed up out of its own box. */
export function WipeUp({
  children,
  className,
  as: Tag = "div",
  from = "entry 4%",
  to = "cover 34%",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  from?: string;
  to?: string;
}) {
  return (
    <Tag className={`s-wipe-up ${className ?? ""}`} style={range({ from, to })}>
      {children}
    </Tag>
  );
}

/** A hairline drawn out from its centre. */
export function Rule({
  className,
  from = "entry 10%",
  to = "cover 42%",
}: {
  className?: string;
  from?: string;
  to?: string;
}) {
  return (
    <span
      aria-hidden
      className={`s-rule block h-px origin-center bg-current ${className ?? ""}`}
      style={range({ from, to })}
    />
  );
}

/** Ornament turning into place. */
export function Turn({
  children,
  className,
  from = "entry 4%",
  to = "cover 40%",
}: {
  children: ReactNode;
  className?: string;
  from?: string;
  to?: string;
}) {
  return (
    <div className={`s-turn ${className ?? ""}`} style={range({ from, to })}>
      {children}
    </div>
  );
}

/** A photograph panned and pulled back inside its frame. */
export function Pan({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`s-pan ${className ?? ""}`}>{children}</div>;
}

/** A panel opening out. */
export function Grow({
  children,
  className,
  from = "entry 6%",
  to = "cover 40%",
}: {
  children: ReactNode;
  className?: string;
  from?: string;
  to?: string;
}) {
  return (
    <div className={`s-grow ${className ?? ""}`} style={range({ from, to })}>
      {children}
    </div>
  );
}
