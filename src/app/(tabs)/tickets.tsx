import { TAB_BAR_HEIGHT } from '@/constants/Size'
import MainWrapper from '@/src/components/MainWrapper'
import Header from '@/src/components/header'
import ScrollTickets from '@/src/components/scroll/ScrollTickets'
import VerticalGridScroll from '@/src/components/scroll/VerticalGridScroll'
import { RootState } from '@/src/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'

const Tab = () => {
    const { nowShowing } = useSelector((state: RootState) => state.public)
    return (
        <MainWrapper
            style={{
                flex: 1
            }}
            HeaderComponent={
                <Header title='Tickets History' backIconShown={false} />
            }>
            <VerticalGridScroll
                contentStyle={{
                    showTitle: true,
                    showSubTitle: true
                }}
                numColumns={2}
                list={nowShowing} />

        </MainWrapper>
    )
}

export default Tab