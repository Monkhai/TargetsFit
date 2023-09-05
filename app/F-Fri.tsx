import { StyleSheet } from 'react-native';
import React from 'react';
import { Text, View } from '../components/Themed';
import { friday } from '../constants/exercises';
import HScrollView from '../components/HScrollView';
import FlatListView from '../components/FlatListView';

const Fri = () => {
  return (
    <View style={styles.container}>
      <HScrollView>
        <FlatListView title={friday.title} exercises={friday.main} />
        <FlatListView title={friday.secondaryTitle} exercises={friday.accessory} />
      </HScrollView>
    </View>
  );
};

export default Fri;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
