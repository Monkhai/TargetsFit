import { ColorSchemeName, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { LIST_ITEM_HEIGHT } from '../../constants/SIZES';
import { ActiveTargetQuantity, Target } from '../../db/db';
import Colors from '../../constants/Colors';

interface Props {
  colorScheme: ColorSchemeName;
  target: Target;
  onRemovePress: (target: Target) => void;
  onLongPress: (target: Target) => void;
}

const BankListItem = ({ target, onRemovePress, onLongPress, colorScheme }: Props) => {
  return (
    <Pressable onLongPress={() => onLongPress(target)}>
      <View style={styles.listItemContainer}>
        <Text style={[styles.listItemText, { flex: 1 }]}>{target.name}</Text>
        <Text style={styles.listItemText}>{target.type}</Text>
        <Text style={styles.listItemText}>{target.quantity}</Text>
        <TouchableOpacity onPress={() => onRemovePress(target)}>
          <View
            style={[
              styles.addButtonContainer,
              { backgroundColor: Colors[colorScheme ?? 'light'].tertiary },
            ]}
          >
            <Text style={styles.removeButton}>-</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default BankListItem;

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
  removeButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
