import { hexToRGBA } from '@/hooks/hexToRGBA'
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
import { BottomSheetModalProvider, TouchableOpacity } from '@gorhom/bottom-sheet'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { FlatList, Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler'
import { ClockIcon, HeartIcon, TicketIcon } from 'react-native-heroicons/outline'
import { PlayIcon, StarIcon } from 'react-native-heroicons/solid'
import Animated, { cancelAnimation, interpolate, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated'
import WebView from 'react-native-webview'

const DetailScreen = () => {
    const theme = useCustomTheme()
    const { colors } = theme

    const params = useLocalSearchParams()

    const scrollRef = useRef<ScrollView>(null)
    const [toggleBottomSheet, setToggleBottomSheet] = useState(false)
    const videoHeight = useSharedValue(200)
    const videoAnimation = useAnimatedStyle(() => ({
        height: withTiming(videoHeight.value)
    }))

    const bottomSheetRef = useRef<BottomSheetRef>(null)

    const trailerButtonAnimation = useAnimatedStyle(() => ({
        height: interpolate(
            videoHeight.value,
            [0, 1],
            [40, 0]),
        opacity: withDelay(300,
            withSpring(videoHeight.value != 200 ? 1 : 0))
    }))

    const buttonTextAnimation = useAnimatedStyle(() => ({
        width: withDelay(300, withTiming(videoHeight.value == 200 ? 100 : 0))
    }))

    const titleAnimation = useAnimatedStyle(() => ({
        fontSize: withTiming(videoHeight.value == 200 ? 16 : 24),
        flex: 1,
    }))

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const dragY = Gesture.Pan()
        .minDistance(50)
        .onEnd((event) => {
            if (videoHeight.value == 200) {
                videoHeight.value = 0
            }
            else {
                videoHeight.value = 200
            }
        })

    const handleWatchTrailerPress = () => {
        cancelAnimation(videoHeight)
        videoHeight.value = 200
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

    useEffect(() => {
        return () => {
            cancelAnimation(videoHeight)
            clearTimeout(timeoutRef.current as NodeJS.Timeout)
        }
    }, [])

    return (
        <BottomSheetModalProvider>
            <DetailBackgroundWrapper
                HeaderComponent={<Header
                    leftIconPress={() => router.dismiss()} />}
                BottomSheetComponent={
                    toggleBottomSheet ?
                        <PaymentSheet ref={bottomSheetRef} />
                        : <ScheduleSheet ref={bottomSheetRef} />
                }>
                <View className='flex-1 overflow-hidden'>
                    {/* header */}
                    <GestureDetector gesture={dragY} >
                        <View>
                            {/* title */}
                            <View className='w-full px-6 pb-4 flex-row-reverse'>
                                <View className='items-end justify-start w-10 h-full pr-2'>

                                    <TouchableOpacity>
                                        <HeartIcon color={colors.text.light} />
                                    </TouchableOpacity>
                                </View>
                                <ThemeText
                                    otherProps={titleAnimation}
                                    letterSpacing={1.5}
                                    fontWeight='bold'>Spiderman: No Way
                                    Home</ThemeText>
                            </View>

                            {/* video embed */}
                            <Animated.View
                                style={videoAnimation}
                                className='px-6 w-full overflow-hidden'>
                                <WebView
                                    autoPlay={true}
                                    allowsFullscreenVideo={true}
                                    style={{ width: '100%', height: 200 }}
                                    javaScriptEnabled
                                    source={{
                                        uri: 'https://www.youtube.com/embed/iTBiUdjXaL0'
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
                                        <CustomButton title='Watch Trailer'
                                            Icon={<PlayIcon
                                                color={colors.text.dark}
                                                size={16} />}
                                            onPress={handleWatchTrailerPress} />
                                    </Animated.View>

                                </View>


                            </View>
                        </View>
                    </GestureDetector>

                    {/* content */}
                    <ScrollView
                        ref={scrollRef}
                        onScroll={(e) => {
                            videoHeight.value = 0
                        }}
                        bounces={false}
                        decelerationRate={0}
                        className='px-6 mt-4 flex-1'>

                        {/* IMDb rate */}
                        <View className='flex-row items-center justify-center w-full pt-2'>
                            <View className={'items-center'}>
                                <StarIcon color={colors.icon.highlight} />
                            </View>
                            <View className='flex-1 ml-2'>
                                <ThemeText
                                    otherProps={{
                                    }}
                                    fontSize={16}
                                    color={colors.text.default}>
                                    9.1/10 IMDb
                                </ThemeText>
                            </View>
                        </View>

                        {/* move types */}
                        <View className='mt-2 w-full flex-row flex-wrap'>
                            <TextHighLight
                                marginX={4}
                                marginY={4}
                                children={'Action'} />
                            <TextHighLight
                                marginX={4}
                                marginY={4}
                                children={'Adventure'} />
                            <TextHighLight
                                marginX={4}
                                marginY={4}
                                children={'Fantasy'} />
                            <TextHighLight
                                marginX={4}
                                marginY={4}
                                children={'Action'} />
                            <TextHighLight
                                marginX={4}
                                marginY={4}
                                children={'Adventure'} />
                            <TextHighLight
                                marginX={4}
                                marginY={4}
                                children={'Fantasy'} />

                        </View>

                        {/* movie stats */}
                        <View className='w-full flex-row justify-between mt-2'>
                            <DetailStatCard
                                style={{
                                    width: '30%'
                                }}
                                title='Length'
                                content='2h 28 min' />
                            <DetailStatCard
                                style={{
                                    width: '30%'
                                }}
                                title='Language'
                                content='English' />
                            <DetailStatCard
                                style={{
                                    width: '30%'
                                }}
                                title='Rating'
                                content='13+' />
                        </View>

                        {/* description */}
                        <View className='w-full mt-4'>
                            <SectionTitle
                                style={{
                                    paddingHorizontal: 0,
                                    marginBottom: 8
                                }}
                                title='Description' />

                            <ThemeText
                                fontSize={12}
                                otherProps={{
                                    textAlign: 'justify'
                                }}
                                letterSpacing={2}
                                lineHeight={22}>
                                With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.
                            </ThemeText>
                        </View>

                        {/* cast */}
                        <View className='w-full mt-4'>
                            <SectionTitle style={{
                                paddingHorizontal: 0,
                                marginBottom: 8
                            }} title='Cast' showButton />
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    columnGap: 8
                                }}
                                horizontal
                                data={[0, 1, 2, 3, 4, 5, 6]}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) =>
                                    <MinimalCard
                                        style={{
                                            width: 100,
                                            height: 200,
                                        }}
                                        title='Tom Holland'
                                        src={{ uri: 'https://ntvb.tmsimg.com/assets/assets/733885_v9_bb.jpg?w=360&h=480' }} />} />
                        </View>
                    </ScrollView>
                </View>
            </DetailBackgroundWrapper>
        </BottomSheetModalProvider>
    )
}

export default DetailScreen