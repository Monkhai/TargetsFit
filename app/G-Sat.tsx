import { StyleSheet } from 'react-native';
import React from 'react';
import { Text, View } from '../components/Themed';
import { saturday } from '../constants/exercises';
import FlatListView from '../components/FlatListView';
import HScrollView from '../components/HScrollView';

const Sat = () => {
  return (
    <View style={styles.container}>
      <HScrollView>
        <FlatListView title={saturday.title} exercises={saturday.main} />
        <FlatListView title={saturday.secondaryTitle} exercises={saturday.accessory} />
      </HScrollView>
    </View>
  );
};

export default Sat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
