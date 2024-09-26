import { View, Text } from 'react-native'
import React from 'react'
import MainWrapper from '@/src/components/MainWrapper'
import Header from '@/src/components/header'
import ThemeText from '@/src/components/theme/ThemeText'
import ScrollExpandSection from '@/src/components/scroll/ScrollExpandSection'
import ScrollTickets from '@/src/components/scroll/ScrollTickets'

const Tab = () => {
    return (
        <MainWrapper headerComponent={
            <Header title='Tickets History' />
        }>
            <ScrollTickets data={[1, 2, 3, 4, 5]} />

        </MainWrapper>
    )
}

export default Tab