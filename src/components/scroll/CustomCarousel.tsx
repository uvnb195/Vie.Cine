import { View, Text, DimensionValue, FlatList, Dimensions, Animated as RNAnimated } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import ThemeText from '../theme/ThemeText'
import SmallButton from '../button/SmallButton'
import VerticalCard from '../card/VerticalCard'
import { CAROUSEL_ITEM_SIZE } from '@/constants/Size'
import { useCustomTheme } from '@/src/contexts/theme'
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import MinimalCard from '../card/MinimalCard'
import SectionTitle from '../button/SectionTitle'

export interface CustomCarouselRef {
    expand: () => void,
    collapse: () => void
}
interface Props {
    width: DimensionValue,
    height?: number,
    optionalButton?: boolean,
    data: any[],
    padding?: number,
    itemFloatSpacing?: number,
    title: string,
    showSeeMore?: boolean
}

const CustomCarousel = forwardRef<CustomCarouselRef, Props>(({
    optionalButton,
    width,
    data,
    itemFloatSpacing = 24,
    padding,
    title,
    showSeeMore }, ref) => {
    const {
        width: windowWidth,
        height: windowHeight } = Dimensions.get('window')

    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [listViewable, setListViewable] = useState([true, ...Array(data.length - 1).fill(false)])
    const [currenIndex, setCurrentIndex] = useState(0)

    const updateViewableItems = (index: number, value: boolean) => {
        let newState = listViewable.slice()
        newState[index] = value
        setListViewable(newState)
    }

    const scrollX = useRef(new RNAnimated.Value(0)).current
    const [isExpanded, setIsExpanded] = useState(true)

    const height = useDerivedValue(() => {
        return isExpanded ? withTiming(CAROUSEL_ITEM_SIZE.height + (title ? 32 : 0)) : withTiming(CAROUSEL_ITEM_SIZE.minimum + (title ? 32 : 0))
    }, [isExpanded])
    const animationStyle = useAnimatedStyle(() => ({
        height: height.value
    }))

    const minimalHeight = useDerivedValue(() => {
        return isExpanded ? withTiming(0) : withTiming(CAROUSEL_ITEM_SIZE.minimum)
    }, [isExpanded])
    const animationSmallList = useAnimatedStyle(() => ({
        height: interpolate(
            height.value,
            [CAROUSEL_ITEM_SIZE.minimum + (title ? 32 : 0), CAROUSEL_ITEM_SIZE.height + (title ? 32 : 0)],
            [CAROUSEL_ITEM_SIZE.minimum, 0])
    }))


    useEffect(() => {
        console.log(isExpanded)
    }, [isExpanded])



    useImperativeHandle(ref, () => ({
        expand: () => {
            setIsExpanded(true)
        },
        collapse: () => {
            setIsExpanded(false)
        }
    }))

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
            <RNAnimated.View
                className={''}
                style={{
                    transform: [
                        { scale: scale || 1 },
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
            </RNAnimated.View >
        )
    }

    const renderSmallItem = () => {
        return (
            <MinimalCard src={require('../../assets/images/image-2.png')} />)
    }


    return (
        <Animated.View
            style={[
                {
                    padding: padding || 0
                },
                animationStyle
            ]}>
            {title &&
                <SectionTitle title={title} showButton />}
            {/* minimal list */}
            <Animated.View
                style={animationSmallList}>
                <Animated.FlatList
                    bounces={false}
                    snapToInterval={150 + 8}
                    decelerationRate={0}
                    className={'w-full'}
                    contentContainerStyle={{
                        columnGap: 8,
                        paddingHorizontal: 8
                    }}
                    horizontal
                    data={data}
                    renderItem={({ item, index }) => renderSmallItem()} />
            </Animated.View>

            {/* carousel */}
            <RNAnimated.FlatList
                contentContainerStyle={{
                    columnGap: 8,
                    paddingHorizontal: 8
                }}
                showsHorizontalScrollIndicator={false}
                horizontal
                snapToInterval={CAROUSEL_ITEM_SIZE.width}
                decelerationRate={0}
                bounces={false}
                onScroll={RNAnimated.event(
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
        </Animated.View>
    )
})

export default CustomCarousel