import { shadowImageStyle } from '@/constants/Styles'
import CustomButton from '@/src/components/button/CustomButton'
import Terms from '@/src/components/card/Terms'
import CustomInput from '@/src/components/input/CustomInput'
import MainWrapper from '@/src/components/MainWrapper'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { Link, router } from 'expo-router'
import React from 'react'
import { Image, KeyboardAvoidingView, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { AtSymbolIcon, KeyIcon, PhoneIcon, ShieldCheckIcon } from 'react-native-heroicons/outline'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import AuthProvider from '../../../contexts/auth'

const Register = () => {
    const themeValue = useCustomTheme()
    const { colors, theme } = themeValue

    const shadow = shadowImageStyle(colors.text.dark)

    const [activeScroll, setActiveScroll] = React.useState(false)
    const [input, setInput] = React.useState({
        emailOrPhone: '',
        password: '',
        confirm: ''
    })

    const animation = useAnimatedStyle(() => ({
        height: 100,
        transform: [{ scale: withTiming(activeScroll ? 0.7 : 1) }],
    }))

    const textAnimation = useAnimatedStyle(() => ({
        opacity: activeScroll ? withTiming(0) : withTiming(1)
    }))

    const handleEmailInput = (value: string) => {
        setInput({
            ...input,
            emailOrPhone: value
        })
    }

    const handlePasswordInput = (value: string) => {
        setInput({
            ...input,
            password: value
        })
    }

    const handleConfirmInput = (value: string) => {
        setInput({
            ...input,
            confirm: value
        })
    }

    const isAnyBlank = () => {
        return Object.values(input).some((value) => value === '')
    }

    return (
        <MainWrapper style={{
            alignItems: 'center',
            flex: 1
        }}>
            <KeyboardAvoidingView
                contentContainerStyle={{
                }}
                behavior='height'
                className='self-center border-red-500'>
                {/* logo */}
                <Animated.View
                    style={animation}
                    className='w-full items-center justify-center self-center'>
                    <Image source={theme == 'dark' ? require('@/assets/images/icon-outline.png') : require('@/assets/images/icon.png')} resizeMode='contain' className='w-[150px] h-full'
                        style={{
                        }} />
                </Animated.View>
                {/* slogan */}
                <Animated.View style={textAnimation} className='w-full items-center my-4 self-center'>
                    <ThemeText>Embrace the World within</ThemeText>
                </Animated.View>
                <View className='w-full flex-1 flex-col'>
                    {/* scroll */}
                    <View className='flex-1'>
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
                                }}>Register</ThemeText>

                            {/* input */}
                            <View className='w-full'
                                style={{ rowGap: 16 }}>
                                <CustomInput
                                    value={input.emailOrPhone}
                                    onValueChange={handleEmailInput}
                                    keyboardType={input.emailOrPhone.length > 0 && input.emailOrPhone[0] === '0' ? 'number-pad' : 'email-address'}
                                    placeHolder='Email / Phone Number'
                                    LeftIcon={
                                        input.emailOrPhone.length > 0 && input.emailOrPhone[0] === '0'
                                            ? <PhoneIcon color={colors.icon.highlight} />
                                            : <AtSymbolIcon
                                                color={colors.icon.highlight}
                                            />
                                    } />
                                <CustomInput
                                    value={input.password}
                                    onValueChange={handlePasswordInput}
                                    blockText={true}
                                    placeHolder='Password'
                                    LeftIcon={<KeyIcon color={colors.icon.highlight} />} />
                                <CustomInput
                                    value={input.confirm}
                                    onValueChange={handleConfirmInput}
                                    blockText={true}
                                    placeHolder='Confirm Password'
                                    LeftIcon={
                                        <ShieldCheckIcon
                                            color={colors.icon.highlight}
                                        />} />
                                <Terms />

                                <CustomButton
                                    onPress={() => {
                                        console.log('pressed')
                                        router.replace('/')
                                    }}
                                    disabled={isAnyBlank()}
                                    title='Continue' style={{
                                        width: '100%',
                                    }} />
                            </View>
                        </ScrollView>
                    </View>
                    {/* bottom */}
                    <View className='w-full px-6 self-center h-[50px]'>
                        <ThemeText otherProps={{ textAlign: 'center' }}>You have any problem? Try{" \n"}
                            <Link href={"/"} >
                                <ThemeText
                                    color={colors.icon.highlight}
                                    fontWeight='bold'
                                    otherProps={{
                                        textDecorationLine: 'underline',
                                        padding: 0,
                                        margin: 0
                                    }}>Login</ThemeText>
                            </Link> now
                        </ThemeText>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </MainWrapper >
    )
}

export default Register