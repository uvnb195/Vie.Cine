import { View, Text, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/redux/store'
import { FlatList, TextInput } from 'react-native-gesture-handler'
import { curRoom, SeatType, updateStatus } from '@/src/redux/adminSlice'
import ThemeText from '@/src/components/theme/ThemeText'
import CustomInput from '@/src/components/input/CustomInput'
import DropdownMenu from '@/src/components/input/DropdownMenu'
import CustomButton from '@/src/components/button/CustomButton'
import { Feather, FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import { currencyFormat, formatCurrency } from '@/hooks/currencyFormat'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { convertSeatTypeToString } from '@/hooks/convertSeatTypeToString'
import { setLoading, Status } from '@/src/redux/publicSlice'
import { router } from 'expo-router'
import { addRoom } from '@/src/redux/adminAsyncActions'
import { auth } from '@/src/api/firebase/config'
import { RoomType } from '@/constants/types/RoomType'

const PriceSetting = () => {
    const { colors } = useCustomTheme()

    const dispatch = useDispatch<AppDispatch>()
    const { rooms, editRoom, status } = useSelector((state: RootState) => state.admin)
    const { loading } = useSelector((state: RootState) => state.public)

    const [name, setName] = useState('')
    const [prices, setPrices] = useState<{ type: SeatType, price: number | string }[]>([])
    const [seatTypes, setSeatTypes] = useState<SeatType[]>([...new Set(editRoom.map2d.flat().map(item => item.seatType).filter(item => item !== SeatType.EMPTY && item !== SeatType.UNAVAILABLE))])
    const [roomType, setRoomType] = useState<'2D' | '3D' | 'IMAX' | null>(null)
    const [currentFocus, setCurrentFocus] = useState<SeatType | null>(null)
    const [check, setCheck] = useState(false)

    const ref = useRef<TextInput>(null)

    const handleConfirm = async () => {
        dispatch(setLoading(true))
        setCheck(true)

        const formData = new FormData()
        formData.append('roomName', name)
        formData.append('roomType', roomType as string)
        formData.append('theatreId', editRoom.theatreId)
        formData.append('prices', JSON.stringify(prices.map(item => ({
            seatType: convertSeatTypeToString(item.type),
            price: typeof item.price === 'string' ?
                item.price.replaceAll(' ', '') : item.price,
        }))))
        formData.append('map2d', JSON.stringify(editRoom.map2d))
        formData.append('totalSeats', editRoom.totalSeats.toString())

        auth.currentUser?.getIdToken().then(token => {
            dispatch(addRoom({
                token: token,
                theatreId: editRoom.theatreId,
                room: formData
            }))
        })
    }

    useEffect(() => {
        console.log(ref.current?.name)
    }, [ref.current])

    useEffect(() => {
        if (check && status === Status.SUCCESS) {
            dispatch(setLoading(false))
            dispatch(curRoom({}))
            router.push({
                pathname: '/routes/admin-routes/status/[id]',
                params: {
                    id: 'success',
                    message: 'Room created successfully',
                    nextTo: '/routes/admin-routes/form/(theatre)/(room)/add/SeatTypes'
                }
            })
        }

        return () => {
            dispatch(curRoom({} as RoomType))
        }
    }, [status])

    return (
        <View className='flex-1 items-center p-2'>
            <View className='w-full flex-row'>
                <View className='w-3/4 pr-2'>
                    <CustomInput value={name} onValueChange={(v) => setName(v)} placeHolder='Room Name' />
                </View>
                <View className='w-1/4'>
                    <DropdownMenu
                        disableSearch
                        placeHolder='Type'
                        data={[
                            { key: '2D', value: '2D' },
                            { key: '3D', value: '3D' },
                            { key: 'IMAX', value: 'IMAX' }]}
                        onSelected={(v) => setRoomType(v)} />
                </View>
            </View>
            <ThemeText otherProps={{
                textAlign: 'left',
                width: '100%',
                paddingVertical: 8,
            }} fontWeight='bold' fontSize={28} letterSpacing={2}>Price</ThemeText>
            {seatTypes.includes(SeatType.STANDARD)
                && <View className='w-full py-2'>
                    <CustomInput
                        keyboardType='numeric'
                        LeftIcon={
                            prices.filter(item => item.type === SeatType.STANDARD).length > 0 && Number(prices.filter(item => item.type === SeatType.STANDARD)[0].price) > 0 ?
                                <Feather name="check-circle" size={20} color={colors.text.dark} />
                                : currentFocus === SeatType.STANDARD ?
                                    <FontAwesome6 name="dot-circle" size={20} color={colors.text.dark} /> : <FontAwesome5 name="circle" size={20} color={colors.text.default} />}
                        value={prices.filter(item => item.type === SeatType.STANDARD).length > 0 ? formatCurrency(Number(prices.filter(item => item.type === SeatType.STANDARD)[0].price)) : ''}
                        onValueChange={(text) => {
                            const value = text.replaceAll(' ', '')
                            if (Number(value) && !isNaN(parseInt(value)) && parseInt(value) > 0) {
                                setPrices([...prices.filter(item => item.type !== SeatType.STANDARD), { type: SeatType.STANDARD, price: parseInt(value) }])
                            }
                            else setPrices([...prices.filter(item => item.type !== SeatType.STANDARD), { type: SeatType.STANDARD, price: 0 }])
                        }}
                        style={{
                            backgroundColor: hexToRGBA(colors.background.bottomSheet, 0.5),
                        }}
                        borderColor={currentFocus === SeatType.STANDARD ? colors.border.default : 'transparent'}
                        onFocus={() => {
                            setCurrentFocus(SeatType.STANDARD)
                        }} placeHolder='STANDARD - (VNĐ)'
                        onBlur={() => {
                            setCurrentFocus(null)
                        }} />

                </View>}

            {seatTypes.includes(SeatType.VIP)
                && <View className='w-full py-2'>
                    <CustomInput
                        keyboardType='numeric'
                        LeftIcon={
                            prices.filter(item => item.type === SeatType.VIP).length > 0 && Number(prices.filter(item => item.type === SeatType.VIP)[0].price) > 0 ?
                                <Feather name="check-circle" size={20} color={colors.text.dark} />
                                : currentFocus === SeatType.VIP ?
                                    <FontAwesome6 name="dot-circle" size={20} color={colors.text.dark} /> : <FontAwesome5 name="circle" size={20} color={colors.text.default} />}
                        value={prices.filter(item => item.type === SeatType.VIP).length > 0 ? formatCurrency(Number(prices.filter(item => item.type === SeatType.VIP)[0].price)) : ''}
                        onValueChange={(text) => {
                            const value = text.replaceAll(' ', '')
                            if (Number(value) && !isNaN(parseInt(value)) && parseInt(value) > 0) {
                                setPrices([...prices.filter(item => item.type !== SeatType.VIP), { type: SeatType.VIP, price: parseInt(value) }])
                            }
                            else setPrices([...prices.filter(item => item.type !== SeatType.VIP), { type: SeatType.VIP, price: 0 }])
                        }}
                        borderColor={currentFocus === SeatType.VIP ? colors.border.default : 'transparent'}
                        style={{
                            backgroundColor: hexToRGBA(colors.background.bottomSheet, 0.5),
                        }}
                        onFocus={() => {
                            setCurrentFocus(SeatType.VIP)
                        }} placeHolder='VIP - (VNĐ)'
                        onBlur={() => {
                            setCurrentFocus(null)
                        }} />
                </View>}

            <KeyboardAvoidingView behavior='padding' className=' absolute bottom-0 right-0 left-0 px-4 my-4'>
                <View className='w-full justify-end items-end flex-row'>
                    <View>
                        <CustomButton
                            disabled={prices.filter(item => item.price === 0).length > 0
                                || name.length === 0
                                || roomType === null} title='Continue'
                            onPress={handleConfirm} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default PriceSetting