# Dum Biryani

Front end for Dum Biryani, a Pakistani biryani restaurant franchise.

Two things live in this repository:

| Path   | What it is | Status |
| ------ | ---------- | ------ |
| `web/` | The web app. **This is the live work.** | Active |
| `src/`, `assets/`, `app.json` | An Expo React Native app for the same brand. | Paused, incomplete |

Unless you were told otherwise, you want `web/`.

## Running it

```bash
cd web
npm install
npm run dev
```

Then open <http://localhost:5180>.

`npm run build` type-checks and builds; it must pass with no errors.

Stack: React 18 + TypeScript + Vite, GSAP 3 (ScrollTrigger) via `@gsap/react`, and
Lenis for weighted scrolling. The same setup as the sibling projects in
`../KOI`, `../GRUFF` and `../STACC-Deli`.

## The landing page

The page is the forty-five minutes. A biryani is sealed into its pot with a rope
of dough and nobody opens it until it is at the table, so the page withholds the
food: a clock runs as you scroll, the pot stays shut the whole way down, and at
45:00 the seal breaks and every photograph arrives at once.

One number drives all of it. `src/sections/Dial.tsx` owns a single ScrollTrigger
spanning the seal to the break and publishes minutes elapsed; every other section
subscribes through `watchMinutes()` in `src/lib/dum.ts`. No section owns a scroll
position of its own, which is what keeps it one machine rather than a stack of
separate effects.

In page order: **Seal** (00:00, the lid seen from above, cracking) → **Clock**
(the long middle) → **Strata** (the five layers, named) → **Pressure** (the last
five minutes) → **Break** (45:00, the food) → **Table** (rooms and the way out).

`Dial` mounts **last** and uses `refreshPriority: -1`: every pinned section adds
a spacer to the page, so measuring before them makes the clock run out a third
of the way down.

## Screens

`/` plus menu, dish, method, visit, order and a confirmation, behind a hash
router in `src/lib/views.tsx`. One transition only — the lid closes over the
page and opens on the next one — because the site has one idea.

Not built: customer accounts, order history, a staff area.

**This is a front end only.** No server, no payments, no authentication. The
basket lives in `localStorage` and the menu, prices and branches are fixed data
in `src/data/`.

## Ornament and colour

Every piece of ornament is an **alpha mask with no colour in it**. The page
paints it with `mask-image` and a palette token, so the same motif can be two
colours in two places and the whole palette changes from one file.

- `design/source-art/` — the original generated art, flat ink on black
- `design/make_assets.py` — turns it into the masks in `web/public/img/`
- `src/data/art.ts` — maps each slot to a file
- `src/components/Orn.tsx`, `src/components/Band.tsx` — paint them

Run `python design/make_assets.py` after changing any source art. It crops the
border strip to its ink so it tiles thin, and cuts the carpet into three
concentric planes for the parallax.

The girih lattice is **constructed in code**, not generated: image models cannot
hold true compass-and-straightedge geometry.

### The palette

`src/styles/tokens.css`. The dyes a Persian carpet is actually made from —
madder root, indigo vat, undyed wool, walnut husk — with the indigo taken nearly
to the bottom of the vat so the ground is almost out of blue.

Two rules, both learned the hard way:

- **Keep colours out of 30–100° of hue.** Only `--larkspur` sits there, and it
  appears five times in the whole site because it means one thing: heat and
  elapsed time. When nine of fourteen tokens were in that band the page read as
  uniformly yellow no matter how the accents were trimmed.
- **Warmth comes from the red side.** Dough, walnut and madder all sit near 10–26°,
  so the warm family is coherent rather than drifting towards khaki.

**No gradients anywhere**, including canvas. Flat hex only.

## Pitfalls already hit

- **Nothing rotates, folds or skews on scroll.** Movement, fade, uniform scale
  and clip reveals only.
- Never use `.from()` in a timeline with `invalidateOnRefresh`; the refresh
  re-records the hidden start as the end state. Use `fromTo`.
- Keep the space *between* the `.word` blocks of a split title, never inside
  one, or the browser drops it and the words run together.
- A drifting `Band` needs far more overhang than its travel, or its own edge
  comes into view at the end of the drift.
- Class names collide across stylesheets: the story page's `.st-*` once
  overrode the strata section's and silently changed its colours. Prefix.
- No `StrictMode`: double-mounted effects replay the one-shot choreography.

## Testing

No test suite. Build, run the dev server, and drive it with `playwright-core`.
`window.lenis`, `window.ScrollTrigger`, `window.gsap` and `window.elapsed()` are
exposed in dev. Check desktop 1440×900, phone 390×844 and
`prefers-reduced-motion: reduce`.

When measuring contrast, note that Firefox serialises `color-mix()` as
`color(srgb 0.91 0.89 0.86 / 0.68)` with **0–1 floats** while `rgb()` uses
0–255. Reading one as the other turns every semi-transparent colour into
near-black and invents failures that are not there.

## Licence

See [LICENSE](LICENSE).
