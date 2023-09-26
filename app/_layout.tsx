import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, useColorScheme } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import Icon from '../components/Icon';
import Colors from '../constants/Colors';
import DBContext from '../context/DBLoadingContext';
import TargetsContext from '../context/TargetsContext';
import useInitializeTables from '../hooks/useCreateDB';
import useGetAllTargets from '../hooks/useGetAllTargets';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isLoading: isDBLoading, error: dbError } = useInitializeTables();
  const [filter, setFilter] = useState<string>();
  const {
    targets,
    isLoading: isAllTargetsLoading,
    error: allTargetsError,
    refetch,
  } = useGetAllTargets(isDBLoading, filter);
  useEffect(() => {
    if (dbError) throw dbError;
  }, [dbError]);

  useEffect(() => {
    if (!isDBLoading && isAllTargetsLoading) {
      SplashScreen.hideAsync();
    }
  }, [isDBLoading, isAllTargetsLoading]);

  if (isDBLoading && isAllTargetsLoading) {
    return null;
  }

  return (
    <DBContext.Provider value={{ isLoading: isDBLoading, error: dbError }}>
      <TargetsContext.Provider
        value={{
          targets: targets,
          isLoading: isAllTargetsLoading,
          error: allTargetsError,
          refetch: refetch,
          filter,
          setFilter,
        }}
      >
        <MenuProvider>
          <RootLayoutNav />
        </MenuProvider>
      </TargetsContext.Provider>
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
