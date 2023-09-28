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
import { dimensions } from '../constants/dimensions';
import { listItemHeight } from './ListItem';

interface Props {
  children: ReactNode;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const HScrollView = ({ children, onScroll }: Props) => {
  return (
    <ScrollView
      scrollEventThrottle={16}
      onScroll={onScroll}
      horizontal
      snapToInterval={dimensions.width}
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: listItemHeight * 9,
  },
});
