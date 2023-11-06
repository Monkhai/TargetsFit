import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import Colors from '../../constants/Colors';

const _layout = () => {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].accent,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: (props) => <FontAwesome name="home" size={props.size} color={props.color} />,
          }}
        />

        <Tabs.Screen
          name="TargetBank"
          options={{
            title: 'Target Bank',
            tabBarIcon: (props) => <FontAwesome name="bullseye" size={props.size} color={props.color} />,
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({});
