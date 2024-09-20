import { View, Text } from 'react-native'
import React, { ReactNode } from 'react'
import { bgColor } from '@/constants/Styles'
import { useCustomTheme } from '@/src/contexts/theme'
import ThemeText from '../theme/ThemeText'

interface Props {
    children: ReactNode,
    marginX?: number,
    marginY?: number,
}

const TextHighLight = ({
    children,
    marginX,
    marginY }: Props) => {
    const themeValue = useCustomTheme()
    const { colors, theme } = themeValue

    return (
        <View className='rounded-full min-w-[40px] px-2 items-center justify-center'
            style={[bgColor(colors.background.highlight),
            {
                marginHorizontal: marginX,
                marginVertical: marginY
            }]}>
            <ThemeText fontSize={12}
                color={colors.text.highlight}
                fontWeight='bold'>
                {children}
            </ThemeText>
        </View>
    )
}

export default TextHighLight