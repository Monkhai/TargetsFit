import React, { ReactNode, useState } from 'react';
import { StyleSheet, TouchableHighlight, TouchableOpacity, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import { listItemHeight, listItemWidth } from './ListItem';
import { Text, View } from './Themed';
import { heavyHaptics } from '../utilityFunctions/haptics';
import { Target } from '../db/db';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface Props {
  target: Target;
  onLongPress: (id: number) => void;
  renderRightActions?: () => ReactNode;
}

const BankListItem = ({ target, onLongPress, renderRightActions }: Props) => {
  const theme = useColorScheme();

  const handleLongPress = () => {
    heavyHaptics();
    onLongPress(target.id);
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableHighlight delayPressIn={200} onLongPress={handleLongPress}>
        <View style={[{ backgroundColor: Colors[theme ?? 'light'].background }, styles.container]}>
          <Text style={[styles.title, styles.text]}>{target.name}</Text>
          <Text style={styles.text}>{target.type}</Text>
          {target.quantity && <Text style={styles.text}>{target.quantity}</Text>}
        </View>
      </TouchableHighlight>
    </Swipeable>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: listItemHeight,
    width: listItemWidth,
    // marginVertical: 1,
    paddingHorizontal: 30,
  },
  text: {
    fontSize: 17,
  },
  title: {
    fontWeight: 'bold',
    color: 'red',
    minWidth: 190,
  },
});

export default BankListItem;
