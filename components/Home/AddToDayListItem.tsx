import { ColorSchemeName, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { LIST_ITEM_HEIGHT } from '../../constants/SIZES';
import { ActiveTargetQuantity, Target } from '../../db/db';
import Colors from '../../constants/Colors';

interface Props {
  colorScheme: ColorSchemeName;
  item: ActiveTargetQuantity;
  availableTargets: number;
  onAddPress: (target: Target) => void;
}

const AddToDayListItem = ({ item, availableTargets, onAddPress, colorScheme }: Props) => {
  return (
    <View style={styles.listItemContainer}>
      <Text style={[styles.listItemText, { flex: 1 }]}>{item.target.name}</Text>
      <Text style={styles.listItemText}>{item.target.type}</Text>
      <Text style={styles.listItemText}>{availableTargets}</Text>
      <TouchableOpacity onPress={() => onAddPress(item.target)}>
        <View
          style={[
            styles.addButtonContainer,
            { backgroundColor: Colors[colorScheme ?? 'light'].tertiary },
          ]}
        >
          <Text style={styles.addButton}>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AddToDayListItem;

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    height: LIST_ITEM_HEIGHT,
    alignItems: 'center',
    gap: 30,
  },
  listItemText: {
    fontSize: 15,
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
  },
});
