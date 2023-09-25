import React, { useContext, useRef, useState } from 'react';
import { Button, StyleSheet, useColorScheme } from 'react-native';
import FlatListView from '../components/DailyFlatListView';
import HScrollView from '../components/HScrollView';
import { Text, View } from '../components/Themed';
import DBContext from '../context/DBLoadingContext';
import useGetWeeklyTargets from '../hooks/useGetWeeklyTargets';
import Colors from '../constants/Colors';
import FilterMenu from '../components/FilterMenu';
import { Menu } from 'react-native-popup-menu';
import { Stack } from 'expo-router';

const Home = () => {
  const colorScheme = useColorScheme();

  const [filter, setFilter] = useState<string>();

  const { isLoading: isDBLoading } = useContext(DBContext);
  const { weeklyTargets, isLoading, error } = useGetWeeklyTargets(isDBLoading, filter);

  const menuRef = useRef<Menu>(null);

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
      <>
        <Stack.Screen
          options={{
            headerLeft: () => (
              <Button
                title="edit"
                color={Colors[colorScheme ?? 'light'].accent}
                onPress={() => ''}
              />
            ),
            headerRight: () => (
              <>
                <Button
                  title="filter"
                  color={Colors[colorScheme ?? 'light'].accent}
                  onPress={() => menuRef.current?.open()}
                />

                <FilterMenu colorScheme={colorScheme} menuRef={menuRef} setFilter={setFilter} />
              </>
            ),
          }}
        />
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
      </>
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
