import { CAROUSEL_ITEM_SIZE } from '@/constants/Size'
import { setLoading } from '@/src/redux/publicSlice'
import { AppDispatch } from '@/src/redux/store'
import { router } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useDispatch } from 'react-redux'
import SectionTitle from '../button/SectionTitle'
import MinimalCard from '../card/MinimalCard'
import { ScrollProps } from './MovieHorizontalScroll'
import { Cast } from '@/constants/types/index'

const PersonHorizontal = ({
    style,
    title,
    titleSize = 16,
    list,
    contentStyle,
    showMore,
    onShowMore,
    viewableItems,
    totalPages
}: ScrollProps<Cast>) => {
    const dispatch = useDispatch<AppDispatch>()

    const renderItem = (item: Cast, index: number) => {
        return (<MinimalCard
            title={contentStyle?.showTitle
                ? item.original_name
                : undefined}
            subTitle={contentStyle?.showSubTitle
                ? item.character
                : undefined
            }
            style={{
                width: contentStyle?.width || CAROUSEL_ITEM_SIZE.width,
                height: contentStyle?.height || CAROUSEL_ITEM_SIZE.height
            }} src={item.profile_path || ''}
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
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => renderItem(item, index)} />
        </View>
    )
}

export default PersonHorizontal