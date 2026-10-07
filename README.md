# Dum Biryani

Front end for Dum Biryani, a Pakistani biryani restaurant franchise.

Two things live in this repository:

| Path   | What it is | Status |
| ------ | ---------- | ------ |
| `web/` | The Next.js web app. **This is the live work.** | Active |
| `src/`, `assets/`, `app.json` | An Expo React Native app for the same brand. | Paused, incomplete |

Unless you were told otherwise, you want `web/`.

## Running the web app

```bash
cd web
npm install
npm run dev
```

Then open <http://localhost:3000>.

`npm run build` produces a production build, `npm run lint` runs ESLint.

## What is built

Seven screens, all sharing one design system:

- `/` — the landing page: a nine-chapter scroll story
- `/menu` — the full menu, filterable
- `/dish/[id]` — a single dish, with portion, spice and add-ons
- `/basket` — edit the order
- `/checkout` — delivery or collection, time slot, payment
- `/order/[id]` — order tracking
- `/locations` — the four branches, and table booking

Not built: customer accounts, order history, a staff area.

**This is a front end only.** There is no server, no payments and no
authentication. Orders are held in `localStorage` and the tracking page advances
on a timer rather than from a kitchen. The menu, prices and branches are fixed
data in `web/src/data/`.

## The design

A Persian direction: lapis and turquoise with saffron gold, ogee (onion) arches
as the recurring container shape, arabesque and girih background fields, paisley
motifs, and layered card depth. Light and dark are both first-class — the two
alternating bands swap colour, so the whole page inverts rather than tinting.

Type is Cormorant Garamond for display, Jost for interface, Amiri for Arabic
script with Noto Naskh behind it for Urdu-only letters, and Reem Kufi for the
دم wordmark.

## How the scroll animation works

The choreography runs on CSS scroll and view timelines rather than on a scroll
listener. This matters: a transform computed in a scroll handler keeps its frame
rate but trails the scroll by a frame or two, and that lag reads as stutter.

Browsers that lack those timelines — Firefox, at the time of writing — are
covered by `web/src/components/scroll-driver.tsx`, which drives the same
animations from JavaScript. Two details in it are load-bearing and are
documented in the file itself:

- Support is detected by **looking at what a real animation on the page
  actually got**, not by asking `CSS.supports`, which can answer yes and still
  not wire anything up. The *named* timeline that the pinned horizontal run
  depends on is checked separately from the anonymous ones, because a browser
  can support one and not the other.
- Each animation is held at its frame via `Animation.currentTime`. The usual
  negative `animation-delay` trick does not work on an animation that is already
  paused.

When changing anything scroll-driven, test in both paths. Forcing the fallback
is one line in the console:

```js
document.head.insertAdjacentHTML('beforeend',
  '<style>*,*::before,*::after{animation-timeline:auto !important}</style>')
```

## A note on performance

Clipping a subtree to a large rounded corner is expensive, and more so on an
element that moves with the scroll. A rounded *background* is cheap; a rounded
*clip* is not. The cards in the method section are built around this: the arch
is painted by the card, and the photograph inside is framed rather than bled
into the curve. Scaling large vector art re-rasterises it, so anything that
changes size is drawn at its final size and scaled down.

## Licence

See [LICENSE](LICENSE).
