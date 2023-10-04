import React, { useEffect, useState } from 'react';
import { ColorSchemeName, FlatList, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { SCREEN_WIDTH } from '../../constants/SIZES';
import { DailyTargets, TargetInWeeklyTargets } from '../../db/db';
import DailyTargetListItem from './DailyTargetListItem';

interface Props {
  colorScheme: ColorSchemeName;
  dailyTargets: DailyTargets;
  onRemovePress: (target: TargetInWeeklyTargets) => void;
}

const DailyTargetList = ({ colorScheme, dailyTargets, onRemovePress }: Props) => {
  const [completionMap, setCompletionMap] = useState(new Map<number, boolean>());

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

  const handleStatusToggle = (id: number, status: boolean | undefined) => {
    const newMap = new Map(completionMap);

    if (status === true) {
      newMap.set(id, false);
    } else if (status === false || status === undefined) {
      newMap.set(id, true);
    }
    setCompletionMap(newMap);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.secondaryContainer,
          { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary },
        ]}
      >
        <Text style={styles.header}>{dailyTargets.day.name}</Text>
        <FlatList
          data={dailyTargets.targets}
          keyExtractor={(item) => item.tb_id.toString()}
          renderItem={({ item: target }) => (
            <DailyTargetListItem
              status={completionMap.get(target.tb_id)}
              onStatusToggle={handleStatusToggle}
              colorScheme={colorScheme}
              target={target}
              onRemovePress={onRemovePress}
            />
          )}
        />
      </View>
    </View>
  );
};

export default React.memo(DailyTargetList);

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    padding: 13,
  },
  secondaryContainer: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    padding: 10,
  },
  header: {
    alignSelf: 'center',
    fontSize: 24,
    textTransform: 'capitalize',
    fontWeight: '600',
    color: 'red',
  },
});
