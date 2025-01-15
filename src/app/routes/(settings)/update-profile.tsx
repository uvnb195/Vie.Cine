import { IMAGE_PICKER_SIZE } from '@/constants/Values'
import { shadowImageStyle } from '@/constants/Styles'
import { locationFilter } from '@/hooks/locationFilter'
import { auth } from '@/src/api/firebase/config'
import CustomButton from '@/src/components/button/CustomButton'
import Header from '@/src/components/header'
import Chip from '@/src/components/input/Chip'
import CustomInput from '@/src/components/input/CustomInput'
import DropdownMenu from '@/src/components/input/DropdownMenu'
import MainWrapper from '@/src/components/MainWrapper'
import ImagePicker from '@/src/components/picker/ImagePicker'
import ThemeText from '@/src/components/theme/ThemeText'
import { useAuth } from '@/src/contexts/auth'
import { useCustomTheme } from '@/src/contexts/theme'
import { fetchUserInfo, updateProfile } from '@/src/redux/privateAsyncActions'
import { updateEmailVerify } from '@/src/redux/privateSlice'
import { fetchAllProvince } from '@/src/redux/publicAsyncActions'
import { setLoading } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { router } from 'expo-router'
import { reload, sendEmailVerification } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'

const ProfileSettingScreen = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const shadow = shadowImageStyle(colors.text.light)
    const dispatch = useDispatch<AppDispatch>()
    const {
        provinces,
        districts,
        wards,
        local } = useSelector((state: RootState) => state.public)
    const { userInfo } = useSelector((state: RootState) => state.private)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const intervalNextVerify = useRef<NodeJS.Timeout | null>(null)

    const { profileInput,
        profileInputErrors,
        handleProfileChange,
        resetProfileInput } = useAuth()

    const [verifyLoading, setVerifyLoading] = useState(false)

    const { showNoti } = useAuth()

    const handleVerifyEmail = async () => {
        showNoti('Please verify your email to continue')
        setVerifyLoading(true)
        if (userInfo) {
            await sendEmailVerification(auth.currentUser!!, {
                handleCodeInApp: true,
                url: 'https://viecine-6dc11.firebaseapp.com'
            })
                .catch(err => console.log(err))
        }
    }

    const handleSelectProvince = (value: string) => {
        if (provinces.length === 0) return
        const code = provinces.find(item => item.name.includes(value.replace('Tp. ', '')))?.code
        if (!code) return
        handleProfileChange('address', { name: value, code: code, type: 'Province' })
    }

    const handleSelectDistrict = (value: string) => {
        if (districts.length === 0) return
        const code = districts.find(item => item.name.includes(value))?.code
        if (!code) return
        handleProfileChange('address', { name: value, code: code, type: 'District' })
    }
    const handleSelectWand = (value: string) => {
        if (wards.length === 0) return
        const code = wards.find(item => item.name.includes(value))?.code
        if (!code) return
        handleProfileChange('address', { name: value, code: code, type: 'Ward' })
    }

    const handleSubmit = async () => {
        dispatch(setLoading(true))

        const formData = new FormData()
        if (profileInput.displayName && !profileInputErrors.displayName) {
            formData.append('displayName', profileInput.displayName)
        }
        if (profileInput.phoneNumber && !profileInputErrors.phoneNumber) {

            formData.append('phoneNumber', profileInput.phoneNumber)
        }
        if (profileInput.address && !profileInputErrors.address) {
            formData.append('address', JSON.stringify(profileInput.address))
        }
        if (profileInput.birthday && !profileInputErrors.birthday) {
            formData.append('birthday', profileInput.birthday)
        }
        if (profileInput.photoURL && !profileInputErrors.photoURL) {
            formData.append('imageBase64', profileInput.photoURL)
        }
        if (profileInput.gender && !profileInputErrors.gender) {
            formData.append('gender', `${profileInput.gender}`)
        }

        await auth.currentUser?.getIdToken()
            .then(token => {
                dispatch(updateProfile({ formData, token }))
            })

        dispatch(setLoading(false))
        router.dismissAll()
    }

    const handleCancel = () => {
        resetProfileInput()
        router.back()
    }

    useEffect(() => {
        const checkVerify = () => {
            console.log('Interval is running!!!!!!!!!!!!');
            if (userInfo && !userInfo.emailVerified) {
                showNoti('Please verify your email to continue')
                reload(auth.currentUser!!)
                    .then(() => {
                        if (auth.currentUser?.emailVerified) {
                            dispatch(updateEmailVerify(true
                            ))
                            setVerifyLoading(false)
                            clearInterval(intervalRef.current as NodeJS.Timeout)
                        }
                    })
                    .catch((error) => {
                        console.error('Lỗi khi reload user:', error); setVerifyLoading(false)
                    });
            } else if (userInfo && userInfo.emailVerified) {
                setVerifyLoading(false)
                clearInterval(intervalRef.current as NodeJS.Timeout)
            }
        }

        if (verifyLoading) {
            intervalRef.current = setInterval(() => {
                checkVerify()
            }, 10000)
        }
    }, [verifyLoading])
    useEffect(() => {
        dispatch(setLoading(true))
        dispatch(fetchAllProvince())
        dispatch(setLoading(false))



        return () => {
            clearInterval(intervalRef.current as NodeJS.Timeout)
            clearInterval(intervalNextVerify.current as NodeJS.Timeout)
        }
    }, [])

    useEffect(() => {
        if (userInfo?.email) {
            handleProfileChange('email', userInfo.email)
        }
        if (userInfo?.phoneNumber) {
            handleProfileChange('phoneNumber', userInfo.phoneNumber)
        }
        if (userInfo?.displayName) {
            handleProfileChange('displayName', userInfo.displayName)
        }

    }, [userInfo])

    return (
        <MainWrapper
            loadingLayer={false}
            HeaderComponent={
                <Header
                    backIconShown={false}
                    title='/UPDATE-PROFILE'
                />
            }>
            <KeyboardAvoidingView
                contentContainerStyle={{
                }}
                behavior='padding'
                className='self-center'>
                <ScrollView>
                    <ImagePicker
                        defaultUri={userInfo?.photoURL || undefined}
                        style={{
                            ...shadow,
                            alignSelf: 'center',
                            width: IMAGE_PICKER_SIZE.default,
                            height: IMAGE_PICKER_SIZE.default
                        }}
                        onImageChange={(uri) => {
                            handleProfileChange('photoURL', uri)
                        }} />
                    <View className='w-full mt-6 px-4'>
                        {/* email field */}
                        <View className='w-full flex-row pt-4'>
                            <View className='flex-1 pr-4'>
                                <CustomInput
                                    value={profileInput.email}
                                    disabled
                                    placeHolder={'Email'} />

                            </View>
                            <View >
                                <CustomButton
                                    onPress={handleVerifyEmail}
                                    disabled={userInfo?.emailVerified}
                                    title='Verify' />
                                {verifyLoading && !userInfo?.emailVerified &&
                                    <View className='absolute top-0 bottom-0 left-0 right-0 border items-center justify-center rounded-2'
                                        style={{
                                            borderColor: colors.border.default,
                                            backgroundColor: colors.background.default
                                        }}>
                                        <ActivityIndicator color={colors.icon.highlight} />
                                    </View>}
                            </View>

                        </View>
                        {/* phone field */}
                        <View className='w-full flex-row pt-4'>
                            <View className='flex-1'>
                                <CustomInput
                                    value={profileInput.phoneNumber || undefined}
                                    keyboardType='number-pad'
                                    placeHolder={'Phone Number (optional)'}
                                    onValueChange={v => {
                                        handleProfileChange('phoneNumber', v)
                                    }} />
                                {profileInputErrors.phoneNumber
                                    && <ThemeText
                                        otherProps={{
                                            textAlign: 'right'
                                        }}
                                        fontSize={12}
                                        color={colors.error}
                                    >{profileInputErrors.phoneNumber}</ThemeText>}
                            </View>
                        </View>
                        {/* name field */}
                        <View className='w-full pt-4'>
                            <CustomInput
                                value={profileInput.displayName || undefined}
                                placeHolder={'Name (*)'}
                                onValueChange={v => {
                                    handleProfileChange('displayName', v)
                                }} />
                            {profileInputErrors.displayName
                                && <ThemeText
                                    otherProps={{
                                        textAlign: 'right'
                                    }}
                                    fontSize={12}
                                    color={colors.error}
                                >{profileInputErrors.displayName}</ThemeText>}
                        </View>
                        {/* birthday field */}
                        <View className='w-full flex-row pt-4'>
                            <View className='flex-1'>
                                <CustomInput
                                    value={profileInput?.birthday || undefined}
                                    inputFormatter='date'
                                    keyboardType='number-pad'
                                    placeHolder={'Day of birth  (*)'}
                                    onValueChange={v => {
                                        handleProfileChange('birthday', v)
                                    }} />
                                {profileInputErrors.birthday
                                    && <ThemeText
                                        otherProps={{
                                            textAlign: 'right'
                                        }}
                                        fontSize={12}
                                        color={colors.error}
                                    >{profileInputErrors.birthday}</ThemeText>}
                            </View>
                        </View>
                        {/* gender field */}
                        <View className='w-full pt-4'>
                            <View className='flex-row items-center justify-between'>
                                <ThemeText
                                    otherProps={{
                                        paddingHorizontal: 8,
                                    }}
                                    fontSize={18}
                                    color={colors.text.light}>Gender:</ThemeText>
                                <View className='flex-row justify-end flex-1'>
                                    <Chip
                                        selected={profileInput?.gender === 1}
                                        onPress={() => {
                                            handleProfileChange('gender', 1)
                                        }}
                                        title={'Male'} />
                                    <View className='w-4' />
                                    <Chip
                                        selected={profileInput?.gender === 2}
                                        onPress={() => {
                                            handleProfileChange('gender', 2)
                                        }}
                                        title={'Female'} />
                                </View>

                            </View>
                            {profileInputErrors.gender
                                && <ThemeText
                                    otherProps={{
                                        textAlign: 'right'
                                    }}
                                    fontSize={12}
                                    color={colors.error}
                                >{profileInputErrors.gender}</ThemeText>}
                        </View>
                        {/* address field */}
                        <ThemeText
                            otherProps={{
                                paddingHorizontal: 8,
                            }}
                            fontSize={18}
                            color={colors.text.light}>Address:</ThemeText>
                        <View className='w-full pt-2 pb-4 flex-row'>
                            <View className='flex-1 flex-row flex-wrap justify-between'>
                                {/* district */}
                                <View className='flex-1 pr-2'>
                                    <DropdownMenu
                                        onSelected={handleSelectDistrict}
                                        disable={profileInput.address?.province?.name === undefined}
                                        value={profileInput?.address?.district?.name || ""}
                                        placeHolder='District (*)'
                                        data={
                                            districts.map(item => ({
                                                key: item.code,
                                                value: locationFilter(item.name, 'District')
                                            }))
                                            || []} />
                                </View>
                                {/*  province  */}
                                <View className='flex-1 pl-2'>
                                    <DropdownMenu
                                        onSelected={handleSelectProvince}
                                        value={profileInput?.address?.province?.name || ""}
                                        disable={profileInput.address?.district?.name === undefined}
                                        placeHolder='Province (*)'
                                        data={
                                            districts.map(item => ({
                                                key: item.code,
                                                value: locationFilter(item.name, 'Province')
                                            }))
                                            || []} />
                                </View>
                            </View>
                        </View>

                        {/* ward */}
                        <View className='pb-10'>
                            <DropdownMenu
                                onSelected={handleSelectWand}
                                disable={profileInput.address?.district?.name === undefined}
                                value={profileInput?.address?.ward?.name || undefined}
                                placeHolder='Ward (*)'
                                data={districts.map(item => ({
                                    key: item.code,
                                    value: item.name
                                })) || []} />
                            {profileInputErrors.address
                                && <ThemeText
                                    fontSize={12}
                                    color={colors.error}
                                    otherProps={{
                                        marginTop: 8,
                                        textAlign: 'right'

                                    }}
                                >{profileInputErrors.address}</ThemeText>}
                        </View>

                        {/* button  */}
                        <View className='w-full flex-row justify-end pb-10'>
                            <CustomButton
                                onPress={handleCancel}
                                title='Cancel' />
                            <View className='w-4' />

                            {/* submit button */}
                            <View>
                                <CustomButton
                                    onPress={handleSubmit}
                                    disabled={Object.values(profileInputErrors).filter(item => item != null && item.length > 0).length > 0}
                                    title='Save' />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </MainWrapper>
    )
}

export default ProfileSettingScreen