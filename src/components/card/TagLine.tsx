import { View, Text, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import clsx from 'clsx'
import ThemeText from '../theme/ThemeText'

interface Props {
    title: string,
    value: string,
    contentStyle?: ViewStyle,
    titleStyle?: TextStyle,
    valueStyle?: TextStyle,
    valueNumsOfLines?: number
}

const TagLine = ({
    title,
    value,
    contentStyle,
    titleStyle,
    valueStyle,
    valueNumsOfLines

}: Props) => {
    const { colors, currentTheme } = useCustomTheme()
    const iconOpacity = currentTheme === 'light' ? 'opacity-70' : 'opacity-50'
    return (
        <View
            className='flex-row w-full items-start justify-between border-b-2 mb-2'
            style={[
                { borderColor: colors.border.default },
                contentStyle
            ]}>
            <ThemeText
                numsOfLines={1}
                otherProps={{
                    paddingTop: 8,
                    ...titleStyle
                }}>{title + " :"}</ThemeText>
            <ThemeText
                numsOfLines={valueNumsOfLines}
                fontWeight='bold'
                otherProps={{
                    paddingLeft: 8,
                    fontSize: 20,
                    flex: 1,
                    textAlign: value.length > 50 ? 'justify' : 'right',
                    ...valueStyle
                }}>{value}</ThemeText>
        </View>
    )
}

export default TagLine