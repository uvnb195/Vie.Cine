import Header from '@/src/components/header'
import MainWrapper from '@/src/components/MainWrapper'
import TabContentWrapper from '@/src/components/TabContentWrapper'
import ThemeText from '@/src/components/theme/ThemeText'
import React from 'react'

interface Props {
}

const Tab = ({
}: Props) => {
    return (
        <MainWrapper
            style={{
                flex: 1
            }}
            HeaderComponent={
                <Header title='/FAVORITES' backIconShown={false} />
            }>
            <TabContentWrapper>
                <ThemeText  >Favorites Screen</ThemeText>
            </TabContentWrapper>
        </MainWrapper>
    )
}

export default Tab