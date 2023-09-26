import { Button, ColorSchemeName, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import FlexCard from './FlexCard';
import { Text, View } from './Themed';
import Colors from '../constants/Colors';
import { Menu } from 'react-native-popup-menu';
import FilterMenu from './FilterMenu';
import EditDayListItem from './EditDayListItem';
import ListItemSeparator from './ListItemSeparator';
import { ActiveTargetQuantity, Target } from '../db/db';

interface Props {
  colorScheme: ColorSchemeName;
  menuRef: React.RefObject<Menu>;
  dayPage: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  allTargets: Target[];
  setFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
  activeTargetQuantity: ActiveTargetQuantity[];
  onAddToDay: (target: Target) => void;
}

const dayMap = {
  1: 'Sunday',
  2: 'Monday',
  3: 'Tuesday',
  4: 'Wednesday',
  5: 'Thursday',
  6: 'Friday',
  7: 'Saturday',
};

const DailyTargetController = ({
  colorScheme,
  menuRef,
  dayPage,
  allTargets,
  setFilter,
  activeTargetQuantity,
  onAddToDay,
}: Props) => {
  return (
    <FlexCard height={6}>
      <View
        style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      >
        <View style={styles.filterBtn} />
        <View style={styles.header}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Add To {dayMap[dayPage]}</Text>
        </View>
        <View style={styles.filterBtn}>
          <Button title="filter" color="red" onPress={() => menuRef.current?.open()} />
          <FilterMenu colorScheme={colorScheme} menuRef={menuRef} setFilter={setFilter} />
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <ListItemSeparator />}
        style={{ width: '100%' }}
        data={allTargets}
        renderItem={({ item: target }) => {
          const activeQuantity = activeTargetQuantity.find(
            (count) => count.target.id === target.id
          );
          return (
            <EditDayListItem
              activeQuantity={activeQuantity!}
              onPress={onAddToDay}
              target={target}
            />
          );
        }}
      />
    </FlexCard>
  );
};

export default DailyTargetController;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderRadius: 20,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  filterBtn: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
