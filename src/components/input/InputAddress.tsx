import { View, Text, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import DropdownMenu, { DropDownItemType } from './DropdownMenu'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/redux/store'
import { setLoading } from '@/src/redux/publicSlice'
import { fetchAllProvince, fetchDistricts, fetchWards } from '@/src/redux/publicAsyncActions'
import { locationNameFormatter, locationFilter } from '@/hooks/locationFilter'
import { Address } from '@/constants/types/AddressType'
import CustomInput from './CustomInput'
import { TheatreType } from '@/constants/types/TheatreType'
import { TheatreErrorType } from '@/src/contexts/theatre'
import ThemeText from '../theme/ThemeText'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
interface Props {
    style?: ViewStyle,
    onSubmit?: (data: TheatreType['location']) => void,
    required?: boolean,
    acceptLatAndLng?: boolean,
    enableAutoExpand?: boolean,
    errorMsg?: TheatreErrorType['location'],
    disable?: boolean,
    data: TheatreType['location']
}

const InputAddress = ({
    style,
    onSubmit,
    required,
    acceptLatAndLng = false,
    enableAutoExpand,
    errorMsg,
    disable,
    data
}: Props) => {
    const { colors } = useCustomTheme()
    const {
        wards,
        districts,
        provinces } = useSelector((state: RootState) => state.public)
    const initData: TheatreType['location'] = {
        province: null,
        district: null,
        street: null,
        lat: null,
        lng: null,
    }
    const [input, setInput] = useState<TheatreType['location']>(data || initData)
    const dispatch = useDispatch<AppDispatch>()
    const errorAnim = useAnimatedStyle(() => ({
        height: withTiming((errorMsg && (Object.entries(errorMsg).filter(i => i.length > 0)).length > 0) ? 20 : 0, { duration: 200 })
    }))

    const handleProvince = (v: number) => {
        if (v === 0) return
        const item = provinces.find(i => i.code === v)
        if (!item) return

        const { code, name } = item
        setInput({
            ...input,
            ...initData,
            province: { code, name },
        });
        dispatch(fetchDistricts({ provinceCode: code }))
    }
    const handleDistrict = (v: number) => {
        if (v === 0) return
        const item = districts.find(i => i.code === v)
        if (!item) return
        const { code, name } = item

        dispatch(fetchWards({ districtCode: code }))
        setInput({
            ...input,
            district: { code, name },
            street: initData.street,
            lat: initData.lat,
            lng: initData.lng
        })
    }

    useEffect(() => {
        dispatch(setLoading(true))
        if (provinces.length === 0) {
            dispatch(fetchAllProvince())
        }
        setTimeout(() => {
            dispatch(setLoading(false))
        }, 0);
    }, [])
    useEffect(() => {
        console.log(input)
        if (input.lat != null && input.lng != null
            && input.province !== null
            && input.district !== null
        ) {
            onSubmit && onSubmit(input)
        }
    }, [input])

    useEffect(() => {
    }, [districts])

    return (
        <View style={style}>
            <View className='flex-row w-full flex-wrap gap-y-2 '>
                {/* district */}
                <View className='w-1/2 pr-2'>
                    <DropdownMenu
                        loading={input.district === null}
                        disable={input.province === null || provinces.length === 0}
                        error={errorMsg && errorMsg?.district?.length > 0}
                        placeHolder='District'
                        value={input.district?.code}
                        data={districts.map(i =>
                            ({ key: i.code, value: locationFilter(i.name, 'District') }))}
                        onSelected={handleDistrict} />
                </View>
                {/* province */}
                <View className='w-1/2 pl-2'>
                    <DropdownMenu
                        loading={input.province === null}
                        error={errorMsg && errorMsg?.province?.length > 0}
                        disable={disable || provinces.length === 0}
                        placeHolder='Province'
                        value={input.province?.code}
                        onSelected={handleProvince}
                        data={provinces.map(i =>
                            ({ key: i.code, value: locationFilter(i.name, 'Province') })
                        )} />
                </View>
            </View>
            {acceptLatAndLng == true &&
                <View className='flex-row pt-2 flex-wrap'>
                    <View className='w-full pb-2'>
                        <CustomInput
                            error={!input.street || input.street.length == 0}
                            selectOnFocus
                            disabled={input.district === null}
                            placeHolder='Street/Detail'
                            value={input.street || ''}
                            onValueChange={v => {
                                setInput({ ...input, street: v })
                            }} />
                    </View>
                    <View className='w-1/2 pr-2'>
                        <CustomInput
                            error={!input.lat}
                            selectOnFocus
                            disabled={input.district === null}
                            keyboardType='number-pad' placeHolder='Latitude'
                            value={input.lat?.toString() || ""}
                            onValueChange={v => {
                                if (v === '' || v === '0') {
                                    setInput({
                                        ...input,
                                        lat: null
                                    })
                                    return
                                }
                                const value = v.replace(',', '.')
                                setInput({ ...input, lat: parseFloat(value) })
                            }}
                            onSubmitEditing={() => onSubmit && onSubmit(input)} />
                    </View>
                    <View className='w-1/2 pl-2'>
                        <CustomInput
                            error={!input.lng}
                            selectOnFocus
                            disabled={input.district == null}
                            keyboardType='number-pad' placeHolder='Longitude'
                            value={input.lng?.toString() || ""}
                            onValueChange={v => {
                                if (v === '' || v === '0') {
                                    setInput({
                                        ...input,
                                        lng: null
                                    })
                                    return
                                }
                                const value = v.replace(',', '.')
                                setInput({
                                    ...input,
                                    lng: parseFloat(value)
                                })
                            }}
                            onSubmitEditing={() => onSubmit && onSubmit(input)} />
                    </View>
                </View>
            }
            {/* error */}
            <Animated.View
                style={errorAnim}
                className='w-full'>
                <ThemeText
                    color={colors.error}
                    fontSize={12}
                    fontWeight='bold'>
                    {errorMsg && (Object.entries(errorMsg).filter(i => i.length > 0)).length > 0 ? 'Please fill all address fields' : ''}
                </ThemeText>
            </Animated.View>
        </View>
    )
}

export default InputAddress