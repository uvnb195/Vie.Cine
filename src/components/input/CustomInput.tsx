import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { EyeIcon } from 'react-native-heroicons/solid'

interface Props {
    height?: number,
    width?: number,
    placeHolder: string,
    disabled?: boolean,
    leftIcon?: React.ReactNode,
    keyboardType?: 'default' | 'number-pad' | 'email-address',
    blockText?: boolean
}

const CustomInput = ({
    height = 50,
    width,
    placeHolder,
    disabled,
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

    return (
        <View className='w-full flex-row items-center rounded-2 border overflow-hidden'
            style={{
                width: width,
                height: height,
                borderColor: disabled
                    ? colors.border.disable
                    : colors.border.default
            }}>
            {/* icon */}
            <View style={{
                width: height,
                height: height,
            }}
                className='items-center justify-center'>
                <MagnifyingGlassIcon color={colors.icon.highlight} size={24} />
            </View>

            {/* input */}
            <View className='h-full flex-auto'>
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    secureTextEntry={showInput}
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
    )
}

export default CustomInput