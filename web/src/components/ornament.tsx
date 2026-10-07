import type { CSSProperties, ReactNode } from "react";

/**
 * Persian ornament: the ogee arch, shamsa medallions, arabesque ribbon work,
 * boteh and the border bands that run between fields.
 *
 * Everything here draws in `currentColor` with an optional second colour for
 * the gilding. Ornament therefore inherits the colour of whatever it sits in,
 * which is the only reliable way to stop it looking like it was coloured for
 * somewhere else and moved.
 */

const GOLD = "var(--color-saffron)";

/** Points of an n-pointed star, as an SVG polygon string. */
export function starPoints(
  points: number,
  outer: number,
  inner: number,
  cx = 50,
  cy = 50,
) {
  const step = Math.PI / points;
  const out: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = i * step - Math.PI / 2;
    out.push(
      `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`,
    );
  }
  return out.join(" ");
}

/**
 * The onion arch, cut once and referenced everywhere. Concave shoulders
 * rising to a point — the ogee, not the plain dome.
 */
export function ArchDefs() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      className="absolute"
      focusable="false"
    >
      <defs>
        <clipPath id="ogee-arch" clipPathUnits="objectBoundingBox">
          <path
            d="M0,1 L0,0.58 C0,0.42 0.10,0.33 0.24,0.25 C0.36,0.18 0.46,0.10 0.5,0
               C0.54,0.10 0.64,0.18 0.76,0.25 C0.90,0.33 1,0.42 1,0.58 L1,1 Z"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

/**
 * A panel cut as an arch, with a gilded inner edge and the suggestion of
 * further panels stacked behind it.
 */
