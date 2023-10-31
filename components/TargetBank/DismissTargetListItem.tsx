import { ColorSchemeName, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { LIST_ITEM_HEIGHT, LIST_ITEM_WIDTH } from '../../constants/SIZES';
import { ActiveTargetQuantity, Day, Target, TargetInWeeklyTargets } from '../../db/db';
import Colors from '../../constants/Colors';
import { Text } from '../Themed';
import { FontAwesome } from '@expo/vector-icons';

type SortedTargets = {
  day: Day;
  target: { targetId: number; targetTbId: number; targetPosition: number };
  quantity: number;
};

interface Props {
  colorScheme: ColorSchemeName;
  item: SortedTargets;
}

const DismissTargetListItem = ({ item, colorScheme }: Props) => {
  return (
    <View style={styles.listItemContainer}>
      <Text style={[styles.listItemText, { fontWeight: '700', color: 'red' }]}>{item.day.name}</Text>
      <Text style={[styles.listItemText, { textAlign: 'right', flex: 1, paddingHorizontal: 20 }]}>{item.quantity}</Text>
      <View style={[styles.buttonContainer, { backgroundColor: Colors[colorScheme ?? 'light'].tertiary }]}>
        <TouchableOpacity onPress={() => ''}>
          <View style={[styles.addButtonContainer]}>
            <Text style={styles.addButton}>+</Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.separator, { borderColor: Colors[colorScheme ?? 'light'].seperator }]} />
        <TouchableOpacity onPress={() => ''}>
          <View style={[styles.addButtonContainer]}>
            <Text style={styles.addButton}>-</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(DismissTargetListItem);

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    height: LIST_ITEM_HEIGHT,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    // gap: 30,
  },
  pressableStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: LIST_ITEM_HEIGHT,
  },
  listItemText: {
    fontSize: 15,
    textTransform: 'capitalize',
  },
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 8,
  },
  separator: {
    borderWidth: 0.33,
    height: 20,
    alignSelf: 'center',
  },
  addButtonContainer: {
    height: 32,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  addButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
});
