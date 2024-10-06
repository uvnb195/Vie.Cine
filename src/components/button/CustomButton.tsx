import { View, Text, ViewStyle, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import ThemeText from '../theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { hexToRGBA } from '@/hooks/hexToRGBA'

interface Props {
    title?: string,
    Icon?: React.ReactNode | undefined,
    disabled?: boolean,
    onPress?: () => void,
    style?: ViewStyle,
    hasBorder?: boolean
}

const CustomButton = ({
    title,
    Icon,
    disabled = false,
    onPress,
    style,
    hasBorder = true
}: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            className='self-start items-center flex-row px-2 border'
            style={[
                {
                    borderRadius: 8,
                    borderColor: hasBorder
                        ? (disabled
                            ? colors.border.disable
                            : colors.border.default)
                        : ('transparent'),
                    minWidth: title ? 80 : undefined,
                    height: 50,
                    backgroundColor: disabled ?
                        'transparent'
                        : hexToRGBA(colors.background.default, 0.5),
                    justifyContent: !title || !Icon ? 'center' : 'space-between'
                },
                style
            ]}>
            {title &&
                <ThemeText
                    otherProps={{
                        textDecorationLine: hasBorder ? 'none' : 'underline',
                    }}
                    numsOfLines={1}
                    color={
                        disabled
                            ? colors.text.disable
                            : colors.text.dark}>{title}</ThemeText>}
            {Icon && <View className='pl-2'
                style={{
                    paddingLeft: title ? 8 : 0
                }}>
                {Icon}
            </View>}
        </TouchableOpacity>
    )
}

export default CustomButton