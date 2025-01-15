import { useCustomTheme } from '@/src/contexts/theme'
import { AppDispatch } from '@/src/redux/store'
import debounce from 'lodash.debounce'
import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import { KeyboardAvoidingView, NativeSyntheticEvent, TextInput, TextInputFocusEventData, TextStyle, View, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { EyeIcon } from 'react-native-heroicons/solid'
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useDispatch } from 'react-redux'
import ThemeText from '../theme/ThemeText'

interface Props {
    style?: ViewStyle,
    textCount?: number,
    placeHolder?: string,
    borderColor?: string,
    placeHolderColor?: string,
    disabled?: boolean,
    textAlgin?: TextStyle['textAlign'],
    LeftIcon?: React.ReactNode,
    keyboardType?: 'default' | 'number-pad' | 'email-address' | 'numeric',
    inputFormatter?: 'date' | 'time' | 'only-numb' | 'default',
    blockText?: boolean,
    onValueChange?: (value: string) => void,
    value?: string,
    useDebounceCallback?: boolean,
    onSubmitEditing?: () => void,
    debounceValue?: number,
    selectOnFocus?: boolean,
    error?: boolean,
    errorMsg?: string,
    lineThrough?: boolean,
    onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void,
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void,
}

const CustomInput = forwardRef<TextInput, Props>(({
    style,
    borderColor,
    placeHolder,
    placeHolderColor,
    disabled = false,
    textAlgin = 'left',
    textCount,
    LeftIcon,
    keyboardType = 'default',
    inputFormatter = 'default',
    blockText = false,
    onSubmitEditing,
    value: initValue,
    onValueChange,
    useDebounceCallback = true,
    debounceValue = 500,
    selectOnFocus,
    error,
    errorMsg,
    lineThrough,
    onFocus,
    onBlur,
}: Props, ref) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [value, setValue] = useState(initValue || "")
    const [focusSection, setFocusSection] = useState<{ start: number, end: number } | undefined>(inputFormatter === 'default' ? undefined : { start: 0, end: 0 })
    const [showInput, setShowInput] = useState(blockText)
    const [iconSize, setIconSize] = useState(8)
    const dispatch = useDispatch<AppDispatch>()

    const translateY = useSharedValue(0)
    const placeHolderTextAnim = useAnimatedStyle(() => ({
        alignSelf: 'flex-start',
        fontSize: interpolate(translateY.value, [-20, 0], [12, 16]),
        transform: [{ translateY: withTiming(translateY.value, { duration: 200, easing: Easing.inOut(Easing.cubic) }) }],
    }))
    const inputAnim = useAnimatedStyle(() => ({
        transform: [{
            translateY: withTiming(interpolate(
                translateY.value,
                [-20, 0],
                [5, 0]
            ), { duration: 300 })
        }],
    }))

    const errorAnim = useAnimatedStyle(() => ({
        height: errorMsg ? withTiming(20) : withTiming(0),
    }))

    const handleSetShowInput = () => {
        setShowInput(!showInput)
    }

    const debouncedHandleValue = useCallback(
        debounce((value: string) =>
            onValueChange && onValueChange(value), debounceValue),
        [onValueChange]);

    const handleInput = (v: string) => {
        if (textCount && v.length > textCount) return
        switch (inputFormatter) {
            case 'date': {
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

                break;
            }
            default: {
                setValue(v)
                break;
            }
        }
    }

    useEffect(() => {
        if (value.length > 0) {
            translateY.value = -20
            errorMsg = ""
        } else translateY.value = 0
        if (!disabled)
            if (useDebounceCallback) {
                debouncedHandleValue(value)
            } else {
                onValueChange && onValueChange(value)
            }

        return () => {
            debouncedHandleValue.cancel()
        }
    }, [value])

    useEffect(() => {
        if (initValue)
            handleInput(initValue || "")
    }, [initValue]);

    return (
        <KeyboardAvoidingView behavior='padding'>
            <View>
                <View className='border rounded-2 flex-row flex-wrap'
                    style={
                        [
                            {
                                height: 55,
                                borderColor: borderColor || (disabled
                                    ? colors.border.disable
                                    : (error || (errorMsg && errorMsg?.length > 0) ? colors.error : colors.border.default)),
                                backgroundColor: colors.background.default
                            }, style]}>
                    {/* icon */}
                    {LeftIcon &&
                        <View
                            onLayout={(e) => setIconSize(e.nativeEvent.layout.width)}
                            style={{
                                width: 40,
                                height: '100%',
                            }}
                            className='items-center justify-center'>
                            {/* <MagnifyingGlassIcon color={colors.icon.highlight} size={24} /> */}
                            {LeftIcon}
                        </View>
                    }

                    {/* content */}
                    <View className='flex-1 justify-center flex-row'>
                        {/* placeholder */}
                        {placeHolder ?
                            <Animated.View
                                className='pl-2 self-start absolute  top-0 bottom-0 left-0 right-0 justify-center'>
                                <ThemeText
                                    color={(error || (errorMsg && errorMsg?.length > 0)) && value.length == 0 ? colors.error : placeHolderColor || colors.text.default}
                                    fontWeight={value.length > 0 ? 'light' : 'regular'}
                                    otherProps={
                                        placeHolderTextAnim}
                                >
                                    {placeHolder}
                                </ThemeText>
                            </Animated.View>
                            : null}
                        {/* input */}
                        <Animated.View
                            style={[inputAnim]}
                            className='flex-1 justify-center'>
                            <TextInput
                                onFocus={(e) => {
                                    // handleInput(value)
                                    if (value.length > 0 && selectOnFocus) {
                                        setFocusSection({
                                            start: 0,
                                            end: value.length
                                        })
                                    }
                                    onFocus && onFocus(e)
                                }}
                                onBlur={(e) => {
                                    onBlur && onBlur(e)
                                }}
                                selection={focusSection}
                                ref={ref}
                                editable={!disabled}
                                value={value}
                                onChangeText={(v) => {
                                    if (inputFormatter !== 'date' && setFocusSection) {
                                        setFocusSection(undefined)
                                    }
                                    handleInput(v)
                                }}
                                secureTextEntry={showInput}
                                numberOfLines={1}
                                selectionColor={colors.text.light}
                                className='px-2 text-base'
                                keyboardType={keyboardType}
                                style={{
                                    height: '100%',
                                    color: colors.text.default,
                                    textAlign: textAlgin,
                                    textDecorationLine: lineThrough ? 'line-through' : 'none',
                                }}
                                onSubmitEditing={onSubmitEditing} />
                        </Animated.View>

                    </View>

                    {/* showTextIcon */}
                    {blockText
                        && <TouchableOpacity
                            className='items-center justify-center'
                            style={{
                                width: 40,
                                height: '100%',
                            }}
                            onPress={handleSetShowInput}>
                            <EyeIcon
                                color={showInput ? colors.text.light : colors.text.default}
                                size={showInput ? 16 : 20} />
                        </TouchableOpacity>}
                </View>
                {/* error */}
                <Animated.View
                    style={errorAnim}
                    className='w-full'>
                    <ThemeText
                        color={colors.error}
                        fontSize={12}
                        fontWeight='bold'>
                        {errorMsg}
                    </ThemeText>
                </Animated.View>
            </View>
        </KeyboardAvoidingView >
    )
})

export default CustomInput