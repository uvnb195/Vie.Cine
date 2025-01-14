import { useCustomTheme } from '@/src/contexts/theme'
import React, { memo, useEffect } from 'react'
import { Pressable, View, ViewStyle, ViewToken } from 'react-native'
import { MapPinIcon } from 'react-native-heroicons/solid'
import Animated, { SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import ThemeText from '../theme/ThemeText'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/redux/store'
import { ScheduleType } from '@/constants/types/ScheduleType'
import { getMovieSchedule } from '@/src/redux/privateAsyncActions'
import { getTheatreDetail } from '@/src/redux/adminAsyncActions'
import { auth } from '@/src/api/firebase/config'
import { TheatreResponse } from '@/src/redux/adminSlice'
import moment from 'moment'
import { UserTheatreList } from '@/src/redux/privateSlice'
interface Props {
    style?: ViewStyle
    selected?: boolean
    data: ScheduleType,
    onSelected?: (lat: number, lng: number) => void,
    onChooseTime?: (time: moment.Moment, price: number, scheduleId: string, timeId: string) => void
}

const ScheduleCard = ({ style, selected, data, onSelected, onChooseTime }: Props) => {
    const { colors } = useCustomTheme()
    const dispatch = useDispatch<AppDispatch>()
    const { theatres } = useSelector((state: RootState) => state.private)
    const [theatreData, setTheatreData] = React.useState<UserTheatreList | null>(null)

    const handlePress = () => {
        onSelected && onSelected(theatreData?.location.lat!!, theatreData?.location.lng!!)
    }

    const getTime = (date: moment.Moment) => {
        const hour = date.toDate().getHours().toString().length === 1 ? `0${date.toDate().getHours()}` : date.toDate().getHours()
        const minute = date.toDate().getMinutes().toString().length === 1 ? `0${date.toDate().getMinutes()}` : date.toDate().getMinutes()
        return `${hour}:${minute}`
    }
    const getDateString = (date: moment.Moment) => {
        const day = date.toDate().getDate().toString().length === 1 ? `0${date.toDate().getDate()}` : date.toDate().getDate()
        const month = date.toDate().getMonth().toString().length === 1 ? `0${date.toDate().getMonth() + 1}` : date.toDate().getMonth() + 1
        const year = date.toDate().getFullYear()
        return `${day}/${month}/${year}`
    }
    const isToday = (date: moment.Moment) => {
        const today = new Date()
        return date.toDate().getDate() === today.getDate() && date.toDate().getMonth() === today.getMonth() && date.toDate().getFullYear() === today.getFullYear()
    }
    const isPast = (date: moment.Moment) => {
        const currentTime = moment()
        return currentTime.isAfter(date)
    }


    const renderRunTime = () => {
        return (
            data.runTimes.map((e, i) => {
                return (
                    <Pressable
                        key={i}
                        disabled={isPast(moment(e.time))}
                        onPress={() => {
                            onChooseTime && onChooseTime(moment(e.time), e.price, data._id, e._id)
                        }}>
                        <View
                            className='rounded-2 p-2 mx-2'
                            style={{
                                borderWidth: 1,
                                borderColor: isPast(moment(e.time)) ? colors.border.disable : colors.border.default,
                                backgroundColor: isPast(moment(e.time)) ? colors.background.default : colors.background.default,
                            }}>
                            <ThemeText fontSize={12}>{getTime(moment(e.time))}</ThemeText>
                        </View>
                    </Pressable>
                )
            })
        )

    }

    useEffect(() => {
        if (!theatres.map(e => e._id).includes(data.theatreId)) {
            auth.currentUser?.getIdToken().then(token => {
                dispatch(getTheatreDetail({ token, id: data.theatreId }))
            })
        }
    }, [])

    useEffect(() => {
        const theatre = theatres.find(e => e._id === data.theatreId)
        if (theatre) {
            setTheatreData(theatre)
        }
    }, [theatres])

    return (
        <Pressable onPress={handlePress}>
            <Animated.View
                className='border-y items-center py-2 px-4' style={[
                    {
                        borderColor: colors.textHighLight.background
                    },
                    style]}>
                {/* theatre info */}
                <View className='w-full'>
                    <ThemeText
                        otherProps={{
                            paddingBottom: 4,
                        }}
                        fontSize={18}
                        fontWeight='bold'>{theatreData?.name}</ThemeText>
                    <View className='flex-row items-center'>
                        <MapPinIcon size={16} color={colors.icon.highlight} />
                        <View className='w-2' />
                        <ThemeText fontSize={12}>{theatreData?.location.address.replace('\n', ' ')}</ThemeText>
                    </View>
                </View>
                <View className='w-full pt-2'>
                    <ThemeText
                        otherProps={{
                            paddingBottom: 4,
                            paddingHorizontal: 8,
                        }}
                        fontSize={18}
                        color={colors.text.light}>{
                            isToday(moment(data.runDate))
                                ? 'Today'
                                : getDateString(moment(data.runDate))}</ThemeText>
                    <View className='flex-row w-full flex-wrap gap-y-2'>
                        {renderRunTime()}
                    </View>
                </View>
            </Animated.View>
        </Pressable>
    )
}

export default ScheduleCard