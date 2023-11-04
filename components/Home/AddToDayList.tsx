import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { ColorSchemeName, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import { LIST_ITEM_HEIGHT } from '../../constants/SIZES';
import { ActiveTargetQuantity, Target } from '../../db/db';
import { Text } from '../Themed';
import AddToDayListItem from './AddToDayListItem';

interface Props {
  colorScheme: ColorSchemeName;
  allTargets: Target[];
  activeTargetQuantity: ActiveTargetQuantity[];
  onAddPress: (target: Target) => void;
}

const AddToDayList = ({ colorScheme, allTargets, activeTargetQuantity, onAddPress }: Props) => {
  const height = useSharedValue<number>(0);
  const rotateChevron = useSharedValue<number>(0);

  const prevLength = useRef(activeTargetQuantity.length);

  const chevronStyles = useAnimatedStyle(() => {
    return { transform: [{ rotateZ: `${rotateChevron.value}deg` }] };
  });

  const listStyles = useAnimatedStyle(() => {
    return { height: height.value, maxHeight: height.value };
  });

  useEffect(() => {
    if (activeTargetQuantity.length === 0 || activeTargetQuantity.length < 0) {
      height.value = 0;
      rotateChevron.value = 0;
    }

    if (activeTargetQuantity.length !== 0 && activeTargetQuantity.length !== prevLength.current && height.value !== 0) {
      height.value = Math.min(LIST_ITEM_HEIGHT * activeTargetQuantity.length, LIST_ITEM_HEIGHT * 5);
      rotateChevron.value = 90;

      prevLength.current = activeTargetQuantity.length;
    }
  }, [activeTargetQuantity]);

  const toggleFlatListHeight = () => {
    if (height.value === 0) {
      rotateChevron.value = withTiming(90);
      const newHeight = Math.min(LIST_ITEM_HEIGHT * activeTargetQuantity.length, LIST_ITEM_HEIGHT * 5);
      height.value = withTiming(newHeight);
    } else if (height.value > 0) {
      rotateChevron.value = withTiming(0);
      height.value = withTiming(0);
    }
  };

  const targetMap = Object.fromEntries(allTargets.map((target) => [target.id, target]));

  const totalActiveCount = Math.max(
    activeTargetQuantity.reduce((acc, curr) => {
      return acc + curr.target.quantity - curr.activeCount;
    }, 0),
    0
  );

  return (
    <View style={styles.container}>
      <View style={[{ backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }, styles.flatListContainer]}>
        <Pressable style={styles.headerContainer} disabled={totalActiveCount === 0} onPress={toggleFlatListHeight}>
          <Text style={[styles.headerTitle, { color: totalActiveCount > 0 ? 'red' : 'gray' }]}>Add Targets</Text>
          <Animated.View style={chevronStyles}>
            <FontAwesome name="chevron-right" size={14} color={totalActiveCount > 0 ? 'red' : 'gray'} />
          </Animated.View>
        </Pressable>
        <Animated.View style={listStyles}>
          <Animated.FlatList
            showsVerticalScrollIndicator={false}
            style={[styles.flatListStyle, listStyles]}
            data={activeTargetQuantity}
            renderItem={({ item }) => {
              const target = targetMap[item.target.id];
              const availableTargets = target ? target.quantity - item.activeCount : 0;
              if (availableTargets === 0 || availableTargets < 0) return null;
              return <AddToDayListItem availableTargets={availableTargets} colorScheme={colorScheme} item={item} onAddPress={onAddPress} />;
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default React.memo(AddToDayList);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 13,
    paddingTop: 0,
  },
  flatListContainer: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
  },
  flatListStyle: {
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },

  headerTitle: { fontSize: 24, fontWeight: 'bold' },
});
