import * as SplashScreen from 'expo-splash-screen';

import { Slot } from 'expo-router';
import CustomThemeProvider from '../contexts/theme';

export default function RootLayout() {
  return (
    <CustomThemeProvider >
      <Slot />
    </CustomThemeProvider>
  );
}
