import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import useInitializeTables from '../hooks/useCreateDB';
import useGetAllTargets from '../hooks/useGetAllTargets';
import useGetWeeklyTargets from '../hooks/useGetWeeklyTargets';
import { I18nManager } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export { ErrorBoundary } from 'expo-router';
SplashScreen.preventAutoHideAsync();
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

export default function RootLayout() {
  //------------------------------------------------------------------------
  const { isLoading: isDBLoading, error: dbError } = useInitializeTables();

  //------------------------------------------------------------------------
  const { isLoading: isAllTargetsLoading } = useGetAllTargets(isDBLoading);

  //------------------------------------------------------------------------
  const { isLoading: weeklyTaretsIsLoading } = useGetWeeklyTargets(isDBLoading);

  //------------------------------------------------------------------------

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
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="screens" options={{ animation: 'fade' }} />
      <Stack.Screen name="first-use" options={{ animation: 'fade' }} />
    </Stack>
  );
}
