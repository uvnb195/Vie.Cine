import { View, Text, ViewStyle, ViewToken } from 'react-native'
import React, { useEffect } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { MovieType } from '@/constants/types'
import MinimalCard, { CardProps } from '../card/MinimalCard'
import SectionTitle from '../button/SectionTitle'
import { CAROUSEL_ITEM_SIZE } from '@/constants/Size'
import { router } from 'expo-router'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/src/redux/store'
import { resetDetail, setLoading } from '@/src/redux/publicSlice'
import { dateConverter } from '@/hooks/convertDate'
import { ScrollProps } from './HorizontalScroll'
import Animated, { interpolateColor, SharedValue, useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated'
import { fetchMovie } from '@/src/redux/publicAsyncAction'
import { ChevronDoubleRightIcon } from 'react-native-heroicons/outline'
import { useCustomTheme } from '@/src/contexts/theme'
import { hexToRGBA } from '@/hooks/hexToRGBA'

interface AnimatedScrollProps extends ScrollProps {
    directionTo?: 'down' | 'left'
}

const AnimatedHorizontalScroll = ({
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
            return <ItemSlideDown item={item} index={index} viewableItems={viewableItems} contentStyle={contentStyle} />
        }
        return <ItemScale item={item} index={index} viewableItems={viewableItems} contentStyle={contentStyle} />
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
            <FlatList
                onViewableItemsChanged={({ viewableItems: vItems }) => { viewableItems.value = vItems }}
                contentContainerStyle={{
                    paddingHorizontal: 8,
                    paddingVertical: 8,
                    columnGap: 16,
                }}
                bounces={false}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={list}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => renderItem(item, index)} />
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
            contentStyle?: ScrollProps['contentStyle'],
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
                    dispatch(fetchMovie(`${item.id}`))
                    router.push({ pathname: '/routes/movie-details/[id]', params: { id: item.id } })
                }} />
        </Animated.View>
    )
}

const ItemScale = (
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
            contentStyle?: ScrollProps['contentStyle'],
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
                    width: contentStyle?.width || CAROUSEL_ITEM_SIZE.width,
                    height: contentStyle?.height || CAROUSEL_ITEM_SIZE.height
                }}
                onPress={() => {
                    dispatch(setLoading(true))
                    dispatch(fetchMovie(`${item.id}`))
                    router.push({ pathname: '/routes/movie-details/[id]', params: { id: item.id } })
                }} />
        </Animated.View>
    )
}

export default AnimatedHorizontalScroll