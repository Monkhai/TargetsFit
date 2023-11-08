import { Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Colors from './Colors';
import { useCallback } from 'react';
import { SCREEN_WIDTH } from './SIZES';

export const firstUseStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
    paddingTop: 100,
    paddingBottom: 50,
  },
  containerWithPadding: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 200,
    gap: 50,
  },
  activeNextButton: {
    opacity: 0.5,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.accent,
    borderRadius: 12,
  },
  inactiveButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.accent,
    borderRadius: 12,
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 80,
  },
  nextButtonText: {
    fontSize: 17,
    color: 'white',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  subheader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  body: {
    fontSize: 17,
    marginTop: 45,
    paddingHorizontal: 15,
    textAlign: 'center',
  },
  animatedVideoContainer: {
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  videoContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
});

export const pressableStyle = (isPressed: boolean): StyleProp<ViewStyle> => {
  if (isPressed) {
    return firstUseStyles.activeNextButton;
  }
  return firstUseStyles.inactiveButton;
};
