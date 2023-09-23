import { Dimensions, FlatList, StyleSheet, useColorScheme } from 'react-native';
import React from 'react';
import { Text, View } from './Themed';
import Colors from '../constants/Colors';
import ListItem, { listItemHeight } from './ListItem';
import { DailyTargets } from '../db/db';
import FlexCard from './FlexCard';

interface Props {
  dailyTargets: DailyTargets;
}

const FlatListView = ({ dailyTargets }: Props) => {
  return (
    <View style={[styles.flatListContainer]}>
      <FlexCard>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{dailyTargets.day.name}</Text>
        </View>
        <FlatList
          contentContainerStyle={styles.flatList}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          data={dailyTargets.targets}
          snapToInterval={listItemHeight}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: target }) => <ListItem target={target} />}
        />
      </FlexCard>
    </View>
  );
};

export default FlatListView;

const styles = StyleSheet.create({
  flatListContainer: {
    width: Dimensions.get('screen').width,
    height: listItemHeight * 12,
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
  },

  flatList: {
    width: Dimensions.get('screen').width * 0.8,
  },
});
