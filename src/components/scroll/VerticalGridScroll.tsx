import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/src/redux/store"
import MinimalCard from "../card/MinimalCard"
import { dateConverter } from "@/hooks/convertDate"
import { CAROUSEL_ITEM_SIZE } from "@/constants/Values"
import { setLoading } from "@/src/redux/publicSlice"
import { router } from "expo-router"
import { ActivityIndicator, Dimensions, FlatList, Image, View, ViewToken } from "react-native"
import SectionTitle from "../button/SectionTitle"
import { useEffect, useState } from "react"
import { useCustomTheme } from "@/src/contexts/theme"
import { ItemScale } from "./AnimatedMovieHorizontalScroll"
import { useSharedValue } from "react-native-reanimated"
import { ScrollProps } from "./MovieHorizontalScroll"
import { MovieType } from "@/constants/types/MovieType"

interface VerticalGridScrollProps extends ScrollProps<MovieType> {
    numColumns?: number,
    onEndReached?: () => void,
}

const VerticalGridScroll = ({
    style,
    title,
    titleSize = 16,
    list,
    contentStyle,
    showMore,
    onShowMore,
    numColumns = 1,
    onEndReached
}: VerticalGridScrollProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const { fetching } = useSelector((state: RootState) => state.public)
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const viewableItems = useSharedValue<ViewToken[]>([])

    const renderItem = (item: MovieType, index: number) => {
        return (
            <View className="items-center justify-center" style={{
                width: `${100 / numColumns}%`,
            }}>
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
                        height: CAROUSEL_ITEM_SIZE.height,
                        paddingHorizontal: contentStyle?.paddingHorizontal || 4,
                        paddingVertical: contentStyle?.paddingVertical || 8
                    }}
                    onPress={() => {
                        router.push({
                            pathname: '/routes/(movie-details)/[id]',
                            params: { id: item.id }
                        })
                    }} />
            </View >)
    }

    return (
        <View
            className='flex-col4'
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
            <View className="flex-1">
                <FlatList
                    windowSize={50}
                    extraData={list}
                    ListFooterComponent={() =>
                        fetching &&
                        <View className="py-4">
                            <ActivityIndicator size={40} color={colors.icon.highlight} />
                        </View>}
                    onEndReachedThreshold={0.5}
                    onEndReached={onEndReached}
                    numColumns={numColumns}
                    contentContainerStyle={{
                        columnGap: 8
                    }}
                    onViewableItemsChanged={({ viewableItems: vItems }) => { viewableItems.value = vItems }}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    data={list}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => renderItem(item, index)} />
            </View>
        </View>
    )
}

export default VerticalGridScroll