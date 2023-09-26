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
import Modal from 'react-native-modal/dist/modal';
import { Menu } from 'react-native-popup-menu';
import FlatListView from '../components/DailyFlatListView';
import EditDayListItem from '../components/EditDayListItem';
import FilterMenu from '../components/FilterMenu';
import HScrollView from '../components/HScrollView';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import DBContext from '../context/DBLoadingContext';
import { DayId, Target } from '../db/db';
import useGetAllTargets from '../hooks/useGetAllTargets';
import useGetWeeklyTargets from '../hooks/useGetWeeklyTargets';
import useGetActiveQuantity from '../hooks/useGetActiveQuantity';

const Home = () => {
  const colorScheme = useColorScheme();

  const [filter, setFilter] = useState<string>();
  const [dayPage, setDayPage] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

  const [addedTargets, setAddedTargets] = useState<Target[]>([]);

  const { isLoading: isDBLoading } = useContext(DBContext);
  const {
    weeklyTargets,
    isLoading: weeklyTaretsIsLoading,
    error: weeklyTaretsError,
    refetch: refetchWeeklyTergets,
  } = useGetWeeklyTargets(isDBLoading, filter);
  const {
    targets: allTargets,
    isLoading: allTargetsIsLoading,
    error: allTargetsError,
    refetch: refetchAllTargets,
  } = useGetAllTargets(isDBLoading, filter);

  const {
    activeTarrgetQuantity,
    isLoading: isActiveCountLoading,
    error: activeCountError,
    refetch: refetchActiveCount,
  } = useGetActiveQuantity(isDBLoading);

  const menuRef = useRef<Menu>(null);
  const modalRef = useRef<Modal>(null);

  const handleHViewScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const screenWidth = Dimensions.get('screen').width;
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / screenWidth);
    const dayId: DayId = (page + 1) as DayId;
    if (dayPage !== dayId) {
      setDayPage(dayId);
    }
  };

  if (allTargetsIsLoading || weeklyTaretsIsLoading || isDBLoading) {
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
        </View>
        <Modal
          ref={modalRef}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            margin: 0,
          }}
          isVisible
          onBackdropPress={() => modalRef.current?.close()}
        >
          <View
            style={{
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              width: Dimensions.get('screen').width,
              height: 500,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingTop: 10,
            }}
          >
            <View
              style={{
                width: 36,
                height: 5,
                alignSelf: 'center',
                borderRadius: 100,
                backgroundColor: 'rgba(60,60,67, 0.3)',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                paddingHorizontal: 10,
                paddingBottom: 10,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <Button title="save" color={'red'} />
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Edit insert day</Text>
              <Button color={'red'} title="cancel" />
            </View>
            <FlatList
              contentContainerStyle={{ paddingHorizontal: 10 }}
              data={allTargets}
              renderItem={({ item: target }) => {
                // const addedTarget = addedTargets.filter((a) => a.id === target.id);
                const activeQuantity = activeTarrgetQuantity.find(
                  (count) => count.target.id === target.id
                );
                return <EditDayListItem activeQuantity={activeQuantity} target={target} />;
              }}
            />
          </View>
        </Modal>
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
