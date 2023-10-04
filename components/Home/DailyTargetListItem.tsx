import { ColorSchemeName, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { LIST_ITEM_HEIGHT } from '../../constants/SIZES';
import { ActiveTargetQuantity, Target, TargetInWeeklyTargets } from '../../db/db';
import Colors from '../../constants/Colors';
import { Text } from '../Themed';
import { FontAwesome } from '@expo/vector-icons';

interface Props {
  colorScheme: ColorSchemeName;
  target: TargetInWeeklyTargets;
  onRemovePress: (target: TargetInWeeklyTargets) => void;
  status: boolean | undefined;
  onStatusToggle: (id: number, status: boolean | undefined) => void;
}

const DailyTargetListItem = ({
  target,
  onRemovePress,
  colorScheme,
  onStatusToggle,
  status,
}: Props) => {
  return (
    <View style={styles.listItemContainer}>
      <View style={{ flex: 1, flexDirection: 'row', gap: 20, paddingLeft: 10 }}>
        <Pressable onPress={() => onStatusToggle(target.tb_id, status)}>
          <FontAwesome name={status ? 'circle' : 'circle-o'} color={'red'} size={20} />
        </Pressable>
        <Text style={[styles.listItemText]}>{target.name}</Text>
      </View>
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
