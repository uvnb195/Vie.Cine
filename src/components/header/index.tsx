import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React, { ReactNode } from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import { ArrowLeftIcon, ChevronLeftIcon, EllipsisHorizontalIcon } from 'react-native-heroicons/outline'
import { Entypo } from '@expo/vector-icons/'
import ThemeText from '../theme/ThemeText'

interface Props {
    leftIconShown?: boolean,
    rightIconShown?: boolean,
    leftIconPress?: () => void,
    rightIconPress?: () => void,
    title?: string,
}

const Header = ({
    leftIconShown = false,
    rightIconShown = false,
    title,
    leftIconPress,
    rightIconPress }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    return (
        <View className='h-[60px] w-full flex-row items-center px-4'>

            {/* left button */}
            <View className='w-[60px] h-[60px] items-center justify-center'>
                {leftIconShown &&
                    <TouchableOpacity className='w-[60px] h-[60px] items-center justify-center'>
                        <View className='w-8 h-8 items-center justify-center'>
                            <ArrowLeftIcon
                                color={colors.icon.highlight}
                                size={24} />
                        </View>
                    </TouchableOpacity>}
            </View>


            {/* text */}
            <View className='flex-grow h-full items-center justify-center'>
                <ThemeText
                    numsOfLines={1}
                    letterSpacing={4}
                    color={colors.icon.highlight}
                    fontWeight='bold'>{title}</ThemeText>
            </View>

            {/* right button */}
            <View className='w-[60px] h-full items-center justify-center'>
                {
                    rightIconShown &&
                    <TouchableOpacity className='w-[60px] h-[60px] items-center justify-center'>
                        <EllipsisHorizontalIcon
                            color={colors.icon.highlight}
                            size={32} />
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default Header