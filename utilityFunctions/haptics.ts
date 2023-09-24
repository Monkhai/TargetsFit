import * as Haptics from 'expo-haptics';

export const heavyHaptics = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

export const lightHaptics = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};
