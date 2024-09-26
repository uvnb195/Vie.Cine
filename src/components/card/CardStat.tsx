import { View, Text } from 'react-native'
import React from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import clsx from 'clsx'
import { StatsType } from './HorizontalCard'
import ThemeText from '../theme/ThemeText'

interface Props {
    stat: StatsType
}

const CardStat = ({ stat }: Props) => {
    const themeValue = useCustomTheme()
    const { colors, theme } = themeValue
    const iconOpacity = theme === 'light' ? 'opacity-70' : 'opacity-50'
    return (
        <View className='flex-row items-start w-full pt-2'>
            <View className={clsx(iconOpacity, 'w-6 h-4 items-center')}>
                {stat.icon}
            </View>
            <View className='flex-1'>
                <ThemeText
                    otherProps={{
                    }} fontSize={12} color={colors.text.light}>
                    {stat.content}
                </ThemeText>
            </View>

        </View>
    )
}

export default CardStat