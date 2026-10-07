import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = useTheme();
  const isLight = scheme === 'light';

  // TODO: load the brand fonts with useFonts, and hide the splash only after they are ready.
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const base = isLight ? DefaultTheme : DarkTheme;
  const navTheme = {
    ...base,
    colors: { ...base.colors, background: theme.background, card: theme.surface, text: theme.text, primary: theme.accent },
  };

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={isLight ? 'dark' : 'light'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="dish/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
