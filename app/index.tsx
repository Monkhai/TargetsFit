import React, { useCallback, useContext, useState } from 'react';
import { Alert, Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, useColorScheme } from 'react-native';
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

const Home = () => {
  const WeeklyTargets = new TargetByDaysDAO();
  const colorScheme = useColorScheme();
  const [dayPage, setDayPage] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

  const { isLoading: isDBLoading } = useContext(DBContext);

  const {
    targets: allTargets,
    isLoading: allTargetsIsLoading,
    error: allTargetsError,
    refetch: refetchAllTargets,
  } = useContext(TargetsContext);

  const {
    weeklyTargets,
    isLoading: weeklyTaretsIsLoading,
    error: weeklyTaretsError,
    refetch: refetchWeeklyTergets,
  } = useContext(WeeklyTargetsContext);

  const {
    activeTargetQuantity,
    isLoading: isActiveCountLoading,
    error: activeCountError,
    refetch: refetchActiveCount,
  } = useContext(ActiveQuantityContext);

  const handleHViewScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const screenWidth = SCREEN_WIDTH;
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
          refetchWeeklyTergets();
        })
        .catch((error: Error) => {
          Alert.alert(error.message);
        });
    },
    [dayPage]
  );

  const handleItemDelete = useCallback((target: TargetInWeeklyTargets) => {
    WeeklyTargets.deleteTargetFromWeeklyTargets(target.tb_id)
      .then(() => {
        refetchActiveCount();
        refetchAllTargets();
        refetchWeeklyTergets();
      })
      .catch((error: Error) => {
        Alert.alert(error.message);
      });
  }, []);

  if (allTargetsIsLoading || weeklyTaretsIsLoading || isDBLoading || isActiveCountLoading) {
    return <LoadingErrorHome message="Loading..." />;
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
        <ScrollView scrollEventThrottle={16} onScroll={handleHViewScroll} pagingEnabled showsHorizontalScrollIndicator={false} horizontal>
          {/* SUNDAY TARGET LIST */}
          <DailyTargetList onRemovePress={handleItemDelete} colorScheme={colorScheme} dailyTargets={weeklyTargets[0]} />

          {/* MONDAY TARGET LIST */}
          <DailyTargetList onRemovePress={handleItemDelete} colorScheme={colorScheme} dailyTargets={weeklyTargets[1]} />

          {/* TUESDAY TARGET LIST */}
          <DailyTargetList onRemovePress={handleItemDelete} colorScheme={colorScheme} dailyTargets={weeklyTargets[2]} />

          {/* WEDNESDAY TARGET LIST */}
          <DailyTargetList onRemovePress={handleItemDelete} colorScheme={colorScheme} dailyTargets={weeklyTargets[3]} />

          {/* THURSDAY TARGET LIST */}
          <DailyTargetList onRemovePress={handleItemDelete} colorScheme={colorScheme} dailyTargets={weeklyTargets[4]} />

          {/* FRIDAY TARGET LIST */}
          <DailyTargetList onRemovePress={handleItemDelete} colorScheme={colorScheme} dailyTargets={weeklyTargets[5]} />

          {/* SATURDAY TARGET LIST */}
          <DailyTargetList onRemovePress={handleItemDelete} colorScheme={colorScheme} dailyTargets={weeklyTargets[6]} />
        </ScrollView>
        <AddToDayList
          colorScheme={colorScheme}
          onAddPress={handleAddToDay}
          allTargets={allTargets}
          activeTargetQuantity={activeTargetQuantity}
        />
      </View>
    );
  }
};

export default React.memo(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
