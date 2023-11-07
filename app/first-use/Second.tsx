import { StyleSheet, useColorScheme } from 'react-native';
import React from 'react';
import { firstUseStyles } from '../../constants/FirstUseStyles';
import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';

const Second = () => {
  const colorScheme = useColorScheme();
  return (
    <View style={firstUseStyles.container}>
      <Text style={firstUseStyles.header}>Your Weekly View</Text>
      <Text style={firstUseStyles.subheader}>Freely Shape Each Day</Text>
      <Text style={[firstUseStyles.body, { color: Colors[colorScheme ?? 'light'].text }]}>
        Swipe to find your day, tap <Text style={[firstUseStyles.body, { fontWeight: 'bold', color: Colors.accent }]}>+</Text> to set your
        target.
      </Text>
    </View>
  );
};

export default Second;

const styles = StyleSheet.create({});
