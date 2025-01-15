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
    hasBorder?: boolean,
    textColor?: string,
}

const CustomButton = ({
    title,
    Icon,
    disabled = false,
    onPress,
    style,
    hasBorder = true,
    textColor
}: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            className='self-start items-center justify-center flex-row border'
            style={[
                {
                    borderRadius: 8,
                    borderColor: hasBorder
                        ? (disabled
                            ? colors.border.disable
                            : colors.border.default)
                        : ('transparent'),
                    height: 50,
                    backgroundColor: disabled ?
                        'transparent'
                        : (hasBorder ? colors.background.default : 'transparent'),
                    justifyContent: !title || !Icon ? 'center' : 'space-between'
                },
                style,
            ]}>
            {title &&
                <ThemeText
                    otherProps={{
                        textDecorationLine: hasBorder ? 'none' : 'underline',
                        paddingHorizontal: 8,
                        paddingRight: 4,
                    }}
                    numsOfLines={1}
                    color={
                        disabled
                            ? colors.text.disable
                            : (textColor ? textColor : colors.text.dark)}>{title}</ThemeText>}
            {Icon && <View>
                {Icon}
            </View>}
        </TouchableOpacity >
    )
}

export default CustomButton