import { View, Text, Image, KeyboardAvoidingView, BackHandler } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import MainWrapper from '@/src/components/MainWrapper'
import { useCustomTheme } from '@/src/contexts/theme'
import { shadowImageStyle } from '@/constants/Styles'
import ThemeText from '@/src/components/theme/ThemeText'
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import { ScrollView } from 'react-native-gesture-handler'
import CustomInput from '@/src/components/input/CustomInput'
import { AtSymbolIcon, KeyIcon, PhoneIcon } from 'react-native-heroicons/outline'
import Terms from '@/src/components/card/Terms'
import CustomButton from '@/src/components/button/CustomButton'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { Link, router } from 'expo-router'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { auth } from '@/src/api/firebase/config'
import AuthProvider, { useAuth } from '@/src/contexts/auth'

const Login = () => {
    const themeValue = useCustomTheme()
    const { colors, theme } = themeValue

    const {
        emailOrPhone,
        password,
        setEmailOrPhone,
        setPassword,
        checkEmailOrPhoneType,
        loading,
        setLoading,
        showNoti
    } = useAuth()

    const [activeScroll, setActiveScroll] = React.useState(false)

    const [emailError, setEmailError] = React.useState<string | string[]>('')
    const [passwordError, setPasswordError] = React.useState<string | string[]>('')

    const animation = useAnimatedStyle(() => ({
        height: 100,
        transform: [{ scale: withTiming(activeScroll ? 0.7 : 1) }],
    }))

    const textAnimation = useAnimatedStyle(() => ({
        opacity: activeScroll ? withTiming(0) : withTiming(1)
    }))

    const handleEmailInput = (value: string) => {
        const { isValid, msg } = setEmailOrPhone(value)
        if (isValid) {
            setEmailError('')
        } else {
            setEmailError(msg!!)
        }
    }

    const handlePasswordInput = (value: string) => {
        const { isValid, msg } = setPassword(value)
        if (isValid) {
            setPasswordError('')
        } else {
            setPasswordError(msg!!)
        }
    }

    const handleSubmit = () => {
        setLoading(true)
        if (emailError || passwordError) return
        const type = checkEmailOrPhoneType(emailOrPhone)
        switch (type) {
            case 'email': {
                createUserWithEmailAndPassword(auth, emailOrPhone, password).then((userCredential) => {
                    console.log('user credential:::::::::::::', userCredential)
                })
                    .catch((error: Error) => {
                        console.log(error.message)
                    })
                    .finally(() => {
                        setLoading(false)
                        router.replace('/')
                    })
            }
                return
            case 'phone': {
                showNoti('Phone number is not supported yet')
                setLoading(false)
                return
            }
            default: return
        }
    }

    const renderError = (error: string | string[]) => {
        if (typeof error === 'string') {
            return <ThemeText
                color={colors.error}
                fontSize={12}
                otherProps={{ textAlign: 'left' }}>{error}</ThemeText>
        } else {
            return error.map((err, index) => {
                return <ThemeText

                    color={colors.error}
                    fontSize={12}
                    key={index}
                    otherProps={{ textAlign: 'left' }}>{err}</ThemeText>
            })
        }
    }


    return (
        <MainWrapper style={{
            alignItems: 'center',
            flex: 1
        }}>
            <KeyboardAvoidingView
                behavior='height'
                className='self-center'>
                {/* logo */}
                <Animated.View
                    style={animation}
                    className='w-full items-center justify-center self-center'>
                    <Image source={theme == 'dark' ? require('@/assets/images/icon-outline.png') : require('@/assets/images/icon.png')} resizeMode='contain' className='w-[150px] h-full' />
                </Animated.View>
                {/* slogan */}
                <Animated.View style={textAnimation} className='w-full items-center my-4 self-center'>
                    <ThemeText>Embrace the World within</ThemeText>
                </Animated.View>
                <View className='flex-1 w-full flex-col'>
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
                                }}>Login</ThemeText>

                            {/* input */}
                            <View className='w-full'
                                style={{ rowGap: 16 }}>
                                <View>
                                    <CustomInput
                                        value={emailOrPhone}
                                        onValueChange={handleEmailInput}
                                        keyboardType={emailOrPhone.length > 0 && emailOrPhone[0] === '0' ? 'number-pad' : 'email-address'}
                                        placeHolder='Email / Phone Number'
                                        LeftIcon={
                                            emailOrPhone.length > 0 && emailOrPhone[0] === '0'
                                                ? <PhoneIcon color={colors.icon.highlight} />
                                                : <AtSymbolIcon
                                                    color={colors.icon.highlight}
                                                />} />
                                    {emailError && renderError(emailError)}
                                </View>
                                <View>
                                    <CustomInput
                                        value={password}
                                        onValueChange={handlePasswordInput}
                                        blockText={true}
                                        placeHolder='Password'
                                        LeftIcon={<KeyIcon color={colors.icon.highlight} />} />

                                    {passwordError && renderError(passwordError)}
                                </View>
                                <Terms />

                                <CustomButton
                                    onPress={handleSubmit}
                                    disabled={emailError || passwordError ? true : (emailOrPhone.length === 0 || password.length === 0) ? true : false}
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
                </View>
            </KeyboardAvoidingView>
        </MainWrapper>
    )
}

export default Login