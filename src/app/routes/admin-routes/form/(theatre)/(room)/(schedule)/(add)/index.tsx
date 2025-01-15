import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemeText from '@/src/components/theme/ThemeText'
import PageWrapper from '@/src/components/pages/PageWrapper'
import { useCustomTheme } from '@/src/contexts/theme'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/redux/store'
import { FlatList } from 'react-native-gesture-handler'
import { MovieProps } from '@/constants/types/MovieType'
import MinimalCard from '@/src/components/card/MinimalCard'
import { dateConverter } from '@/hooks/convertDate'
import { CAROUSEL_ITEM_SIZE } from '@/constants/Values'
import CustomButton from '@/src/components/button/CustomButton'
import { getMovies } from '@/src/redux/adminAsyncActions'
import { auth } from '@/src/api/firebase/config'
import { router } from 'expo-router'
import { curMovie } from '@/src/redux/adminSlice'
import { fetchMovie } from '@/src/redux/publicAsyncActions'

const AddSchedule = () => {
    const { colors } = useCustomTheme()
    const dispatch = useDispatch<AppDispatch>()
    const { editRoom, movies, movie } = useSelector((state: RootState) => state.admin)

    const [selected, setSelected] = useState<MovieProps['_id'] | null>(null)

    const handleSelected = () => {
        if (selected) {
            dispatch(curMovie({ ...movies.find(movie => movie._id === selected) } as MovieProps))
            router.push('/routes/admin-routes/form/(schedule)/(add)/Detail')
            dispatch(fetchMovie({ id: selected }))
        }

    }

    const renderItem = (item: MovieProps, index: number) => {
        return (
            <View className="items-center justify-center" style={{
                width: `${100 / 3}%`,
            }}>
                <MinimalCard
                    onPress={() => {
                        if (selected === item._id) {
                            setSelected(null)
                        } else {
                            setSelected(item._id)
                        }
                    }}
                    title={item.movieName}
                    subTitle={dateConverter(new Date(item.startTime))}
                    src={item.movieImageUri}
                    style={{
                        width: '100%',
                        height: CAROUSEL_ITEM_SIZE.height,
                        paddingHorizontal: 4,
                        paddingVertical: 8,
                        backgroundColor: selected === item._id ? colors.background.bottomSheet : undefined,
                        borderWidth: selected === item._id ? 2 : 0,
                        borderRadius: selected === item._id ? 8 : 0,
                        borderColor: colors.border.default
                    }} />
            </View >)
    }

    useEffect(() => {
        auth.currentUser?.getIdToken().then(token => {
            dispatch(getMovies(token))
        })

    }, [])

    return (
        <PageWrapper title={editRoom.roomName + ' - ' + editRoom.roomType}
            subTitle='Add new Schedule'>
            <View className='flex-1 pb-16'>
                <FlatList
                    windowSize={50}
                    onEndReachedThreshold={0.5}
                    numColumns={3}
                    contentContainerStyle={{
                        columnGap: 8
                    }}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    data={movies}
                    renderItem={({ item, index }) => renderItem(item, index)} />
                <View className='absolute bottom-0 w-full items-end flex-row justify-end p-4'>
                    <CustomButton disabled={!selected} title='Continue' onPress={handleSelected} />
                </View>
            </View>
        </PageWrapper>
    )
}

export default AddSchedule