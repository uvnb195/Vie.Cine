import { View, Text, ImageSourcePropType, Image } from 'react-native'
import React from 'react'
import ThemeText from '../theme/ThemeText'
import { PADDING_VALUE } from '@/constants/Size'
import { useCustomTheme } from '@/src/contexts/theme'
import { hexToRGBA } from '@/hooks/hexToRGBA'

interface Props {
    width: number,
    height: number,
    src: ImageSourcePropType,
    name: string,
    lastFourDigits: string,
    expired: string,
    isActived?: boolean
}

const CreditCard = ({
    width,
    height,
    src,
    name,
    lastFourDigits,
    expired,
    isActived = false
}: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    return (
        <View className='w-full h-full rounded-[16px]'
            style={{
                width: width,
                height: height,
                padding: PADDING_VALUE.md,
                borderColor: colors.border.default,
                borderWidth: isActived ? 1 : 0,
                backgroundColor: colors.background.default,
            }}>
            <View className='w-full flex-row-reverse items-center justify-between overflow-hidden'>
                {/* content */}

                <Image
                    resizeMethod='resize'
                    resizeMode='contain'
                    source={src}
                    style={{
                        opacity: 0.3,
                        width: width * 20 / 100 - PADDING_VALUE.md,
                        height: height / 2 - PADDING_VALUE.md,
                    }} />
                <View className='flex-1'>
                    <ThemeText
                        numsOfLines={1}
                        letterSpacing={2.5}
                        fontSize={14}
                        fontWeight='light'>**** **** **** 1905</ThemeText>
                </View>

            </View>
            <View className='flex-1 flex-row-reverse justify-between items-center overflow-hidden'>
                <View className='items-center justify-center'>
                    <ThemeText numsOfLines={1}
                        fontSize={14} fontWeight='light'>EXPIRES</ThemeText>
                    <ThemeText numsOfLines={1}
                        fontWeight='bold'>{expired}</ThemeText>
                </View>

                <ThemeText
                    numsOfLines={1}
                    letterSpacing={1}
                    fontWeight='bold'
                    fontSize={12}>{name.toUpperCase()}</ThemeText>
            </View>
        </View>
    )
}

export default CreditCard