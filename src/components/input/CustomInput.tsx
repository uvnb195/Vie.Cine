import { View, Text, TextInput, Pressable, TextStyle, KeyboardAvoidingView } from 'react-native'
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { EyeIcon } from 'react-native-heroicons/solid'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import debounce from 'lodash.debounce'
import ThemeText from '../theme/ThemeText'
import Animated, { useAnimatedStyle, useDerivedValue, withSpring, withTiming } from 'react-native-reanimated'

interface Props {
    height?: number,
    width?: number,
    placeHolder: string,
    borderColor?: string,
    placeHolderColor?: string,
    disabled?: boolean,
    textAlgin?: TextStyle['textAlign'],
    LeftIcon?: React.ReactNode,
    keyboardType?: 'default' | 'number-pad' | 'email-address' | 'numeric',
    inputFormatter?: 'date' | 'only-numb' | 'default',
    blockText?: boolean,
    handleValue?: (value: string) => void,
    initValue?: string,
    useDebounceCallback?: boolean,
    onSubmitEditing?: () => void
}

const CustomInput = forwardRef<TextInput, Props>(({
    height = 50,
    width,
    borderColor,
    placeHolder,
    placeHolderColor,
    disabled = false,
    textAlgin = 'left',
    LeftIcon,
    keyboardType = 'default',
    inputFormatter = 'default',
    blockText = false,
    onSubmitEditing,
    initValue,
    handleValue,
    useDebounceCallback = true }: Props, ref) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [value, setValue] = useState(initValue || "")
    const [focusSection, setFocusSection] = useState<{ start: number, end: number } | undefined>(inputFormatter === 'default' ? undefined : { start: 0, end: 0 })
    const [showInput, setShowInput] = useState(blockText)
    const [iconSize, setIconSize] = useState(8)

    const opacity = useDerivedValue(() => {
        return value.length > 0 ? 1 : 0
    }, [value])

    const placeholderAnim = useAnimatedStyle(() => ({
        left: iconSize,
        opacity: opacity.value
    }))

    const handleSetShowInput = () => {
        setShowInput(!showInput)
    }

    const debouncedHandleValue = useCallback(
        debounce((value: string) =>
            handleValue && handleValue(value), 300),
        [handleValue]);

    const handleInput = (v: string) => {
        if (inputFormatter === 'default') {
            setValue(v)
            return
        }
        if (inputFormatter === 'date') {
            const oldV = value
            if (v.length > 10) {
                setValue(v.substring(0, 9) + v.substring(10))
                return
            }
            const format = '__/__/____'
            const newV = v + format.slice(value.length)
            if (oldV.length !== 0 && oldV.length > newV.length) {
                let deletedDate = oldV.substring(0, oldV.indexOf('_') === -1 ? 10 : oldV.indexOf('_'))
                if (deletedDate[deletedDate.length - 1] === '/') {
                    deletedDate = deletedDate.substring(0, deletedDate.length - 2)
                } else {
                    deletedDate = deletedDate.substring(0, deletedDate.length - 1)
                }
                setValue(deletedDate + format.slice(deletedDate.length))
                setFocusSection({
                    start: deletedDate.length,
                    end: deletedDate.length + 1
                })
            } else {
                if (newV.length > 10) return
                setValue(newV)
                setFocusSection({
                    start: newV.indexOf('_') === -1 ? newV.length - 1 : newV.indexOf('_'),
                    end: newV.indexOf('_') === -1 ? newV.length : newV.indexOf('_') + 1
                })
            }
        }
    }

    useEffect(() => {
        if (!disabled)
            if (useDebounceCallback) {
                debouncedHandleValue(value)
            } else {
                handleValue && handleValue(value)
            }


        return () => {
            debouncedHandleValue.cancel()
        }
    }, [value])

    useEffect(() => {
        if (initValue)
            handleInput(initValue)
    }, [initValue])

    return (
        <KeyboardAvoidingView behavior='padding' >
            <View className='w-full flex-row items-center rounded-2 border'
                style={{
                    width: width,
                    height: height,
                    borderColor: borderColor || (disabled
                        ? colors.border.disable
                        : colors.border.default),
                    backgroundColor: hexToRGBA(colors.background.default, 0.7)
                }}>
                {/* placeholder */}
                <Animated.View
                    className='absolute top-[-12px]'
                    style={[placeholderAnim]}>
                    <ThemeText
                        fontSize={12}
                        letterSpacing={1}
                        otherProps={{
                            backgroundColor: colors.background.default,
                            paddingHorizontal: 2,
                            borderRadius: 4,
                        }}>{placeHolder}</ThemeText>
                </Animated.View>
                {/* icon */}
                {LeftIcon &&
                    <View
                        onLayout={(e) => setIconSize(e.nativeEvent.layout.width)}
                        style={{
                            width: height,
                            height: height,
                        }}
                        className='items-center justify-center'>
                        {/* <MagnifyingGlassIcon color={colors.icon.highlight} size={24} /> */}
                        {LeftIcon}
                    </View>
                }

                {/* input */}
                <View className='h-full flex-auto'>
                    <TextInput
                        onFocus={() => {
                            handleInput(value)
                        }}
                        selection={focusSection}
                        ref={ref}
                        editable={!disabled}
                        value={value}
                        onChangeText={handleInput}
                        secureTextEntry={showInput}
                        numberOfLines={1}
                        selectionColor={colors.text.light}
                        placeholder={placeHolder}
                        placeholderTextColor={placeHolderColor || colors.text.light}
                        className='px-2 text-base'
                        keyboardType={keyboardType}
                        style={{
                            height: height,
                            color: colors.text.default,
                            textAlign: textAlgin
                        }}
                        onSubmitEditing={onSubmitEditing} />
                </View>

                {/* showTextIcon */}
                {blockText
                    && <TouchableOpacity
                        className=' items-center justify-center'
                        style={{
                            width: height,
                            height: height,
                        }}
                        onPress={handleSetShowInput}>
                        <EyeIcon
                            color={showInput ? colors.text.light : colors.text.default}
                            size={showInput ? 16 : 20} />
                    </TouchableOpacity>}
            </View>
        </KeyboardAvoidingView>
    )
})

export default CustomInput