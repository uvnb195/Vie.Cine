import { View, Text, Image } from 'react-native'
import React from 'react'
import MainWrapper from '@/src/components/MainWrapper'
import { useCustomTheme } from '@/src/contexts/theme'
import { shadowImageStyle } from '@/constants/Styles'
import ThemeText from '@/src/components/theme/ThemeText'
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import { ScrollView } from 'react-native-gesture-handler'
import CustomInput from '@/src/components/input/CustomInput'
import { AtSymbolIcon, KeyIcon } from 'react-native-heroicons/outline'
import Terms from '@/src/components/card/Terms'
import CustomButton from '@/src/components/button/CustomButton'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { Link, router } from 'expo-router'

const Login = () => {
    const themeValue = useCustomTheme()
    const { colors, theme } = themeValue

    const shadow = shadowImageStyle(colors.text.dark)

    const [activeScroll, setActiveScroll] = React.useState(false)

    const height = useDerivedValue(() => {
        return activeScroll ? 100 : 200
    }, [activeScroll])

    const animation = useAnimatedStyle(() => ({
        height: withTiming(height.value),
        paddingHorizontal: activeScroll ? 0 : 24,
        marginTop: activeScroll ? 48 : 0
    }))

    return (
        <MainWrapper style={{
            alignItems: 'center',
            flex: 1
        }}>
            {/* logo */}
            <Animated.View
                style={animation}
                className='w-full items-center justify-center'>
                <Image source={theme == 'dark' ? require('@/assets/images/icon-outline.png') : require('@/assets/images/icon.png')} resizeMode='contain' className='w-[150px] h-full'
                    style={{
                    }} />
            </Animated.View>
            {/* slogan */}
            <View className='w-full items-center my-4'>
                <ThemeText>Embrace the World within</ThemeText>
            </View>

            {/* scroll */}
            <View className='flex-1 w-full'>
                <ScrollView
                    bounces={false}
                    decelerationRate={0}
                    contentContainerStyle={{
                        paddingVertical: 24,
                        paddingHorizontal: 24
                    }}
                    onScroll={e => (e.nativeEvent.contentOffset.y > 0 ? setActiveScroll(true) : setActiveScroll(false))}>
                    <ThemeText
                        fontSize={40}
                        fontWeight='regular'
                        letterSpacing={2}
                        otherProps={{
                            textAlign: 'center',
                            paddingBottom: 48
                        }}>Login</ThemeText>

                    {/* input */}
                    <View className='w-full'
                        style={{ rowGap: 16 }}>

                        <CustomInput placeHolder='Email'
                            LeftIcon={<AtSymbolIcon color={colors.icon.highlight} />} />
                        <CustomInput
                            blockText={true}
                            placeHolder='Password'
                            LeftIcon={<KeyIcon color={colors.icon.highlight} />} />
                        <Terms />

                        <CustomButton

                            onPress={() => {
                                router.push('/(auth)/register')
                            }}
                            disabled={false}
                            title='Continue' style={{
                                width: '100%',
                            }} />
                    </View>
                </ScrollView>

            </View>
            {/* bottom */}
            <View className='w-full px-6'>
                <ThemeText otherProps={{ textAlign: 'center' }}>You have any problem? Try{" \n"}
                    <Link href={"/"} onPress={() => console.log('pressed')}>
                        <ThemeText
                            color={colors.icon.highlight}
                            fontWeight='bold'
                            otherProps={{
                                textDecorationLine: 'underline',
                                padding: 0,
                                margin: 0
                            }}>Register</ThemeText>
                    </Link> or{" "}
                    <Link href={"/"} onPress={() => console.log('pressed')}>
                        <ThemeText
                            color={colors.icon.highlight}
                            fontWeight='bold'
                            otherProps={{
                                textDecorationLine: 'underline',
                                padding: 0,
                                margin: 0
                            }}>Reset Password</ThemeText>
                    </Link>
                </ThemeText>
            </View>
        </MainWrapper>
    )
}

export default Login