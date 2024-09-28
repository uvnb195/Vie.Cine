import * as SplashScreen from 'expo-splash-screen';

import { Slot, Stack } from 'expo-router';
import CustomThemeProvider from '../contexts/theme';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  SplashScreen.hideAsync();

  const [loaded] = useFonts({
    'Roboto-Bold': require('../../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
    'Roboto': require('../../assets/fonts/Roboto-Medium.ttf'),
  });

  useEffect(() => {
    if (loaded) {
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <CustomThemeProvider >
      {/* <Slot /> */}
      <Stack initialRouteName='(tabs)' screenOptions={{ headerShown: false }} />
      <StatusBar backgroundColor='transparent' />
    </CustomThemeProvider>
  );
}
