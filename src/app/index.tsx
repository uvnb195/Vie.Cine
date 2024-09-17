import { Entypo } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'
import { ChevronLeftIcon, MagnifyingGlassCircleIcon } from 'react-native-heroicons/outline'
import MainWrapper from '../components/MainWrapper'
import Header from '../components/header'
import { useCustomTheme } from '../contexts/theme'
import ThemeText from '../components/theme/ThemeText'


// say hello worlda
const RootLayout = () => {
    const value = useCustomTheme()
    const { colors } = value
    return (
        <MainWrapper
            headerComponent={
                <Header
                    leftIcon={
                        <View className='p-1'>
                            <ChevronLeftIcon
                                color={colors.text.default}
                                size={24} />
                        </View>}
                    rightIcon={
                        <View className='p-1'>
                            <Entypo name="dots-three-vertical" size={24} color={colors.text.default} />
                        </View>}
                    title='Ticket DetailTicket DetailTicket DetailTicket DetailTicket DetailTicket DetailTicket DetailTicket Detail' />
            }>

            <ThemeText
                fontSize={24}
                fontWeight='bold'
                color={colors.text.default}>Dao Huu Quan</ThemeText>

            <ThemeText
                fontSize={16}
                fontWeight='light'
                color={colors.text.default}>Email: uvnb195@gmail.com</ThemeText>
        </MainWrapper>
    )
}

export default RootLayout