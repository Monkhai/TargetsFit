import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Alert, ColorSchemeName, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import { LIST_ITEM_HEIGHT } from '../../constants/SIZES';
import { ActiveTargetQuantity, Target } from '../../db/db';
import AddToDayListItem from './AddToDayListItem';
import { Text } from '../Themed';

const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome);

interface Props {
  colorScheme: ColorSchemeName;
  activeTargetQuantity: ActiveTargetQuantity[];
  allTargets: Target[];
  onAddPress: (target: Target) => void;
}

const AddToDayList = ({ colorScheme, activeTargetQuantity, allTargets, onAddPress }: Props) => {
  const height = useSharedValue(0);
  const rotateThing = useSharedValue(0);

  useEffect(() => {
    height.value = 0;
    rotateThing.value = 0;
  }, [allTargets, activeTargetQuantity]);

  const chevronStyles = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotateThing.value}deg` }],
  }));

  const toggleFlatListHeight = () => {
    if (height.value === 0) {
      rotateThing.value = withTiming(90);
      height.value = withTiming(LIST_ITEM_HEIGHT * activeTargetQuantity.length);
    } else if (height.value > 0) {
      rotateThing.value = withTiming(0);
      height.value = withTiming(0);
    }
  };

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
          disabled={allTargets.length === 0}
          onPress={toggleFlatListHeight}
        >
          <Text style={[styles.headerTitle, { color: allTargets.length > 0 ? 'red' : 'gray' }]}>
            Add to Day
          </Text>
          <AnimatedFontAwesome
            style={chevronStyles}
            name="chevron-right"
            size={14}
            color={allTargets.length > 0 ? 'red' : 'gray'}
          />
        </Pressable>
        <Animated.FlatList
          style={[styles.flatListStyle, { height: height, maxHeight: height }]}
          data={activeTargetQuantity}
          renderItem={({ item }) => {
            const target = allTargets.find((t) => t.id === item.target.id);
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
    height: 'auto',
    padding: '3%',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },

  headerTitle: { fontSize: 24, fontWeight: 'bold' },
});
