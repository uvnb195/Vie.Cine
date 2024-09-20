import { View, Text, DimensionValue, FlatList, Dimensions, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ThemeText from '../theme/ThemeText'
import SmallButton from '../button/SmallButton'
import VerticalCard from '../card/VerticalCard'
import { CAROUSEL_ITEM_SIZE } from '@/constants/Size'

interface Props {
    width: DimensionValue,
    height?: DimensionValue,
    optionalButton?: boolean,
    data: any[],
    padding?: number,
    itemFloatSpacing?: number
}

const CustomCarousel = ({
    optionalButton,
    width,
    height = 400,
    data,
    itemFloatSpacing = 24,
    padding }: Props) => {
    const {
        width: windowWidth,
        height: windowHeight } = Dimensions.get('window')

    const [listViewable, setListViewable] = useState([true, ...Array(data.length - 1).fill(false)])
    const [currenIndex, setCurrentIndex] = useState(0)

    const updateViewableItems = (index: number, value: boolean) => {
        let newState = listViewable.slice()
        newState[index] = value
        setListViewable(newState)
    }

    const scrollX = useRef(new Animated.Value(0)).current

    // useEffect(() => {
    //     console.log(listViewable)
    // }, [listViewable])

    const renderItem = (item: any, index: number) => {

        if (typeof item === 'boolean') {
            return <View style={{
                width: CAROUSEL_ITEM_SIZE.width / 2, height: CAROUSEL_ITEM_SIZE.height
            }} />
        }
        const inputRange = [
            (index - 2) * CAROUSEL_ITEM_SIZE.width,
            (index - 1) * CAROUSEL_ITEM_SIZE.width,
            (index) * CAROUSEL_ITEM_SIZE.width
        ]
        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7]
        })
        const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [-50, 0, -50]
        })

        return (
            <Animated.View
                className={''}
                style={{
                    transform: [
                        { scale: scale },
                        { translateY: translateY }],
                    width: CAROUSEL_ITEM_SIZE.width,
                    height: CAROUSEL_ITEM_SIZE.height
                }}>

                <VerticalCard
                    style={{
                        width: CAROUSEL_ITEM_SIZE.width,
                        height: CAROUSEL_ITEM_SIZE.height
                    }}
                    title={'Spiderman: No Way HomeSpiderman: No Way HomeSpiderman: No Way Home'}
                    subtitle='9.5/10 IMDb'
                    imageSoure={require('../../assets/images/image-2.png')}
                />
            </Animated.View >
        )
    }

    useEffect(() => {
        console.log(scrollX)
    }, [scrollX])



    return (
        <View style={{
            padding: padding || 0
        }}>
            <View className='h-30vh w-100vw' style={{
                marginTop: itemFloatSpacing,
                width: width,
                height: height
            }}>
                <Animated.FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    snapToInterval={CAROUSEL_ITEM_SIZE.width}
                    decelerationRate={0}
                    bounces={false}
                    onScroll={Animated.event(
                        [{
                            nativeEvent: {
                                contentOffset: {
                                    x: scrollX
                                }
                            }
                        }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                    data={[false, ...data, false]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => renderItem(item, index)} />
            </View>
        </View>
    )
}

export default CustomCarousel