import { View, Text } from 'react-native'
import React from 'react'
import MainWrapper from '@/src/components/MainWrapper'
import ThemeText from '@/src/components/theme/ThemeText'
import Header from '@/src/components/header'
import ScrollExpandSection from '@/src/components/scroll/ScrollExpandSection'

const Tab = () => {
    return (
        <MainWrapper
            headerComponent={
                <Header title='Profile' />
            }>
            <ScrollExpandSection width={'100%'} data={[1, 2, 3]} />
        </MainWrapper>
    )
}

export default Tab