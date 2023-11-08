import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Second" />
      <Stack.Screen name="Third" />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
