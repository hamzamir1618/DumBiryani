import { Pressable, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { haptic } from '@/lib/haptics';
import { Spring } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressableScaleProps = PressableProps & {
  /** How far the element shrinks while pressed. */
  pressedScale?: number;
  withHaptic?: boolean;
};

/** A button that shrinks slightly when pressed, springs back, and gives a light haptic tap. */
export function PressableScale({
  pressedScale = 0.97,
  withHaptic = true,
  onPressIn,
  onPressOut,
  onPress,
  style,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      {...rest}
      style={[animatedStyle, style as object]}
      onPressIn={(e) => {
        scale.value = withSpring(pressedScale, Spring.snappy);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, Spring.snappy);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (withHaptic) haptic.tap();
        onPress?.(e);
      }}
    />
  );
}
