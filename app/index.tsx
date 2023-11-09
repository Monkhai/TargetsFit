import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, useColorScheme } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
const splashScreen = require('../assets/images/secondary-splash.png');
const darkSplashScreen = require('../assets/images/secondary-splash-dark.png');

const index = () => {
  const colorScheme = useColorScheme();

  const checkUserFirstTime = async () => {
    const isUserFirstTime = await AsyncStorage.getItem('isUserFirstTime');
    if (isUserFirstTime !== 'true') {
      await AsyncStorage.setItem('isUserFirstTime', 'true');
      setTimeout(() => router.replace('/first-use/'), 2000);
    } else {
      setTimeout(() => router.replace('/screens/'), 2000);
    }
  };

  useEffect(() => {
    checkUserFirstTime();
  }, []);

  return (
    <Animated.Image
      entering={FadeIn}
      exiting={FadeOut}
      source={colorScheme === 'dark' ? darkSplashScreen : splashScreen}
      style={styles.imageStyle}
    />
  );
};

export default index;

const styles = StyleSheet.create({
  imageStyle: { height: '100%', width: '100%' },
});
