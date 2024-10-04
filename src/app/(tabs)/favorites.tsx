import { View, Text } from 'react-native'
import React from 'react'
import MainWrapper from '@/src/components/MainWrapper'
import ThemeText from '@/src/components/theme/ThemeText'
import Header from '@/src/components/header'
import SectionTitle from '@/src/components/button/SectionTitle'
import CustomScroll from '@/src/components/scroll/CustomScroll'
import { TAB_BAR_HEIGHT } from '@/constants/Size'

interface Props {
}

const Tab = ({
}: Props) => {
    return (
        <MainWrapper
            style={{
                flex: 1,
                marginBottom: TAB_BAR_HEIGHT
            }}
            HeaderComponent={
                <Header title='Favorites' backIconShown={false} />
            }>
            <View className='flex-1'>
                <CustomScroll
                    data={[1, 2, 3, 4, 5, 6, 7, 8]} showMore />
            </View>
        </MainWrapper>
    )
}

export default Tab