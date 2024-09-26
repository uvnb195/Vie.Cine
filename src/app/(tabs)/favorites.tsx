import { View, Text } from 'react-native'
import React from 'react'
import MainWrapper from '@/src/components/MainWrapper'
import ThemeText from '@/src/components/theme/ThemeText'
import Header from '@/src/components/header'

const Tab = () => {
    return (
        <MainWrapper
            headerComponent={
                <Header title='Favorites' />
            }>
            <ThemeText>Tickets</ThemeText>
        </MainWrapper>
    )
}

export default Tab