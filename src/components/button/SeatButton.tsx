import { View, Text, TouchableOpacity, ViewStyle } from 'react-native'
import React, { useEffect } from 'react'
import { SeatProps, SeatType } from '@/src/redux/adminSlice'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import ThemeText from '../theme/ThemeText'
import { PADDING_VALUE } from '@/constants/Values'
import { useCustomTheme } from '@/src/contexts/theme'
import { renderSeatColor } from '@/hooks/renderSeatColor'

interface Props {
    data: SeatProps,
    itemSize?: number,
    style?: ViewStyle,
    selected?: boolean,
    onPress?: () => void
}

const SeatButton = ({
    data,
    itemSize = 40,
    style,
    selected,
    onPress
}: Props) => {
    const { colors } = useCustomTheme()

    return (
        <View
            className='flex-row border-[1px]'
            style={[
                {
                    borderColor: data.seatType === SeatType.EMPTY ? 'transparent' : colors.background.default
                },
                style]}>
            <TouchableOpacity
                disabled={data.seatType == SeatType.UNAVAILABLE || data.seatType == SeatType.EMPTY}
                onPress={onPress}>
                <Animated.View style={[
                    {
                        margin: PADDING_VALUE.sm / 2,
                        backgroundColor: renderSeatColor(data.seatType, colors),
                        borderColor: selected ? colors.text.default : 'transparent',
                        height: itemSize,
                        width: itemSize
                    }]}
                    className='items-center justify-center border'>
                    <ThemeText
                        fontSize={data.seatType === SeatType.EMPTY ? itemSize / 2 : itemSize / 4}
                        color={data.seatType === SeatType.UNAVAILABLE ? colors.text.light : colors.text.default}
                        fontWeight='bold'
                        lineHeight={itemSize / 2}
                        otherProps={{
                            padding: 0,
                            margin: 0,
                        }}
                        numsOfLines={1}
                        letterSpacing={0} >
                        {data.seatType === SeatType.EMPTY ? "" : data.seatCode}
                    </ThemeText>
                </Animated.View>
            </TouchableOpacity>
        </View>
    )
}

export default SeatButton