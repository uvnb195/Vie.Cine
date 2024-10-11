import { shadowImageStyle } from '@/constants/Styles'
import { dateConverter } from '@/hooks/convertDate'
import { getDeviceLocales } from '@/hooks/permissions'
import DetailBackgroundWrapper from '@/src/components/DetailBackgroundWrapper'
import PaymentSheet, { BottomSheetRef } from '@/src/components/bottom-sheet/PaymentSheet'
import ScheduleSheet from '@/src/components/bottom-sheet/ScheduleSheet'
import SectionTitle from '@/src/components/button/SectionTitle'
import SmallButton from '@/src/components/button/SmallButton'
import DetailStatCard from '@/src/components/card/DetailStatCard'
import MinimalCard from '@/src/components/card/MinimalCard'
import TextHighLight from '@/src/components/card/TextHighLight'
import Header from '@/src/components/header'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { fetchPerson } from '@/src/redux/publicAsyncActions'
import { setLoading } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { BottomSheetModalProvider, TouchableOpacity } from '@gorhom/bottom-sheet'
import { router, useLocalSearchParams } from 'expo-router'
import React, { memo, useEffect, useRef, useState } from 'react'
import { Image, View } from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { HeartIcon } from 'react-native-heroicons/outline'
import { StarIcon } from 'react-native-heroicons/solid'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'

const PersonScreen = () => {
    const theme = useCustomTheme()
    const { colors } = theme
    const { id } = useLocalSearchParams()
    const dispatch = useDispatch<AppDispatch>()
    const {
        loading,
        phoneRegion,
        personInfo
    } = useSelector((state: RootState) => state.public)

    const scrollRef = useRef<ScrollView>(null)
    const [toggleBottomSheet, setToggleBottomSheet] = useState(false)
    const [toggleBiography, setToggleBiography] = useState(false)
    const scrollY = useSharedValue(0)
    const avatarScale = useAnimatedStyle(() => ({
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
        )),
        borderWidth: withTiming(interpolate(
            scrollY.value,
            [0, 1],
            [1, 0],
            'clamp'
        )),
        borderColor: colors.border.default
    }))
    const shadow = shadowImageStyle(colors.text.default)

    const bottomSheetRef = useRef<BottomSheetRef>(null)

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
        if (personInfo.person?.also_known_as) {
            return personInfo.person?.also_known_as.map((name, index) => {
                return <TextHighLight
                    key={index}
                    marginX={4}
                    marginY={4}
                    children={name} />
            })
        }
        else return null
    }

    const handleAddToFavor = () => {
        getDeviceLocales()
    }

    useEffect(() => {
        if (personInfo.person && personInfo.person.id.toString() == id.toString()) {
            scrollY.value = 0
            dispatch(setLoading(false))
        }
    }, [personInfo])

    useEffect(() => {
        dispatch(setLoading(true))
        dispatch(fetchPerson({ id: id + "" }))
        return () => {
            clearTimeout(timeoutRef.current as NodeJS.Timeout)
        }
    }, [id])


    return (
        <BottomSheetModalProvider>
            <DetailBackgroundWrapper
                sourceUri={loading ? undefined : personInfo.person?.profile_path}
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
                        {/* name */}
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
                                {personInfo.person?.name}
                            </ThemeText>
                        </View>

                        {/* avatar */}
                        <Animated.View
                            style={[
                                { ...shadow },
                                avatarScale]}
                            className='self-center rounded-full border-2 overflow-hidden items-center justify-center'>
                            <Image source={{ uri: personInfo?.person?.profile_path }} style={{
                                height: 300,
                                width: 200
                            }}
                                resizeMode='cover' />
                        </Animated.View>
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
                        {/* Popularity */}
                        <View className='flex-row items-center justify-center w-full pt-2 px-4'>
                            <View className={'items-center'}>
                                <StarIcon color={colors.icon.highlight} />
                            </View>
                            <View className='flex-1 ml-2'>
                                <ThemeText
                                    otherProps={{
                                    }}
                                    fontSize={14}
                                    color={colors.text.default}>Popularity:{" "}
                                    <ThemeText otherProps={{
                                    }}
                                        fontSize={16}
                                        fontWeight='bold'
                                        color={colors.text.default}>{personInfo.person?.popularity}
                                    </ThemeText>
                                </ThemeText>
                            </View>
                        </View>

                        {/* move types */}
                        <View className='mt-2 w-full flex-row flex-wrap px-2'>
                            {renderGenres()}
                        </View>

                        {/* movie stats */}
                        <View className='w-full flex-row justify-start mt-2 pl-6'>
                            <DetailStatCard
                                style={{
                                    width: '30%'
                                }}
                                title='Gender'
                                content={personInfo.person?.gender == 2 ? 'Male' : 'Female'} />
                            <DetailStatCard
                                style={{
                                    width: '30%'
                                }}
                                title='Day of Birth'
                                content={dateConverter(personInfo.person?.birthday || "")} />
                            {personInfo.person?.deathday &&
                                <DetailStatCard
                                    style={{
                                        width: '30%'
                                    }}
                                    title='Deathday'
                                    content={personInfo.person?.deathday} />}
                        </View>

                        {/* Biography */}
                        <Animated.View className='w-full mt-4 px-4'>
                            <SectionTitle
                                style={{
                                    paddingHorizontal: 0,
                                    marginBottom: 8
                                }}
                                title='Biography' />
                            <ThemeText
                                otherProps={{
                                    fontStyle: 'italic'
                                }}
                                fontWeight={'light'}
                                fontSize={18} letterSpacing={2} color={colors.text.light}>{personInfo.person?.place_of_birth}</ThemeText>

                            <ThemeText
                                fontSize={16}
                                otherProps={{
                                    marginTop: 8,
                                    textAlign: 'justify',
                                    height: (toggleBiography ? 'auto' : 250),
                                }} color={colors.text.light}
                                letterSpacing={1.5}
                                lineHeight={22}>{personInfo.person?.biography}
                            </ThemeText>

                            {/* read more */}
                            {
                                personInfo.person?.biography && personInfo.person?.biography?.length > 500 &&
                                <View className='w-full h-10 justify-start pt-2'>
                                    <SmallButton
                                        onPress={() => { setToggleBiography(!toggleBiography) }}
                                        title={toggleBiography ? 'Collapse⤴' : 'Read More⤵'} style={{ alignSelf: 'flex-end' }} />
                                </View>
                            }

                        </Animated.View>

                        {/* cast */}
                        <View className='w-full mt-4'>
                            <SectionTitle style={{
                                paddingHorizontal: 16,
                                marginBottom: 8
                            }}
                                title='Cast'
                                showButton={personInfo.cast && personInfo.cast.length > 10 ? true : false} />
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    columnGap: 8,
                                    paddingHorizontal: 16
                                }}
                                horizontal
                                snapToInterval={100}
                                data={personInfo.cast?.slice(0, 10)}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) =>
                                    <MinimalCard
                                        onPress={() => {
                                            dispatch(setLoading(true))
                                            router.replace({
                                                pathname: '/routes/movie-details/[id]',
                                                params: { id: item.id }
                                            })
                                        }}
                                        style={{
                                            width: 100,
                                            height: 200,
                                        }}
                                        title={item.original_title}
                                        subTitle={item.release_date}
                                        src={item.poster_path || ""} />} />
                        </View>
                    </ScrollView>
                </View>
            </DetailBackgroundWrapper >

        </BottomSheetModalProvider >
    )
}

export default memo(PersonScreen)