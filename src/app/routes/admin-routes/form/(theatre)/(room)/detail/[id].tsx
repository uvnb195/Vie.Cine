import { View, Text, ScrollView, KeyboardAvoidingView, BackHandler, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/redux/store'
import { getRoomDetail, getRoomSchedule, upsertRoom } from '@/src/redux/adminAsyncActions'
import { curRoom, SeatType } from '@/src/redux/adminSlice'
import { auth } from '@/src/api/firebase/config'
import PageWrapper from '@/src/components/pages/PageWrapper'
import CinemaMapView from '@/src/components/scroll/CinemaMapView'
import CustomButton from '@/src/components/button/CustomButton'
import CustomInput from '@/src/components/input/CustomInput'
import ThemeText from '@/src/components/theme/ThemeText'
import { Entypo, EvilIcons, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useCustomTheme } from '@/src/contexts/theme'
import { FlatList } from 'react-native-gesture-handler'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { convertSeatTypeToString, convertStringToSeatType } from '@/hooks/convertSeatTypeToString'
import { StatusType } from '@/constants/types/StatusType'
import { currencyFormat, formatCurrency } from '@/hooks/currencyFormat'
import { RoomType } from '@/constants/types/RoomType'
import { setLoading, Status, updateStatus } from '@/src/redux/publicSlice'

const RoomDetail = () => {
    const { id } = useLocalSearchParams()
    const { editRoom, rooms, status, schedule } = useSelector((state: RootState) => state.admin)
    const dispatch = useDispatch<AppDispatch>()
    const { colors } = useCustomTheme()
    const [currentFocus, setCurrentFocus] = useState<SeatType | null>(null)
    const [disable, setDisable] = useState(true)
    const [statusChanged, setStatusChanged] = useState(false)

    const renderItem = (item: {
        seatType: string;
        price: number;
    }) => {
        return (
            <View className='py-2'>
                <CustomInput
                    placeHolder={item.seatType}
                    keyboardType='numeric'
                    LeftIcon={
                        <MaterialIcons name="attach-money" size={20} color={colors.text.dark} />}
                    value={formatCurrency(item.price.toString())}
                    onValueChange={(value) => {
                        if (value.length > 0 && Number(value.replaceAll(' ', '')) != editRoom.prices.filter(item => item.seatType === item.seatType)[0].price) {
                            setDisable(false)
                            dispatch(curRoom({ prices: editRoom.prices.map(price => price.seatType === item.seatType ? { seatType: item.seatType, price: Number(value.replaceAll(' ', '')) } : price) }))
                        }
                    }}
                    style={{
                        backgroundColor: hexToRGBA(colors.background.highlight, 0.5),
                    }}
                    borderColor={currentFocus && convertSeatTypeToString(currentFocus) === item.seatType ? colors.border.default : 'transparent'}
                    onFocus={() => {
                        setCurrentFocus(convertStringToSeatType(item.seatType))
                    }}
                    onBlur={() => {
                        setCurrentFocus(null)
                    }} />
            </View>
        )
    }

    const encodeForm = (data: RoomType) => {
        console.log('data >>>', data)
        const form = new FormData()
        form.append('_id', data._id)
        form.append('roomName', data.roomName)
        form.append('roomType', data.roomType)
        form.append('map2d', JSON.stringify(data.map2d))
        form.append('prices', JSON.stringify(data.prices))
        form.append('theatreId', data.theatreId)
        form.append('totalSeats', data.totalSeats.toString())
        form.append('status', data.status)
        return form
    }

    const onSave = async () => {
        setDisable(true)
        auth.currentUser?.getIdToken(true).then(token => {
            dispatch(upsertRoom({ token, theatreId: rooms.theatreId, room: encodeForm(editRoom) }))

        })
    }

    const onStatusChange = () => {
        Alert.alert('Warning', `Are you sure to ${editRoom.status === 'REMOVED' ? 'ENABLE' : 'REMOVE'} this Room?`, [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            {
                text: 'YES', onPress: () => {
                    setStatusChanged(true)
                }
            },
        ]);
    }

    const handleNavigate = async () => {
        await auth.currentUser?.getIdToken().then(token => {
            dispatch(getRoomSchedule({ token, roomId: editRoom._id }))
        })
        router.push({
            pathname: '/routes/admin-routes/form/(theatre)/(room)/(schedule)/List',
        })
    }

    useEffect(() => {
        console.log('schedule::<>', schedule)
    }, [schedule])

    useEffect(() => {
        if (statusChanged)
            auth.currentUser?.getIdToken(true).then(token => {
                dispatch(upsertRoom({
                    token,
                    theatreId: rooms.theatreId,
                    room: encodeForm({ ...editRoom, status: editRoom.status === 'REMOVED' ? StatusType.AVAILABLE : StatusType.REMOVED })
                }))
                setStatusChanged(false)
            })
    }, [statusChanged])

    useEffect(() => {
        if (status === Status.PENDING) {
            dispatch(setLoading(true))
        }
        else {
            dispatch(setLoading(false))
        }
    }, [status])

    useEffect(() => {
        return () => {
            // dispatch(curRoom({}))
            dispatch(updateStatus(Status.IDLE))
        }
    }, [])
    return (
        <PageWrapper title='Room Detail' >
            <View className='flex-1'>
                <CinemaMapView disabled={editRoom.status === StatusType.REMOVED} data={editRoom.map2d || []} />
                <KeyboardAvoidingView
                    behavior='position'
                    style={{
                        flex: 1,
                        backgroundColor: colors.background.default
                    }}>
                    <View className='p-4 gap-y-4'
                        style={{
                            backgroundColor: colors.background.default
                        }}>
                        <View className='flex-row justify-between'>
                            <View className='w-3/4'>
                                <CustomInput
                                    lineThrough={editRoom.status === StatusType.REMOVED}
                                    placeHolder='Room Name'
                                    value={editRoom.roomName}
                                    onValueChange={(v) => {
                                        if (v !== editRoom.roomName && v.length > 0) {
                                            dispatch(curRoom({
                                                roomName: v
                                            }))
                                            setDisable(false)
                                        }
                                    }} />
                            </View>
                            <View className='w-1/4 pl-4'>
                                <CustomInput
                                    lineThrough={editRoom.status === StatusType.REMOVED}
                                    placeHolder='Type'
                                    disabled
                                    value={editRoom.roomType} />
                            </View>
                        </View>
                        <View>
                            <ThemeText
                                fontSize={18}
                                fontWeight='bold'
                                letterSpacing={1.9}>
                                Price
                            </ThemeText>
                            <View className='w-full py-2'>
                                <FlatList data={editRoom.prices}
                                    renderItem={({ item }) => renderItem(item)} />
                            </View>
                        </View>
                        <View className='w-full justify-end flex-row items-end'>
                            <CustomButton
                                onPress={handleNavigate}
                                title='Schedule'
                                Icon={
                                    <View className='pr-2'>
                                        <Ionicons name="calendar-outline" size={20} color={colors.text.dark} />
                                    </View>
                                } />
                        </View>
                    </View>
                </KeyboardAvoidingView>
                <KeyboardAvoidingView behavior='padding' className=' absolute bottom-0 right-0 left-0 px-4 my-4'>
                    <View className='w-full justify-between items-end flex-row'>
                        <View>
                            <CustomButton
                                onPress={onStatusChange}
                                style={{
                                    height: 40,
                                    borderRadius: 4,
                                    backgroundColor: hexToRGBA(colors.error, 0.3)
                                }}
                                title={editRoom.status === StatusType.REMOVED ? 'Enable' : 'Remove'}
                                Icon={<View className='pr-2'>
                                    {editRoom.status === StatusType.REMOVED ? <Entypo name="chevron-thin-right" size={20} color={colors.text.dark} /> : <EvilIcons name="close" size={20} color={colors.text.dark} />}</View>} />
                        </View>
                        <View>
                            <CustomButton
                                disabled={disable} title='Save'
                                onPress={onSave} />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </PageWrapper>
    )
}

export default RoomDetail