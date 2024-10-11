import { UserInfo } from "@/constants/types/UserType";
import { Address } from "@/constants/types/index";
import { hexToRGBA } from "@/hooks/hexToRGBA";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, BackHandler, Easing, Animated as RNAnimated, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import ThemeText from "../components/theme/ThemeText";
import { AppDispatch, RootState } from "../redux/store";
import { useCustomTheme } from "./theme";
import { fetchDistricts, fetchWards } from "../redux/publicAsyncActions";

export interface ProfileInputErrors {
    displayName: string | null,
    phoneNumber: string | null,
    address: string | null,
    birthday: string | null,
    gender: string | null,
    photoURL: string | null,
}

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
    showNoti: (msg: string) => void,
    profileInput: UserInfo,
    profileInputErrors: ProfileInputErrors
    handleProfileChange: (
        key: keyof UserInfo,
        value: UserInfo[keyof UserInfo] | Address<'Province' | 'District' | 'Ward'>) => void,
    resetProfileInput: () => void
}

const AuthContext = createContext<UserCredentials | null>(null)

export const useAuth = () => {
    const value = useContext(AuthContext)
    if (!value) throw new Error('useAuth must be wrapped in AuthProvider')
    return value
}

export default function AuthProvider(
    { children }: { children: React.ReactNode }) {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const { loading } = useSelector((state: RootState) => state.public)
    const [emailOrPhone, setEmailOrPhone] = useState('')
    const [password, setPassword] = useState('')
    const [shortNoti, setShortNoti] = useState<string | null>(null)

    const { userInfo } = useSelector((state: RootState) => state.private)
    const dispatch = useDispatch<AppDispatch>()

    const initialAddress = (type: 'Province' | 'District' | 'Ward') => ({ code: '', name: '', type: type } as Address<'Province' | 'District' | 'Ward'>)

    const [isEmailValid, setIsEmailValid] = useState(false)
    const [profileInput, setProfileInput] = useState<UserInfo>({
        displayName: '',
        email: '',
        phoneNumber: '',
        address: {
            province: initialAddress('Province') as Address<'Province'>,
            district: initialAddress('Province') as Address<'District'>,
            ward: initialAddress('Province') as Address<'Ward'>
        },
        birthday: '',
        gender: null,
        photoURL: null,
        emailVerified: false
    })

    const resetInput = () => {
        setProfileInput({
            displayName: '',
            email: '',
            phoneNumber: '',
            address: {
                province: initialAddress('Province') as Address<'Province'>,
                district: initialAddress('Province') as Address<'District'>,
                ward: initialAddress('Province') as Address<'Ward'>
            },
            birthday: '',
            gender: null,
            photoURL: null,
            emailVerified: false
        })
    }

    const [profileInputErrors, setProfileInputErrors] = useState<ProfileInputErrors>({
        displayName: 'Name is required.',
        phoneNumber: '',
        address: 'Address is required.',
        birthday: 'Date of Birth is required.',
        gender: 'Gender is required.',
        photoURL: '',
    })

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

    const handleSelectAddress = (
        value: Address<'Province' | 'District' | 'Ward'>) => {
        switch (value.type) {
            case "Province": {
                setProfileInput({
                    ...profileInput,
                    address: {
                        province: {
                            code: value.code,
                            name: value.name,
                            type: 'Province'
                        },
                        district: initialAddress('District') as Address<'District'>,
                        ward: initialAddress('Ward') as Address<'Ward'>
                    }

                })
                setProfileInputErrors({
                    ...profileInputErrors,
                    address: 'Address is required.'
                })
                dispatch(fetchDistricts({ provinceCode: value.code }))
                return
            }
            case "District": {
                setProfileInput({
                    ...profileInput,
                    address: {
                        ...profileInput.address,
                        district: {
                            code: value.code,
                            name: value.name,
                            type: "District"
                        },
                        ward: initialAddress('Ward') as Address<'Ward'>
                    }
                })
                setProfileInputErrors({
                    ...profileInputErrors,
                    address: 'Address is required.'
                })

                dispatch(fetchWards({ districtCode: value.code }))
                return
            }
            case "Ward": {
                setProfileInput({
                    ...profileInput,
                    address: {
                        ...profileInput.address,
                        ward: {
                            code: value.code,
                            name: value.name,
                            type: "Ward"
                        },
                    }
                })
                setProfileInputErrors({
                    ...profileInputErrors,
                    address: null
                })
                return
            }
        }

    }
    const handleProfileChange = (
        key: keyof UserInfo,
        value: UserInfo[keyof UserInfo] | Address<'Province' | 'District' | 'Ward'>) => {
        switch (key) {
            case 'address': {
                handleSelectAddress(value as Address<'District' | 'Province' | 'Ward'>)
                return
            }
            case 'photoURL': {
                setProfileInput({
                    ...profileInput,
                    photoURL: value as string
                })
                return
            }
            case 'gender': {
                setProfileInput({
                    ...profileInput,
                    gender: value as UserInfo['gender']
                })
                if (value !== null) {
                    setProfileInputErrors({
                        ...profileInputErrors,
                        gender: null
                    })
                }
                return
            }
            case 'emailVerified': {
                setProfileInput({
                    ...profileInput,
                    emailVerified: value as boolean
                })
                return
            }
            case 'email': {
                profileInput.email = value as string
                return
            }
            case 'phoneNumber': {
                profileInput.phoneNumber = (value as string).replace('+84', '0')
                return
            }
            default: {
                const newData = {
                    ...profileInput,
                    [key]: (value as string).length > 0 ? value : ''
                }
                setProfileInput(newData)
                checkInputError(key, value as UserInfo[keyof UserInfo])
                return
            }
        }
    }


    const sendRequireMessage = (key: keyof ProfileInputErrors, msg?: string) => {
        try {
            setProfileInputErrors({
                ...profileInputErrors,
                [key.toString()]: 'This field is required' + (msg ? `. ${msg}` : '')
            })
        } catch (err: any) {
            console.log(err.message)
        }
    }
    const checkInputError = (
        key: keyof UserInfo,
        value: UserInfo[keyof UserInfo]) => {
        const errorKey = key as keyof ProfileInputErrors
        switch (errorKey) {
            case 'gender': {
                setProfileInputErrors({
                    ...profileInputErrors,
                    gender: null
                })
                return
            }
            case "phoneNumber": {
                if (value === null
                    || (value as string).length === 0) {
                    setProfileInputErrors({
                        ...profileInputErrors,
                        phoneNumber: null
                    })
                    return
                } else {
                    const phoneRegex = /^((\+84|0)(3|5|7|8|9)\d{8})$/
                    if (!phoneRegex.test(value as string)) {
                        setProfileInputErrors({
                            ...profileInputErrors,
                            phoneNumber: 'Invalid phone number'
                        })
                    } else
                        setProfileInputErrors({
                            ...profileInputErrors,
                            phoneNumber: null
                        })
                }
                return
            }
            case "address": {
                if (value == null) {
                    sendRequireMessage(errorKey)
                } else {
                    setProfileInputErrors({
                        ...profileInputErrors,
                        address: null
                    })
                }
                return
            }
            case "displayName": {
                if (value === null
                    || (value as string).length === 0) {
                    sendRequireMessage(errorKey)
                } else {
                    if ((value as string).length < 6) {
                        setProfileInputErrors({
                            ...profileInputErrors,
                            displayName: 'Display name must be at least 6 characters'
                        })
                    } else
                        setProfileInputErrors({
                            ...profileInputErrors,
                            displayName: null
                        })
                }
                return
            }
            case "birthday": {
                if ((value as string).includes('_')) {
                    sendRequireMessage(errorKey)
                    return
                }
                const dob = (value as string).split('/')

                const dateRegex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
                if (!dateRegex.test(value as string)) {
                    setProfileInputErrors({
                        ...profileInputErrors,
                        birthday: 'Please use the format DD/MM/YYYY for dates.'
                    })
                    return
                }
                setProfileInputErrors({
                    ...profileInputErrors,
                    birthday: null
                })
            }
        }
    }
    //
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
        console.log('loading:::::::::::::::::', loading)
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
                showNoti,
                handleProfileChange,
                profileInput,
                profileInputErrors,
                resetProfileInput: resetInput
            }}>
            <View
                className="flex-1" >
                {children}

                {/* loading */}
                {loading &&
                    <RNAnimated.View className="absolute bottom-0 left-0 right-0 w-full h-full z-[1000] items-center justify-center" style={[
                        {
                            backgroundColor: colors.blurBackground,
                            opacity: opacity
                        }
                    ]}  >
                        <ActivityIndicator
                            size={50}
                            color={colors.icon.highlight} />
                    </RNAnimated.View>}

                {/* bottom noti */}
                <Animated.View
                    style={animationNoti}
                    className={'absolute bottom-6 left-0 right-0 w-full z-[1000] px-4 items-center justify-center overflow-hidden'}>
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