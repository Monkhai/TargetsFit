import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, useColorScheme, useWindowDimensions } from 'react-native';
import AddToDayList from '../components/Home/AddToDayList';
import DailyTargetList from '../components/Home/DailyTargetList';
import LoadingErrorHome from '../components/LoadingErrorHome';
import { Text, View } from '../components/Themed';
import { SCREEN_WIDTH } from '../constants/SIZES';
import ActiveQuantityContext from '../context/ActiveQuantityContext';
import DBContext from '../context/DBLoadingContext';
import TargetsContext from '../context/TargetsContext';
import WeeklyTargetsContext from '../context/WeeklyTargetsContext';
import { DayId, Target, TargetByDaysDAO, TargetInWeeklyTargets } from '../db/db';
import { ScrollView } from 'react-native-gesture-handler';
import LoadingHomeScreen from '../components/Home/LoadingHomeScreen';
import useGetWeeklyTargets from '../hooks/useGetWeeklyTargets';

const Home = () => {
  const WeeklyTargets = new TargetByDaysDAO();
  const colorScheme = useColorScheme();
  const [dayPage, setDayPage] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [isScrollViewMounted, setIsScrollViewMounted] = useState(false);

  const { width: screenWidth } = useWindowDimensions();

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const today = new Date().getDay();

    const scrollPosition = SCREEN_WIDTH * today;

    scrollViewRef.current?.scrollTo({ y: 0, x: scrollPosition, animated: false });
  }, [isScrollViewMounted]);

  const { isLoading: isDBLoading } = useContext(DBContext);

  const {
    targets: allTargets,
    isLoading: allTargetsIsLoading,
    error: allTargetsError,
    refetch: refetchAllTargets,
  } = useContext(TargetsContext);

  const {
    sundayTargets,
    mondayTargets,
    tuesdayTargets,
    wednesdayTargets,
    thursdayTargets,
    fridayTargets,
    saturdayTargets,
    isLoading: weeklyTaretsIsLoading,
    error: weeklyTaretsError,
    refetch: refetchWeeklyTargets,
    refetchDailyTargets,
  } = useContext(WeeklyTargetsContext);

  const {
    activeTargetQuantity,
    isLoading: isActiveCountLoading,
    error: activeCountError,
    refetch: refetchActiveCount,
  } = useContext(ActiveQuantityContext);

  const totalActiveCount = Math.max(
    activeTargetQuantity.reduce((acc, curr) => {
      return acc + curr.target.quantity - curr.activeCount;
    }, 0),
    0
  );

  const handleHViewScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / screenWidth);
      const dayId: DayId = (page + 1) as DayId;
      if (dayPage !== dayId) {
        setDayPage(dayId);
      }
    },
    [dayPage]
  );

  const handleAddToDay = useCallback(
    (target: Target) => {
      WeeklyTargets.addTargetToDay(dayPage, target.id)
        .then(() => {
          refetchActiveCount();
          refetchAllTargets();
          refetchDailyTargets(dayPage);
        })
        .catch((error: Error) => {
          Alert.alert(error.message);
        });
    },

    [dayPage, activeTargetQuantity]
  );

  const handleItemDelete = useCallback((target: TargetInWeeklyTargets) => {
    WeeklyTargets.deleteTargetFromWeeklyTargets(target.tb_id, target.id)
      .then(() => {
        refetchActiveCount();
        refetchDailyTargets(target.dayId);
        refetchAllTargets();
      })
      .catch((error: Error) => {
        Alert.alert(error.message);
      });
  }, []);

  if (allTargetsIsLoading || isDBLoading || isActiveCountLoading) {
    return <LoadingHomeScreen />;
  } else if (weeklyTaretsError) {
    return <LoadingErrorHome message={weeklyTaretsError.message} />;
  } else if (allTargetsError) {
    return <LoadingErrorHome message={allTargetsError.message} />;
  } else if (activeCountError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{activeCountError.message}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ScrollView
          onLayout={() => setIsScrollViewMounted(true)}
          ref={scrollViewRef}
          scrollEventThrottle={16}
          onScroll={handleHViewScroll}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          {/* SUNDAY TARGET LIST */}
          <DailyTargetList
            refetchWeeklyTergets={refetchWeeklyTargets}
            onRemovePress={handleItemDelete}
            colorScheme={colorScheme}
            dailyTargets={sundayTargets}
          />

          {/* MONDAY TARGET LIST */}
          <DailyTargetList
            refetchWeeklyTergets={refetchWeeklyTargets}
            onRemovePress={handleItemDelete}
            colorScheme={colorScheme}
            dailyTargets={mondayTargets}
          />

          {/* TUESDAY TARGET LIST */}
          <DailyTargetList
            refetchWeeklyTergets={refetchWeeklyTargets}
            onRemovePress={handleItemDelete}
            colorScheme={colorScheme}
            dailyTargets={tuesdayTargets}
          />

          {/* WEDNESDAY TARGET LIST */}
          <DailyTargetList
            refetchWeeklyTergets={refetchWeeklyTargets}
            onRemovePress={handleItemDelete}
            colorScheme={colorScheme}
            dailyTargets={wednesdayTargets}
          />

          {/* THURSDAY TARGET LIST */}
          <DailyTargetList
            refetchWeeklyTergets={refetchWeeklyTargets}
            onRemovePress={handleItemDelete}
            colorScheme={colorScheme}
            dailyTargets={thursdayTargets}
          />

          {/* FRIDAY TARGET LIST */}
          <DailyTargetList
            refetchWeeklyTergets={refetchWeeklyTargets}
            onRemovePress={handleItemDelete}
            colorScheme={colorScheme}
            dailyTargets={fridayTargets}
          />

          {/* SATURDAY TARGET LIST */}
          <DailyTargetList
            refetchWeeklyTergets={refetchWeeklyTargets}
            onRemovePress={handleItemDelete}
            colorScheme={colorScheme}
            dailyTargets={saturdayTargets}
          />
        </ScrollView>
        {totalActiveCount > 0 && (
          <AddToDayList
            weeklyTaretsIsLoading={weeklyTaretsIsLoading}
            colorScheme={colorScheme}
            onAddPress={handleAddToDay}
            allTargets={allTargets}
            activeTargetQuantity={activeTargetQuantity}
          />
        )}
      </View>
    );
  }
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
