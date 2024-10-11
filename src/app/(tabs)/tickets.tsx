import { TAB_BAR_HEIGHT } from '@/constants/Size'
import MainWrapper from '@/src/components/MainWrapper'
import TabContentWrapper from '@/src/components/TabContentWrapper'
import Header from '@/src/components/header'
import ScrollTickets from '@/src/components/scroll/TicketScroll'
import ThemeText from '@/src/components/theme/ThemeText'
import { RootState } from '@/src/redux/store'
import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

const Tab = () => {
    const { nowShowing } = useSelector((state: RootState) => state.public)
    return (
        <MainWrapper
            style={{
                flex: 1,
                paddingBottom: TAB_BAR_HEIGHT
            }}
            HeaderComponent={
                <Header title='/HISTORY' backIconShown={false} />
            }>
            <TabContentWrapper>
                <ThemeText>Tickets Screen</ThemeText>
            </TabContentWrapper>

        </MainWrapper>
    )
}

export default Tab