import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import MainWrapper from '@/src/components/MainWrapper'
import VerticalGridScroll from '@/src/components/scroll/VerticalGridScroll'
import { useCustomTheme } from '@/src/contexts/theme'
import { AppDispatch, RootState } from '@/src/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { router, useLocalSearchParams } from 'expo-router'
import Header from '@/src/components/header'
import { fetchNowShowing, fetchUpcoming } from '@/src/redux/publicAsyncAction'
import { updateListGroupShowing } from '@/src/redux/publicSlice'

const GroupView = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const { nowShowing,
        nowShowingReachingEnd,
        upComing,
        upcomingReachingEnd,
        fetching,
        listGroupShowing, movieInfo: detailInfo } = useSelector((state: RootState) => state.public)
    const dispatch = useDispatch<AppDispatch>()
    const { id } = useLocalSearchParams()
    const [currentPage, setCurrentPage] = React.useState(1)

    const handleLoadMore = () => {
        if (fetching) return
        if (!fetching) {
            switch (id) {
                case 'trending':
                    if (nowShowingReachingEnd) return
                    dispatch(fetchNowShowing({ page: currentPage + 1 }))
                    break
                case 'upcoming':
                    if (upcomingReachingEnd) return
                    dispatch(fetchUpcoming({ page: currentPage + 1 }))
                    break
                default:
                    dispatch(fetchUpcoming({ page: currentPage + 1 }))
            }
            setCurrentPage(currentPage + 1)
        }
    }
    return (
        <MainWrapper
            HeaderComponent={
                <Header
                    searchIconShown
                    title={(id + "").toUpperCase()}
                    backIconPress={() => {
                        setCurrentPage(1)
                        router.back()
                    }} />}
        >
            <VerticalGridScroll
                contentStyle={{
                    showTitle: true,
                    showSubTitle: true
                }}
                onEndReached={handleLoadMore}
                numColumns={3}
                list={listGroupShowing} />
        </MainWrapper>
    )
}

export default GroupView