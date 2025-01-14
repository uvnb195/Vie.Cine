import { hexToRGBA } from '@/hooks/hexToRGBA'
import { useCustomTheme } from '@/src/contexts/theme'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { forwardRef, ReactNode, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Alert, BackHandler, Button, Dimensions, View, ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import ScheduleCard from '../card/ScheduleCard'
import CustomSearchOutLine from '../input/CustomSearchOutLine'
import LocationTag from '../LocationTag'
import { BottomSheetRef } from './PaymentSheet'
import MapView, { Marker } from 'react-native-maps'
import { requestLocationPermission } from '@/hooks/permissions'
import { kMToLongitudes } from '@/hooks/kMToLongitudes'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/redux/store'
import { auth } from '@/src/api/firebase/config'
import { getMovieSchedule, getTheatreDetail } from '@/src/redux/privateAsyncActions'
import { ScheduleType } from '@/constants/types/ScheduleType'
import { router } from 'expo-router'
import { addBookingTicket } from '@/src/redux/privateSlice'

interface Props {
    children?: ReactNode,
}

const ScheduleSheet = forwardRef<BottomSheetRef, Props>(({ children }, ref) => {
    const snapPoints = useMemo(() => ['90%'], [])

    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const { schedules } = useSelector((state: RootState) => state.private)
    const { local } = useSelector((state: RootState) => state.public)
    const dispatch = useDispatch<AppDispatch>()

    const sheetRef = useRef<BottomSheetModal>(null)

    const [coords, setCoords] = React.useState<{ latitude: number, longitude: number }>({ latitude: 0, longitude: 0 })
    const [selectedTheatre, setSelectedTheatre] = useState<ScheduleType | null>(null)

    const viewableItems = useSharedValue<ViewToken[]>([])

    const mapRef = useRef<MapView>(null)

    useImperativeHandle(ref, () => ({
        closeSheet: () => {
            return sheetRef.current?.close()
        },
        expandSheet: () => {
            sheetRef.current?.expand()
        },
        collapseSheet: () => {
            sheetRef.current?.collapse()
        },
        openSheet: () => {
            sheetRef.current?.present()
        }
    }), [])

    const renderItem = ((item: ScheduleType) => {
        return (
            <ScheduleCard
                style={{
                    backgroundColor: selectedTheatre === item ? colors.background.default : undefined,
                    borderRadius: selectedTheatre === item ? 8 : 0,
                }}
                data={item}
                selected={selectedTheatre === item}
                onSelected={(lat, lng) => {
                    setCoords({ latitude: lat, longitude: lng })
                    if (selectedTheatre?._id === item.theatreId) setSelectedTheatre(null)
                    else setSelectedTheatre(item)
                }}
                onChooseTime={(time, price, scheduleId, timeId) => {
                    auth.currentUser?.getIdToken().then(token => {
                        dispatch(getTheatreDetail({ token, theatreId: item.theatreId }))
                    })
                    dispatch(addBookingTicket({
                        _id: timeId,
                        price,
                        selectedTime: time.toDate(),
                        movieScheduleId: scheduleId
                    }))
                    router.push('/routes/(movie-details)/BuyTicket')
                }} />
        )
    })

    useEffect(() => {
        if (local.longitude !== 0 && local.latitude !== 0) {
            setCoords({
                latitude: local.latitude,
                longitude: local.longitude
            })
        } else {
            (async () => {
                const result = await requestLocationPermission()
                if (result.status == 'success') {
                    setCoords({
                        latitude: result.data!!.coords.latitude,
                        longitude: result.data!!.coords.longitude
                    })
                }
            })()
        }

    }, [])


    const onPositionChange = () => {
        mapRef.current?.animateCamera({
            center: {
                latitude: coords.latitude,
                longitude: coords.longitude
            },
            zoom: 12
        }, { duration: 500 })
    }

    useEffect(() => {
        onPositionChange()
    }, [coords])

    return (
        <BottomSheetModal
            enableDismissOnClose={true}
            ref={sheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backgroundStyle={
                { backgroundColor: hexToRGBA(colors.background.bottomSheet, 0.8) }
            }
            handleIndicatorStyle={{ backgroundColor: colors.sheetIndicator }}
            backdropComponent={(props) => (
                <BottomSheetBackdrop {...props}
                    enableTouchThrough={true} pressBehavior='close' />
            )}
        >
            <View className=' flex-1 h-[90%]'>
                <LocationTag style={{ paddingHorizontal: 8 }} />
                <View className='w-full h-[200px] border-2 fixed z-50'
                    style={{
                        borderColor: colors.text.default
                    }}>
                    <MapView
                        ref={mapRef}
                        className='flex-1'
                        zoomControlEnabled={true}
                        showsUserLocation={true}
                        zoomEnabled={false}
                        zoomTapEnabled={false}
                        rotateEnabled={false}
                        initialRegion={{
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                            latitudeDelta: 0.000001,
                            longitudeDelta: kMToLongitudes(1, coords.latitude)
                        }}>
                        <Marker
                            pinColor={'blue'}
                            coordinate={{
                                latitude: coords.latitude,
                                longitude: coords.longitude,
                            }}
                            title={`You`}
                        />
                    </MapView>

                </View>
                <View className='flex-1 pt-4'>
                    <FlatList
                        decelerationRate={'fast'}
                        contentContainerStyle={{
                            paddingBottom: 24
                        }}
                        data={schedules}
                        renderItem={({ item, index }) =>
                            // <Button title={item.movieId + ""} onPress={() => setCoords({ latitude: 17.222820870981355, longitude: 106.78801501689948 })} />
                            renderItem(item)
                        }
                        onViewableItemsChanged={({ viewableItems: vItems }) => {
                            viewableItems.value = vItems
                        }}
                    />
                </View>
            </View>

        </BottomSheetModal>
    )
})

export default ScheduleSheet