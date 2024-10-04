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
    fontSize?: number,
}

const SectionTitle = ({
    title,
    showButton,
    onPress,
    style,
    fontSize = 24 }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    return (
        <View className='items-center justify-between flex-row-reverse h-8 overflow-hidden w-full'
            style={[style]}>
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
                fontSize={fontSize}
                fontWeight='bold'
                color={colors.text.light}
                letterSpacing={3}>{title}</ThemeText>

        </View>
    )
}

export default SectionTitle