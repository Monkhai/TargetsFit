import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const heavyHaptics = () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } else {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Haptics.selectionAsync();
  }
};

export const lightHaptics = () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } else {
    Haptics.selectionAsync();
  }
};
