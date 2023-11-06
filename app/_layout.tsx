import { FontAwesome } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import ActiveQuantityContext from '../context/ActiveQuantityContext';
import DBContext from '../context/DBLoadingContext';
import TargetsContext from '../context/TargetsContext';
import WeeklyTargetsContext from '../context/WeeklyTargetsContext';
import useInitializeTables from '../hooks/useCreateDB';
import useGetActiveQuantity from '../hooks/useGetActiveQuantity';
import useGetAllTargets from '../hooks/useGetAllTargets';
import useGetWeeklyTargets from '../hooks/useGetWeeklyTargets';

export { ErrorBoundary } from 'expo-router';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  //------------------------------------------------------------------------
  const { isLoading: isDBLoading, error: dbError } = useInitializeTables();

  //------------------------------------------------------------------------
  const { targets, isLoading: isAllTargetsLoading, error: allTargetsError, refetch } = useGetAllTargets(isDBLoading);

  //------------------------------------------------------------------------
  const {
    sundayTargets,
    mondayTargets,
    tuesdayTargets,
    wednesdayTargets,
    thursdayTargets,
    fridayTargets,
    saturdayTargets,
    isLoading: weeklyTaretsIsLoading,
    error: weeklyTargetsError,
    refetchAllTargets: refetchWeeklyTergets,
    refetchDailyTargets,
  } = useGetWeeklyTargets(isDBLoading);

  //------------------------------------------------------------------------
  const {
    activeTargetQuantity,
    isLoading: isActiveCountLoading,
    error: activeCountError,
    refetch: refetchActiveCount,
  } = useGetActiveQuantity(isDBLoading);

  //------------------------------------------------------------------------
  useEffect(() => {
    if (dbError) throw dbError;
  }, [dbError]);

  //------------------------------------------------------------------------
  useEffect(() => {
    if (!isDBLoading && isAllTargetsLoading) {
      SplashScreen.hideAsync();
    }
  }, [isDBLoading, isAllTargetsLoading]);

  //------------------------------------------------------------------------
  return (
    <DBContext.Provider value={{ isLoading: isDBLoading, error: dbError }}>
      <TargetsContext.Provider
        value={{
          targets: targets,
          isLoading: isAllTargetsLoading,
          error: allTargetsError,
          refetch: refetch,
        }}
      >
        <WeeklyTargetsContext.Provider
          value={{
            sundayTargets,
            mondayTargets,
            tuesdayTargets,
            wednesdayTargets,
            thursdayTargets,
            fridayTargets,
            saturdayTargets,
            isLoading: weeklyTaretsIsLoading,
            error: weeklyTargetsError,
            refetch: refetchWeeklyTergets,
            refetchDailyTargets,
          }}
        >
          <ActiveQuantityContext.Provider
            value={{
              activeTargetQuantity: activeTargetQuantity,
              isLoading: isActiveCountLoading,
              error: activeCountError,
              refetch: refetchActiveCount,
            }}
          >
            <RootLayoutNav />
          </ActiveQuantityContext.Provider>
        </WeeklyTargetsContext.Provider>
      </TargetsContext.Provider>
    </DBContext.Provider>
  );
}

//------------------------------------------------------------------------
function RootLayoutNav() {
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
}
