import React from 'react';
import { StyleSheet } from 'react-native';
import FlatListView from '../components/FlatListView';
import HScrollView from '../components/HScrollView';
import { View } from '../components/Themed';
import { sunday } from '../constants/exercises';

const Sun = () => {
  return (
    <View style={styles.container}>
      <HScrollView>
        {/* main exercises */}
        <FlatListView title={sunday.title} exercises={sunday.main} />
        {/* secondary exercises */}
        <FlatListView title={sunday.secondaryTitle} exercises={sunday.accessory} />
      </HScrollView>
    </View>
  );
};

export default Sun;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
