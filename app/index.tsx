import React, { useContext, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Menu } from 'react-native-popup-menu';
import FlatListView from '../components/DailyFlatListView';
import DailyTargetController from '../components/DailyTargetController';
import HScrollView from '../components/HScrollView';
import { Text, View } from '../components/Themed';
import ActiveQuantityContext from '../context/ActiveQuantityContext';
import DBContext from '../context/DBLoadingContext';
import TargetsContext from '../context/TargetsContext';
import { DayId, Target, TargetByDaysDAO, TargetInWeeklyTargets } from '../db/db';
import useGetWeeklyTargets from '../hooks/useGetWeeklyTargets';

const WeeklyTargets = new TargetByDaysDAO();

const Home = () => {
  const colorScheme = useColorScheme();
  const [dayPage, setDayPage] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

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
    activeTargetQuantity,
    isLoading: isActiveCountLoading,
    error: activeCountError,
    refetch: refetchActiveCount,
  } = useContext(ActiveQuantityContext);

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

  const handleAddToDay = (target: Target) => {
    WeeklyTargets.addTargetToDay(dayPage, target.id)
      .then(() => {
        refetchActiveCount();
        refetchAllTargets();
        refetchWeeklyTergets();
      })
      .catch((error: Error) => {
        Alert.alert(error.message);
      });
  };

  const handleItemDelete = (target: TargetInWeeklyTargets) => {
    WeeklyTargets.deleteTargetFromWeeklyTargets(target.tb_id)
      .then(() => {
        refetchActiveCount();
        refetchAllTargets();
        refetchWeeklyTergets();
      })
      .catch((error: Error) => {
        Alert.alert(error.message);
      });
  };

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
      <View style={styles.container}>
        <HScrollView onScroll={handleHViewScroll}>
          {/* SUNDAY */}
          <FlatListView onItemDelete={handleItemDelete} dailyTargets={weeklyTargets![0]} />
          {/* MONDAY */}
          <FlatListView onItemDelete={handleItemDelete} dailyTargets={weeklyTargets![1]} />
          {/* TUESDAY */}
          <FlatListView onItemDelete={handleItemDelete} dailyTargets={weeklyTargets![2]} />
          {/* WEDNESDAY */}
          <FlatListView onItemDelete={handleItemDelete} dailyTargets={weeklyTargets![3]} />
          {/* THURSDAY */}
          <FlatListView onItemDelete={handleItemDelete} dailyTargets={weeklyTargets![4]} />
          {/* FRIDAY */}
          <FlatListView onItemDelete={handleItemDelete} dailyTargets={weeklyTargets![5]} />
          {/* SATURDAY */}
          <FlatListView onItemDelete={handleItemDelete} dailyTargets={weeklyTargets![6]} />
        </HScrollView>
        <DailyTargetController
          activeTargetQuantity={activeTargetQuantity}
          allTargets={allTargets}
          colorScheme={colorScheme}
          dayPage={dayPage}
          menuRef={menuRef}
          onAddToDay={handleAddToDay}
          setFilter={setFilter}
        />
      </View>
    );
  }
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
});
