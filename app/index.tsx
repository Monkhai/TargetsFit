import { Stack } from 'expo-router';
import React, { useContext, useRef, useState } from 'react';
import {
  Button,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Menu } from 'react-native-popup-menu';
import FlatListView from '../components/DailyFlatListView';
import EditDayListItem from '../components/EditDayListItem';
import FilterMenu from '../components/FilterMenu';
import FlexCard from '../components/FlexCard';
import HScrollView from '../components/HScrollView';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import DBContext from '../context/DBLoadingContext';
import TargetsContext from '../context/TargetsContext';
import { DayId, Target } from '../db/db';
import useGetActiveQuantity from '../hooks/useGetActiveQuantity';
import useGetWeeklyTargets from '../hooks/useGetWeeklyTargets';
import ListItemSeparator from '../components/ListItemSeparator';

const Home = () => {
  const colorScheme = useColorScheme();
  const [dayPage, setDayPage] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

  const dayMap = {
    1: 'Sunday',
    2: 'Monday',
    3: 'Tuesday',
    4: 'Wednesday',
    5: 'Thursday',
    6: 'Friday',
    7: 'Saturday',
  };

  const { isLoading: isDBLoading } = useContext(DBContext);

  const {
    targets: allTargets,
    isLoading: allTargetsIsLoading,
    error: allTargetsError,
    refetch: refetchAllTargets,
    filter,
    setFilter,
  } = useContext(TargetsContext);

  const {
    weeklyTargets,
    isLoading: weeklyTaretsIsLoading,
    error: weeklyTaretsError,
    refetch: refetchWeeklyTergets,
  } = useGetWeeklyTargets(isDBLoading, filter);

  const {
    activeTarrgetQuantity,
    isLoading: isActiveCountLoading,
    error: activeCountError,
    refetch: refetchActiveCount,
  } = useGetActiveQuantity(isDBLoading);

  const menuRef = useRef<Menu>(null);

  const handleHViewScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const screenWidth = Dimensions.get('screen').width;
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / screenWidth);
    const dayId: DayId = (page + 1) as DayId;
    if (dayPage !== dayId) {
      setDayPage(dayId);
    }
  };

  const handleAddToDay = (target: Target) => {};

  if (allTargetsIsLoading || weeklyTaretsIsLoading || isDBLoading || isActiveCountLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  } else if (weeklyTaretsError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{weeklyTaretsError.message}</Text>
      </View>
    );
  } else if (allTargetsError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{allTargetsError.message}</Text>
      </View>
    );
  } else if (activeCountError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{activeCountError.message}</Text>
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
            headerRight: () => <></>,
          }}
        />
        <View style={styles.container}>
          <HScrollView onScroll={handleHViewScroll}>
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
          <FlexCard height={6}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                paddingTop: 10,
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  flex: 0.4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
              >
                <Button title="save" color={'red'} />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Edit {dayMap[dayPage]}</Text>
              </View>
              <View
                style={{
                  flex: 0.4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
              >
                <Button
                  title="filter"
                  color={Colors[colorScheme ?? 'light'].accent}
                  onPress={() => menuRef.current?.open()}
                />
                <FilterMenu colorScheme={colorScheme} menuRef={menuRef} setFilter={setFilter} />
              </View>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <ListItemSeparator />}
              style={{ width: '100%' }}
              data={allTargets}
              renderItem={({ item: target }) => {
                const activeQuantity = activeTarrgetQuantity.find(
                  (count) => count.target.id === target.id
                );
                return (
                  <EditDayListItem
                    activeQuantity={activeQuantity!}
                    onPress={handleAddToDay}
                    target={target}
                  />
                );
              }}
            />
          </FlexCard>
        </View>
      </>
    );
  }
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 20,
  },
});
