import { View, Text, TextInput, Pressable, TextStyle, KeyboardAvoidingView } from 'react-native'
import React, { useEffect } from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { EyeIcon } from 'react-native-heroicons/solid'

interface Props {
    height?: number,
    width?: number,
    placeHolder: string,
    borderColor?: string,
    placeHolderColor?: string,
    disabled?: boolean,
    textAlgin?: TextStyle['textAlign'],
    leftIcon?: React.ReactNode,
    keyboardType?: 'default' | 'number-pad' | 'email-address' | 'numeric',
    blockText?: boolean
}

const CustomInput = ({
    height = 50,
    width,
    borderColor,
    placeHolder,
    placeHolderColor,
    disabled,
    textAlgin = 'left',
    leftIcon,
    keyboardType = 'default',
    blockText = false }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [showInput, setShowInput] = React.useState(blockText)
    const [input, setInput] = React.useState('')

    const handleSetShowInput = () => {
        if (input.length > 0) {
            setShowInput(!showInput)
        }
    }

    const handleTextChange = (text: string) => {
        if (keyboardType === 'number-pad' || keyboardType === 'numeric')
            if (text.includes('.') || text.includes(',') || text.includes('-') || text.includes(' ')) return
        setInput(text)
    }

    return (
        <KeyboardAvoidingView behavior='position'>

            <View className='w-full flex-row items-center rounded-2 border overflow-hidden'
                style={{
                    width: width,
                    height: height,
                    borderColor: borderColor || (disabled
                        ? colors.border.disable
                        : colors.border.default),
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
                        editable={!disabled}
                        value={input}
                        onChangeText={handleTextChange}
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
                        }} />
                </View>

                {/* showTextIcon */}
                {blockText
                    && <Pressable
                        className=' items-center justify-center'
                        style={{
                            width: height,
                            height: height,
                        }}
                        onPress={handleSetShowInput}>
                        <EyeIcon
                            color={showInput ? colors.text.light : colors.text.default}
                            size={24} />
                    </Pressable>}
            </View>
        </KeyboardAvoidingView>
    )
}

export default CustomInput