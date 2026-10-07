import type { CSSProperties, ReactNode } from "react";

/**
 * Scenes: the larger scroll set-pieces. Each is held in place while the page
 * moves past it, and each is driven by the browser's own view timeline rather
 * than by a scroll listener.
 */

/**
 * A paragraph lit one word at a time. Every word takes its own slice of the
 * section's passage, so the sentence reads itself as you come down to it.
 */
export function LitProse({
  text,
  className,
  dim = "rgba(255,255,255,0.18)",
  lit = "#ffffff",
  start = 14,
  step = 0.9,
  span = 26,
}: {
  text: string;
  className?: string;
  dim?: string;
  lit?: string;
  start?: number;
  step?: number;
  span?: number;
}) {
  const words = text.split(" ");
  return (
    <p
      className={className}
      style={{ "--word-dim": dim, "--word-lit": lit } as CSSProperties}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="s-word"
          style={
            {
              "--r-from": `entry ${start + i * step}%`,
              "--r-to": `cover ${start + span + i * step}%`,
            } as CSSProperties
          }
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

/**
 * A horizontal passage. The section is tall, the view inside it is pinned,
 * and the run of panels travels sideways across exactly that height — so
 * moving down the page moves you along the row, one for one.
 *
 * The height is derived from the width of the run rather than guessed, which
 * matters: guessing leaves a wide screen pinned on a row that has already
 * finished travelling, and the section reads as stuck.
 */
export function PinnedRun({
  children,
  count,
  className,
  label,
  panelVw = 36,
  panelMin = 270,
  gapVw = 2.4,
  padVw = 6,
}: {
  children: ReactNode;
  count: number;
  className?: string;
  label?: string;
  panelVw?: number;
  panelMin?: number;
  gapVw?: number;
  padVw?: number;
}) {
  const vars = {
    "--panel": `max(${panelMin}px, ${panelVw}vw)`,
    "--run-gap": `${gapVw}vw`,
    "--run-pad": `${padVw}vw`,
    // the run's own width, less one screen: exactly how far it has to travel
    height: `calc(100svh + (var(--panel) * ${count}) + (var(--run-gap) * ${count - 1}) + (var(--run-pad) * 2) - 100vw)`,
  } as CSSProperties;

  return (
    <section
      className={`scene relative ${className ?? ""}`}
      style={vars}
      aria-label={label}
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div
          className="scene-run flex w-max items-stretch"
          style={{ gap: "var(--run-gap)", paddingInline: "var(--run-pad)" }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

/** One panel in a pinned run, sized from the run's own measure. */
export function RunPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`flex shrink-0 flex-col ${className ?? ""}`}
      style={{ width: "var(--panel)" }}
    >
      {children}
    </article>
  );
}

/**
 * Cards that hold at the top of the window and let the next ride over them,
 * so the set gathers into a pile as you read rather than scrolling away.
 */
export function StackedCards({
  children,
  className,
  top = 14,
  step = 2.4,
}: {
  children: ReactNode[];
  className?: string;
  top?: number;
  step?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          className="stack-card"
          style={{ "--stack-top": `${top + i * step}vh` } as CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
