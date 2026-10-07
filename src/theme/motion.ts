import { Easing } from 'react-native-reanimated';

/**
 * Motion principle: slow to reveal, quick to respond, like lifting the lid on a dum pot.
 * Touch feedback is fast. Content arrives with a soft, eased entrance.
 */
export const Duration = {
  instant: 120,
  quick: 220,
  base: 420,
  slow: 700,
  reveal: 1100,
} as const;

export const Ease = {
  /** Default ease-out for things entering the screen. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Ease-in-out for things moving within the screen. */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
} as const;

export const Spring = {
  /** Press feedback and toggles. */
  snappy: { damping: 20, stiffness: 320, mass: 0.8 },
  /** Sheets, cards, and shared image moves. */
  gentle: { damping: 24, stiffness: 160, mass: 1 },
} as const;

/** Delay between items in a staggered list entrance. */
export const Stagger = 60;
