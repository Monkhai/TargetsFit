import { Dimensions, StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import React, { ReactNode, useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { ActiveTargetQuantity, Target } from '../db/db';
import Colors from '../constants/Colors';
import { listItemHeight, listItemWidth } from './ListItem';
import { Text } from './Themed';

interface Props {
  target: Target;
  activeQuantity?: ActiveTargetQuantity;
}

const EditDayListItem = ({ target, activeQuantity }: Props) => {
  const theme = useColorScheme();

  const [calculatedActiveCount, setCalculatedActiveCount] = useState(0);

  useEffect(() => {
    if (activeQuantity) {
      if (activeQuantity?.activeCount > 0) setCalculatedActiveCount(activeQuantity.activeCount);
    }
  }, [activeQuantity]);

  return (
    <View style={[{ backgroundColor: Colors[theme ?? 'light'].background }, styles.container]}>
      <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'flex-start' }}>
        <Text style={[styles.title, styles.text]}>{target.name}</Text>
      </View>
      <View
        style={{
          flex: 0.7,
          marginHorizontal: 10,
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Text style={styles.text}>{target.type}</Text>
      </View>
      {target.quantity && (
        <View
          style={{
            flex: 0.5,
            marginHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Text style={styles.text}>
            {calculatedActiveCount}/{target.quantity}
          </Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <View style={styles.addRemoveBtns}>
          <TouchableOpacity
            onPress={() => setCalculatedActiveCount((c) => c - 1)}
            style={{ justifyContent: 'center', alignItems: 'center', width: 18 }}
          >
            <Text style={{ fontSize: 18 }}>-</Text>
          </TouchableOpacity>
          <View style={{ width: 1, height: 18, backgroundColor: 'rgba(60,60,67,0.3)' }} />
          <TouchableOpacity
            onPress={() => setCalculatedActiveCount((c) => c + 1)}
            style={{ justifyContent: 'center', alignItems: 'center', width: 18 }}
          >
            <Text style={{ fontSize: 18 }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditDayListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: listItemHeight,
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 20,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  detailsContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
  },
  text: {
    fontSize: 17,
  },
  title: {
    fontWeight: 'bold',
    color: 'red',
  },
  addRemoveBtns: {
    width: 94,
    height: 36,
    backgroundColor: 'rgba(118,118,128,0.12)',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
});
