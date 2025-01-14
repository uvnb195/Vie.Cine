import { MovieRunTime } from '@/constants/types/MovieType'
import { convertDuration } from '@/hooks/convertDuration'
import { auth } from '@/src/api/firebase/config'
import BottomSection from '@/src/components/bottom-sheet/BottomSection'
import TextHighLight from '@/src/components/card/TextHighLight'
import CustomInput from '@/src/components/input/CustomInput'
import DropdownMenu from '@/src/components/input/DropdownMenu'
import PageWrapper from '@/src/components/pages/PageWrapper'
import ThemeText from '@/src/components/theme/ThemeText'
import { AdminMovieType, useAdminMovie } from '@/src/contexts/movie'
import { useCustomTheme } from '@/src/contexts/theme'
import { addMovie } from '@/src/redux/adminAsyncActions'
import { fetchMovie } from '@/src/redux/publicAsyncActions'
import { setLoading } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { router, useLocalSearchParams } from 'expo-router'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Button, Image, Pressable, View } from 'react-native'
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'

const SelectTime = () => {
    const id = useLocalSearchParams().id.toString()
    if (Number.isNaN(parseInt(id))) router.back()

    const { colors } = useCustomTheme()
    const { data, handleData } = useAdminMovie()
    const { movieInfo } = useSelector((state: RootState) => state.public)
    const dispatch = useDispatch<AppDispatch>()
    const [datePicked, setDatePicked] = useState<Date | null>(null)
    const [openDateDialog, setOpenDateDialog] = useState<boolean>(false)

    const renderGenres = () => {
        if (movieInfo.movie?.genres) {
            return movieInfo.movie?.genres.map((genre, index) => {
                return <TextHighLight
                    key={index}
                    marginX={4}
                    marginY={4}
                    children={genre.name} />
            })
        }
        else return null
    }
    const handleSelectRunTime = (value: MovieRunTime) => {
        const createAt = moment()
        let endAt = moment()
        endAt = value <= 3
            ? endAt.add(value, 'weeks')
            : endAt.add(value - 3, 'months')
        handleData({
            movieId: parseInt(id),
            movieName: movieInfo.movie?.original_title || '',
            movieImageUri: movieInfo.movie?.poster_path || '',
            startTime: datePicked,
            endAt: endAt.toDate()
        } as AdminMovieType)
    }
    const handleFinish = () => {
        const formData = new FormData()
        formData.append('movieId', data?.movieId.toString() || '')
        formData.append('movieName', data?.movieName || '')
        formData.append('movieImageUri', data?.movieImageUri || '')
        formData.append('startTime', data?.startTime.toString() || '')
        formData.append('endAt', data?.endAt.toString() || '')
        auth.currentUser?.getIdToken().then(token => {
            dispatch(addMovie({ token, movie: formData }))
        })
        router.dismissAll()
    }

    useEffect(() => {
        dispatch(setLoading(true))
        if (id.length > 0) {
            dispatch(fetchMovie({ id }))
        }
        setTimeout(() => {
            dispatch(setLoading(false))
        }, 0);
        return () => handleData(null)
    }, [])
    return (
        <View className='flex-1'>
            {/* dialog */}
            {openDateDialog &&
                <RNDateTimePicker
                    mode='date'
                    value={datePicked || new Date()}
                    onChange={(event, date) => {
                        if (event.type === 'dismissed') {
                            setOpenDateDialog(false)
                        }
                        else if (event.type === 'set') {
                            setOpenDateDialog(false)
                            if (date) {
                                setDatePicked(date)
                            }
                        }
                    }}
                />
            }

            <PageWrapper
                style={{
                    paddingHorizontal: 16
                }}
                title={'Run Time'}
                subTitle={'How long to run the movie'}
            >
                <View className='flex-1 pt-4'>
                    <ScrollView>
                        <ThemeText
                            fontSize={20}
                            fontWeight='bold'>{movieInfo.movie?.original_title}</ThemeText>
                        <Image
                            style={{
                                width: '100%',
                                height: 200,
                                borderRadius: 8,
                            }}
                            resizeMode='cover'
                            source={{ uri: movieInfo.movie?.backdrop_path }} />
                        <ThemeText
                            otherProps={{
                                paddingVertical: 8,
                            }}>Duration:{convertDuration(movieInfo.movie?.runtime || 0)}</ThemeText>
                        <ThemeText
                            otherProps={{
                                paddingVertical: 8,
                            }}>Certification:{movieInfo.movie?.certification}</ThemeText>

                        <View className='flex-row flex-wrap items-center'>
                            <ThemeText>Genres:</ThemeText>
                            {renderGenres()}
                        </View>

                        {/* run time */}
                        <View className='w-full'>
                            <DropdownMenu
                                style={{
                                    marginTop: 16
                                }}
                                disableSearch
                                placeHolder='Select run time'
                                data={[
                                    {
                                        value: '1 Week',
                                        key: MovieRunTime.ONE_WEEK
                                    },
                                    {
                                        value: '2 Weeks',
                                        key: MovieRunTime.TWO_WEEKS
                                    },
                                    {
                                        value: '3 Weeks',
                                        key: MovieRunTime.THREE_WEEKS
                                    },
                                    {
                                        value: '1 Month',
                                        key: MovieRunTime.ONE_MONTH
                                    },
                                    {
                                        value: '2 Months',
                                        key: MovieRunTime.TWO_MONTHS
                                    },
                                    {
                                        value: '3 Months',
                                        key: MovieRunTime.THREE_MONTHS
                                    },
                                ]}
                                onSelected={handleSelectRunTime} />
                        </View>

                        {/* start time */}
                        <View className='w-full relative'>
                            <View>
                                <CustomInput
                                    style={{
                                        marginTop: 16,
                                    }}
                                    borderColor={colors.border.default}
                                    placeHolder='Start date'
                                    disabled
                                    value={datePicked ? `${datePicked.getDate()}/${datePicked.getMonth() || 0 + 1}/${datePicked.getFullYear()}` : 'Select start date'
                                    }
                                />
                            </View>
                            <View className='absolute w-full h-[55px] bottom-0 z-50'>
                                <Pressable
                                    className='w-full h-full'
                                    onPress={() => {
                                        console.log('pressed')
                                        setOpenDateDialog(true)
                                    }} />
                            </View>
                        </View>

                    </ScrollView>
                </View>
                <View>
                    <BottomSection
                        handleNext={handleFinish}
                        handleCancel={() => router.back()}
                        currentIndex={1}
                        totalPage={2}
                        disabled={datePicked === null || data === null}
                    />
                </View>
            </PageWrapper>

        </View>
    )
}

export default SelectTime