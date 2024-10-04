import { useDispatch, useSelector } from "react-redux"
import { ScrollProps } from "./HorizontalScroll"
import { AppDispatch, RootState } from "@/src/redux/store"
import MinimalCard from "../card/MinimalCard"
import { MovieType } from "@/constants/types"
import { dateConverter } from "@/hooks/convertDate"
import { CAROUSEL_ITEM_SIZE } from "@/constants/Size"
import { setLoading } from "@/src/redux/publicSlice"
import { router } from "expo-router"
import { ActivityIndicator, Dimensions, FlatList, Image, View } from "react-native"
import SectionTitle from "../button/SectionTitle"
import { useEffect, useState } from "react"

interface VerticalGridScrollProps extends ScrollProps {
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
    viewableItems,
    numColumns = 1,
    onEndReached
}: VerticalGridScrollProps) => {
    const { width, height } = Dimensions.get('window')
    const paddingValue = 16
    const dispatch = useDispatch<AppDispatch>()
    const { fetching, listGroupShowing } = useSelector((state: RootState) => state.public)
    const [showList, setShowList] = useState<MovieType[]>([])

    useEffect(() => {
        console.log(listGroupShowing)
        setShowList(listGroupShowing)
    }, [listGroupShowing])

    const renderItem = (item: MovieType, index: number) => {
        return (
            <View className="px-4 py-2" style={{
                width: width / numColumns
            }}>
                <MinimalCard
                    title={contentStyle?.showTitle
                        ? item.original_title
                        : undefined}
                    subTitle={contentStyle?.showSubTitle
                        ? item.release_date
                        : undefined
                    }
                    style={{
                        width: '100%',
                        height: contentStyle?.height || CAROUSEL_ITEM_SIZE.height
                    }} src={item.poster_path}
                    onPress={() => {
                        dispatch(setLoading(true))
                        router.push({ pathname: '/routes/details/[id]', params: { id: item.id } })
                    }} />
                {/* <View className="absolute top-0 bottom-0 left-0 right-0 p-10">
                    <View className="flex-1 bg-white rounded-2">
                        <Image
                            source={require('../../assets/images/qr-dummy.png')}
                            className="w-full h-full"
                            resizeMode="contain" />
                    </View>
                </View> */}
            </View >)
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
                windowSize={50}
                extraData={showList}
                ListFooterComponent={() =>
                    fetching &&
                    <View>
                        <ActivityIndicator size={40} />
                    </View>}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReached}
                onViewableItemsChanged={({ viewableItems: vItems }) => { viewableItems && viewableItems(vItems) }}
                numColumns={numColumns}
                contentContainerStyle={{
                }}
                bounces={false}
                showsVerticalScrollIndicator={false}
                data={showList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => renderItem(item, index)} />
        </View>
    )
}

export default VerticalGridScroll