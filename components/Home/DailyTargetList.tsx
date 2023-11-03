import React, { useEffect, useState } from 'react';
import { ColorSchemeName, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { LIST_ITEM_HEIGHT, SCREEN_WIDTH } from '../../constants/SIZES';
import { DailyTargets, TargetByDaysDAO, TargetInWeeklyTargets } from '../../db/db';
import DailyTargetListItem from './DailyTargetListItem';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';

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

  useEffect(() => {
    const newMap = new Map(completionMap);

    // Compare the previous and current targets
    const prevTargets = Array.from(completionMap.keys());
    const currentTargets = dailyTargets.targets.map((t) => t.tb_id);

    // Check for added and removed targets
    const addedTargets = currentTargets.filter((id) => !prevTargets.includes(id));
    const removedTargets = prevTargets.filter((id) => !currentTargets.includes(id));

    // Initialize statuses for added targets
    addedTargets.forEach((id) => {
      newMap.set(id, false);
    });

    // Remove statuses for removed targets
    removedTargets.forEach((id) => {
      newMap.delete(id);
    });

    setCompletionMap(newMap);
  }, [dailyTargets.targets]);

  useEffect(() => {
    // Extract IDs for easy comparison
    const draggableIds = new Set(draggableData.map((t) => t.tb_id));
    const dailyTargetIds = new Set(dailyTargets.targets.map((t) => t.tb_id));

    // Find new targets
    const newTargets = dailyTargets.targets.filter((t) => !draggableIds.has(t.tb_id));

    // Find removed targets
    const removedTargets = draggableData.filter((t) => !dailyTargetIds.has(t.tb_id));

    // Remove the removed targets and append the new targets
    const updatedDraggableData = draggableData.filter((t) => !removedTargets.includes(t)).concat(newTargets);

    setDraggableData(updatedDraggableData);
  }, [dailyTargets]);

  const handleStatusToggle = (id: number, status: boolean | undefined) => {
    const newMap = new Map(completionMap);

    Haptics.selectionAsync();

    if (status === true) {
      newMap.set(id, false);
    } else if (status === false || status === undefined) {
      newMap.set(id, true);
    }
    setCompletionMap(newMap);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.secondaryContainer, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
        <Text style={styles.header}>{dailyTargets.day.name}</Text>
        <View style={{ flex: 1 }}>
          {dailyTargets.targets.length > 0 && (
            <DraggableFlatList
              data={draggableData}
              showsVerticalScrollIndicator={false}
              onDragEnd={({ data }) => {
                const positions = data.map((item, index) => ({ tb_id: item.tb_id, position: index }));
                setDraggableData(data);
                targetByDaysDAO.updatePositions(dailyTargets.day.id, positions).then(() => refetchWeeklyTergets());
              }}
              keyExtractor={(item) => item.tb_id.toString()}
              renderItem={({ item: target, drag }) => (
                <ScaleDecorator>
                  <Pressable
                    onLongPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                      drag();
                    }}
                  >
                    <DailyTargetListItem
                      status={completionMap.get(target.tb_id)}
                      onStatusToggle={handleStatusToggle}
                      colorScheme={colorScheme}
                      target={target}
                      onRemovePress={onRemovePress}
                    />
                  </Pressable>
                </ScaleDecorator>
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
    width: SCREEN_WIDTH,
    // paddingTop: 13,
    // paddingHorizontal: 13,
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
    color: 'red',
    marginVertical: 8,
  },
});
