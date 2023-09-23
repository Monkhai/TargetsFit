import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const HScrollView = ({ children, onScroll }: Props) => {
  const screenWidth = Dimensions.get('screen').width;

  return (
    <ScrollView
      scrollEventThrottle={16}
      onScroll={onScroll}
      horizontal
      snapToInterval={screenWidth}
      decelerationRate={'fast'}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {children}
    </ScrollView>
  );
};

export default HScrollView;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
