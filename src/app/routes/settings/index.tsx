import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import MainWrapper from '@/src/components/MainWrapper'
import Header from '@/src/components/header'
import { router } from 'expo-router'
import DropdownMenu from '@/src/components/input/DropdownMenu'
import { ScrollView } from 'react-native-gesture-handler'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setLoading } from '@/src/redux/publicSlice'
import { AppDispatch } from '@/src/redux/store'
import { useDispatch } from 'react-redux'

const index = () => {
    const deviceTheme = useColorScheme()
    const themeValue = useCustomTheme()
    const { colors, toggleTheme, currentTheme } = themeValue
    const handleSetUpTheme = async (value: string) => {
        console.log('selected changed:', value)
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

    return (
        <MainWrapper
            HeaderComponent={
                <Header title='Settings'
                    backIconShown={true}
                    backIconPress={() => router.dismiss()} />
            }>
            <View className='flex-1'>
                <ScrollView>
                    <View className='m-0 flex-row items-center justify-between px-6 border-b'
                        style={{
                            borderColor: colors.border.disable
                        }}>
                        <ThemeText>Interface:</ThemeText>
                        <View className='z-20'>
                            <DropdownMenu
                                onSelected={handleSetUpTheme}
                                disableSearch
                                placeHolder={currentTheme[0].toUpperCase() + currentTheme.slice(1)}
                                data={['Light', 'Dark', 'System']}
                                width={120} />
                        </View>
                    </View>


                </ScrollView>
            </View>
        </MainWrapper>
    )
}

export default index