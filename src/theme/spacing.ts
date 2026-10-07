/** Spacing uses a 4pt base grid. Screens get 24pt side margins so the layout has room to breathe. */
export const Space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 72,
} as const;

export const Gutter = Space.lg;

export const Radius = {
  sm: 8,
  md: 16,
  lg: 28,
  pill: 999,
} as const;
