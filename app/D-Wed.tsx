import React from 'react';
import { StyleSheet } from 'react-native';
import FlatListView from '../components/FlatListView';
import HScrollView from '../components/HScrollView';
import { View } from '../components/Themed';
import { wednesday } from '../constants/exercises';

const Wed = () => {
  return (
    <View style={styles.container}>
      <HScrollView>
        <FlatListView title={wednesday.title} exercises={wednesday.main} />
        <FlatListView title={wednesday.secondaryTitle} exercises={wednesday.accessory} />
      </HScrollView>
    </View>
  );
};

export default Wed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
