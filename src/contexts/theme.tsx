import { Colors, PaletteType } from '@/constants/Colors';
import React, { createContext, ReactNode, useContext } from 'react';
import { useColorScheme } from 'react-native';

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

const CustomThemeProvider = ({ children }: Props) => {
    const mode = useColorScheme()
    const value = Colors[mode!!]
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export default CustomThemeProvider