import { View, Text, ViewStyle } from 'react-native'
import React from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import CustomButton from '../button/CustomButton'
import { Feather } from '@expo/vector-icons'

interface Props {
    style?: ViewStyle,
    title: string,
    Icon?: React.ReactNode,
    selected?: boolean,
    onPress?: () => void
}

const Chip = ({
    title,
    selected,
    style,
    onPress,
    Icon }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    return (
        <CustomButton
            onPress={onPress}
            textColor={selected ? colors.text.dark : colors.icon.enable}
            style={
                {
                    borderColor: selected ? colors.border.default : colors.icon.disable,
                    ...style,
                    minWidth: 72,
                }}
            title={title}
            Icon={Icon ? Icon : selected
                ? <Feather
                    name='check-circle'
                    size={16}
                    color={colors.icon.highlight} />
                : <Feather
                    name='circle'
                    size={16}
                    color={colors.icon.enable} />
            } />
    )
}

export default Chip