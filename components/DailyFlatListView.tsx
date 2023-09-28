import React from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import { DailyTargets, Target, TargetInWeeklyTargets } from '../db/db';
import FlexCard from './FlexCard';
import ListItem, { listItemHeight, listItemWidth } from './ListItem';
import ListItemDeleteAction from './ListItemDeleteAction';
import { Text, View } from './Themed';
import ListItemSeparator from './ListItemSeparator';

interface Props {
  dailyTargets: DailyTargets;
  onItemDelete: (target: TargetInWeeklyTargets) => void;
}

const FlatListView = ({ dailyTargets, onItemDelete }: Props) => {
  return (
    <View style={styles.flatListContainer}>
      <FlexCard height={9}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{dailyTargets.day.name}</Text>
        </View>
        <FlatList
          ItemSeparatorComponent={() => <ListItemSeparator />}
          contentContainerStyle={styles.flatList}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          data={dailyTargets.targets}
          // style={{ borderWidth: 1, borderColor: 'white' }}
          snapToInterval={listItemHeight}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: target }) => (
            <ListItem
              renderLeftActions={() => (
                <ListItemDeleteAction onPress={() => onItemDelete(target)} />
              )}
              target={target}
            />
          )}
        />
      </FlexCard>
    </View>
  );
};

export default FlatListView;

const styles = StyleSheet.create({
  flatListContainer: {
    width: Dimensions.get('screen').width,
    alignItems: 'center',
  },

  titleWrapper: {
    height: listItemHeight,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    textTransform: 'capitalize',
  },

  flatList: {
    width: listItemWidth,
  },
});
