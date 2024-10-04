import { View, Text, ViewStyle, ViewToken } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { MovieType } from '@/constants/types'
import MinimalCard from '../card/MinimalCard'
import SectionTitle from '../button/SectionTitle'
import { CAROUSEL_ITEM_SIZE } from '@/constants/Size'
import { router } from 'expo-router'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/src/redux/store'
import { setLoading } from '@/src/redux/publicSlice'
import { dateConverter } from '@/hooks/convertDate'

export interface ScrollProps {
    style?: ViewStyle,
    title?: string,
    titleSize?: number,
    list: MovieType[],
    showMore?: boolean,
    onShowMore?: () => void,
    contentStyle?: {
        width?: number,
        height?: number,
        showTitle?: boolean,
        showSubTitle?: boolean
    },
    viewableItems?: (items: ViewToken<MovieType>[]) => void
}

const HorizontalScroll = ({
    style,
    title,
    titleSize = 16,
    list,
    contentStyle,
    showMore,
    onShowMore,
    viewableItems
}: ScrollProps) => {
    const dispatch = useDispatch<AppDispatch>()

    const renderItem = (item: MovieType, index: number) => {
        return (<MinimalCard
            title={contentStyle?.showTitle
                ? item.original_title
                : undefined}
            subTitle={contentStyle?.showSubTitle
                ? item.release_date
                : undefined
            }
            style={{
                width: contentStyle?.width || CAROUSEL_ITEM_SIZE.width,
                height: contentStyle?.height || CAROUSEL_ITEM_SIZE.height
            }} src={item.poster_path}
            onPress={() => {
                dispatch(setLoading(true))
                router.push({ pathname: '/routes/details/[id]', params: { id: item.id } })
            }} />)
    }

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
                onViewableItemsChanged={({ viewableItems: vItems }) => { viewableItems && viewableItems(vItems) }}
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

export default HorizontalScroll