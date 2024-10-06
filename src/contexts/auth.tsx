import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated as RNAnimated, Easing, ImageBackground, View, BackHandler } from "react-native";
import { useCustomTheme } from "./theme";
import { hexToRGBA } from "@/hooks/hexToRGBA";
import { shadowImageStyle } from "@/constants/Styles";
import ThemeText from "../components/theme/ThemeText";
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

interface UserCredentials {
    emailOrPhone: string,
    setEmailOrPhone: (value: string) => ({
        isValid: boolean,
        msg?: string | string[]
    }),
    password: string,
    setPassword: (value: string) => ({
        isValid: boolean,
        msg?: string | string[]
    }),
    checkEmailOrPhoneType: (value: string) => 'email' | 'phone' | undefined
    showNoti: (msg: string) => void
}

const AuthContext = createContext<UserCredentials | null>(null)

export const useAuth = () => {
    const value = useContext(AuthContext)
    if (!value) throw new Error('useAuth must be wrapped in AuthProvider')
    return value
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const { loading } = useSelector((state: RootState) => state.public)
    const [emailOrPhone, setEmailOrPhone] = useState('')
    const [password, setPassword] = useState('')
    const [shortNoti, setShortNoti] = useState<string | null>(null)

    const opacity = useRef(new RNAnimated.Value(0)).current
    const animationOpacityIn = RNAnimated.timing(opacity, {
        toValue: 1,
        easing: Easing.linear,
        duration: 300,
        useNativeDriver: true
    })

    const handleEmailOrInput = (value: string) => {
        setEmailOrPhone(value)
        return isEmailOrPhoneValid(value)
    }

    const handlePassword = (value: string) => {
        setPassword(value)
        return isPasswordValid(value)

    }

    const scaleY = useSharedValue(0)
    const animationNoti = useAnimatedStyle(() => ({
        transform: [{ scaleY: scaleY.value }]
    }))

    const checkEmailOrPhoneType = (emailOrPhone: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const testEmail = emailRegex.test(emailOrPhone)
        if (testEmail) return 'email'
        if (emailOrPhone.length > 0 && (emailOrPhone[0] === '0' || emailOrPhone[0] === '+84' || emailOrPhone[0] === '84')) {
            const phoneRegex = /^((\+84|0)(3|5|7|8|9)\d{8})$/;
            const testPhone = phoneRegex.test(emailOrPhone)
            if (testPhone) return 'phone'
        }
        return undefined
    }

    const isEmailOrPhoneValid = (emailOrPhone: string) => {
        if (emailOrPhone.length === 0) return { isValid: false, msg: 'This field is required' }

        const check = checkEmailOrPhoneType(emailOrPhone)
        console.log(check)
        if (check === undefined) return { isValid: false, msg: 'Invalid email or phone number' }
        return { isValid: true }
    }

    const isPasswordValid = (password: string) => {
        if (password.length === 0) return { isValid: false, msg: 'This field is required' }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
        if (!passwordRegex.test(password)) return { isValid: false, msg: ['Minimum eight characters', 'At least one letter and one number'] }
        return { isValid: true }
    }

    const showNoti = (msg: string) => {
        setShortNoti(null)
        setShortNoti(msg)
    }

    useEffect(() => {
        const handleBackAction = () => {
            if (loading === true) {
                showNoti('Please wait for loading to finish')
                return true
            }
            if (router.canDismiss()) {
                router.dismiss()
            } else {
                BackHandler.exitApp()
            }
            return true
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackAction)

        return () => {
            animationOpacityIn.stop()
            backHandler.remove()
        }
    }, [loading])

    useEffect(() => {
        animationOpacityIn.start()
        let timeout = setTimeout(() => {
        });
        if (shortNoti != null) {
            scaleY.value = 0
            scaleY.value = withTiming(1, { duration: 300 })
            timeout = setTimeout(() => {
                setShortNoti(null)
                scaleY.value = withTiming(0, { duration: 300 })
            }, 2000);
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [shortNoti])

    return (
        <AuthContext.Provider
            value={{
                emailOrPhone,
                setEmailOrPhone: handleEmailOrInput,
                password,
                setPassword: handlePassword,
                checkEmailOrPhoneType,
                showNoti
            }}>
            <View
                className="flex-1" >
                {children}

                {/* loading */}
                {loading &&
                    <RNAnimated.View className="absolute bottom-0 left-0 right-0 w-full h-full z-100 items-center justify-center" style={[
                        {
                            backgroundColor: colors.blurBackground,
                            opacity: opacity
                        },

                    ]}  >
                        <ActivityIndicator
                            size={50}
                            color={colors.icon.highlight} />
                    </RNAnimated.View>}

                {/* bottom noti */}
                <Animated.View
                    style={animationNoti}
                    className={'absolute bottom-6 left-0 right-0 w-full z-100 px-4 items-center justify-center overflow-hidden'}>
                    <View className="flex-1 w-1/2 rounded-2 border" style={{
                        borderColor: colors.border.default,
                        backgroundColor: hexToRGBA(colors.textHighLight.background, 0.8),
                        paddingHorizontal: 16,
                        paddingVertical: 8
                    }}>
                        <ThemeText
                            fontSize={12}
                            color={colors.textHighLight.text}
                            fontWeight="bold"
                            letterSpacing={2}
                            otherProps={{ textAlign: 'center' }}>{shortNoti}</ThemeText>
                    </View>
                </Animated.View>

            </View>
        </AuthContext.Provider>
    )
}