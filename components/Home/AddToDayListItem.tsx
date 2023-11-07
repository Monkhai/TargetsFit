import { ColorSchemeName, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useContext } from 'react';
import { LIST_ITEM_HEIGHT } from '../../constants/SIZES';
import { ActiveTargetQuantity, Target } from '../../db/db';
import Colors from '../../constants/Colors';
import { Text } from '../Themed';
import AddRemoveButton from '../AddRemoveButton';
import WeeklyTargetsContext from '../../context/WeeklyTargetsContext';

interface Props {
  item: ActiveTargetQuantity;
  availableTargets: number;
  onAddPress: (target: Target) => void;
}

const AddToDayListItem = ({ item, availableTargets, onAddPress }: Props) => {
  const { isLoading } = useContext(WeeklyTargetsContext);

  return (
    <View style={styles.listItemContainer}>
      <Text style={[styles.listItemText, styles.primaryListItemText]}>{item.target.name}</Text>
      <View style={styles.secondaryListItemTextContainer}>
        <Text style={styles.listItemText}>{item.target.type}</Text>
        <Text style={styles.listItemText}>{availableTargets}</Text>
      </View>
      <AddRemoveButton onPress={() => onAddPress(item.target)} label="+" disabled={isLoading} />
    </View>
  );
};

export default React.memo(AddToDayListItem);

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    height: LIST_ITEM_HEIGHT,
    alignItems: 'center',
  },
  primaryListItemText: {
    flex: 1,
    fontWeight: '700',
    color: 'red',
  },
  secondaryListItemTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
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
    marginLeft: 10,
  },
  addButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
});
