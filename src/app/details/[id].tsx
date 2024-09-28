import { hexToRGBA } from '@/hooks/hexToRGBA'
import DetailBackgroundWrapper from '@/src/components/DetailBackgroundWrapper'
import MainWrapper from '@/src/components/MainWrapper'
import CustomButton from '@/src/components/button/CustomButton'
import SectionTitle from '@/src/components/button/SectionTitle'
import CardStat from '@/src/components/card/CardStat'
import DetailStatCard from '@/src/components/card/DetailStatCard'
import MinimalCard from '@/src/components/card/MinimalCard'
import TextHighLight from '@/src/components/card/TextHighLight'
import Header from '@/src/components/header'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { FlatList, Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler'
import { ClockIcon, HeartIcon, TicketIcon } from 'react-native-heroicons/outline'
import { PlayIcon, StarIcon } from 'react-native-heroicons/solid'
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated'
import WebView from 'react-native-webview'

const DetailScreen = () => {
    const theme = useCustomTheme()
    const { colors } = theme

    const params = useLocalSearchParams()
    useEffect(() => {
        console.log(params.id)
    }, [])

    const scrollRef = useRef<ScrollView>(null)
    const [isVisibleVideo, setIsVisibleVideo] = useState(true)
    const videoHeight = useSharedValue(200)
    const videoAnimation = useAnimatedStyle(() => ({
        height: withTiming(videoHeight.value)
    }))

    const trailerButtonAnimation = useAnimatedStyle(() => ({
        height: interpolate(
            videoHeight.value,
            [0, 1],
            [40, 0]),
        opacity: withDelay(300,
            withSpring(videoHeight.value != 200 ? 1 : 0))
    }))

    const textAnimation = useAnimatedStyle(() => ({
        width: withDelay(300, withTiming(videoHeight.value == 200 ? 100 : 0))
    }))

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
    // const videoHeight = interpolate(scrollY.value,
    //     [0, 50],
    //     [200, 0])


    // const titleAnimation = useAnimatedStyle(() => ({
    //     fontSize: interpolate(
    //         scrollY.value,
    //         [0, 1],
    //         [24, 20]),
    //     width: '80%'
    // }))



    // const otherButtonAnimation = useAnimatedStyle(() => ({
    //     width
    // }))

    const handleWatchTrailerPress = () => {
        videoHeight.value = 200
    }

    return (
        <DetailBackgroundWrapper
            headerComponent={<Header
                leftIconPress={() => router.dismiss()} />}>
            <GestureDetector gesture={dragY} >
                <View>
                    {/* title */}
                    <View className='w-full px-6 pb-4 flex-row'>
                        <ThemeText
                            // otherProps={titleAnimation}
                            letterSpacing={1.5}
                            fontWeight='bold'>Spiderman: No Way
                            Home</ThemeText>

                        <View className=' flex-1 items-end justify-start pr-6'>

                            <TouchableOpacity>
                                <HeartIcon color={colors.text.light} />
                            </TouchableOpacity>
                        </View>
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
                            <TouchableOpacity>
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
                                        otherProps={textAnimation}
                                        numsOfLines={1}
                                        color={colors.text.dark}>Schedule</ThemeText>
                                    <View>
                                        <ClockIcon color={colors.text.dark} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View className='w-2' />

                            {/* buy ticket */}
                            <TouchableOpacity>
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
                                        otherProps={textAnimation}
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
                                    icon={<PlayIcon
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
        </DetailBackgroundWrapper>
    )
}

export default DetailScreen