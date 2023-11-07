import { FontAwesome } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, Tabs } from 'expo-router';
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
    weeklyTargets,
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
    if (!isDBLoading && isAllTargetsLoading && weeklyTaretsIsLoading) {
      SplashScreen.hideAsync();
    }
  }, [isDBLoading, isAllTargetsLoading]);

  //------------------------------------------------------------------------
  return <RootLayoutNav />;
}

//------------------------------------------------------------------------
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="screens" options={{ animation: 'fade' }} />
      <Stack.Screen name="first-use" options={{ animation: 'fade' }} />
    </Stack>
  );
}
