import { CAROUSEL_ITEM_SIZE } from '@/constants/Size'
import { useCustomTheme } from '@/src/contexts/theme'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Dimensions, DimensionValue, Animated as RNAnimated, TouchableOpacity, View, ViewStyle } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated'
import SectionTitle from '../button/SectionTitle'
import MinimalCard from '../card/MinimalCard'
import VerticalCard from '../card/VerticalCard'
import { FlatList } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/redux/store'
import { MovieType } from '@/constants/types'
import { router } from 'expo-router'
import { setLoading } from '@/src/redux/publicSlice'

export interface CustomCarouselRef {
    expand: () => void,
    collapse: () => void
}
interface Props {
    style?: ViewStyle,
    optionalButton?: boolean,
    padding?: number,
    itemFloatSpacing?: number,
    title?: string,
    showSeeMore?: boolean
}

const CustomCarousel = forwardRef<CustomCarouselRef, Props>(({
    style,
    optionalButton,
    itemFloatSpacing = 24,
    title = undefined,
    showSeeMore }, ref) => {
    const {
        width: windowWidth,
        height: windowHeight } = Dimensions.get('window')

    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const dispatch = useDispatch<AppDispatch>()
    const { nowShowing, fetching: loadingImage } = useSelector((state: RootState) => state.public)

    const scrollX = useRef(new RNAnimated.Value(0)).current
    const [isExpanded, setIsExpanded] = useState(true)

    const animationSmallList = useAnimatedStyle(() => ({
        height: isExpanded ? 0 : withTiming(CAROUSEL_ITEM_SIZE.minimum),
        opacity: withDelay(300, withTiming(isExpanded ? 0 : 1)),
        borderColor: isExpanded ? withTiming('transparent') : withTiming(colors.border.default)
    }))

    const animationBigList = useAnimatedStyle(() => ({
        height: isExpanded ? withTiming(CAROUSEL_ITEM_SIZE.height) : 0,
        opacity: withTiming(isExpanded ? 1 : 0)
    }))

    useEffect(() => {
        console.log('now showing::::::::::', nowShowing)
    }, [nowShowing])

    useImperativeHandle(ref, () => ({
        expand: () => {
            setIsExpanded(true)
        },
        collapse: () => {
            setIsExpanded(false)
        }
    }))

    const renderItem = (item: MovieType | boolean, index: number) => {


        if (typeof item === 'boolean') {
            return <View
                style={{
                    width: CAROUSEL_ITEM_SIZE.width / 2,
                    height: CAROUSEL_ITEM_SIZE.height
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
        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5]
        })

        return (
            <RNAnimated.View
                style={{
                    transform: [
                        { scale: scale },
                        { translateY: translateY }],
                    opacity: opacity
                }}>
                <TouchableOpacity className='flex-1'
                    onPress={() => {
                        dispatch(setLoading(true))
                        router.push({ pathname: '/routes/details/[id]', params: { id: item.id } })
                    }}>

                    <VerticalCard
                        style={{
                            width: CAROUSEL_ITEM_SIZE.width,
                            height: CAROUSEL_ITEM_SIZE.height
                        }}
                        data={item}
                    />
                </TouchableOpacity>
            </RNAnimated.View >
        )
    }

    const renderSmallItem = (item: MovieType, index: number) => {
        return (
            <MinimalCard style={{
                height: '100%'
            }} src={item.poster_path}
                title={item.title} />)
    }

    useEffect(() => {
        console.log(nowShowing)
    }, [nowShowing])

    return (
        <Animated.View
            className={'flex-1'}
            style={[
                style
            ]}>
            {title &&
                //40 px
                <View className='h-10'>

                    <SectionTitle
                        onPress={() => router.push({
                            pathname: '/routes/search',
                            params: { id: nowShowing[0].id }
                        })}
                        title={title}
                        showButton />
                </View>
            }
            {/* minimal list */}
            <Animated.View
                className={'py-2 border-t border-b'}
                style={animationSmallList}>
                <FlatList
                    bounces={false}
                    snapToInterval={158}
                    decelerationRate={0}
                    contentContainerStyle={{
                        columnGap: 8,
                    }}
                    horizontal
                    data={nowShowing}
                    renderItem={({ item, index }) => renderSmallItem(item, index)} />
            </Animated.View>


            {/* carousel */}
            <Animated.View
                className={'flex-1 h-[300px]'}
                style={[animationBigList]}>
                <RNAnimated.FlatList
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
                    data={[false, ...nowShowing.slice(0, 11), false]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => renderItem(item, index)} />
            </Animated.View>
        </Animated.View>
    )
})

export default CustomCarousel