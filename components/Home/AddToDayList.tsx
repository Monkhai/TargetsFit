import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { ColorSchemeName, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import { LIST_ITEM_HEIGHT } from '../../constants/SIZES';
import { ActiveTargetQuantity, Target } from '../../db/db';
import { Text } from '../Themed';
import AddToDayListItem from './AddToDayListItem';

const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome);
interface Props {
  colorScheme: ColorSchemeName;
  activeTargetQuantity: ActiveTargetQuantity[];
  allTargets: Target[];
  onAddPress: (target: Target) => void;
}

const AddToDayList = ({ colorScheme, activeTargetQuantity, allTargets, onAddPress }: Props) => {
  const height = useSharedValue<number>(0);
  const rotateChevron = useSharedValue<number>(0);
  const prevLength = useRef(activeTargetQuantity.length);

  const chevronStyles = useAnimatedStyle(() => {
    return { transform: [{ rotateZ: `${rotateChevron.value}deg` }] };
  });

  useEffect(() => {
    if (activeTargetQuantity.length === 0) {
      height.value = 0;
      rotateChevron.value = 0;
    }

    if (
      activeTargetQuantity.length !== 0 &&
      activeTargetQuantity.length !== prevLength.current &&
      height.value !== 0
    ) {
      height.value = LIST_ITEM_HEIGHT * activeTargetQuantity.length;
      rotateChevron.value = 90;

      prevLength.current = activeTargetQuantity.length;
    }
  }, [activeTargetQuantity]);

  const toggleFlatListHeight = () => {
    if (height.value === 0) {
      rotateChevron.value = withTiming(90);
      height.value = withTiming(LIST_ITEM_HEIGHT * activeTargetQuantity.length);
    } else if (height.value > 0) {
      rotateChevron.value = withTiming(0);
      height.value = withTiming(0);
    }
  };

  const targetMap = Object.fromEntries(allTargets.map((target) => [target.id, target]));

  return (
    <View style={styles.container}>
      <View
        style={[
          { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary },
          styles.flatListContainer,
        ]}
      >
        <Pressable
          style={styles.headerContainer}
          disabled={activeTargetQuantity.length === 0}
          onPress={toggleFlatListHeight}
        >
          <Text
            style={[
              styles.headerTitle,
              { color: activeTargetQuantity.length > 0 ? 'red' : 'gray' },
            ]}
          >
            Add Targets
          </Text>
          <Animated.View style={chevronStyles}>
            <FontAwesome
              name="chevron-right"
              size={14}
              color={activeTargetQuantity.length > 0 ? 'red' : 'gray'}
            />
          </Animated.View>
        </Pressable>
        <Animated.FlatList
          contentContainerStyle={{ flex: 1 }}
          style={[styles.flatListStyle, { height: height, maxHeight: height }]}
          data={activeTargetQuantity}
          renderItem={({ item }) => {
            const target = targetMap[item.target.id];
            const availableTargets = target ? target.quantity - item.activeCount : 0;
            if (availableTargets === 0) return null;

            return (
              <AddToDayListItem
                availableTargets={availableTargets}
                colorScheme={colorScheme}
                item={item}
                onAddPress={onAddPress}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

export default React.memo(AddToDayList);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 13,
  },
  flatListContainer: {
    height: 'auto',
    width: '100%',
    padding: 10,
    borderRadius: 10,
  },
  flatListStyle: {
    width: '100%',
  },
  headerContainer: {
    // height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },

  headerTitle: { fontSize: 24, fontWeight: 'bold' },
});