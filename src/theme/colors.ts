/**
 * Palette: "Saffron & Smoke" plus oxblood.
 * Warm near-blacks instead of pure black, and an ivory the colour of parchment instead of white.
 * Saffron is the only bright accent, used for the main action and for what is selected.
 * Oxblood is the brand maroon, used for grounds, sheets and colour blocks.
 * Ember is for glow and active fills only. At 2.8:1 on smoke, it is never used for text.
 */

const palette = {
  smoke950: '#110E0C',
  smoke900: '#1A1613',
  smoke800: '#26201C',
  smoke700: '#3A322C',
  ash500: '#8C8279',
  parchment50: '#FAF6EF',
  parchment100: '#F3EDE3',
  parchment200: '#E6DDCE',
  saffron500: '#E3A33C',
  saffron600: '#C98A26',
  oxblood950: '#2A0D10',
  oxblood700: '#6D1A1F',
  ember500: '#A3303A',
  leaf600: '#4F6B4A',
} as const;

export const Colors = {
  dark: {
    background: palette.smoke950,
    surface: palette.smoke900,
    surfaceRaised: palette.smoke800,
    border: palette.smoke700,
    text: palette.parchment100,
    textMuted: palette.ash500,
    accent: palette.saffron500,
    onAccent: palette.smoke950,
    brand: palette.oxblood700,
    brandDeep: palette.oxblood950,
    onBrand: palette.parchment100,
    glow: palette.ember500,
    danger: '#D4644A',
    success: '#7FA077',
  },
  light: {
    background: palette.parchment50,
    surface: palette.parchment100,
    surfaceRaised: '#FFFFFF',
    border: palette.parchment200,
    text: palette.smoke900,
    textMuted: '#6E655D',
    accent: palette.saffron600,
    onAccent: palette.smoke950,
    brand: palette.oxblood700,
    brandDeep: palette.oxblood950,
    onBrand: palette.parchment100,
    glow: palette.ember500,
    danger: '#9E2A1E',
    success: palette.leaf600,
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = { [K in keyof typeof Colors.dark]: string };
