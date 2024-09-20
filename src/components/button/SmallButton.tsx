import { useCustomTheme } from '@/src/contexts/theme'
import React from 'react'
import { TouchableOpacity, ViewStyle } from 'react-native'
import ThemeText from '../theme/ThemeText'

interface Props {
    title: string,
    style?: ViewStyle,
    disabled?: boolean,
    onPress?: () => void
}

const SmallButton = ({ title, style, disabled, onPress }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    return (
        <TouchableOpacity
            disabled={disabled}
            className='h-6 rounded-full border items-center justify-center'
            style={[
                {
                    borderColor: colors.border.default,
                    alignSelf: 'flex-start',
                    paddingHorizontal: 8,
                    backgroundColor: disabled
                        ? colors.smallButton.backgroundDisable
                        : colors.smallButton.backgroundDefault,
                },
                style
            ]}
            onPress={onPress}>
            <ThemeText fontSize={12}
                fontWeight={disabled ? 'bold' : 'regular'}
                letterSpacing={1.5}
                color={disabled
                    ? colors.smallButton.textDisable
                    : colors.smallButton.textDefault}>
                {title}
            </ThemeText>
        </TouchableOpacity>
    )
}

export default SmallButton