import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import React, { ReactNode, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Target } from '../db/db';
import Colors from '../constants/Colors';
import { listItemHeight, listItemWidth } from './ListItem';

interface Props {
  target: Target;
}

const EditDayListItem = ({ target }: Props) => {
  const theme = useColorScheme();

  return (
    <TouchableOpacity>
      <View style={[{ backgroundColor: Colors[theme ?? 'light'].background }, styles.container]}>
        <Text style={[styles.title, styles.text]}>{target.name}</Text>
        <Text style={styles.text}>{target.type}</Text>
        {target.quantity && <Text style={styles.text}>{target.quantity}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default EditDayListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: listItemHeight,
    padding: 10,
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
    minWidth: 190,
  },
});
