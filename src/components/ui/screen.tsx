import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Gutter, Space, useTheme } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
};

export function Screen({ children, scroll = true }: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const padding = { paddingTop: insets.top + Space.lg, paddingHorizontal: Gutter };

  if (!scroll) {
    return <View style={[styles.fill, padding, { backgroundColor: theme.background }]}>{children}</View>;
  }

  return (
    <ScrollView
      style={[styles.fill, { backgroundColor: theme.background }]}
      contentContainerStyle={[padding, { paddingBottom: Space.xxxl }]}
      contentInsetAdjustmentBehavior="never">
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
