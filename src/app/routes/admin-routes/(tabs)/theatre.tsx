import { TAB_BAR_HEIGHT } from '@/constants/Values'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { kMToLongitudes } from '@/hooks/kMToLongitudes'
import { getDeviceLocation } from '@/hooks/permissions'
import { auth } from '@/src/api/firebase/config'
import AdminWrapper from '@/src/components/AdminWrapper'
import CustomButton from '@/src/components/button/CustomButton'
import Header from '@/src/components/header'
import DropdownMenu from '@/src/components/input/DropdownMenu'
import SearchInput from '@/src/components/input/SearchInput'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { getTheatres } from '@/src/redux/adminAsyncActions'
import { addRooms } from '@/src/redux/adminSlice'
import { setLoading, updateLocation } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { router } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { Button, Pressable, View, ViewStyle } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { ArrowRightIcon, ChevronRightIcon, MapPinIcon, PlusIcon } from 'react-native-heroicons/solid'
import MapView, { Marker } from 'react-native-maps'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'

const Theatre = () => {
    const { colors } = useCustomTheme()

    const dispatch = useDispatch<AppDispatch>()
    const { local } = useSelector((state: RootState) => state.public)
    const { theatres, status } = useSelector((state: RootState) => state.admin)
    const [theatreLocation, setTheatreLocation] = React.useState<{ latitude: number, longitude: number }>({ latitude: local.latitude, longitude: local.longitude })
    const mapRef = useRef<MapView>(null)
    const height = useSharedValue(0)
    const [selectedTheatre, setSelectedTheatre] = React.useState<string | null>(null)

    const animation = useAnimatedStyle(() => ({
        height: height.value
    }))
    const detailAnimation = useAnimatedStyle(() => ({
        width: interpolate(height.value, [0, 200], [0, 100]),
        opacity: interpolate(height.value, [0, 200], [0, 1])
    }))

    const requestLocationPermission = async () => {
        const result = await getDeviceLocation()
        if (result.status == 'success') {
            dispatch(updateLocation({
                province: result.data?.city || "",
                district: result.data?.district || "",
                latitude: result.data?.latitude || 0,
                longitude: result.data?.longitude || 0
            }))
        }
    }
    const fetchTheatres = async () => {
        await auth.currentUser?.getIdToken().then(token => {
            dispatch(getTheatres(token))
        })
    }
    useEffect(() => {
        fetchTheatres()
        if (local.latitude == 0 || local.longitude == 0) {
            requestLocationPermission()
        }
    }, [])
    const onPositionChange = () => {
        mapRef.current?.animateCamera({
            center: {
                latitude: theatreLocation.latitude,
                longitude: theatreLocation.longitude
            },
            zoom: 12
        }, { duration: 500 })
    }

    const handleDetail = () => {
        if (selectedTheatre == null) return
        dispatch(addRooms({ theatreId: selectedTheatre }))
        router.push({
            pathname: '/routes/admin-routes/form/(theatre)/(detail)',
            params: {
                id: 'detail',
                theatreId: selectedTheatre
            }
        })
    }

    useEffect(() => {
        onPositionChange()
    }, [theatreLocation])

    useEffect(() => {
        console.log('::::::::::::::::::::::::', status)
    }, [status]);

    return (
        <AdminWrapper
            style={{
                flex: 1,
                marginBottom: TAB_BAR_HEIGHT,
            }}
            HeaderComponent={
                <Header title='/THEATRES'
                    backIconShown={false} />
            }>
            <Animated.View style={animation} className={'bg-black w-full overflow-hidden border-2'}>
                <MapView
                    ref={mapRef}
                    className='w-full h-[200px]'
                    zoomControlEnabled={true}
                    showsUserLocation={true}
                    zoomEnabled={false}
                    zoomTapEnabled={false}
                    rotateEnabled={false}
                    initialRegion={{
                        latitude: local.latitude,
                        longitude: local.longitude,
                        latitudeDelta: 0.000001,
                        longitudeDelta: kMToLongitudes(1, local.latitude)
                    }}>
                    {theatreLocation.latitude != local.latitude && theatreLocation.longitude != local.longitude &&
                        <Marker
                            pinColor={'blue'}
                            coordinate={{
                                latitude: theatreLocation.latitude,
                                longitude: theatreLocation.longitude,
                            }}
                            title={`You`}
                        />}
                </MapView>

            </Animated.View>

            {/* search & buttons */}
            <View className='px-4 flex-row-reverse py-2'
                style={
                    {
                        backgroundColor: hexToRGBA(colors.background.default, 0.7),
                    }
                }>
                <Animated.View style={detailAnimation}>
                    <CustomButton
                        onPress={handleDetail}
                        title='Detail'
                        style={{
                            height: 40
                        }}
                        Icon={<ArrowRightIcon color={colors.icon.enable} size={20} />} />
                </Animated.View>
                <View className='w-2' />
                <CustomButton
                    onPress={() => {
                        router.push({
                            pathname: '/routes/admin-routes/form/(theatre)/(add)',
                            params: { id: 'add' }
                        })
                    }}
                    style={{
                        width: 50,
                        height: 40
                    }}
                    Icon={<PlusIcon color={colors.icon.enable} size={20} />} />
                <View className='flex-1 pr-2'>
                    <SearchInput style={{ height: 40 }} />
                </View>
            </View>
            <View className='flex-shrink' >
                {theatres.length == 0
                    ? <ThemeText fontSize={24} otherProps={{
                        textAlign: 'center',
                        padding: 16,
                    }}
                        color={colors.error}>Not found any Theatres.</ThemeText>
                    : <FlatList
                        onScrollBeginDrag={(e) => {
                            height.value = withTiming(0)
                        }}
                        data={theatres}
                        renderItem={({ item }) => {
                            if (!item.location) return null
                            let addressData = (item.location.district?.name || '') + ', ' + (item.location.province?.name || '')
                            return (
                                <CinemaItem
                                    onPress={() => {
                                        if (selectedTheatre != item._id) {
                                            setSelectedTheatre(item._id)
                                            setTheatreLocation({
                                                latitude: item.location.lat || 0,
                                                longitude: item.location.lng || 0
                                            })
                                            height.value = withTiming(200)
                                        }
                                    }}
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 4,
                                        backgroundColor: selectedTheatre == item._id ? colors.background.bottomSheet : hexToRGBA(colors.background.default, 0.7),
                                        borderBottomWidth: 1,
                                        borderColor: colors.border.disable
                                    }}
                                    title={item.name}
                                    address={addressData} />
                            )
                        }}
                    />}

            </View>

        </AdminWrapper>
    )
}

interface CinemaItemProps {
    title: string,
    address: string,
    style?: ViewStyle,
    onPress?: () => void
}

const CinemaItem = ({
    title,
    address,
    style,
    onPress
}: CinemaItemProps) => {
    const { colors } = useCustomTheme()
    return (
        <Pressable onPress={onPress}>
            <View className='py-2' style={style}>
                <ThemeText
                    fontSize={20}
                    fontWeight='bold'
                    letterSpacing={3}
                    color={colors.text.dark}
                >{title.toUpperCase()}</ThemeText>
                <View className='flex-row items-center'>
                    <MapPinIcon
                        size={16}
                        color={colors.icon.highlight} />
                    <View className='w-2' />
                    <ThemeText>{address}</ThemeText>
                </View>
            </View>
        </Pressable>
    )
}

export default Theatre
