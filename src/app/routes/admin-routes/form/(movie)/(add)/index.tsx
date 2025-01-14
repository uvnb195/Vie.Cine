import { MovieType } from '@/constants/types/MovieType'
import { CAROUSEL_ITEM_SIZE } from '@/constants/Values'
import { dateConverter } from '@/hooks/convertDate'
import { auth } from '@/src/api/firebase/config'
import BottomSection from '@/src/components/bottom-sheet/BottomSection'
import MinimalCard from '@/src/components/card/MinimalCard'
import PageWrapper from '@/src/components/pages/PageWrapper'
import { useAdminMovie } from '@/src/contexts/movie'
import { useCustomTheme } from '@/src/contexts/theme'
import { getMovies } from '@/src/redux/adminAsyncActions'
import { fetchList } from '@/src/redux/publicAsyncActions'
import { updateLongList } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'

const AddMovie = () => {
    const { fetching, nowShowing, longList } = useSelector((state: RootState) => state.public)
    const dispatch = useDispatch<AppDispatch>()
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null)
    const { colors } = useCustomTheme()
    const { handleData } = useAdminMovie()

    const handleLoadMore = () => {
        if (fetching) return
        if (!fetching) {
            if (nowShowing && nowShowing?.total_pages > currentPage + 1)
                dispatch(fetchList({
                    page: currentPage + 1,
                    url: '/now-showing'
                }))
            setCurrentPage(currentPage + 1)
        }
    }
    const handleNext = () => {
        if (selectedMovie === null) return
        router.replace({
            pathname: '/routes/admin-routes/form/(movie)/(add)/[id]',
            params: { id: selectedMovie.id }
        })
    }

    const renderItem = (item: MovieType, index: number) => {
        return (
            <View className="items-center justify-center" style={{
                width: `${100 / 3}%`,
            }}>
                <MinimalCard
                    title={item.original_title}
                    subTitle={dateConverter(item.release_date)}
                    src={item.poster_path}
                    style={{
                        width: '100%',
                        height: CAROUSEL_ITEM_SIZE.height,
                        paddingHorizontal: 4,
                        paddingVertical: 8,
                        backgroundColor: selectedMovie?.id === item.id ? colors.background.bottomSheet : undefined,
                        borderWidth: selectedMovie?.id === item.id ? 2 : 0,
                        borderRadius: selectedMovie?.id === item.id ? 8 : 0,
                        borderColor: colors.border.default
                    }}
                    onPress={() => {
                        console.log(item)
                        if (selectedMovie?.id === item.id) setSelectedMovie(null)
                        else
                            setSelectedMovie(item)
                        // router.push({ pathname: '/routes/movie-details/[id]', params: { id: item.id } })
                    }} />
            </View >)
    }
    useEffect(() => {
        dispatch(updateLongList('/now-showing'))

        return () => {
            dispatch(updateLongList(null))
        }
    }, [])

    return (
        <View className='flex-1'>
            <PageWrapper
                style={{
                    paddingHorizontal: 16
                }}
                title={selectedMovie === null ? 'Add Movie' : selectedMovie.original_title}
                subTitle={selectedMovie === null ? 'Pick a movie' : 'Click Next to continue'}
            >
                <View className='flex-1'>
                    <FlatList
                        extraData={longList}
                        windowSize={50}
                        ListFooterComponent={() =>
                            fetching &&
                            <View className="py-4">
                                <ActivityIndicator size={40} color={colors.icon.highlight} />
                            </View>}
                        onEndReachedThreshold={0.5}
                        onEndReached={handleLoadMore}
                        numColumns={3}
                        contentContainerStyle={{
                            columnGap: 8
                        }}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        data={longList?.results}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => renderItem(item, index)} />
                </View>

                <View>
                    <BottomSection
                        handleNext={handleNext}
                        handleCancel={() => router.back()}
                        currentIndex={0}
                        totalPage={2}
                        disabled={selectedMovie === null}
                    />
                </View>
            </PageWrapper>

        </View>
    )
}

export default AddMovie