import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import Animated, { FadeIn, SlideOutRight } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Text, View } from '../../components/Themed';
import { firstUseStyles, pressableStyle } from '../../constants/FirstUseStyles';

const FirstUseScreen = () => {
  const [isHeadingAppearing, setIsHeadingAppearing] = useState(false);
  const [isSubHeadingAppearing, setIsSubHeadingAppearing] = useState(false);
  const [isNextButtonAvailable, setIsNextButtonAvailable] = useState(false);

  const handleNext = () => router.replace('/first-use/Second');

  useEffect(() => {
    setTimeout(() => setIsHeadingAppearing(true), 1000);
    setTimeout(() => setIsSubHeadingAppearing(true), 3000);
    setTimeout(() => setIsNextButtonAvailable(true), 5000);
  }, []);

  return (
    <View style={firstUseStyles.containerWithPadding}>
      {isHeadingAppearing && (
        <Animated.Text entering={FadeIn.duration(1500)} style={firstUseStyles.header}>
          Welcome to TargetsFit!
        </Animated.Text>
      )}
      {isSubHeadingAppearing && (
        <Animated.Text entering={FadeIn.duration(1500)} style={firstUseStyles.subheader}>
          Set Goals, Not Limits
        </Animated.Text>
      )}
      {isNextButtonAvailable && (
        <Animated.View style={firstUseStyles.nextButtonContainer} entering={FadeIn.duration(1000)}>
          <Pressable onPress={handleNext} style={(a) => pressableStyle(a.pressed)}>
            <Text style={firstUseStyles.nextButtonText}>Next</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

export default FirstUseScreen;
