import { View, Text, ImageSourcePropType, ViewStyle, Image, ScrollView } from 'react-native'
import React, { ReactNode } from 'react'
import clsx from 'clsx'
import { useCustomTheme } from '@/src/contexts/theme'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import ThemeText from '../theme/ThemeText'
import { bgColor } from '@/constants/Styles'
import TextHighLight from './TextHighLight'

export interface StatsType {
    content: string,
    icon: ReactNode,
}

interface Props {
    image: ImageSourcePropType,
    title: string,
    stats: StatsType[],
    sortTag: string[],
    className?: string,
    style: ViewStyle,
    hasBorder?: boolean
}

// must have size
const HorizontalCard = ({
    image,
    title,
    stats,
    sortTag,
    className,
    style,
    hasBorder }: Props) => {
    const themeValue = useCustomTheme()
    const { colors, theme } = themeValue
    const iconOpacity = theme === 'light' ? 'opacity-70' : 'opacity-50'

    const renderStats = () => {
        return stats.map((stat, index) => (
            <View key={index} className='flex-row items-center'>
                <View className={clsx(iconOpacity, 'pr-1')}>
                    {stat.icon}
                </View>
                <ThemeText fontSize={16} color={colors.text.light}
                    numsOfLines={1}>
                    {stat.content}
                </ThemeText>
            </View>
        ))
    }

    const renderSortTag = () => {
        return sortTag.map((tag, index) => (
            <TextHighLight key={index} marginX={4}>
                {tag}
            </TextHighLight>
        ))
    }
    return (
        <View style={[
            {
                borderColor: hasBorder
                    ? colors.border.default
                    : 'transparent'
            },
            style]}
            className={clsx(
                'flex-row rounded-4 border overflow-hidden',
                className
            )}>
            <Image
                source={image}
                resizeMode='cover'
                className='w-1/3 h-full rounded-2' />
            <View className='flex-1 ml-2 gapy-2'>
                <ThemeText fontSize={16}
                    fontWeight='bold'
                    letterSpacing={2.5}>
                    {title}
                </ThemeText>

                {/* stats */}
                {renderStats()}

                {/* sort tag */}
                <View className='h-5 w-full flex-row gap-x-2 mt-2'>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {renderSortTag()}
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}

export default HorizontalCard