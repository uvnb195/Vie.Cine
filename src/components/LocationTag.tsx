import React, { useEffect, useRef } from 'react'
import { Animated, View, ViewStyle } from 'react-native'
import { MapPinIcon } from 'react-native-heroicons/solid'
import { useDispatch, useSelector } from 'react-redux'
import { getDeviceLocation } from '../../hooks/permissions'
import { useCustomTheme } from '../contexts/theme'
import { updateLocation } from '../redux/paymentSlice'
import { RootState } from '../redux/store'
import ThemeText from './theme/ThemeText'

interface Props {
    style?: ViewStyle,
}

const LocationTag = ({ style }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const locationHeight = useRef(new Animated.Value(0)).current

    const { address } = useSelector((state: RootState) => state.payment)
    const dispatch = useDispatch()

    useEffect(() => {
        if (address.city.length > 0) {
            setTimeout(() => {
                Animated.timing(locationHeight, {
                    toValue: 20,
                    duration: 500,
                    useNativeDriver: false
                }).start()
            }, 1000)
        }
    }, [address])

    useEffect(() => {
        (async () => {
            const result = await getDeviceLocation()
            if (result.status == 'success') {
                dispatch(updateLocation(result.data!!))
            }
        })()
    }, [])

    return (
        <View className='w-full' style={[
            style]}>
            <Animated.View
                className='w-full flex-row items-center overflow-hidden m-0 p-0'
                style={{
                    height: locationHeight,
                }}>
                <MapPinIcon
                    size={16}
                    color={colors.text.highlight} style={{
                        marginRight: 8
                    }} />
                <ThemeText otherProps={{
                }}>{`${address.district}, ${address.city}`}</ThemeText>
            </Animated.View>
        </View>
    )
}

export default LocationTag