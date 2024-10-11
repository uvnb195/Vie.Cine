import { Colors, PaletteType } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';
import { setLoading } from '../redux/publicSlice';

const ThemeContext = createContext<{
    colors: PaletteType,
    currentTheme: 'dark' | 'light' | 'system',
    toggleTheme: (value: 'dark' | 'light') => void
}>({
    colors: Colors.light,
    currentTheme: 'system',
    toggleTheme: () => { }
})

interface Props {
    children: ReactNode
}
export const useCustomTheme = () => {
    const value = useContext(ThemeContext)
    if (!value) throw new Error('useTheme must be wrapped in ThemeProvider')
    return value
}

const CustomThemeProvider = ({ children }: Props) => {
    const theme = useColorScheme()
    const [mode, setMode] = useState<'dark' | 'light' | 'system'>('system')

    useEffect(() => {
        const getStoredTheme = async () => {
            const storedTheme = await AsyncStorage.getItem('theme')
            if (!storedTheme) setMode('system')
            else setMode(storedTheme as ('dark' | 'light'))
        }
        getStoredTheme()
    }, [])

    const colors = (mode === 'system') ? Colors[theme!!] : Colors[mode]
    return (
        <ThemeContext.Provider value={{
            colors: colors,
            toggleTheme: (value) => {
                setMode(value)
            },
            currentTheme: mode
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default CustomThemeProvider