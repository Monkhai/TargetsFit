import React from 'react';
import { ColorSchemeName, StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { LIST_ITEM_HEIGHT } from '../../constants/SIZES';
import { Text } from '../Themed';
import { SortedTargets } from '../../hooks/useGetDismissTargetData';

interface Props {
  colorScheme: ColorSchemeName;
  item: SortedTargets;
  initialQuantity: number;
  mutableMissingTargets: number;
  onRemove: (tb_id: number) => void;
  onAdd: (tb_id: number, dayId: number) => void;
}

const DismissTargetListItem = ({ item, initialQuantity, mutableMissingTargets, colorScheme, onRemove, onAdd }: Props) => {
  const addControlButtonColor = item.quantity === initialQuantity ? 'gray' : 'red';
  const removeControlButtonColor = item.quantity === 0 || mutableMissingTargets === 0 ? 'gray' : 'red';

  return (
    <View style={styles.listItemContainer}>
      <Text style={[styles.listItemText, { fontWeight: '700', color: 'red' }]}>{item.day.name}</Text>
      <Text style={[styles.listItemText, { textAlign: 'right', flex: 1, paddingHorizontal: 20 }]}>{item.quantity}</Text>
      <View style={[styles.buttonContainer, { backgroundColor: Colors[colorScheme ?? 'light'].tertiary }]}>
        <TouchableOpacity disabled={item.quantity === initialQuantity} onPress={() => onAdd(item.targets[0].targetId, item.day.id)}>
          <View style={[styles.controlButtonContainer]}>
            <Text style={[styles.controlButton, { color: addControlButtonColor }]}>+</Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.separator, { borderColor: Colors[colorScheme ?? 'light'].seperator }]} />
        <TouchableOpacity
          disabled={item.quantity === 0 || mutableMissingTargets === 0}
          onPress={() => onRemove(item.targets[0].targetTbId)}
        >
          <View style={[styles.controlButtonContainer]}>
            <Text style={[styles.controlButton, { color: removeControlButtonColor }]}>-</Text>
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
  controlButtonContainer: {
    height: 32,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  controlButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
