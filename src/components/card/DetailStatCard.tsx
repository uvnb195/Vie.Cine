import { View, Text, ViewStyle } from 'react-native'
import React from 'react'
import ThemeText from '../theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'

interface Props {
    title: string,
    content: string,
    style?: ViewStyle
}

const DetailStatCard = ({ title, content, style }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    return (
        <View
            className='w-full'
            style={style}>
            <ThemeText
                fontSize={16}
                color={colors.text.light}>{title}</ThemeText>
            <View className='h-1' />
            <ThemeText fontSize={16}
                fontWeight='bold'
                letterSpacing={0.7}
                numsOfLines={1}
            >{content}</ThemeText>
        </View>
    )
}

export default DetailStatCard