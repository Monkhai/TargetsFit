import { ColorSchemeName, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { LIST_ITEM_HEIGHT } from '../../constants/SIZES';
import { ActiveTargetQuantity, Target, TargetInWeeklyTargets } from '../../db/db';
import Colors from '../../constants/Colors';
import { Text } from '../Themed';

interface Props {
  colorScheme: ColorSchemeName;
  target: TargetInWeeklyTargets;
  onRemovePress: (target: TargetInWeeklyTargets) => void;
}

const DailyTargetListItem = ({ target, onRemovePress, colorScheme }: Props) => {
  return (
    <View style={styles.listItemContainer}>
      <Text style={[styles.listItemText, { flex: 1 }]}>{target.name}</Text>
      <Text style={styles.listItemText}>{target.type}</Text>
      <TouchableOpacity onPress={() => onRemovePress(target)}>
        <View
          style={[
            styles.addButtonContainer,
            { backgroundColor: Colors[colorScheme ?? 'light'].tertiary },
          ]}
        >
          <Text style={styles.addButton}>-</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(DailyTargetListItem);

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
