import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

/** One place for haptic feedback, so the feel stays consistent across the app. */
export const haptic = {
  tap: () => enabled && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  select: () => enabled && Haptics.selectionAsync(),
  addToBag: () => enabled && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  success: () => enabled && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
};
