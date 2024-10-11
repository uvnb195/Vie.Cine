import { View, Text, ViewStyle, ViewToken, DimensionValue } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import MinimalCard from '../card/MinimalCard'
import SectionTitle from '../button/SectionTitle'
import { CAROUSEL_ITEM_SIZE } from '@/constants/Size'
import { router } from 'expo-router'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/src/redux/store'
import { setLoading } from '@/src/redux/publicSlice'
import { dateConverter } from '@/hooks/convertDate'
import { Cast, MovieType } from '@/constants/types/index'

export interface ScrollProps<T> {
    style?: ViewStyle,
    title?: string,
    titleSize?: number,
    list: T[] | null,
    showMore?: boolean,
    onShowMore?: () => void,
    contentStyle?: {
        width?: DimensionValue,
        height?: DimensionValue,
        showTitle?: boolean,
        showSubTitle?: boolean,
        paddingHorizontal?: number,
        paddingVertical?: number
    },
    viewableItems?: (items: ViewToken<MovieType | Cast>[]) => void,
    totalPages?: number
}

const MovieHorizontalScroll = ({
    style,
    title,
    titleSize = 16,
    list,
    contentStyle,
    showMore,
    onShowMore,
    viewableItems,
    totalPages
}: ScrollProps<MovieType>) => {
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
                router.push({ pathname: '/routes/movie-details/[id]', params: { id: item.id } })
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
                data={(list !== null) ? list : []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => renderItem(item, index)} />
        </View>
    )
}

export default MovieHorizontalScroll