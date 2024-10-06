import { auth } from '@/src/api/firebase/config'
import CustomButton from '@/src/components/button/CustomButton'
import Terms from '@/src/components/card/Terms'
import CustomInput from '@/src/components/input/CustomInput'
import MainWrapper from '@/src/components/MainWrapper'
import ThemeText from '@/src/components/theme/ThemeText'
import { useAuth } from '@/src/contexts/auth'
import { useCustomTheme } from '@/src/contexts/theme'
import { setLoading } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { Link, router } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect } from 'react'
import { Image, KeyboardAvoidingView, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { AtSymbolIcon, KeyIcon, PhoneIcon } from 'react-native-heroicons/outline'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'

const Login = () => {
    const themeValue = useCustomTheme()
    const { colors, currentTheme: theme } = themeValue
    const dispatch = useDispatch<AppDispatch>()
    const { userInfo } = useSelector((state: RootState) => state.public)

    const {
        emailOrPhone,
        password,
        setEmailOrPhone,
        setPassword,
        checkEmailOrPhoneType,
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

    const handleSubmit = async () => {
        dispatch(setLoading(true))
        if (emailError || passwordError) return
        const type = checkEmailOrPhoneType(emailOrPhone)
        switch (type) {
            case 'email': {
                const validation = await signInWithEmailAndPassword(auth, emailOrPhone, password)
                    .catch(err => {
                        console.log(err.code)
                        switch (err.code) {
                            case 'auth/user-not-found': {
                                showNoti('User not found')
                                break
                            }
                            case 'auth/wrong-password': {
                                showNoti('Wrong password')
                                break
                            }
                            case 'auth/too-many-requests': {
                                showNoti('Please restart your app and try again')
                                break
                            }
                            default: {
                                showNoti('Something went wrong')
                                break
                            }
                        }
                    })
                dispatch(setLoading(false))
                console.log(validation)
                break;
            }
            case 'phone': {
                showNoti('Phone number is not supported yet')
                dispatch(setLoading(false))
                return
            }
            default: {
                showNoti('Invalid email or phone number')
                return
            }
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

    useEffect(() => {
        if (userInfo)
            router.dismissAll()
    }, [userInfo])

    return (
        <MainWrapper
            loadingLayer={false}
            style={{
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
                            <ThemeText
                                onPress={() => router.replace('/routes/(auth)/register')}
                                color={colors.icon.highlight}
                                fontWeight='bold'
                                otherProps={{
                                    textDecorationLine: 'underline',
                                    padding: 0,
                                    margin: 0
                                }}>Register</ThemeText>
                            or{" "}
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