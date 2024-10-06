import { View, Text, Button, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import MainWrapper from '@/src/components/MainWrapper'
import ThemeText from '@/src/components/theme/ThemeText'
import Header from '@/src/components/header'
import ScrollExpandSection from '@/src/components/scroll/ScrollExpandSection'
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import ImagePicker from '@/src/components/picker/ImagePicker'
import { IMAGE_PICKER_SIZE, TAB_BAR_HEIGHT } from '@/constants/Size'
import { useCustomTheme } from '@/src/contexts/theme'
import { shadowImageStyle } from '@/constants/Styles'
import { ScrollView } from 'react-native-gesture-handler'
import ScrollCreditCard from '@/src/components/scroll/ScrollCreditCard'
import CustomButton from '@/src/components/button/CustomButton'
import { ArrowLeftEndOnRectangleIcon, ArrowLeftStartOnRectangleIcon, Cog8ToothIcon } from 'react-native-heroicons/outline'
import { signOut } from 'firebase/auth'
import { auth } from '@/src/api/firebase/config'
import { router } from 'expo-router'
import { current } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/redux/store'

const Tab = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const dispatch = useDispatch<AppDispatch>()
    const { loading, userInfo } = useSelector((state: RootState) => state.public)

    const signButtonTitle = !userInfo ? 'Sign In' : 'Sign Out'


    const shadow = shadowImageStyle(colors.text.light)


    const handleSignOut = () => {
        signOut(auth)
        router.push('/routes/(auth)')
    }

    useEffect(() => {
        console.log('current user:', userInfo?.providerData)

    }, [userInfo])

    return (
        <MainWrapper
            style={{
                flex: 1
            }}
            HeaderComponent={
                <Header title='Profile' backIconShown={false} />
            }>
            <ScrollView>
                <ImagePicker
                    style={{
                        ...shadow,
                        alignSelf: 'center',
                        width: IMAGE_PICKER_SIZE.default,
                        height: IMAGE_PICKER_SIZE.default
                    }}
                    onImageChange={(base64) => console.log(base64)} />

                {/* information */}
                <View className='w-full mt-6 items-center'>
                    <ThemeText
                        otherProps={{
                            textAlign: 'center',
                            marginBottom: 8
                        }}
                        fontWeight='bold'
                        fontSize={24}
                        letterSpacing={4}
                        numsOfLines={2}>{userInfo?.displayName || userInfo?.email || "Anonymous"}</ThemeText>
                    {userInfo ?
                        <View>
                            <ThemeText
                                fontSize={16}
                                fontWeight='light'
                                otherProps={{
                                    textAlign: 'center',
                                    marginBottom: 8
                                }}
                                numsOfLines={1}
                            >Email: {userInfo.email}</ThemeText>
                            <ThemeText
                                fontSize={16}
                                fontWeight='light'
                                otherProps={{
                                    textAlign: 'center',
                                    marginBottom: 8
                                }}
                                numsOfLines={1}
                            >Phone No: {userInfo.phoneNumber || 'not add yet'}</ThemeText>
                            <ThemeText
                                fontSize={16}
                                fontWeight='light'
                                otherProps={{
                                    textAlign: 'center',
                                    paddingHorizontal: 24
                                }}
                                numsOfLines={2}
                            >Address: 72376 Francis Mountains, South Altaside, AK 13277</ThemeText>
                        </View>
                        : <ThemeText>Login for more features</ThemeText>
                    }

                </View>

                {!userInfo ? <View className='w-full py-4'>
                    <CustomButton
                        onPress={() => { }}
                        title='Login'
                        style={{ alignSelf: 'center' }}
                        Icon={<ArrowLeftEndOnRectangleIcon color={colors.text.default} />} />
                </View>
                    : <>
                        {/* credit cards */}
                        <View className='w-full mt-6'>
                            <ScrollCreditCard />
                        </View>

                        {/* buttons */}
                        <View className='w-full px-4 mt-8 flex-row justify-evenly'>
                            <CustomButton
                                onPress={() => {
                                    router.push({
                                        pathname: '/routes/settings',
                                    })
                                }}
                                title='Settings'
                                Icon={<Cog8ToothIcon color={colors.text.default} />} />
                            <CustomButton
                                onPress={handleSignOut}
                                title={signButtonTitle}
                                Icon={<ArrowLeftStartOnRectangleIcon
                                    color={colors.text.default} />} />
                        </View>
                    </>
                }


            </ScrollView>
        </MainWrapper>
    )
}

export default Tab
