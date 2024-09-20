import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline'
import { EyeIcon } from 'react-native-heroicons/solid'
import Animated, { useAnimatedStyle, useDerivedValue, withSequence, withTiming } from 'react-native-reanimated'

interface Props {
    height?: number,
    width?: number,
    placeHolder?: string,
    disabled?: boolean,
    leftIcon?: React.ReactNode,
    keyboardType?: 'default' | 'number-pad' | 'email-address'
}

const SearchInput = ({
    height = 50,
    width,
    placeHolder = "Search ...",
    disabled,
    keyboardType = 'default' }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [input, setInput] = React.useState('')

    const animationValue = useDerivedValue(() => {
        if (input.length === 0) {
            return withSequence(
                withTiming(0, { duration: 100 }),
                withTiming(0, { duration: 100 }),
                withTiming(1, { duration: 100 }),
            )
        } else {
            return 1
        }
    }, [input])

    const animation = useAnimatedStyle(() => ({
        transform: [{ scale: animationValue.value }]
    }))

    return (
        <View className='w-full flex-row items-center rounded-2 border overflow-hidden'
            style={{
                width: width,
                height: height,
                borderColor: disabled
                    ? colors.border.disable
                    : colors.border.default
            }}>


            {/* input */}
            <View className='h-full flex-auto'>
                <TextInput
                    value={input}
                    onChangeText={(text) => {
                        setInput(text)
                    }}
                    numberOfLines={1}
                    selectionColor={colors.text.light}
                    placeholder={placeHolder}
                    placeholderTextColor={colors.text.light}
                    className='px-2 text-base'
                    keyboardType={keyboardType}
                    style={{
                        height: height,
                        color: colors.text.default
                    }} />
            </View>

            {/* icon */}
            <Animated.View style={
                [{
                    width: height - 10,
                    height: height - 10,
                    marginRight: 5,
                    borderColor: input.length === 0
                        ? 'transparent'
                        : (disabled
                            ? colors.border.disable
                            : colors.border.default),
                    backgroundColor: input.length === 0
                        ? 'transparent'
                        : colors.searchIcon
                },
                    animation
                ]}
                className='items-center justify-center border rounded-1'
            >
                {input.length === 0
                    ?
                    <MagnifyingGlassIcon color={colors.icon.highlight} size={24} />
                    :
                    <Pressable
                        onPress={() => {
                            setInput("")
                        }}>
                        <XMarkIcon color={colors.icon.highlight}
                            size={24} />
                    </Pressable>}
            </Animated.View>
        </View>
    )
}

export default SearchInput