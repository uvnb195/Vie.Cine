import { View, Text } from 'react-native'
import React, { ReactNode } from 'react'
import { bgColor } from '@/constants/Styles'
import { useCustomTheme } from '@/src/contexts/theme'
import ThemeText from '../theme/ThemeText'

interface Props {
    children: ReactNode,
    marginX?: number,
    marginY?: number,
    color?: string,
    backgroundColor?: string
}

const TextHighLight = ({
    children,
    marginX,
    marginY,
    color,
    backgroundColor }: Props) => {
    const themeValue = useCustomTheme()
    const { colors, theme } = themeValue

    return (
        <View className='rounded-full min-w-[40px] px-2 items-center justify-center'
            style={[bgColor(backgroundColor || colors.textHighLight.background),
            {
                marginHorizontal: marginX,
                marginVertical: marginY
            }]}>
            <ThemeText fontSize={12}
                color={color || colors.textHighLight.text}
                fontWeight='bold'>
                {children}
            </ThemeText>
        </View>
    )
}

export default TextHighLight