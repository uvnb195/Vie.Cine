import DetailBackgroundWrapper from '@/src/components/DetailBackgroundWrapper'
import MainWrapper from '@/src/components/MainWrapper'
import CustomButton from '@/src/components/button/CustomButton'
import Header from '@/src/components/header'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ClockIcon, HeartIcon, TicketIcon } from 'react-native-heroicons/outline'
import { PlayIcon } from 'react-native-heroicons/solid'
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
    const videoHeight = useSharedValue(200)
    const videoAnimation = useAnimatedStyle(() => ({
        height: withTiming(videoHeight.value)
    }))


    const titleAnimation = useAnimatedStyle(() => ({
        fontSize: interpolate(videoHeight.value, [0, 200], [24, 20]),
        width: '80%'
    }))

    const trailerButtonAnimation = useAnimatedStyle(() => ({
        height: interpolate(
            videoHeight.value,
            [0, 200],
            [40, 0]),
        opacity: withDelay(300, withSpring(videoHeight.value == 200 ? 0 : 1))
    }))

    const [isEverScroll, setIsEverScroll] = React.useState(false)

    // const otherButtonAnimation = useAnimatedStyle(() => ({
    //     width
    // }))

    const handleWatchTrailerPress = () => {
        scrollRef.current?.scrollTo({ y: 0, animated: false })
    }

    return (
        <DetailBackgroundWrapper
            headerComponent={<Header
                leftIconPress={() => router.dismiss()} />}>

            {/* title */}
            <View className='w-full px-6 pb-4 flex-row'>
                <ThemeText
                    otherProps={titleAnimation}
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
                    <CustomButton
                        style={{

                        }}
                        title={!isEverScroll ? 'Schedule' : undefined}
                        icon={<ClockIcon color={colors.text.dark} />} />
                    <View className='w-2' />
                    <CustomButton
                        style={{

                        }}
                        title={!isEverScroll ? 'Buy Ticket' : undefined}
                        icon={<TicketIcon color={colors.text.dark} />} />
                </View>
                {/* trailer */}
                <View className='flex-grow'>
                    <Animated.View style={trailerButtonAnimation} className={'overflow-hidden'}>

                        <CustomButton title='Watch Trailer'
                            icon={<PlayIcon
                                color={colors.text.dark}
                                size={16} />}
                            onPress={handleWatchTrailerPress} />
                    </Animated.View>

                </View>


            </View>

            <ScrollView
                ref={scrollRef}
                onScroll={(e) => {
                    if (e.nativeEvent.contentOffset.y > 0 && videoHeight.value == 200) {
                        setIsEverScroll(true)
                        videoHeight.value = 0
                    } else if (e.nativeEvent.contentOffset.y == 0) {
                        videoHeight.value = 200
                        setIsEverScroll(false)
                    }
                }}
                bounces={false}
                decelerationRate={0}
                className='px-6 mt-4 flex-1'>
                <View className='w-full h-[1000px] border-4 border-white' />
            </ScrollView>
        </DetailBackgroundWrapper>
    )
}

export default DetailScreen