import { ColorSchemeName, FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SCREEN_WIDTH } from '../../constants/SIZES';
import Colors from '../../constants/Colors';
import { DailyTargets, Target, TargetInWeeklyTargets } from '../../db/db';
import DailyTargetListItem from './DailyTargetListItem';

interface Props {
  colorScheme: ColorSchemeName;
  dailyTargets: DailyTargets;
  onRemovePress: (target: TargetInWeeklyTargets) => void;
}

const DailyTargetList = ({ colorScheme, dailyTargets, onRemovePress }: Props) => {
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
          renderItem={({ item: target }) => (
            <DailyTargetListItem
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

export default DailyTargetList;

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
