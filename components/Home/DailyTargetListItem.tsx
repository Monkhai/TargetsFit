import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { ColorSchemeName, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { LIST_ITEM_HEIGHT } from '../../constants/SIZES';
import { TargetInWeeklyTargets } from '../../db/db';
import { Text } from '../Themed';
import AddRemoveButton from '../AddRemoveButton';

interface Props {
  colorScheme: ColorSchemeName;
  target: TargetInWeeklyTargets;
  onRemovePress: (target: TargetInWeeklyTargets) => void;
  status: boolean | undefined;
  onStatusToggle: (id: number, status: boolean | undefined) => void;
}

const DailyTargetListItem = ({ target, onRemovePress, colorScheme, onStatusToggle, status }: Props) => {
  return (
    <View style={styles.listItemContainer}>
      <View style={styles.primaryTextContainer}>
        <Pressable onPress={() => onStatusToggle(target.tb_id, status)} style={styles.pressableStyle}>
          <FontAwesome name={status ? 'circle' : 'circle-o'} color={Colors.accent} size={24} />
        </Pressable>
        <Text style={[styles.listItemText, styles.targetNameText]}>{target.name}</Text>
      </View>
      <Text style={styles.listItemText}>{target.type}</Text>
      <AddRemoveButton onPress={() => onRemovePress(target)} label="-" />
    </View>
  );
};

export default DailyTargetListItem;

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    height: LIST_ITEM_HEIGHT,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  primaryTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressableStyle: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 30,
    height: LIST_ITEM_HEIGHT,
  },
  targetNameText: {
    fontWeight: '700',
    color: Colors.accent,
  },

  listItemText: {
    fontSize: 15,
    textTransform: 'capitalize',
  },
  removeButtonContainer: {
    height: 32,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 10,
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
  },
});
