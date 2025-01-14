import { IMAGE_PICKER_SIZE } from '@/constants/Values'
import { shadowImageStyle } from '@/constants/Styles'
import { auth } from '@/src/api/firebase/config'
import CustomButton from '@/src/components/button/CustomButton'
import Header from '@/src/components/header'
import MainWrapper from '@/src/components/MainWrapper'
import ImagePicker from '@/src/components/picker/ImagePicker'
import ScrollCreditCard from '@/src/components/scroll/ScrollCreditCard'
import TabContentWrapper from '@/src/components/TabContentWrapper'
import ThemeText from '@/src/components/theme/ThemeText'
import AuthProvider, { useAuth } from '@/src/contexts/auth'
import { useCustomTheme } from '@/src/contexts/theme'
import { clearUser } from '@/src/redux/privateSlice'
import { setLoading } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { router } from 'expo-router'
import { signOut, User } from 'firebase/auth'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ArrowLeftEndOnRectangleIcon, ArrowLeftStartOnRectangleIcon, Cog8ToothIcon } from 'react-native-heroicons/outline'
import { useDispatch, useSelector } from 'react-redux'

const ProfileTab = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const dispatch = useDispatch<AppDispatch>()
    const { loading } = useSelector((state: RootState) => state.public)
    const { userInfo } = useSelector((state: RootState) => state.private)

    const signButtonTitle = !userInfo ? 'Sign In' : 'Sign Out'

    const shadow = shadowImageStyle(colors.text.light)

    const handleSignOut = () => {
        dispatch(setLoading(true))
        dispatch(clearUser())
        signOut(auth)
        router.replace('/(tabs)/')
        setTimeout(() => {
            dispatch(setLoading(false))
        }, 1000)
    }

    return (
        <MainWrapper
            style={{
                flex: 1
            }}
            HeaderComponent={
                <Header title='/PROFILE' backIconShown={false} />
            }>
            <TabContentWrapper>
                <ScrollView>
                    <ImagePicker
                        disabled={true}
                        defaultUri={userInfo?.photoURL || undefined}
                        style={{
                            ...shadow,
                            alignSelf: 'center',
                            width: IMAGE_PICKER_SIZE.default,
                            height: IMAGE_PICKER_SIZE.default
                        }} />

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
                            numsOfLines={2}>{userInfo?.displayName || "Unnamed"}</ThemeText>
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
                                >Gender: {userInfo.gender == null ? 'not add yet' : userInfo.gender == 1 ? 'Male' : 'Female'}
                                </ThemeText>
                                <ThemeText
                                    fontSize={16}
                                    fontWeight='light'
                                    otherProps={{
                                        textAlign: 'center',
                                        marginBottom: 8
                                    }}
                                    numsOfLines={1}
                                >Day of Birth: {userInfo.birthday || 'not add yet'}
                                </ThemeText>
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
                                {userInfo.address
                                    &&
                                    <ThemeText
                                        fontSize={16}
                                        fontWeight='light'
                                        otherProps={{
                                            textAlign: 'center',
                                            paddingHorizontal: 24
                                        }}
                                        numsOfLines={2}
                                    >Address: {userInfo.address?.ward?.name},{userInfo?.address?.ward?.name?.length && userInfo?.address?.ward?.name?.length > 10 ? "\n" : " "}{userInfo.address?.district?.name},{" "}{userInfo.address?.province?.name}</ThemeText>}
                            </View>
                            : <ThemeText>Login for more features</ThemeText>
                        }

                    </View>

                    {!userInfo ? <View className='w-full py-4'>
                        <CustomButton
                            onPress={() => {
                                router.push('/routes/(auth)/')
                            }}
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
                                        router.push('/routes/(settings)/')
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
            </TabContentWrapper>
        </MainWrapper>
    )
}

export default ProfileTab
