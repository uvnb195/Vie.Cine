import MainWrapper from '@/src/components/MainWrapper'
import Header from '@/src/components/header'
import DropdownMenu from '@/src/components/input/DropdownMenu'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { AppDispatch, RootState } from '@/src/redux/store'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import React from 'react'
import { useColorScheme, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { UserGroupIcon } from 'react-native-heroicons/solid'
import { ChevronRightIcon } from 'react-native-heroicons/solid'
import { useDispatch, useSelector } from 'react-redux'

const SettingsScreen = () => {
    const deviceTheme = useColorScheme()
    const {
        colors,
        toggleTheme,
        currentTheme,
        setIsAdminMode
    } = useCustomTheme()
    const dispatch = useDispatch<AppDispatch>()
    const { userInfo } = useSelector((state: RootState) => state.private)

    const handleSetUpTheme = async (value: string) => {
        if (value === 'Light') {
            toggleTheme('light')
            await AsyncStorage.setItem('theme', 'light')
        } else if (value === 'Dark') {
            toggleTheme('dark')
            await AsyncStorage.setItem('theme', 'dark')
        } else {
            toggleTheme(deviceTheme == 'dark' ? 'dark' : 'light')
            await AsyncStorage.removeItem('theme')
        }
    }

    const handleNavigation = () => {
        setIsAdminMode(true)
        router.dismissAll()
    }

    return (
        <MainWrapper
            HeaderComponent={
                <Header title='Settings'
                    backIconShown={true}
                    backIconPress={() => router.back()} />
            }>
            <View className='flex-1'>
                <ScrollView>

                    {/* change password */}
                    <TouchableOpacity onPress={() => { }}>
                        <View className='m-0 flex-row items-center justify-between px-6 py-2 border-b h-[60px]'
                            style={{
                                borderColor: colors.border.disable
                            }}>
                            <ThemeText>Change Password</ThemeText>
                            <View className='z-20'>
                                <ChevronRightIcon color={colors.icon.enable} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* change avatar */}
                    <TouchableOpacity onPress={() => {
                        router.push({
                            pathname: '/routes/(settings)/update-avatar',
                        })
                    }}>
                        <View className='m-0 flex-row items-center justify-between px-6 py-2 border-b h-[60px]'
                            style={{
                                borderColor: colors.border.disable
                            }}>
                            <ThemeText>Change Avatar</ThemeText>
                            <View className='z-20'>
                                <ChevronRightIcon color={colors.icon.enable} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* update profile */}
                    <TouchableOpacity onPress={() => {
                        router.push('/routes/(settings)/update-profile')
                    }}>
                        <View className='m-0 flex-row items-center justify-between px-6 py-2 border-b h-[60px]'
                            style={{
                                borderColor: colors.border.disable
                            }}>
                            <ThemeText>Update profile</ThemeText>
                            <View className='z-20'>
                                <ChevronRightIcon color={colors.icon.enable} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* mode */}
                    <View className='flex-row items-center justify-between px-6 border-b h-max'
                        style={{
                            borderColor: colors.border.disable
                        }}>
                        <ThemeText>Mode:</ThemeText>
                        <View className='z-20 h-full pb-4'>
                            <DropdownMenu
                                onSelected={handleSetUpTheme}
                                disableSearch
                                value={currentTheme[0].toUpperCase() + currentTheme.slice(1)}
                                data={['Light', 'Dark', 'System']}
                                width={120} />
                        </View>
                    </View>

                    {/* admin manager */}
                    {userInfo?.role === 'admin' &&
                        <TouchableOpacity onPress={handleNavigation}>
                            <View className='m-0 flex-row items-center justify-between px-6 py-2 border-b h-[60px]'
                                style={{
                                    borderColor: colors.border.disable
                                }}>
                                <ThemeText>Admin Manager</ThemeText>
                                <View className='z-20'>
                                    <UserGroupIcon color={colors.icon.enable} />
                                </View>
                            </View>
                        </TouchableOpacity>}

                </ScrollView>
            </View>
        </MainWrapper>
    )
}

export default SettingsScreen