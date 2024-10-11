import { CAROUSEL_ITEM_SIZE } from '@/constants/Size'
import { MovieType } from '@/constants/types'
import { dateConverter } from '@/hooks/convertDate'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { useCustomTheme } from '@/src/contexts/theme'
import { fetchMovie } from '@/src/redux/publicAsyncActions'
import { setLoading } from '@/src/redux/publicSlice'
import { AppDispatch } from '@/src/redux/store'
import { router } from 'expo-router'
import React, { useEffect } from 'react'
import { View, ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import Animated, { interpolateColor, SharedValue, useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated'
import { useDispatch } from 'react-redux'
import SectionTitle from '../button/SectionTitle'
import MinimalCard from '../card/MinimalCard'
import { ScrollProps } from './MovieHorizontalScroll'

interface AnimatedScrollProps extends ScrollProps<MovieType> {
    directionTo?: 'down' | 'left'
}

const AnimatedMovieHorizontalScroll = ({
    style,
    title,
    titleSize = 16,
    list,
    contentStyle,
    showMore,
    onShowMore,
    directionTo = 'down'
}: AnimatedScrollProps) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const dispatch = useDispatch<AppDispatch>()
    const viewableItems = useSharedValue<ViewToken[]>([])

    const animatedColors = [hexToRGBA(colors.text.default, 0.1), hexToRGBA(colors.background.highlight, 0.3)]
    const animationValue = useSharedValue(0)

    const animation = useAnimatedStyle(() => {
        return ({
            backgroundColor: interpolateColor(animationValue.value, [0, 1], animatedColors)
        })
    },)

    const renderItem = (item: MovieType, index: number) => {
        if (directionTo === 'down') {
            return <ItemSlideDown
                item={item}
                index={index}
                viewableItems={viewableItems}
                contentStyle={contentStyle} />
        }
        return <ItemScale
            item={item}
            index={index}
            viewableItems={viewableItems}
            contentStyle={contentStyle} />
    }

    useEffect(() => {
        animationValue.value = withRepeat(withSpring(1, { duration: 1000 }), -1, true)
    }, [])

    return (
        <View
            className='flex-col'
            style={[
                {
                    flex: 1,
                },
                style
            ]}>
            {title && <SectionTitle style={{
                paddingHorizontal: 8,
            }} fontSize={titleSize}
                title={title}
                showButton={showMore}
                onPress={onShowMore} />}
            <View className='flex-grow'>
                <FlatList
                    style={
                        {
                            width: '100%',
                            height: '100%',
                        }
                    }
                    onViewableItemsChanged={({ viewableItems: vItems }) => { viewableItems.value = vItems }}
                    contentContainerStyle={{
                        paddingHorizontal: 8,
                        columnGap: 16,
                    }}
                    bounces={false}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={list}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => renderItem(item, index)} />
            </View>

        </View>
    )
}

const ItemSlideDown = (
    {
        item,
        index,
        viewableItems,
        contentStyle,
    }:
        {
            item: MovieType,
            index: number,
            viewableItems: SharedValue<ViewToken[]>,
            contentStyle?: ScrollProps<MovieType>['contentStyle'],
        }) => {
    const dispatch = useDispatch<AppDispatch>()
    const animation = useAnimatedStyle(() => {
        const isVisible = Boolean(viewableItems.value.filter((item) => item.isViewable).find((viewableItem) => {
            return viewableItem.item.id === item.id
        }))
        return ({
            height: contentStyle?.height || CAROUSEL_ITEM_SIZE.minimum,
            width: contentStyle?.width || CAROUSEL_ITEM_SIZE.minimum,
            opacity: withTiming(isVisible ? 1 : 0),
            transform: [{ translateY: withSpring(isVisible ? 0 : -100) }]
        })
    })

    return (
        <Animated.View
            className={' items-center justify-center'}
            style={[
                animation]}>
            <MinimalCard
                title={contentStyle?.showTitle
                    ? item.original_title
                    : undefined}
                subTitle={contentStyle?.showSubTitle
                    ? item.release_date
                    : undefined
                }
                src={item.poster_path}
                style={{
                    width: contentStyle?.width || CAROUSEL_ITEM_SIZE.width,
                    height: contentStyle?.height || CAROUSEL_ITEM_SIZE.height
                }}
                onPress={() => {
                    dispatch(setLoading(true))
                    router.push({ pathname: '/routes/movie-details/[id]', params: { id: item.id } })
                }} />
        </Animated.View>
    )
}

export const ItemScale = (
    {
        item,
        index,
        viewableItems,
        contentStyle,
        onPress,
    }:
        {
            item: MovieType,
            index: number,
            viewableItems: SharedValue<ViewToken[]>,
            contentStyle?: ScrollProps<MovieType>['contentStyle'],
            onPress?: () => void
        }) => {
    const dispatch = useDispatch<AppDispatch>()
    const animation = useAnimatedStyle(() => {
        const isVisible = Boolean(viewableItems.value.filter((item) => item.isViewable).find((viewableItem) => {
            return viewableItem.item.id === item.id
        }))
        return ({
            height: contentStyle?.height || CAROUSEL_ITEM_SIZE.minimum,
            width: contentStyle?.width || CAROUSEL_ITEM_SIZE.minimum,
            opacity: withTiming(isVisible ? 1 : 0),
            transform: [{ scale: withTiming(isVisible ? 1 : 0.5) }]
        })
    })

    return (
        <Animated.View
            className={' items-center justify-center'}
            style={[
                animation]}>
            <MinimalCard
                title={contentStyle?.showTitle
                    ? item.original_title
                    : undefined}
                subTitle={contentStyle?.showSubTitle
                    ? dateConverter(item.release_date)
                    : undefined
                } src={item.poster_path}
                style={{
                    width: '100%',
                    height: '100%'
                }}
                onPress={() => {
                    dispatch(setLoading(true))
                    router.push({ pathname: '/routes/movie-details/[id]', params: { id: item.id } })
                }} />
        </Animated.View>
    )
}

export default AnimatedMovieHorizontalScroll