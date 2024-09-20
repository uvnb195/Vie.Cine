import { View, Text, ImageSourcePropType, ViewStyle, Image } from 'react-native'
import React, { useState } from 'react'
import clsx from 'clsx'
import { useCustomTheme } from '@/src/contexts/theme'
import ThemeText from '../theme/ThemeText'
import { StarIcon } from 'react-native-heroicons/solid'
import { shadowImageStyle } from '@/constants/Styles'

interface Props {
    title: string,
    subtitle?: string,
    hasBorder?: boolean,
    imageSoure: ImageSourcePropType,
    style?: ViewStyle,
}

//size default 150x250
const VerticalCard = ({
    title,
    subtitle,
    hasBorder,
    imageSoure,
    style }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const size = {
        width: style?.width || 150,
        height: style?.height || 'auto',
        minHeight: 250
    }

    return (
        <View style={[
            size,
            style,
            // { borderColor: hasBorder ? 'red' : 'transparent' }
        ]}
            className='items-center flex-col justify-around p-2 rounded-4 overflow-hidden'>

            {/* image */}
            <View className='w-full h-3/4 items-center justify-center rounded-2'
                style={shadowImageStyle(colors.text.dark)}>
                <Image
                    source={imageSoure}
                    className='w-full h-full rounded-1'
                    resizeMode='cover' />
            </View>

            {/* title */}
            <View className='w-full h-[40px] justify-center items-start'>
                <ThemeText
                    fontSize={14}
                    fontWeight='bold'
                    color={colors.text.dark}
                    letterSpacing={2}
                    numsOfLines={2}
                >
                    {title}
                </ThemeText>
            </View>


            {/* subtitle */}
            {subtitle &&
                <View className='flex-row items-center overflow-hidden justify-start px-2'>
                    <StarIcon color={colors.icon.highlight} size={16} />
                    <ThemeText
                        color={colors.text.light}
                        otherProps={{ width: '100%' }}
                        fontSize={14}
                        numsOfLines={1}>{subtitle}</ThemeText>
                </View>
            }
        </View>
    )
}

export default VerticalCard