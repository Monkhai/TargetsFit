import React from 'react';
import { StyleSheet } from 'react-native';
import FlatListView from '../components/FlatListView';
import HScrollView from '../components/HScrollView';
import { View } from '../components/Themed';
import { monday } from '../constants/exercises';

const Mon = () => {
  return (
    <View style={styles.container}>
      <HScrollView>
        <FlatListView title={monday.title} exercises={monday.main} />
        <FlatListView title={monday.secondaryTitle} exercises={monday.accessory} />
      </HScrollView>
    </View>
  );
};

export default Mon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
