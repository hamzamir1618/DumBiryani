import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { dishes } from '@/data/menu';
import { Duration, Ease, Radius, Space, Stagger, useTheme } from '@/theme';

/** Placeholder home screen. It exists to check the theme tokens and entrance motion on a real device. */
export default function HomeScreen() {
  const theme = useTheme();

  return (
    <Screen>
      <Animated.View entering={FadeInDown.duration(Duration.slow).easing(Ease.out)}>
        <Text variant="label" color="accent">
          Slow-cooked since dawn
        </Text>
        <Text variant="hero" style={styles.hero}>
          Dum{'\n'}Biryani
        </Text>
      </Animated.View>

      <View style={styles.list}>
        {dishes.map((dish, i) => (
          <Animated.View
            key={dish.id}
            entering={FadeInDown.delay(Duration.quick + i * Stagger)
              .duration(Duration.base)
              .easing(Ease.out)}>
            <Link href={{ pathname: '/dish/[id]', params: { id: dish.id } }} asChild>
              <PressableScale style={StyleSheet.flatten([styles.card, { backgroundColor: theme.surface }])}>
                <Text variant="heading">{dish.name}</Text>
                <Text variant="price" color="textMuted">
                  Rs {dish.price}
                </Text>
              </PressableScale>
            </Link>
          </Animated.View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { marginTop: Space.sm },
  list: { marginTop: Space.xxl, gap: Space.sm },
  card: { padding: Space.lg, borderRadius: Radius.md, gap: Space.xs },
});
