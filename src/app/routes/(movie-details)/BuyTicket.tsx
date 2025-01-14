import { ServiceType } from '@/constants/types/ServiceType'
import { currencyFormat } from '@/hooks/currencyFormat'
import { auth } from '@/src/api/firebase/config'
import BottomSection from '@/src/components/bottom-sheet/BottomSection'
import DetailBackgroundWrapper from '@/src/components/DetailBackgroundWrapper'
import Header from '@/src/components/header'
import PageWrapper from '@/src/components/pages/PageWrapper'
import CinemaMapView from '@/src/components/scroll/CinemaMapView'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { SeatProps, SeatType } from '@/src/redux/adminSlice'
import { addBooking, getServices } from '@/src/redux/privateAsyncActions'
import { addBookingTicket } from '@/src/redux/privateSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { Feather } from '@expo/vector-icons'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { CheckCircleIcon } from 'react-native-heroicons/outline'
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'

const BuyTicket = () => {
    const { colors } = useCustomTheme()
    const { loading, movieInfo } = useSelector((state: RootState) => state.public)
    const { theatreDetail, services, booking, schedules } = useSelector((state: RootState) => state.private)
    const dispatch = useDispatch<AppDispatch>()
    const [selectedSeats, setSelectedSeats] = useState<SeatProps[]>([])
    const [selectedServices, setSelectedServices] = useState<ServiceType[]>([])
    const [maps, setMaps] = useState<SeatProps[][]>([])

    const totalHeight = useDerivedValue(() => {
        if (selectedSeats.length > 0 || selectedServices.length > 0) {
            return 100
        } else return 0
    }, [selectedSeats, selectedServices])
    const totalAnim = useAnimatedStyle(() => ({
        height: withTiming(totalHeight.value),
        opacity: withTiming(totalHeight.value > 0 ? 1 : 0),
        transform: [{ translateY: withTiming(totalHeight.value > 0 ? 0 : 100) }]
    }))

    const calculateTotal = useCallback(() => {
        let total = 0
        if (selectedServices.length > 0) {
            selectedServices.forEach((service) => {
                total += service.price
            })
        }
        if (selectedSeats.length > 0) {
            total += selectedSeats.length * booking?.price!!
        }
        return total
    }, [selectedSeats, selectedServices])


    const renderSelectedSeats = () => {
        return selectedSeats?.map((seat, index) =>
            <View
                key={index}
                className='w-16 h-6 border rounded-2 items-center justify-center m-2'
                style={{
                    borderColor: colors.border.default,
                    backgroundColor: colors.background.highlight
                }}>
                <ThemeText>{seat?.seatCode}</ThemeText>
            </View>)
    }
    const handleFinish = () => {
        const formData = new FormData()
        if (!booking || !booking.movieScheduleId || !booking.price || !booking?.selectedTime || selectedSeats.length == 0) return
        formData.append('movieScheduleId', booking.movieScheduleId?.toString())
        formData.append('price', calculateTotal().toString())
        formData.append('selectedTime', booking.selectedTime.toString())
        formData.append('seats', JSON.stringify(selectedSeats.map(e => e.seatCode)))
        if (selectedServices.length > 0)
            formData.append('services', JSON.stringify(selectedServices))
        auth.currentUser?.getIdToken().then((token) => {
            dispatch(addBooking({ token, booking: formData }))
        })
        router.dismissAll()
    }

    useEffect(() => {
        auth.currentUser?.getIdToken().then((token) => {
            dispatch(getServices(token))
        })
        return () => {
            setSelectedSeats([])
            dispatch(addBookingTicket(null))
        }
    }, [])

    useEffect(() => {
        if (!theatreDetail || !theatreDetail?.map2d || theatreDetail.map2d.length == 0 || !booking?.movieScheduleId) return
        const currentSchedule = schedules.find((schedule) => schedule._id === booking?.movieScheduleId)?.runTimes
        const blockSeats = currentSchedule?.filter(e => e._id === booking?._id)[0].unavailableSeats
        if (!blockSeats || blockSeats.length === 0) {
            setMaps(theatreDetail.map2d)
            return
        }
        const newMap = theatreDetail.map2d.map((row) => {
            if (row.length === 0) return row
            return row.map((seat) => {
                if (blockSeats.includes(seat.seatCode)) {
                    return { ...seat, seatType: SeatType.UNAVAILABLE }
                } else return seat
            })
        })
        console.log('============================', newMap)
        setMaps(newMap)
    }, [theatreDetail?.map2d])

    return (
        <DetailBackgroundWrapper
            sourceUri={loading ? undefined : movieInfo.movie?.poster_path}
            HeaderComponent={
                < Header
                    title={'buy.ticket'.toUpperCase()}
                    searchIconShown
                    backIconPress={() => {
                        router.dismiss()
                    }} />}>
            <View className='flex-1'>
                <PageWrapper
                    title='Buy Tickets'
                    subTitle='Choose your Seats'
                    style={{
                        flex: 1,
                        borderColor: 'blue'
                    }}>

                    <View className='w-full h-[200px] z-50'>
                        <CinemaMapView
                            selected={selectedSeats || []}
                            onSelected={(value) => {
                                if (selectedSeats.includes(value)) {
                                    setSelectedSeats(selectedSeats.filter((seat) => seat !== value))
                                } else {
                                    setSelectedSeats([...selectedSeats, value])
                                }
                            }}
                            data={maps || []}
                        />
                    </View>
                    <ThemeText
                        otherProps={{
                            width: '100%',
                            textAlign: 'right',
                            paddingRight: 16
                        }}>
                        Seat price: {currencyFormat(booking?.price || 0)}
                    </ThemeText>
                    {selectedSeats.length > 0 &&
                        <View className={'flex-wrap flex-row items-center'}>
                            <ThemeText
                                fontSize={20}
                                fontWeight='bold'
                                color={colors.text.light}>Selected:</ThemeText>
                            {renderSelectedSeats()}
                        </View>}
                    <Animated.View className='flex-grow'>
                        <FlatList data={services}
                            renderItem={({ item }) =>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (selectedServices.includes(item)) {
                                            setSelectedServices(selectedServices.filter((service) => service !== item))
                                        } else {
                                            setSelectedServices([...selectedServices, item])
                                        }
                                    }}>
                                    <View className='flex-row items-center justify-between my-2'>
                                        <View className='px-2 items-center'>
                                            {selectedServices.includes(item) ? <CheckCircleIcon size={28} color={colors.icon.highlight} />
                                                : <Feather name='circle' size={24} color={colors.icon.highlight} />}
                                        </View>
                                        <View>
                                            <ThemeText fontWeight={selectedServices.includes(item) ? 'bold' : 'regular'}
                                                fontSize={20}
                                                color={selectedServices.includes(item) ? colors.text.dark : colors.text.default}>{item.title}</ThemeText>
                                            <ThemeText color={colors.text.light}>Price: {currencyFormat(item.price)}</ThemeText>
                                        </View>
                                        <View className='flex-1 items-end pr-2'>
                                            <Image
                                                style={{
                                                    width: 100,
                                                    height: 50,
                                                }}
                                                source={{ uri: item.image }} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            } />
                    </Animated.View>
                    <Animated.View className={'w-full items-center flex-row'}
                        style={totalAnim}>
                        <ThemeText
                            fontWeight='bold'
                            otherProps={{
                                textAlign: 'right',
                                width: '100%',
                                paddingRight: 16,
                                textDecorationLine: 'underline'
                            }}
                            fontSize={20}>Total: {currencyFormat(calculateTotal())}</ThemeText>
                    </Animated.View>
                    <BottomSection
                        handleCancel={() => {
                            router.dismissAll()
                        }}
                        handleNext={handleFinish}
                        currentIndex={0}
                        totalPage={1}
                        disabled={selectedSeats.length === 0} />
                </PageWrapper>
            </View>
        </DetailBackgroundWrapper>
    )
}

export default BuyTicket