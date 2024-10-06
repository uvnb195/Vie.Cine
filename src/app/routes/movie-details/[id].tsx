import { Cast, MovieType } from '@/constants/types'
import { dateConverter } from '@/hooks/convertDate'
import { convertDuration } from '@/hooks/convertDurration'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { getDeviceLocales } from '@/hooks/permissions'
import DetailBackgroundWrapper from '@/src/components/DetailBackgroundWrapper'
import PaymentSheet, { BottomSheetRef } from '@/src/components/bottom-sheet/PaymentSheet'
import ScheduleSheet from '@/src/components/bottom-sheet/ScheduleSheet'
import CustomButton from '@/src/components/button/CustomButton'
import SectionTitle from '@/src/components/button/SectionTitle'
import DetailStatCard from '@/src/components/card/DetailStatCard'
import MinimalCard from '@/src/components/card/MinimalCard'
import TextHighLight from '@/src/components/card/TextHighLight'
import Header from '@/src/components/header'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { fetchMovie, fetchPerson } from '@/src/redux/publicAsyncAction'
import { resetDetail, setLoading } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { BottomSheetModalProvider, TouchableOpacity } from '@gorhom/bottom-sheet'
import { router, useLocalSearchParams } from 'expo-router'
import React, { memo, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { ClockIcon, HeartIcon, TicketIcon } from 'react-native-heroicons/outline'
import { PlayIcon, StarIcon } from 'react-native-heroicons/solid'
import Animated, { cancelAnimation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import WebView from 'react-native-webview'
import { useDispatch, useSelector } from 'react-redux'

const DetailScreen = () => {
    const theme = useCustomTheme()
    const { colors } = theme
    const { id } = useLocalSearchParams()
    const dispatch = useDispatch<AppDispatch>()
    const {
        movieInfo,
        loading,
        phoneRegion,
        fetching
    } = useSelector((state: RootState) => state.public)

    const scrollRef = useRef<ScrollView>(null)
    const [toggleBottomSheet, setToggleBottomSheet] = useState(false)

    const scrollY = useSharedValue(0)
    const videoAnimation = useAnimatedStyle(() => ({
        opacity: interpolate(
            scrollY.value,
            [0, 100],
            [1, 0],
            'clamp'
        ),
        height: withTiming(interpolate(
            scrollY.value,
            [0, 1],
            [200, 0],
            'clamp'
        ))
    }))

    const bottomSheetRef = useRef<BottomSheetRef>(null)

    const trailerButtonAnimation = useAnimatedStyle(() => ({
        height: interpolate(
            scrollY.value,
            [0, 1],
            [40, 0]),
        opacity: interpolate(
            scrollY.value,
            [0, 1],
            [0, 1])
    }))
    const buttonTextAnimation = useAnimatedStyle(() => ({
        width: withTiming(interpolate(
            scrollY.value,
            [0, 1],
            [100, 0],
            'clamp'
        ))
    }))

    const titleAnimation = useAnimatedStyle(() => ({
        fontSize: withTiming(interpolate(
            scrollY.value,
            [0, 1],
            [16, 24],
            'clamp'
        )),
        flex: 1,
    }))

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleWatchTrailerPress = () => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: true
        })
    }

    const handleOpenScheduleSheet = () => {
        setToggleBottomSheet(false)
        timeoutRef.current = setTimeout(() => {
            bottomSheetRef.current?.openSheet()
        }, 100);
    }

    const handleOpenPaymentSheet = () => {
        setToggleBottomSheet(true)
        timeoutRef.current = setTimeout(() => {
            bottomSheetRef.current?.openSheet()
        }, 100);
    }

    const renderGenres = () => {
        if (movieInfo.movie?.genres) {
            return movieInfo.movie?.genres.map((genre, index) => {
                return <TextHighLight
                    key={index}
                    marginX={4}
                    marginY={4}
                    children={genre.name} />
            })
        }
        else return null
    }

    const handleAddToFavor = () => {
        getDeviceLocales()
    }

    useEffect(() => {
        if (movieInfo.movie && movieInfo.movie.id.toString() == id.toString()) {
            scrollY.value = 0
            dispatch(setLoading(false))
        }
    }, [movieInfo])

    useEffect(() => {
        dispatch(setLoading(true))
        dispatch(fetchMovie({ id: id + "" }))
        return () => {
            clearTimeout(timeoutRef.current as NodeJS.Timeout)
        }
    }, [id])

    return (
        <BottomSheetModalProvider>
            <DetailBackgroundWrapper
                sourceUri={loading ? undefined : movieInfo.movie?.poster_path}
                HeaderComponent={< Header
                    searchIconShown
                    backIconPress={() => {
                        router.dismiss()
                    }} />}
                BottomSheetComponent={
                    toggleBottomSheet ?
                        <PaymentSheet ref={bottomSheetRef} />
                        : <ScheduleSheet ref={bottomSheetRef} />
                }>
                <View className='flex-1 overflow-hidden'>
                    {/* header */}
                    <View>
                        {/* title */}
                        <View className='w-full px-6 pb-4 flex-row-reverse'>
                            <View className='items-end justify-start w-10 h-full pr-2'>

                                <TouchableOpacity
                                    onPress={handleAddToFavor}>
                                    <HeartIcon color={colors.text.light} />
                                </TouchableOpacity>
                            </View>
                            <ThemeText
                                otherProps={titleAnimation}
                                letterSpacing={1.5}
                                fontWeight='bold'>
                                {movieInfo.movie?.original_title}
                            </ThemeText>
                        </View>

                        {/* video embed */}
                        <Animated.View
                            style={videoAnimation}
                            className='px-6 w-full overflow-hidden'>
                            <WebView
                                renderLoading={() => <ActivityIndicator />}
                                cacheMode='LOAD_NO_CACHE'
                                allowsFullscreenVideo={true}
                                style={{ width: '100%', height: 200 }}
                                javaScriptEnabled
                                source={{
                                    uri: movieInfo.movie?.trailer || ""
                                }} />
                        </Animated.View>

                        {/* button */}
                        <View className='w-full mt-4 flex-row-reverse justify-between px-6'>
                            {/* others */}
                            <View className='flex-row'>
                                {/* schedule */}
                                <TouchableOpacity
                                    onPress={handleOpenScheduleSheet}>
                                    <View
                                        className='self-start items-center justify-center flex-row px-2 rounded-2 border'
                                        style={[
                                            {
                                                borderColor: colors.border.default,
                                                minHeight: 40,
                                                backgroundColor: hexToRGBA(colors.background.default, 0.5)
                                            }
                                        ]}>
                                        <ThemeText
                                            otherProps={buttonTextAnimation}
                                            numsOfLines={1}
                                            color={colors.text.dark}>Schedule</ThemeText>
                                        <View>
                                            <ClockIcon color={colors.text.dark} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View className='w-2' />

                                {/* buy ticket */}
                                <TouchableOpacity
                                    onPress={handleOpenPaymentSheet}>
                                    <View
                                        className='self-start items-center justify-center flex-row px-2 rounded-2 border'
                                        style={[
                                            {
                                                borderColor: colors.border.default,
                                                minHeight: 40,
                                                backgroundColor: hexToRGBA(colors.background.default, 0.5)
                                            }
                                        ]}>
                                        <ThemeText
                                            otherProps={buttonTextAnimation}
                                            numsOfLines={1}
                                            color={colors.text.dark}>Buy Ticket</ThemeText>
                                        <View >
                                            <TicketIcon color={colors.text.dark} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {/* trailer */}
                            <View className='flex-grow'>
                                <Animated.View
                                    style={trailerButtonAnimation}
                                    className={'overflow-hidden'}>
                                    <CustomButton
                                        style={{ height: 40 }}
                                        title='Watch Trailer'
                                        Icon={<PlayIcon
                                            color={colors.text.dark}
                                            size={16} />}
                                        onPress={handleWatchTrailerPress} />
                                </Animated.View>

                            </View>


                        </View>
                    </View>

                    {/* content */}
                    <ScrollView
                        ref={scrollRef}
                        onScroll={(e) => {
                            scrollY.value = e.nativeEvent.contentOffset.y
                        }}
                        bounces={false}
                        decelerationRate={0}
                        className='mt-4 flex-1'
                        contentContainerStyle={
                            {
                                paddingBottom: 24
                            }
                        }>
                        {/* IMDb rate */}
                        <View className='flex-row items-center justify-center w-full pt-2 px-4'>
                            <View className={'items-center'}>
                                <StarIcon color={colors.icon.highlight} />
                            </View>
                            <View className='flex-1 ml-2'>
                                <ThemeText
                                    otherProps={{
                                    }}
                                    fontSize={16}
                                    color={colors.text.default}>
                                    {movieInfo.movie?.vote_average}{" "}/{" "}10 IMDb{" "}
                                    {movieInfo.movie && movieInfo.movie.vote_count && <ThemeText fontSize={14} color={colors.text.light}>({movieInfo.movie?.vote_count + " "}{movieInfo.movie && movieInfo.movie.vote_count > 1 ? "votes" : "vote"})</ThemeText>}
                                </ThemeText>
                            </View>
                        </View>

                        {/* move types */}
                        <View className='mt-2 w-full flex-row flex-wrap px-2'>
                            {renderGenres()}
                        </View>

                        {/* movie stats */}
                        <View className='w-full flex-row justify-between mt-2 pl-6'>
                            <DetailStatCard
                                style={{
                                    width: '30%'
                                }}
                                title='Length'
                                content={convertDuration(movieInfo.movie?.runtime || 0)} />
                            <DetailStatCard
                                style={{
                                    width: '30%'
                                }}
                                title='Release'
                                content={dateConverter(movieInfo.movie?.release_date || "") + ""} />
                            <DetailStatCard
                                style={{
                                    width: '30%'
                                }}
                                title='Rating'
                                content={movieInfo.movie?.certification || 'No'} />
                        </View>

                        {/* description */}
                        <View className='w-full mt-4 px-4'>
                            <SectionTitle
                                style={{
                                    paddingHorizontal: 0,
                                    marginBottom: 8
                                }}
                                title='Description' />
                            <ThemeText
                                otherProps={{
                                    fontStyle: 'italic'
                                }}
                                fontWeight={'light'}
                                fontSize={18} letterSpacing={2} color={colors.text.light}>{movieInfo.movie?.tagline}</ThemeText>

                            <ThemeText
                                fontSize={16}
                                otherProps={{
                                    height: movieInfo.movie?.overview && movieInfo.movie?.overview.length < 300 ? 200 : 'auto',
                                    marginTop: 8,
                                    textAlign: 'justify'
                                }} color={colors.text.light}
                                letterSpacing={1.5}
                                lineHeight={22}>{movieInfo.movie?.overview}
                            </ThemeText>
                        </View>

                        {/* cast */}
                        <View className='w-full mt-4'>
                            <SectionTitle style={{
                                paddingHorizontal: 16,
                                marginBottom: 8
                            }} title='Cast' />
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    columnGap: 8,
                                    paddingHorizontal: 16
                                }}
                                horizontal
                                data={movieInfo.cast}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) =>
                                    <MinimalCard
                                        style={{
                                            width: 100,
                                            height: 200,
                                        }}
                                        title={item.original_name}
                                        src={item.profile_path || ""}
                                        onPress={() => {
                                            dispatch(setLoading(true))
                                            router.replace({
                                                pathname: '/routes/person-details/[id]',
                                                params: {
                                                    id: item.id
                                                }
                                            })
                                        }} />} />
                        </View>
                    </ScrollView>
                </View>
            </DetailBackgroundWrapper >

        </BottomSheetModalProvider >
    )
}

export default memo(DetailScreen)