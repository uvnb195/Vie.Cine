import { View, Text } from 'react-native'
import React from 'react'
import MainWrapper from '@/src/components/MainWrapper'
import Header from '@/src/components/header'

const tickets = () => {
    return (
        <MainWrapper headerComponent={
            <Header title='Tickets History' />
        }>
            <View>
                <Text>Tickets</Text>
            </View>
        </MainWrapper>
    )
}

export default tickets