import React, { ReactNode, useState } from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { listItemHeight, listItemWidth } from './ListItem';
import { Text, View } from './Themed';
import { heavyHaptics } from '../utilityFunctions/haptics';
import { Target } from '../db/db';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
      <TouchableOpacity onLongPress={handleLongPress}>
        <View style={[{ backgroundColor: Colors[theme ?? 'light'].background }, styles.container]}>
          <Text style={[styles.title, styles.text]}>{target.name}</Text>
          <Text style={styles.text}>{target.type}</Text>
          {target.quantity && <Text style={styles.text}>{target.quantity}</Text>}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: listItemHeight,
    paddingHorizontal: 30,
    width: listItemWidth,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  detailsContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
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
