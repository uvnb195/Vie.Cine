import { View, Text, KeyboardAvoidingView, TextInput, ViewStyle, DimensionValue } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useCustomTheme } from '@/src/contexts/theme'

interface Props {
    width?: DimensionValue,
    height?: DimensionValue,
    fontSize?: number,
    placeHolder?: string,
    style?: ViewStyle,
    disabled?: boolean,
    onSubmitEditing?: (text: string) => void,
    maxLetters?: number,
    upperCase?: boolean,
    onBlur?: () => void
}

const OutlinedTextInput = ({
    width,
    height,
    fontSize,
    placeHolder,
    style,
    disabled,
    onSubmitEditing,
    maxLetters,
    upperCase,
    onBlur }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [input, setInput] = React.useState('')

    const ref = useRef<TextInput>(null)

    useEffect(() => {
        ref.current?.focus()
    }, [])

    return (

        <KeyboardAvoidingView behavior='padding'>
            <View className='w-full flex-row items-center rounded-2 overflow-hidden'
                style={[{
                    width: width,
                    height: height,
                },
                    style]}>
                <TextInput
                    onBlur={onBlur}
                    onSubmitEditing={() =>
                        onSubmitEditing && onSubmitEditing(input)}
                    selectionColor={colors.text.light}
                    ref={ref}
                    editable={!disabled}
                    placeholder={placeHolder || 'Search'}
                    placeholderTextColor={colors.text.disable}
                    style={{
                        height: '100%',
                        width: '100%',
                        fontFamily: 'Roboto',
                        letterSpacing: 1,
                        color: colors.text.default,
                        fontSize: fontSize || 16,
                    }}
                    value={input}
                    autoCapitalize={upperCase ? 'characters' : 'none'}
                    onChangeText={(text) => {
                        if (!maxLetters) {
                            setInput(text)
                            return
                        }
                        if (text.length > maxLetters) {
                            setInput(text.slice(text.length - maxLetters))
                        } else {
                            setInput(text)
                        }

                    }}
                />
            </View>
        </KeyboardAvoidingView>
    )
}

export default OutlinedTextInput