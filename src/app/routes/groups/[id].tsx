import { PublicURL } from '@/src/api/axios/public'
import Header from '@/src/components/header'
import MainWrapper from '@/src/components/MainWrapper'
import VerticalGridScroll from '@/src/components/scroll/VerticalGridScroll'
import { useCustomTheme } from '@/src/contexts/theme'
import { fetchList } from '@/src/redux/publicAsyncActions'
import { setLoading, updateLongList } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GroupView = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const { nowShowing,
        upComing,
        fetching,
        loading,
        longList,
        movieInfo: detailInfo } = useSelector((state: RootState) => state.public)
    const dispatch = useDispatch<AppDispatch>()
    const { id } = useLocalSearchParams()
    const [currentPage, setCurrentPage] = React.useState(1)

    useEffect(() => {
        dispatch(updateLongList(id as PublicURL))

        return () => {
            dispatch(updateLongList(null))
        }
    }, [])

    useEffect(() => {
        dispatch(setLoading(false))
    }, [longList])

    const handleLoadMore = () => {
        if (fetching) return
        if (!fetching) {
            switch (id as PublicURL) {
                case '/now-showing':
                    if (nowShowing && nowShowing?.total_pages > currentPage + 1)
                        dispatch(fetchList({ page: currentPage + 1, url: id as PublicURL }))
                    break
                case '/upcoming':
                    if (upComing && upComing?.total_pages > currentPage + 1)
                        dispatch(fetchList({ page: currentPage + 1, url: id as PublicURL }))
                    break
                default:
                    dispatch(fetchList({ page: currentPage + 1, url: id as PublicURL }))
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
                        dispatch(setLoading(false))
                        setCurrentPage(1)
                        dispatch(updateLongList(null))
                        router.back()
                    }} />}>
            <VerticalGridScroll
                contentStyle={{
                    showTitle: true,
                    showSubTitle: true
                }}
                onEndReached={handleLoadMore}
                numColumns={3}
                list={longList?.results || []} />
        </MainWrapper>
    )
}

export default GroupView