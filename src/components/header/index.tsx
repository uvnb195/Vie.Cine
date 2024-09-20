import { View, Text, Pressable } from 'react-native'
import React, { ReactNode } from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { Entypo } from '@expo/vector-icons/'
import ThemeText from '../theme/ThemeText'

interface Props {
    leftIcon?: ReactNode,
    rightIcon?: ReactNode,
    leftIconPress?: () => void,
    rightIconPress?: () => void,
    title?: string,
}

const Header = ({
    leftIcon,
    rightIcon,
    title,
    leftIconPress,
    rightIconPress }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    return (
        <View className='flex-1 flex-row items-center justify-center'>

            {/* icon button */}
            {leftIcon &&
                <Pressable
                    className='h-full w-14 items-start justify-center absolute top-0 bottom-0 left-6'
                    onPress={leftIconPress}>
                    {leftIcon}
                </Pressable>}
            {rightIcon &&
                <Pressable
                    className='h-full w-14 items-end justify-center absolute top-0 bottom-0 right-6'
                    onPress={rightIconPress}>
                    {rightIcon}
                </Pressable>}

            {/* title */}
            <View className='h-full w-full items-center justify-center'>
                <ThemeText
                    letterSpacing={2}
                    fontWeight='regular'
                    fontSize={16}
                    numsOfLines={1}
                    otherProps={{
                        maxWidth: '70%'
                    }}>
                    {title}
                </ThemeText>
            </View>
        </View>
    )
}

export default Header