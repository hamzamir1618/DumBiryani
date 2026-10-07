import { useColorScheme } from 'react-native';

import { Colors, type ThemeColors } from './colors';

export * from './colors';
export * from './motion';
export * from './spacing';
export * from './typography';

/** The app defaults to dark ("Smoke"). Light ("Parchment") is used when the device asks for it. */
export function useTheme(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === 'light' ? Colors.light : Colors.dark;
}