export function ArchPanel({
  children,
  className,
  frame = "currentColor",
  thickness = 3,
  stack = true,
}: {
  children: ReactNode;
  className?: string;
  frame?: string;
  thickness?: number;
  stack?: boolean;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      {stack && (
        <>
          <span
            aria-hidden
            className="ogee absolute inset-0 -z-10 translate-x-2 translate-y-2 scale-[0.99] opacity-20"
            style={{ background: frame }}
          />
          <span
            aria-hidden
            className="ogee absolute inset-0 -z-20 translate-x-4 translate-y-4 scale-[0.98] opacity-10"
            style={{ background: frame }}
          />
        </>
      )}
      <div
        className="ogee card-depth"
        style={{ background: frame, padding: thickness }}
      >
        <div
          className="ogee relative overflow-hidden"
          style={{ background: "var(--page)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** A shamsa: the star medallion at the centre of a dome or a carpet field. */
export function Medallion({
  size = 120,
  className,
  accent = GOLD,
  rings = true,
}: {
  size?: number;
  className?: string;
  accent?: string;
  rings?: boolean;
}) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      <polygon
        points={starPoints(16, 48, 33)}
        stroke="currentColor"
        strokeWidth="0.7"
      />
      {rings && (
        <circle
          cx="50"
          cy="50"
          r="36"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.6"
        />
      )}
      <polygon
        points={starPoints(8, 30, 17)}
        stroke={accent}
        strokeWidth="1"
        transform="rotate(22.5 50 50)"
      />
      <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.8" />
      {Array.from({ length: 8 }, (_, i) => (
        <circle
          key={i}
          cx="50"
          cy="27"
          r="2.2"
          fill={accent}
          transform={`rotate(${45 * i} 50 50)`}
        />
      ))}
      <polygon points={starPoints(8, 9, 4)} fill={accent} />
    </svg>
  );
}

/** Boteh: the seed-and-flame figure the West calls paisley. */
export function Boteh({
  size = 72,
  className,
  accent = GOLD,
  tilt = 0,
}: {
  size?: number;
  className?: string;
  accent?: string;
  tilt?: number;
}) {
  const shape =
    "M62 8 C82 20 90 48 79 70 C69 90 43 99 25 88 C8 78 2 56 13 42 C23 29 44 29 49 43 C53 55 45 64 36 60";

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <path
        d={shape}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d={shape}
        stroke={accent}
        strokeWidth="1.4"
        strokeLinecap="round"
        transform="translate(50 50) scale(0.62) translate(-50 -50)"
      />
      <circle cx="56" cy="34" r="2.6" fill={accent} />
      <circle cx="44" cy="72" r="2" fill="currentColor" />
    </svg>
  );
}

/**
 * A ribbon of arabesque: interlacing stems that meet, cross and throw off
 * leaves. Given `draw`, the stems ink themselves in as the band is passed.
 */
export function ArabesqueRibbon({
  className,
  style,
  height = 92,
  accent = GOLD,
  draw = false,
  repeats = 10,
}: {
  className?: string;
  style?: CSSProperties;
  height?: number;
  accent?: string;
  draw?: boolean;
  repeats?: number;
}) {
  // One module of the ribbon, repeated across the width.
  const w = 200;
  const stemA = `M0,50 C25,8 75,8 100,50 C125,92 175,92 200,50`;
  const stemB = `M0,50 C25,92 75,92 100,50 C125,8 175,8 200,50`;
  const leaves = [
    "M100,50 C112,38 126,40 130,52 C120,58 106,58 100,50 Z",
    "M100,50 C88,62 74,60 70,48 C80,42 94,42 100,50 Z",
  ];

  return (
    <div
      aria-hidden
      className={`overflow-hidden ${className ?? ""}`}
      style={{ height, color: "inherit", ...style }}
    >
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${w * repeats} 100`}
        preserveAspectRatio="none"
        fill="none"
      >
        <g
          className={draw ? "s-draw" : undefined}
          style={
            draw
              ? ({ "--draw-length": 2600 } as React.CSSProperties)
              : undefined
          }
          strokeDasharray={draw ? 2600 : undefined}
        >
          {Array.from({ length: repeats }, (_, i) => (
            <g key={i} transform={`translate(${i * w} 0)`}>
              <path d={stemA} stroke="currentColor" strokeWidth="0.9" />
              <path d={stemB} stroke={accent} strokeWidth="0.8" opacity="0.8" />
              {leaves.map((d, j) => (
                <path
                  key={j}
                  d={d}
                  fill={j === 0 ? accent : "currentColor"}
                  opacity="0.4"
                />
              ))}
              <circle cx="100" cy="50" r="2.6" fill={accent} />
              <circle
                cx="0"
                cy="50"
                r="1.8"
                fill="currentColor"
                opacity="0.6"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

/** A running border of linked lozenges and stars, the guard round a field. */
export function BorderBand({
  className,
  height = 26,
  accent = GOLD,
  count = 34,
}: {
  className?: string;
  height?: number;
  accent?: string;
  count?: number;
}) {
  return (
    <div
      aria-hidden
      className={`flex w-full items-center justify-between overflow-hidden ${className ?? ""}`}
      style={{ height }}
    >
      {Array.from({ length: count }, (_, i) => (
        <svg
          key={i}
          width={height * 0.76}
          height={height * 0.76}
          viewBox="0 0 100 100"
          className="shrink-0"
          fill="none"
        >
          {i % 2 === 0 ? (
            <polygon
              points={starPoints(8, 46, 20)}
              fill={accent}
              opacity="0.9"
            />
          ) : (
            <polygon
              points="50,14 86,50 50,86 14,50"
              stroke="currentColor"
              strokeWidth="7"
            />
          )}
        </svg>
      ))}
    </div>
  );
}

/** A quarter medallion, for the corner of a band. */
export function Spandrel({
  size = 220,
  corner = "tl",
  className,
  accent = GOLD,
  star = true,
}: {
  size?: number;
  corner?: "tl" | "tr" | "bl" | "br";
  className?: string;
  accent?: string;
  /** The filled star at the corner's heart. Off where it would land on the
      masthead: it is the same gold as the wordmark and swallows it whole. */
  star?: boolean;
}) {
  const rotate = { tl: 0, tr: 90, br: 180, bl: 270 }[corner];
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M0 0 H100 A100 100 0 0 0 0 100 Z"
        fill="currentColor"
        opacity="0.08"
      />
      <path
        d="M0 0 H74 A74 74 0 0 0 0 74 Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.45"
      />
      <path
        d="M0 0 H50 A50 50 0 0 0 0 50 Z"
        stroke={accent}
        strokeWidth="0.9"
        opacity="0.7"
      />
      {star && (
        <polygon
          points={starPoints(8, 13, 6, 24, 24)}
          fill={accent}
          opacity="0.9"
        />
      )}
    </svg>
  );
}

/**
 * The medallion at the centre of the field, which blooms across the whole
 * document on the browser's own scroll timeline.
 */
export function FieldMedallion({
  className,
  opacity = 0.16,
  accent = GOLD,
}: {
  className?: string;
  opacity?: number;
  accent?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 grid place-items-center overflow-hidden ${className ?? ""}`}
      style={{ opacity, contain: "paint" }}
    >
      <div className="s-bloom">
        <svg width="720" height="720" viewBox="0 0 200 200" fill="none">
          <g className="s-ring" style={{ transformOrigin: "100px 100px" }}>
            <polygon
              points={starPoints(16, 94, 72, 100, 100)}
              stroke="currentColor"
              strokeWidth="0.7"
            />
            <circle
              cx="100"
              cy="100"
              r="70"
              stroke="currentColor"
              strokeWidth="0.6"
            />
          </g>
          <g className="s-ring-back" style={{ transformOrigin: "100px 100px" }}>
            <polygon
              points={starPoints(12, 58, 42, 100, 100)}
              stroke={accent}
              strokeWidth="0.9"
            />
            {Array.from({ length: 12 }, (_, i) => (
              <rect
                key={i}
                x="96.5"
                y="26"
                width="7"
                height="7"
                stroke="currentColor"
                strokeWidth="0.6"
                transform={`rotate(${i * 30} 100 100) rotate(45 100 29.5)`}
              />
            ))}
          </g>
          <polygon
            points={starPoints(8, 29, 14, 100, 100)}
            stroke={accent}
            strokeWidth="0.9"
          />
          <circle
            cx="100"
            cy="100"
            r="10"
            stroke="currentColor"
            strokeWidth="0.8"
          />
          <polygon points={starPoints(8, 7, 3, 100, 100)} fill={accent} />
        </svg>
      </div>
    </div>
  );
}
