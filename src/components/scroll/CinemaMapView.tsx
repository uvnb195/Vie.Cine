import { PADDING_VALUE } from '@/constants/Values'
import { useCustomTheme } from '@/src/contexts/theme'
import { SeatProps, SeatType } from '@/src/redux/adminSlice'
import { RootState } from '@/src/redux/store'
import React, { useCallback, useEffect } from 'react'
import { ActivityIndicator, Dimensions, View, ViewStyle } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import SeatButton from '../button/SeatButton'
import ThemeText from '../theme/ThemeText'
import ZoomView from './ZoomView'
import { setLoading } from '@/src/redux/publicSlice'
import { renderSeatColor } from '@/hooks/renderSeatColor'

interface Props {
    data: SeatProps[][],
    style?: ViewStyle,
    selected?: { x: number, y: number, data: SeatProps }[],
    onSelected?: (selected: { x: number, y: number, data: SeatProps }) => void
}

const CinemaMapView = ({ data, style, selected, onSelected }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const { width: screenWidth } = Dimensions.get('window')
    const dispatch = useDispatch()
    const { loading } = useSelector((state: RootState) => state.public)

    const [map2d, setMap2d] = React.useState<SeatProps[][]>([])
    const [itemSize, setItemSize] = React.useState(0)

    const renderRow = (item: SeatProps[], rowIndex: number) => {
        return (
            <View
                className='w-full flex-row-reverse px-2'
                key={rowIndex}>
                {item.map((value, colIndex) =>
                    <SeatButton
                        style={{
                            borderColor: value.seatType === SeatType.EMPTY ? 'transparent' : selected?.map(item => item.data).includes(value) ? colors.icon.highlight : colors.background.default,
                            borderRadius: selected?.map(item => item.data).includes(value) ? PADDING_VALUE.sm : 0
                        }}
                        onPress={() => {
                            onSelected && onSelected({ x: rowIndex, y: colIndex, data: value })
                        }}
                        data={value
                        } key={colIndex}
                        itemSize={itemSize} />
                )}
            </View>
        )
    }

    useEffect(() => {
        setMap2d(data)
        if (data[0] && data[0].length > 0) {
            setItemSize(screenWidth / (data[0].length) - PADDING_VALUE.md)
        }
    }, [data])

    return (
        <ZoomView
            height={screenWidth * 2 / 3}
            accepted={data.length > 0}
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
            <View className='w-full mx-4 py-2 flex-row items-center'>
                <ThemeText
                    fontSize={12}
                    fontWeight='light'>Note:</ThemeText>
                <View className='self-center border p-[2px] rounded-1 ml-2'
                    style={{ borderColor: colors.background.default }}>
                    <View className='self-start px-1 rounded-[2px]'
                        style={{
                            backgroundColor: renderSeatColor(SeatType.STANDARD, colors),
                        }}>
                        <ThemeText
                            fontSize={8}
                            letterSpacing={1}
                            fontWeight='light'>Standard</ThemeText>
                    </View>
                </View>
                <View className='self-center border p-[2px] rounded-1 ml-2'
                    style={{ borderColor: colors.background.default }}>
                    <View className='self-start px-1 rounded-[2px]'
                        style={{
                            backgroundColor: renderSeatColor(SeatType.VIP, colors),
                        }}>
                        <ThemeText
                            fontSize={8}
                            letterSpacing={1}
                            fontWeight='light'>VIP</ThemeText>
                    </View>
                </View>
                <View className='self-center border p-[2px] rounded-1 ml-2'
                    style={{ borderColor: colors.background.default }}>
                    <View className='self-start px-1 rounded-[2px]'
                        style={{
                            backgroundColor: renderSeatColor(SeatType.SWEET_BOX, colors),
                        }}>
                        <ThemeText
                            fontSize={8}
                            letterSpacing={1}
                            fontWeight='light'>SWEET-BOX</ThemeText>
                    </View>
                </View>
            </View>
            {/* seats view */}
            <View className=' items-center justify-center'>
                <View className='self-center'>
                    <FlatList
                        data={map2d}
                        renderItem={({ item, index }) => renderRow(item, index)} />
                </View>
            </View>
        </ZoomView >
    )
}

export default CinemaMapView