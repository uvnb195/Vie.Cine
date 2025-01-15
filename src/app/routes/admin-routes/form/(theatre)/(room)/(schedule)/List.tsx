import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/redux/store'
import PageWrapper from '@/src/components/pages/PageWrapper'
import { setLoading, Status } from '@/src/redux/publicSlice'
import { FlatList } from 'react-native-gesture-handler'
import ThemeText from '@/src/components/theme/ThemeText'
import TagLine from '@/src/components/card/TagLine'
import TextHighLight from '@/src/components/card/TextHighLight'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import CustomButton from '@/src/components/button/CustomButton'
import { FontAwesome6 } from '@expo/vector-icons'
import { router } from 'expo-router'
import { getRoomSchedule } from '@/src/redux/adminAsyncActions'
import { auth } from '@/src/api/firebase/config'
import { ScheduleType } from '@/constants/types/ScheduleType'
import AdminAxiosRepository from '@/src/api/axios/admin'
import PublicAxiosRepository from '@/src/api/axios/public'
import { MovieType } from '@/constants/types/MovieType'

const ListSchedule = () => {
    const { colors } = useCustomTheme()
    const dispatch = useDispatch<AppDispatch>()
    const { status, editRoom, schedule } = useSelector((state: RootState) => state.admin)
    const { } = useSelector((state: RootState) => state.public)

    const [scheduleMovieInfos, setScheduleMovieInfos] = useState<MovieType[]>([])

    const handleAdd = () => {
        router.push('/routes/admin-routes/form/(room)/(schedule)/(add)')
    }

    const fetchMovieInfo = async (movieId: string) => {
        const response = await auth.currentUser?.getIdToken().then(token => {
            const response = AdminAxiosRepository
                .getMovies(token)
                .then(res => res.data.filter((movie: any) => movie._id === movieId)[0].movieId)
            console.log(response)
            return response
        })

        const res = await PublicAxiosRepository.getMovie(response).then(res => res.data)
        console.log('><><><>', res)

        return res
    }

    const renderItem = (item: MovieType, index: number) => {
        return (
            <View className='p-2 flex-row border-b' key={index}
                style={{
                    backgroundColor: hexToRGBA(colors.background.bottomSheet, 0.3),
                    paddingBottom: index === schedule.length - 1 ? 100 : 0
                }}>
                <View className='w-3/4'>
                    {/* title */}
                    <ThemeText
                        fontSize={18}
                        fontWeight='bold'
                        letterSpacing={1.9}
                        otherProps={{
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            textAlign: 'center'
                        }}
                        numsOfLines={1}>{item.original_title}</ThemeText>

                    {/* time && quantity */}
                    <View className='flex-row w-full justify-between items-center'>
                        <TextHighLight>{item?.timeStart?.toLocaleTimeString() || ""}</TextHighLight>
                        <ThemeText
                            fontSize={18}
                            fontWeight='bold'
                            letterSpacing={1.9}
                            otherProps={{
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                textAlign: 'center'
                            }}>16/<ThemeText fontSize={12}>24</ThemeText></ThemeText>
                    </View>
                    {/* time remaining */}
                    <View className='flex-row w-full items-center'>
                        <View className='rounded-full w-2 h-2 mx-2'
                            style={{
                                backgroundColor: colors.error
                            }} />
                        <ThemeText>Running</ThemeText>
                    </View>
                </View>
                <View className='w-1/4 border rounded-1 items-center justify-center'>
                    <Image
                        source={{ uri: scheduleMovieInfos[index].poster_path }}
                        style={{
                            width: '100%', height: 60
                        }} />
                </View>
            </View>
        )
    }

    useEffect(() => {
        if (schedule.length > 0) {
            dispatch(setLoading(false))
            let movieData = [] as MovieType[]
            schedule.forEach(async (item) => {
                const response = await fetchMovieInfo(item.movieId)
                movieData.push(response)
            })

            setScheduleMovieInfos(movieData)
        }
    }, [schedule])

    useEffect(() => {
        console.log('scheduleMovieInfos', scheduleMovieInfos)
    }, [scheduleMovieInfos])

    return (
        <PageWrapper title={editRoom.roomName + ' - ' + editRoom.roomType}
            subTitle='Schedule of room'>
            <View className='flex-1'>
                <FlatList
                    data={scheduleMovieInfos}
                    renderItem={({ item, index }) => renderItem(item, index)}
                />
                <View className='absolute bottom-0 right-0 w-14 h-14 m-4'>
                    <CustomButton
                        onPress={handleAdd}
                        title=''
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 100,
                            shadowColor: colors.text.dark,
                            shadowOffset: { width: 0, height: 2 },

                            backgroundColor: colors.background.highlight
                        }}
                        hasBorder={false}
                        Icon={<FontAwesome6 name="plus"
                            size={24}
                            color={colors.text.dark} />} />
                </View>
            </View>
        </PageWrapper>
    )
}

export default ListSchedule