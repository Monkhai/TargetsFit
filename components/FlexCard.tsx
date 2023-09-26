import { Dimensions, StyleSheet, ViewProps, useColorScheme } from 'react-native';
import React, { ReactNode } from 'react';
import Colors from '../constants/Colors';
import { View } from './Themed';
import { listItemHeight } from './ListItem';
import { dimensions } from '../constants/dimensions';

interface Props extends ViewProps {
  children: ReactNode;
  height: number;
}

const FlexCard = ({ children, height, style }: Props) => {
  const theme = useColorScheme();

  return (
    <View
      style={[
        { backgroundColor: Colors[theme ?? 'light'].background, height: listItemHeight * height },
        style,
        styles.card,
      ]}
    >
      {children}
    </View>
  );
};

export default FlexCard;

const styles = StyleSheet.create({
  card: {
    width: dimensions.width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { height: 10, width: 0 },
    shadowRadius: 10,
    overflow: 'hidden',
  },
});
