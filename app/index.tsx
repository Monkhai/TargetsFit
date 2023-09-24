import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import FlatListView from '../components/DailyFlatListView';
import HScrollView from '../components/HScrollView';
import { Text, View } from '../components/Themed';
import DBContext from '../context/DBLoadingContext';
import useGetWeeklyTargets from '../hooks/useGetWeeklyTargets';

const Home = () => {
  const { isLoading: isDBLoading } = useContext(DBContext);
  const { weeklyTargets, isLoading, error } = useGetWeeklyTargets(isDBLoading);

  if (isLoading || isDBLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  } else if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error.message}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <HScrollView>
          {/* SUNDAY */}
          <FlatListView dailyTargets={weeklyTargets![0]} />
          {/* MONDAY */}
          <FlatListView dailyTargets={weeklyTargets![1]} />
          {/* TUESDAY */}
          <FlatListView dailyTargets={weeklyTargets![2]} />
          {/* WEDNESDAY */}
          <FlatListView dailyTargets={weeklyTargets![3]} />
          {/* THURSDAY */}
          <FlatListView dailyTargets={weeklyTargets![4]} />
          {/* FRIDAY */}
          <FlatListView dailyTargets={weeklyTargets![5]} />
          {/* SATURDAY */}
          <FlatListView dailyTargets={weeklyTargets![6]} />
        </HScrollView>
      </View>
    );
  }
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
