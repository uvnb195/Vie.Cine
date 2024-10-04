import { View, Text, TextInput, Pressable, TextStyle, KeyboardAvoidingView } from 'react-native'
import React, { forwardRef, useEffect } from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { EyeIcon } from 'react-native-heroicons/solid'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { hexToRGBA } from '@/hooks/hexToRGBA'

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
    blockText?: boolean,
    value?: string,
    onValueChange?: (value: string) => void,
    onSubmitEditing?: () => void
}

const CustomInput = forwardRef<TextInput, Props>(({
    height = 50,
    width,
    borderColor,
    placeHolder,
    placeHolderColor,
    disabled,
    textAlgin = 'left',
    LeftIcon: leftIcon,
    keyboardType = 'default',
    blockText = false,
    value,
    onValueChange,
    onSubmitEditing }: Props, ref) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [enableShowButton, setEnableShowButton] = React.useState(false)
    const [showInput, setShowInput] = React.useState(blockText)

    const handleSetShowInput = () => {
        setShowInput(!showInput)
    }

    return (
        <KeyboardAvoidingView behavior='padding' >

            <View className='w-full flex-row items-center rounded-2 border overflow-hidden'
                style={{
                    width: width,
                    height: height,
                    borderColor: borderColor || (disabled
                        ? colors.border.disable
                        : colors.border.default),
                    backgroundColor: hexToRGBA(colors.background.default, 0.7)
                }}>
                {/* icon */}
                {
                    leftIcon &&
                    <View style={{
                        width: height,
                        height: height,
                    }}
                        className='items-center justify-center'>
                        {/* <MagnifyingGlassIcon color={colors.icon.highlight} size={24} /> */}
                        {leftIcon}
                    </View>
                }


                {/* input */}
                <View className='h-full flex-auto'>
                    <TextInput
                        ref={ref}
                        editable={!disabled}
                        value={value}
                        onChangeText={(value) => {
                            if (value.length > 0) {
                                setEnableShowButton(true)
                            } else {
                                setEnableShowButton(false)
                            }
                            onValueChange && onValueChange(value)
                        }}
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
                        disabled={!enableShowButton}
                        className=' items-center justify-center'
                        style={{
                            width: height,
                            height: height,
                        }}
                        onPress={handleSetShowInput}>
                        <EyeIcon
                            color={showInput ? colors.text.light : colors.text.default}
                            size={24} />
                    </TouchableOpacity>}
            </View>
        </KeyboardAvoidingView>
    )
})

export default CustomInput