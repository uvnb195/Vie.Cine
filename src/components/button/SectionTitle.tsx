import { View, Text, ViewStyle } from 'react-native'
import React from 'react'
import ThemeText from '../theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import SmallButton from './SmallButton'

interface Props {
    title: string,
    showButton?: boolean,
    onPress?: () => void,
    style?: ViewStyle,
}

const SectionTitle = ({ title, showButton, onPress, style }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    return (
        <View className='items-center justify-between flex-row-reverse px-2 h-[32px] w-full' style={style}>
            {showButton &&
                <View>
                    <SmallButton
                        title='See more'
                        onPress={onPress} />
                </View>}
            <ThemeText
                otherProps={{
                    flexGrow: 1,
                }}
                fontSize={24}
                fontWeight='bold'
                color={colors.text.light}
                letterSpacing={3}>{title}</ThemeText>

        </View>
    )
}

export default SectionTitle