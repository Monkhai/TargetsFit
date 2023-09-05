import React from 'react';
import { StyleSheet } from 'react-native';
import FlatListView from '../components/FlatListView';
import HScrollView from '../components/HScrollView';
import { View } from '../components/Themed';
import { tuesday } from '../constants/exercises';

const Tue = () => {
  return (
    <View style={styles.container}>
      <HScrollView>
        <FlatListView title={tuesday.title} exercises={tuesday.main} />
        <FlatListView title={tuesday.secondaryTitle} exercises={tuesday.accessory} />
      </HScrollView>
    </View>
  );
};

export default Tue;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
