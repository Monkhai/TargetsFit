import { Dimensions, StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import React, { ReactNode, useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { ActiveTargetQuantity, Target } from '../db/db';
import Colors from '../constants/Colors';
import { listItemHeight, listItemWidth } from './ListItem';
import { Text } from './Themed';

interface Props {
  target: Target;
  activeQuantity: ActiveTargetQuantity;
  onPress: (target: Target) => void;
}

const EditDayListItem = ({ target, onPress, activeQuantity }: Props) => {
  const theme = useColorScheme();

  const leftCount = target.quantity - activeQuantity?.activeCount;

  return (
    <View style={[{ backgroundColor: Colors[theme ?? 'light'].background }, styles.container]}>
      <View style={{ flex: 1.8, justifyContent: 'center', alignItems: 'flex-start' }}>
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
            flex: 0.3,
            marginHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Text style={styles.text}>{leftCount}</Text>
        </View>
      )}
      <View style={{ flex: 0.5 }}>
        <TouchableOpacity onPress={() => onPress(target)} style={styles.addButton}>
          <Text style={{ fontSize: 18, color: 'red' }}>+</Text>
        </TouchableOpacity>
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
  addButton: {
    height: 36,
    backgroundColor: 'rgba(118,118,128,0.12)',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
});
