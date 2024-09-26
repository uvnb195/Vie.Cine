import { View, Text, TextStyle, TextProps, StyleProp } from 'react-native'
import React, { ReactNode } from 'react'
import { useCustomTheme } from '@/src/contexts/theme'

interface Props {
    fontWeight?: 'light' | 'regular' | 'bold',
    children: string | ReactNode,
    fontSize?: 24 | 16 | 14 | 12 | 10 | 8 | number,
    color?: string,
    lineHeight?: number,
    letterSpacing?: number,
    numsOfLines?: number,
    otherProps?: TextStyle
}

const ThemeText = ({
    fontWeight,
    children,
    fontSize,
    color,
    lineHeight,
    letterSpacing,
    otherProps,
    numsOfLines }: Props) => {
    const { colors } = useCustomTheme()
    const fontStyle = () => {
        switch (fontWeight) {
            case 'light': return { fontFamily: 'Roboto-Light' }
            case 'bold': return { fontFamily: 'Roboto-Bold' }
            default: return { fontFamily: 'Roboto' }
        }
    }

    const textColor = color || colors.text.default

    const otherPropStyles = otherProps || {}

    return (
        <Text
            className='overflow-hidden'
            style={[
                fontStyle(),
                {
                    color: textColor,
                    fontSize: fontSize || 16,
                    lineHeight: lineHeight,
                    letterSpacing: letterSpacing || 1.5,
                },
                { ...otherPropStyles }
            ]}
            numberOfLines={numsOfLines}
        >
            {children}
        </Text>
    )
}

export default ThemeText