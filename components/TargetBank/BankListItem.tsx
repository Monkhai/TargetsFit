import React from 'react';
import { ColorSchemeName, Pressable, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { LIST_ITEM_HEIGHT } from '../../constants/SIZES';
import { Target } from '../../db/db';
import { Text, View } from '../Themed';
import { transform } from '@babel/core';

interface Props {
  target: Target;
  onRemovePress: (target: Target) => void;
  onLongPress: (target: Target) => void;
}

const BankListItem = ({ target, onRemovePress, onLongPress }: Props) => {
  const colorScheme = useColorScheme();
  return (
    <Pressable
      style={(a) => {
        return { opacity: a.pressed ? 0.5 : 1 };
      }}
      onPress={() => onLongPress(target)}
    >
      <View style={styles.listItemContainer}>
        <Text style={[styles.listItemText, styles.primaryListItemText]}>{target.name}</Text>
        <View style={styles.secondaryListItemTextContainer}>
          <Text style={styles.listItemText}>{target.type}</Text>
          <Text style={styles.listItemText}>{target.quantity}</Text>
        </View>
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
    backgroundColor: 'transparent',
  },
  primaryListItemText: {
    flex: 1,
    fontWeight: '700',
    color: Colors.accent,
  },
  secondaryListItemTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: 'transparent',
  },
  listItemText: {
    fontSize: 15,
    textTransform: 'capitalize',
  },
  addButtonContainer: {
    height: 32,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 10,
  },
  removeButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
  },
});
