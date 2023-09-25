import React, { useContext, useRef, useState } from 'react';
import {
  Button,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import FlatListView from '../components/DailyFlatListView';
import HScrollView from '../components/HScrollView';
import { Text, View } from '../components/Themed';
import DBContext from '../context/DBLoadingContext';
import useGetWeeklyTargets from '../hooks/useGetWeeklyTargets';
import Colors from '../constants/Colors';
import FilterMenu from '../components/FilterMenu';
import { Menu } from 'react-native-popup-menu';
import { Stack } from 'expo-router';
import { DayId } from '../db/db';
import Modal from 'react-native-modal/dist/modal';

const Home = () => {
  const colorScheme = useColorScheme();

  const [filter, setFilter] = useState<string>();
  const [dayPage, setDayPage] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

  const { isLoading: isDBLoading } = useContext(DBContext);
  const { weeklyTargets, isLoading, error } = useGetWeeklyTargets(isDBLoading, filter);

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
          // hasBackdrop={false}
          onBackdropPress={() => modalRef.current?.close()}
        >
          <View
            style={{
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              width: Dimensions.get('screen').width,
              height: 500,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          ></View>
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
