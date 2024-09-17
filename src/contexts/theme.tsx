import { Colors, PaletteType } from '@/constants/Colors';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { StyleProp, useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

const ThemeContext = createContext<PaletteType | null>(null)
interface Props {
    children: ReactNode
}



export const useCustomTheme = () => {

    const value = useContext(ThemeContext)
    const theme = useColorScheme()
    if (!value) throw new Error('useTheme must be wrapped in ThemeProvider')
    return { colors: value, theme: theme }
}

SplashScreen.preventAutoHideAsync();

const CustomThemeProvider = ({ children }: Props) => {
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
    const mode = useColorScheme()
    const value = Colors[mode!!]
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export default CustomThemeProvider