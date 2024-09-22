import { View, Text, Image, ViewStyle, LayoutChangeEvent } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import ZoomView from './ZoomView'
import { CinemaMapType, SeatType } from '@/constants/Types'
import ThemeText from '../theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { styled } from 'nativewind'
import { PADDING_VALUE } from '@/constants/Size'

interface Props {
    data?: CinemaMapType,
    style?: ViewStyle
}



const dummyData: CinemaMapType = {
    totalSeats: 133,
    availableSeats: 133 - 2,
    map: {
        totalCols: 16,
        totalRows: 10,
        data: [
            Array.from({ length: 16 }, (_, index) =>
                (index == 15 || index == 1 || index == 0) ?
                    { seatType: SeatType.EMPTY }
                    : {
                        seatType: SeatType.STANDARD,
                        seatCode: `A${15 - index + 1}`
                    }),
            Array.from({ length: 16 }, (_, index) =>
                (index == 15 || index == 1 || index == 0) ?
                    { seatType: SeatType.EMPTY }
                    : {
                        seatType: SeatType.STANDARD,
                        seatCode: `B${15 - index + 1}`
                    }),
            Array.from({ length: 16 }, (_, index) =>
                (index == 15 || index == 1 || index == 0) ?
                    { seatType: SeatType.EMPTY }
                    : {
                        seatType: SeatType.STANDARD,
                        seatCode: `C${15 - index + 1}`
                    }),
            Array.from({ length: 16 }, (_, index) =>
                (index == 15 || index == 1 || index == 0) ?
                    { seatType: SeatType.EMPTY }
                    : {
                        seatType: SeatType.VIP,
                        seatCode: `D${15 - index + 1}`
                    }),
            Array.from({ length: 16 }, (_, index) =>
                (index == 15 || index == 1 || index == 0) ?
                    { seatType: SeatType.EMPTY }
                    : {
                        seatType: SeatType.VIP,
                        seatCode: `E${15 - index + 1}`
                    }),
            Array.from({ length: 16 }, (_, index) =>
                (index == 15 || index == 1 || index == 0) ?
                    { seatType: SeatType.EMPTY }
                    : {
                        seatType: SeatType.VIP,
                        seatCode: `F${15 - index + 1}`
                    }),
            Array.from({ length: 16 }, (_, index) =>
                (index == 15 || index == 1 || index == 0) ?
                    { seatType: SeatType.EMPTY }
                    : {
                        seatType: SeatType.VIP,
                        seatCode: `G${15 - index + 1}`
                    }),
            Array.from({ length: 16 }, (_, index) =>
                (index == 15 || index == 1 || index == 0) ?
                    { seatType: SeatType.EMPTY }
                    : {
                        seatType: SeatType.VIP,
                        seatCode: `H${15 - index + 1}`
                    }),
            Array.from({ length: 16 }, (_, index) =>
                (index == 15 || index == 1 || index == 0) ?
                    { seatType: SeatType.EMPTY }
                    : {
                        seatType: SeatType.VIP,
                        seatCode: `I${15 - index + 1}`
                    }),

            Array.from({ length: 16 }, (_, index) =>
            ({
                seatType: SeatType.SWEET_BOX,
                seatCode: `K${15 - index + 1}`
            })),
        ]
    }
}

const CinemaMapView = ({ data, style }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [onLayoutContentSize, setOnLayoutContentSize] = React.useState({ width: 0, height: 0 })

    const handleOnLayoutSize = useCallback((width: number, height: number) => {
        setOnLayoutContentSize({
            width,
            height
        })
    }, [onLayoutContentSize])

    useEffect(() => {
        console.log(onLayoutContentSize)
    }, [onLayoutContentSize])


    const renderSeats = () => {
        const itemSize = onLayoutContentSize.width / dummyData.map.totalCols - PADDING_VALUE.sm
        let renderItems = []
        for (let i = 0; i < dummyData.map.totalRows; i++) {
            for (let j = 0; j < dummyData.map.totalCols; j++) {
                renderItems.push(
                    (dummyData.map.data[i][j].seatType != SeatType.EMPTY)
                        ? <View className='h-6 rounded-2 bg-teal-500 items-center justify-center' key={`${i}${j}`}
                            style={{
                                margin: PADDING_VALUE.sm / 2,
                                width: itemSize
                            }} >
                            <Text style={{ fontSize: itemSize / 2 }} numberOfLines={1}>{dummyData.map.data[i][j].seatCode}</Text>
                            {/* <MaterialCommunityIcons
                                style={{
                                    color: colors.text.default,
                                }}
                                name="sofa-single" size={24} color="black" />
                            <Text className='text-sm'>{dummyData.map.data[i][j].seatCode}</Text> */}
                        </View>
                        : <View
                            className='h-6 rounded-2' key={`${i}${j}`}
                            style={{
                                margin: PADDING_VALUE.sm / 2,
                                width: itemSize
                            }} />
                )
            }
        }
        return renderItems
    }


    return (<ZoomView
        style={{
            flexDirection: 'column',
            backgroundColor: colors.background.highlight
        }}>
        {/* screen point */}
        <View
            className='w-2/3 rounded-2 self-center m-2'
            style={{
                backgroundColor: colors.background.default
            }} >
            <ThemeText numsOfLines={1} letterSpacing={4} fontWeight='bold' fontSize={16} otherProps={{
                textAlign: 'center',
            }}>SCREEN</ThemeText>
        </View>
        {/* seats view */}
        <View className='flex-row flex-wrap'
            onLayout={e => {
                if (e.nativeEvent.layout.width != onLayoutContentSize.width || e.nativeEvent.layout.height != onLayoutContentSize.height)
                    handleOnLayoutSize(
                        e.nativeEvent.layout.width,
                        e.nativeEvent.layout.height)
            }
            }>
            {renderSeats()}
        </View>
    </ZoomView>
    )
}

export default CinemaMapView