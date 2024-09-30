import { View, Text, ViewStyle, Pressable, Touchable } from 'react-native'
import React from 'react'
import ThemeText from '../theme/ThemeText'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Link } from 'expo-router'
import { useCustomTheme } from '@/src/contexts/theme'

interface Props {
    style?: ViewStyle
}

const Terms = ({ style }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    return (
        <View className='w-full' style={style}>
            <ThemeText
                otherProps={{
                    textAlign: 'center',
                    paddingHorizontal: 24
                }}>By proceeding. You agree to the{" "}
                <Link href={"/"} onPress={() => console.log('pressed')}>
                    <ThemeText
                        color={colors.icon.highlight}
                        fontWeight='bold'
                        otherProps={{
                            textDecorationLine: 'underline',
                            padding: 0,
                            margin: 0
                        }}>Terms</ThemeText>
                </Link>
                {" "}&{" "}
                <Link href={"/"} onPress={() => console.log('pressed')}>
                    <ThemeText
                        color={colors.icon.highlight}
                        fontWeight='bold'
                        otherProps={{
                            textDecorationLine: 'underline', padding: 0,
                            margin: 0
                        }}>Privacy</ThemeText>
                </Link>
            </ThemeText>
        </View>
    )
}

export default Terms