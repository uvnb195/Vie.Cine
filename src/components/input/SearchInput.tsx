import { View, Text, TextInput, Pressable, ViewStyle } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline'
import { EyeIcon } from 'react-native-heroicons/solid'
import Animated, { useAnimatedStyle, useDerivedValue, withSequence, withTiming } from 'react-native-reanimated'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CustomButton from '../button/CustomButton'

interface Props {
    style?: ViewStyle,
    placeHolder?: string,
    disabled?: boolean,
    leftIcon?: React.ReactNode,
    keyboardType?: 'default' | 'number-pad' | 'email-address',
    onTextChange?: (text: string) => void
}

const SearchInput = ({
    style,
    placeHolder = "Search ...",
    disabled,
    keyboardType = 'default',
    onTextChange }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [input, setInput] = React.useState('')
    const ref = useRef<TextInput | null>(null)

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

    const handleTextChange = (text: string) => {
        setInput(text)
        onTextChange && onTextChange(text)
    }

    const handleClearText = () => {
        setInput("")
        ref.current?.focus()
    }

    return (
        <View className='w-full flex-row-reverse items-center rounded-2 border overflow-hidden'
            style={[
                {
                    height: 50,
                    borderColor: colors.border.default
                },
                style
            ]}>
            {/* icon */}
            <Animated.View
                style={
                    [
                        animation
                    ]}
                className='items-center justify-center rounded-1 w-[50px] h-full'
            >
                {input.length === 0
                    ?
                    <View className='w-full h-full items-center justify-center m-0 p-2'>
                        <MagnifyingGlassIcon color={colors.icon.highlight} size={24} />
                    </View>

                    :
                    <TouchableOpacity
                        onPress={handleClearText}>
                        <CustomButton Icon={
                            <XMarkIcon color={colors.icon.highlight} size={24} />} />
                    </TouchableOpacity>}
            </Animated.View>

            {/* input */}
            <View className='h-full flex-1 '>
                <TextInput
                    ref={ref}
                    value={input}
                    onChangeText={handleTextChange}
                    numberOfLines={1}
                    selectionColor={colors.text.light}
                    placeholder={placeHolder}
                    placeholderTextColor={colors.text.light}
                    className='px-2 text-base'
                    keyboardType={keyboardType}
                    style={{
                        height: '100%',
                        color: colors.text.default
                    }} />
            </View>
        </View>
    )
}

export default SearchInput