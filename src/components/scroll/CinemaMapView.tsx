import { PADDING_VALUE } from '@/constants/Size'
import { CinemaMapType } from '@/constants/Types'
import { useCustomTheme } from '@/src/contexts/theme'
import { SeatProps, SeatType, updateSeats } from '@/src/redux/paymentSlice'
import { RootState } from '@/src/redux/store'
import React, { memo, useCallback, useEffect } from 'react'
import { View, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import ThemeText from '../theme/ThemeText'
import ZoomView from './ZoomView'

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
                        seatType: SeatType.UNAVAILABLE,
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
    const state = useSelector((state: RootState) => state.payment.seats)
    const dispatch = useDispatch()

    let oldState: SeatProps[] = []

    const [onLayoutContentSize, setOnLayoutContentSize] = React.useState({ width: 0, height: 0 })

    const [selecteds, setSelecteds] = React.useState<SeatProps[]>([])
    const [zoomViewState, setZoomViewState] = React.useState(false)

    const handleSelected = (item: SeatProps) => {
        if (selecteds.includes(item)) {
            setSelecteds(selecteds.filter(value => value != item))
        }
        else setSelecteds([...selecteds, item])
    }

    const handleOnLayoutSize =
        useCallback((width: number, height: number) => {
            setOnLayoutContentSize({
                width,
                height
            })
        }, [onLayoutContentSize])

    const handleUpdateSelectedSeats = () => {
        dispatch(updateSeats(selecteds))
        setSelecteds([])
    }

    const renderSeats = () => {
        const itemSize = onLayoutContentSize.width / dummyData.map.totalCols - PADDING_VALUE.md
        let renderItems = []

        const renderColor = (seatType: SeatType) => {
            switch (seatType) {
                case SeatType.STANDARD:
                    return colors.zoomView.seats.standard
                case SeatType.VIP:
                    return colors.zoomView.seats.vip
                case SeatType.SWEET_BOX:
                    return colors.zoomView.seats['sweet-box']
                case SeatType.EMPTY:
                    return 'transparent'
                case SeatType.UNAVAILABLE:
                    return colors.zoomView.seats.unavailable
            }
        }
        for (let i = 0; i < dummyData.map.totalRows; i++) {
            for (let j = 0; j < dummyData.map.totalCols; j++) {
                const item = dummyData.map.data[i][j]
                renderItems.push(
                    (item.seatType != SeatType.EMPTY)
                        ? <TouchableOpacity
                            disabled={item.seatType == SeatType.UNAVAILABLE}
                            onPress={() => handleSelected(item)}
                            className=' items-center justify-center border' key={`${i}${j}`}
                            style={{
                                margin: PADDING_VALUE.md / 2,
                                width: itemSize,
                                height: itemSize,
                                borderRadius: itemSize / 10,
                                backgroundColor: renderColor(item.seatType),
                                borderColor: selecteds.includes(item) ? colors.text.default : 'transparent'
                            }} >
                            <ThemeText
                                fontSize={item.seatType === SeatType.UNAVAILABLE ? itemSize / 2 : itemSize / 4}
                                color={item.seatType === SeatType.UNAVAILABLE ? colors.text.light : colors.text.default}
                                fontWeight='bold'
                                lineHeight={itemSize / 2}
                                otherProps={{
                                    padding: 0,
                                    margin: 0,
                                }}
                                numsOfLines={1}
                                letterSpacing={0} >{item.seatType === SeatType.UNAVAILABLE ? "X" : item.seatCode}</ThemeText>
                        </TouchableOpacity>
                        : <View
                            className='rounded-2' key={`${i}${j}`}
                            style={{
                                margin: PADDING_VALUE.md / 2,
                                width: itemSize,
                                height: itemSize,
                            }} />
                )
            }
        }
        return renderItems
    }

    return (<ZoomView
        accepted={selecteds.length > 0}
        onHide={handleUpdateSelectedSeats}
        style={{
            flexDirection: 'column',
            backgroundColor: colors.background.highlight,
            ...style
        }}>
        {/* screen point */}
        <View
            className='w-2/3 rounded-2 self-center m-2'
            style={{
                backgroundColor: colors.background.default
            }} >
            <ThemeText
                numsOfLines={1}
                letterSpacing={4}
                fontWeight='bold'
                fontSize={16}
                otherProps={{
                    textAlign: 'center',
                }}>SCREEN</ThemeText>
        </View>
        {/* seats view */}
        <View className='flex-row flex-wrap'
            onLayout={e => {
                if (e.nativeEvent.layout.width != onLayoutContentSize.width
                    || e.nativeEvent.layout.height != onLayoutContentSize.height)
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

export default memo(CinemaMapView)