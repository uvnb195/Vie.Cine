import { View, Text } from 'react-native'
import React from 'react'
import MainWrapper from '@/src/components/MainWrapper'
import Header from '@/src/components/header'
import ThemeText from '@/src/components/theme/ThemeText'

const Tab = () => {
    return (
        <MainWrapper headerComponent={
            <Header title='Tickets History' />
        }>
            <ThemeText>Tickets</ThemeText>
        </MainWrapper>
    )
}

export default Tab