import React from 'react';
import { StyleSheet } from 'react-native';
import FlatListView from '../components/FlatListView';
import HScrollView from '../components/HScrollView';
import { View } from '../components/Themed';
import { thursday } from '../constants/exercises';

const Thu = () => {
  return (
    <View style={styles.container}>
      <HScrollView>
        <FlatListView title={thursday.title} exercises={thursday.main} />
        <FlatListView title={thursday.secondaryTitle} exercises={thursday.accessory} />
      </HScrollView>
    </View>
  );
};

export default Thu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
