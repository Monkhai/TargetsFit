import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
const splashScreen = require('../assets/images/splash.png');

const index = () => {
  useEffect(() => {
    setTimeout(() => router.replace('/FirstUseScreen'), 2);
  }, []);

  return <Image source={splashScreen} style={styles.imageStyle} />;
};

export default index;

const styles = StyleSheet.create({
  imageStyle: { height: '100%', width: '100%' },
});
