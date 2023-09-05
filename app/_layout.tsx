import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerTitleStyle: { fontSize: 28 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Sun',
            tabBarIcon: ({ color }) => <TabBarIcon name="circle" color={color} />,
          }}
        />
        <Tabs.Screen
          name="B-Mon"
          options={{
            title: 'Mon',
            tabBarIcon: ({ color }) => <TabBarIcon name="circle" color={color} />,
          }}
        />
        <Tabs.Screen
          name="C-Tue"
          options={{
            title: 'Tue',
            tabBarIcon: ({ color }) => <TabBarIcon name="circle" color={color} />,
          }}
        />
        <Tabs.Screen
          name="D-Wed"
          options={{
            title: 'Wed',
            tabBarIcon: ({ color }) => <TabBarIcon name="circle" color={color} />,
          }}
        />
        <Tabs.Screen
          name="E-Thu"
          options={{
            title: 'Thu',
            tabBarIcon: ({ color }) => <TabBarIcon name="circle" color={color} />,
          }}
        />
        <Tabs.Screen
          name="F-Fri"
          options={{
            title: 'Fri',
            tabBarIcon: ({ color }) => <TabBarIcon name="circle" color={color} />,
          }}
        />
        <Tabs.Screen
          name="G-Sat"
          options={{
            title: 'Sat',
            tabBarIcon: ({ color }) => <TabBarIcon name="circle" color={color} />,
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
