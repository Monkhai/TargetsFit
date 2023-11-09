import { ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Text, View } from '../../components/Themed';
import { firstUseStyles, pressableStyle } from '../../constants/FirstUseStyles';
import { Platform, Pressable, useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
const lightVideo = require('../../assets/first-use-videos/edit-target-light.mp4');
const darkVideo = require('../../assets/first-use-videos/edit-target-dark.mp4');

const handleNext = () => {
  router.replace('/first-use/Fourth');
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
      <Animated.Text entering={FadeIn.duration(1500)} style={firstUseStyles.header}>
        Editing Targets
      </Animated.Text>

      {!isVideoAppearing && <View style={firstUseStyles.animatedVideoContainer} />}
      {isVideoAppearing && (
        <Animated.View
          entering={FadeIn.duration(1500)}
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
      <Text style={firstUseStyles.body}>To edit a target, simply tap it.</Text>

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
        Editing Targets
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

      <Animated.Text entering={FadeIn.duration(1500)} style={firstUseStyles.body}>
        To edit a target, simply tap it.
      </Animated.Text>

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
