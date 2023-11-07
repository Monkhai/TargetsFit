import { Platform, StyleSheet } from 'react-native';
import Colors from './Colors';

export const firstUseStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
    paddingTop: 100,
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
  },
});
