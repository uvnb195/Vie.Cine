import * as SplashScreen from 'expo-splash-screen';

import { useFonts } from 'expo-font';
import { Redirect, router, Slot, Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import CustomThemeProvider from '../contexts/theme';
import { store } from '../redux/store';
import { auth } from '../api/firebase/config';
import AuthProvider from '../contexts/auth';
import { onAuthStateChanged } from 'firebase/auth';

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
    <Provider store={store}>
      <GestureHandlerRootView>
        <CustomThemeProvider >
          <Stack initialRouteName='(tabs)' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='(tabs)' />
          </Stack>
          <StatusBar backgroundColor='transparent' />
        </CustomThemeProvider>
      </GestureHandlerRootView>
    </Provider>
  )
}
