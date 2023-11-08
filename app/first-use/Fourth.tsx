import { Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const IOS = () => {
  return (
    <View>
      <Text>Fourth</Text>
    </View>
  );
};

const Android = () => {
  return (
    <View>
      <Text>Fourth</Text>
    </View>
  );
};

export default Platform.OS === 'ios' ? IOS : Android;

const styles = StyleSheet.create({});
