import { View, Text, StyleProp, TextStyle } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useCustomTheme } from '@/src/contexts/theme'
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline'
import { TouchableOpacity } from '@gorhom/bottom-sheet'

interface Props {
    style?: TextStyle,
    numberOfLines?: number,
    placeHolder?: string,
    onTextChange?: (text: string) => void
}

const CustomSearchOutLine = ({
    style,
    placeHolder,
    onTextChange,
    numberOfLines }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [input, setInput] = React.useState('')

    const handleTextChange = (text: string) => {
        setInput(text)
        onTextChange && onTextChange(text)
    }
    return (
        <View className='flex-row items-center'>
            <TextInput
                placeholderTextColor={colors.text.light}
                placeholder={placeHolder}
                value={input}
                onChangeText={handleTextChange}
                className='flex-1'
                selectionColor={colors.text.light}
                style={[
                    { color: colors.text.default },
                    style]}
                numberOfLines={numberOfLines} />
            <View className='items-center h-full w-12 justify-center pr-4' >
                <TouchableOpacity
                    onPress={() => handleTextChange('')}
                    disabled={input.length == 0}>
                    {input.length > 0 ? <XMarkIcon color={colors.text.highlight} /> : <MagnifyingGlassIcon color={colors.icon.enable} />}
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CustomSearchOutLine