import { View, Text, ViewStyle, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ChevronDownIcon, ChevronUpIcon } from 'react-native-heroicons/solid'
import { useCustomTheme } from '@/src/contexts/theme'
import ThemeText from '../theme/ThemeText'
import { PencilSquareIcon } from 'react-native-heroicons/outline'

interface ExpandItemProps {
    style?: ViewStyle,
    title: string,
    data: any,
    expand: boolean,
    handleExpand: (value: boolean) => void
}

const ExpandItem = ({
    style,
    title,
    data,
    expand = false,
    handleExpand }: ExpandItemProps) => {
    const { colors } = useCustomTheme()
    const height = useSharedValue(0)
    const expandAnim = useAnimatedStyle(() => ({
        height: withTiming(height.value, { duration: 500 })
    }))

    useEffect(() => {
        height.value = expand ? 200 : 0
    }, [expand])

    return (
        <View style={style} className='px-2'>
            <TouchableOpacity
                onPress={() => { handleExpand(!expand) }}
                className='flex-row items-center min-h-[40px]'>
                <ThemeText color={expand ? colors.text.dark : colors.text.default}
                    fontWeight={expand ? 'bold' : 'regular'}>{title}</ThemeText>
                <View
                    className='flex-1 mx-2'
                    style={{
                        backgroundColor: expand
                            ? colors.text.dark
                            : colors.text.light,
                        height: expand ? 2 : 1,
                    }} />
                {expand
                    ? <ChevronDownIcon
                        color={colors.icon.highlight} />
                    : <ChevronUpIcon
                        color={colors.icon.highlight} />}
            </TouchableOpacity>
            <Animated.View
                style={expandAnim}
                className='flex-1 w-full overflow-hidden'>
                <View className='flex-row items-center justify-between'>
                    <ThemeText
                        otherProps={{
                            marginLeft: 8,
                            borderWidth: 1,
                            borderRadius: 4,
                            alignSelf: 'flex-start',
                            padding: 8
                        }}>19:45</ThemeText>
                    <View className='flex-1'>
                        <ThemeText
                            otherProps={{
                                paddingHorizontal: 8,
                            }}
                            fontWeight='bold'
                            numsOfLines={2}>Venom: The Last Dance</ThemeText>
                    </View>
                    <Pressable className='mr-2'>
                        <PencilSquareIcon color={colors.icon.highlight} />
                    </Pressable>
                </View>
            </Animated.View>
        </View>
    )
}

export default ExpandItem