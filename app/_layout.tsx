import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Button, useColorScheme } from 'react-native';
import Icon from '../components/Icon';
import Colors from '../constants/Colors';
import DBContext from '../context/DBLoadingContext';
import useInitializeTables from '../hooks/useCreateDB';
import { MenuProvider } from 'react-native-popup-menu';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const { isLoading, error: dbError } = useInitializeTables();

  useEffect(() => {
    if (error || dbError) throw error;
  }, [error, dbError]);

  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);

  if (!loaded && isLoading) {
    return null;
  }

  return (
    <DBContext.Provider value={{ isLoading: isLoading, error: dbError }}>
      <MenuProvider>
        <RootLayoutNav />
      </MenuProvider>
    </DBContext.Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          headerTitleStyle: { fontSize: 22 },
          headerLeftContainerStyle: { paddingLeft: 20 },
          headerRightContainerStyle: { paddingRight: 20 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarShowLabel: false,
            headerRight: () => (
              <Button title="edit" color={Colors[colorScheme ?? 'light'].accent} />
            ),
            tabBarIcon: ({ focused }) => (
              <Icon color={focused ? 'accent' : 'secondary'} icon="home" />
            ),
          }}
        />

        <Tabs.Screen
          name="TargetBank"
          options={{
            title: 'Target Bank',
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Icon color={focused ? 'accent' : 'secondary'} icon="target" />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
