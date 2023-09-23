import { Dimensions, StyleSheet, ViewProps, useColorScheme } from 'react-native';
import React, { ReactNode } from 'react';
import Colors from '../constants/Colors';
import { View } from './Themed';

interface Props extends ViewProps {
  children: ReactNode;
}

const FlexCard = ({ children, style }: Props) => {
  const theme = useColorScheme();

  return (
    <View style={[{ backgroundColor: Colors[theme ?? 'light'].background }, style, styles.card]}>
      {children}
    </View>
  );
};

export default FlexCard;

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('screen').width * 0.9,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { height: 10, width: 0 },
    shadowRadius: 20,
  },
});
