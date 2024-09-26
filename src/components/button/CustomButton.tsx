import { View, Text, ViewStyle, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import ThemeText from '../theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'

interface Props {
    height?: number,
    width?: number,
    title?: string,
    icon?: React.ReactNode,
    disabled?: boolean,
    onPress?: () => void,
    style?: ViewStyle,
    hasBorder?: boolean
}

const CustomButton = ({ title, icon,
    disabled,
    onPress,
    height = 40,
    width,
    style,
    hasBorder = true
}: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            className='self-start items-center justify-center flex-row px-2 rounded-2 border'
            style={[
                {
                    width: width, height,
                    borderColor: hasBorder
                        ? (disabled
                            ? colors.border.disable
                            : colors.border.default)
                        : ('transparent'),
                    minWidth: width && width < 80 ? width : 80
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
            {icon && <View className='pl-2'
                style={{
                    paddingLeft: title ? 8 : 0
                }}>
                {icon}
            </View>}
        </TouchableOpacity>
    )
}

export default CustomButton