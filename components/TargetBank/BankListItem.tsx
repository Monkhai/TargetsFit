import React from 'react';
import { ColorSchemeName, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import { LIST_ITEM_HEIGHT } from '../../constants/SIZES';
import { Target } from '../../db/db';
import { Text, View } from '../Themed';
import MemoText from '../MemoText';

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
        <Text style={[styles.listItemText, { flex: 1, fontWeight: '700', color: 'red' }]}>{target.name}</Text>
        <Text style={styles.listItemText}>{target.type}</Text>
        <Text style={styles.listItemText}>{target.quantity}</Text>
        <TouchableOpacity onPress={() => onRemovePress(target)}>
          <View style={[styles.addButtonContainer, { backgroundColor: Colors[colorScheme ?? 'light'].tertiary }]}>
            <Text style={styles.removeButton}>-</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default React.memo(BankListItem);

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    height: LIST_ITEM_HEIGHT,
    alignItems: 'center',
    gap: 30,
    backgroundColor: 'transparent',
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
    color: 'red',
  },
});
