import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
import { ColorSchemeName, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Colors from '../../constants/Colors';
import { DailyTargets, TargetByDaysDAO, TargetInWeeklyTargets } from '../../db/db';
import DailyTargetMetaListItem from './DailyTargetMetaListItem';

const targetByDaysDAO = new TargetByDaysDAO();
interface Props {
  colorScheme: ColorSchemeName;
  dailyTargets: DailyTargets;
  onRemovePress: (target: TargetInWeeklyTargets) => void;
  refetchWeeklyTergets: () => void;
}

const DailyTargetList = ({ colorScheme, dailyTargets, onRemovePress, refetchWeeklyTergets }: Props) => {
  const [completionMap, setCompletionMap] = useState(new Map<number, boolean>());

  const [draggableData, setDraggableData] = useState(dailyTargets.targets);

  const { width: screenWidth } = useWindowDimensions();
  //------------------------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    // Convert both sets of ids to Sets for O(1) lookups.
    const draggableIdsSet = new Set(draggableData.map((t) => t.tb_id));
    const dailyTargetIdsSet = new Set(dailyTargets.targets.map((t) => t.tb_id));

    // Find new targets efficiently
    const newTargets = dailyTargets.targets.filter((t) => !draggableIdsSet.has(t.tb_id));

    // Create a map of the dailyTargets for constant-time lookups
    const dailyTargetsMap = new Map(dailyTargets.targets.map((t) => [t.tb_id, t]));

    // Construct the new draggableData array with updated and new items
    const newDraggableData = draggableData
      .filter((t) => dailyTargetIdsSet.has(t.tb_id)) // Retain only targets that are still present
      .map((t) => dailyTargetsMap.get(t.tb_id) || t) // Update items with their latest versions if changed
      .concat(newTargets); // Add new items

    setDraggableData(newDraggableData);
  }, [dailyTargets]);

  //------------------------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const currentTargetIds = new Set(dailyTargets.targets.map((t) => t.tb_id));

    setCompletionMap((prevMap) => {
      const newMap = new Map();

      // Add new or existing targets with their previous completion status
      for (const target of dailyTargets.targets) {
        const { tb_id } = target;
        newMap.set(tb_id, prevMap.get(tb_id) || false);
      }

      // Iterate over the previous map to remove targets that no longer exist
      for (const id of prevMap.keys()) {
        if (!currentTargetIds.has(id)) {
          newMap.delete(id);
        }
      }

      return newMap;
    });
  }, [dailyTargets]);

  //------------------------------------------------------------------------------------------------------------------------------------------------
  const handleStatusToggle = useCallback(
    (id: number, status: boolean | undefined) => {
      const newMap = new Map(completionMap);

      Haptics.selectionAsync();

      if (status === true) {
        newMap.set(id, false);
      } else if (status === false || status === undefined) {
        newMap.set(id, true);
      }
      setCompletionMap(newMap);
    },
    [completionMap]
  );

  const handleDragEnd = useCallback((data: TargetInWeeklyTargets[]) => {
    const positions = data.map((item, index) => ({ tb_id: item.tb_id, position: index }));
    setDraggableData(data);
    targetByDaysDAO.updatePositions(dailyTargets.day.id, positions).then(() => refetchWeeklyTergets());
  }, []);
  //------------------------------------------------------------------------------------------------------------------------------------------------
  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <View style={[styles.secondaryContainer, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
        <Text style={styles.header}>{dailyTargets.day.name}</Text>
        <View style={{ flex: 1, overflow: 'hidden' }}>
          {dailyTargets.targets.length > 0 && (
            <DraggableFlatList
              style={{ overflow: 'visible' }}
              data={draggableData}
              showsVerticalScrollIndicator={false}
              onDragEnd={({ data }) => handleDragEnd(data)}
              keyExtractor={(item) => item.tb_id.toString()}
              renderItem={({ item: target, drag }) => (
                <DailyTargetMetaListItem
                  colorScheme={colorScheme}
                  completionMap={completionMap}
                  drag={drag}
                  handleStatusToggle={handleStatusToggle}
                  onRemovePress={onRemovePress}
                  target={target}
                />
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default React.memo(DailyTargetList);

const styles = StyleSheet.create({
  container: {
    padding: 13,
  },
  secondaryContainer: {
    justifyContent: 'flex-start',
    borderRadius: 10,
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
  },
  header: {
    alignSelf: 'center',
    fontSize: 24,
    textTransform: 'capitalize',
    fontWeight: '600',
    color: Colors.accent,
    marginVertical: 8,
  },
});
