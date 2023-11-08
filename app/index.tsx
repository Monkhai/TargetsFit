import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
const splashScreen = require('../assets/images/secondary-splash.png');

const index = () => {
  useEffect(() => {
    setTimeout(() => router.replace('/first-use/'), 2000);
  }, []);

  return <Animated.Image entering={FadeIn} exiting={FadeOut} source={splashScreen} style={styles.imageStyle} />;
};

export default index;

const styles = StyleSheet.create({
  imageStyle: { height: '100%', width: '100%' },
});
