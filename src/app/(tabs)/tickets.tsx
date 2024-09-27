import MainWrapper from '@/src/components/MainWrapper'
import Header from '@/src/components/header'
import ScrollTickets from '@/src/components/scroll/ScrollTickets'
import React from 'react'

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