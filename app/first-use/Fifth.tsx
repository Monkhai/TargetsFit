import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, useColorScheme } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { firstUseStyles, pressableStyle } from '../../constants/FirstUseStyles';
import { router } from 'expo-router';
const lightVideo = require('../../assets/first-use-videos/reorder-targets-light.mp4');
const darkVideo = require('../../assets/first-use-videos/reorder-targets-dark.mp4');

const handleNext = () => {
  router.replace('/screens/');
};

const IOS = () => {
  const colorScheme = useColorScheme();
  const videoRef = useRef<Video>(null);

  const [isVideoAppearing, setIsVideoAppearing] = useState(false);
  const [isNextButtonAvailable, setIsNextButtonAvailable] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVideoAppearing(true), 1000);
    setTimeout(() => videoRef.current?.playAsync(), 3000);
  }, []);

  return (
    <View style={firstUseStyles.container}>
      <Animated.Text entering={FadeIn.duration(1500)} exiting={FadeOut} style={firstUseStyles.header}>
        Reordering Targets
      </Animated.Text>
      {!isVideoAppearing && <View style={firstUseStyles.animatedVideoContainer} />}
      {isVideoAppearing && (
        <Animated.View
          entering={FadeIn.duration(1500)}
          exiting={FadeOut}
          style={[firstUseStyles.animatedVideoContainer, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}
        >
          <View style={[firstUseStyles.videoContainer, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
            <Video
              onPlaybackStatusUpdate={(status) => {
                if (status.isLoaded) {
                  if (status.didJustFinish) setIsNextButtonAvailable(true);
                }
              }}
              ref={videoRef}
              style={{ flex: 1, borderRadius: 20 }}
              resizeMode={ResizeMode.CONTAIN}
              source={colorScheme === 'dark' ? darkVideo : lightVideo}
            />
          </View>
        </Animated.View>
      )}
      <Animated.Text exiting={FadeOut} style={firstUseStyles.body}>
        To reorder your targets, just drag them.
      </Animated.Text>
      {isNextButtonAvailable && (
        <Animated.View style={firstUseStyles.nextButtonContainer} entering={FadeIn.duration(1500)} exiting={FadeOut}>
          <Pressable onPress={handleNext} style={(a) => pressableStyle(a.pressed)}>
            <Text style={firstUseStyles.nextButtonText}>Get Started!</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
const AnimatedVideo = Animated.createAnimatedComponent(Video);

const Android = () => {
  const colorScheme = useColorScheme();
  const videoRef = useRef<Video>(null);

  const [isNextButtonAvailable, setIsNextButtonAvailable] = useState(false);

  useEffect(() => {
    setTimeout(() => videoRef.current?.playAsync(), 3000);
  }, []);

  return (
    <View style={firstUseStyles.container}>
      <Animated.Text entering={FadeIn.duration(1500)} style={firstUseStyles.header}>
        Reordering Targets
      </Animated.Text>

      <View style={[firstUseStyles.animatedVideoContainer, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
        <View style={[firstUseStyles.videoContainer, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
          <AnimatedVideo
            entering={ZoomIn.duration(1500)}
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded) {
                if (status.didJustFinish) setIsNextButtonAvailable(true);
              }
            }}
            ref={videoRef}
            style={{ flex: 1, borderRadius: 20 }}
            resizeMode={ResizeMode.CONTAIN}
            source={colorScheme === 'dark' ? darkVideo : lightVideo}
          />
        </View>
      </View>

      <Text style={firstUseStyles.body}>To reorder your targets, just drag them.</Text>

      {isNextButtonAvailable && (
        <Animated.View style={firstUseStyles.nextButtonContainer} entering={FadeIn.duration(1500)}>
          <Pressable onPress={handleNext} style={(a) => pressableStyle(a.pressed)}>
            <Text style={firstUseStyles.nextButtonText}>Next</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

export default Platform.OS === 'ios' ? IOS : Android;
