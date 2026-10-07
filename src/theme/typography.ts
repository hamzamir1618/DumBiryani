import { Platform, type TextStyle } from 'react-native';

/**
 * Draft type pairing: a serif for display text and a neutral sans for the interface.
 * These use system fonts until we pick the brand faces.
 * After that, point `Fonts` at the loaded family names (see app.json `expo-font` plugin).
 */
export const Fonts = {
  display: Platform.select({ ios: 'ui-serif', default: 'serif' }),
  sans: Platform.select({ ios: 'system-ui', default: 'sans-serif' }),
  mono: Platform.select({ ios: 'ui-monospace', default: 'monospace' }),
};

/** Sizes follow a ratio of about 1.25. Display sizes use tight line-height; body sizes stay easy to read. */
export const Type = {
  hero: { fontFamily: Fonts.display, fontSize: 56, lineHeight: 56, letterSpacing: -1.2 },
  title: { fontFamily: Fonts.display, fontSize: 36, lineHeight: 40, letterSpacing: -0.6 },
  heading: { fontFamily: Fonts.display, fontSize: 24, lineHeight: 30, letterSpacing: -0.2 },
  body: { fontFamily: Fonts.sans, fontSize: 16, lineHeight: 24 },
  bodySmall: { fontFamily: Fonts.sans, fontSize: 14, lineHeight: 20 },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  price: { fontFamily: Fonts.sans, fontSize: 16, lineHeight: 20, fontVariant: ['tabular-nums'] },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof Type;
