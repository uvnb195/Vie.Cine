import { CAROUSEL_ITEM_SIZE, HORIZONTALCARD_SIZE } from '@/constants/Size'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { BottomSheetRef } from '@/src/components/bottom-sheet/PaymentSheet'
import SectionTitle from '@/src/components/button/SectionTitle'
import HorizontalCard from '@/src/components/card/HorizontalCard'
import MinimalCard from '@/src/components/card/MinimalCard'
import HomeHeader from '@/src/components/header/HomeHeader'
import LocationTag from '@/src/components/LocationTag'
import MainWrapper from '@/src/components/MainWrapper'
import CustomCarousel, { CustomCarouselRef } from '@/src/components/scroll/CustomCarousel'
import { useCustomTheme } from '@/src/contexts/theme'
import { RootState } from '@/src/redux/store'
import React, { useRef } from 'react'
import { Animated as RNAnimated, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { CakeIcon, MapPinIcon, UserIcon } from 'react-native-heroicons/solid'
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, withSpring, withTiming } from 'react-native-reanimated'
import { useSelector } from 'react-redux'

const Tab = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const bottomSheetRef = useRef<BottomSheetRef>(null)

    const [toggle, setToggle] = React.useState(true)

    const carouselHeight = useDerivedValue(() => {
        return toggle ? withSpring(CAROUSEL_ITEM_SIZE.height + 32) : withSpring(CAROUSEL_ITEM_SIZE.minimum + 32)
    }, [toggle])

    const carouselAnimation = useAnimatedStyle(() => {
        return ({
            height: carouselHeight.value
        })
    })

    const bottomAnimation = useAnimatedStyle(() => ({
        height: withTiming(interpolate(
            carouselHeight.value,
            [CAROUSEL_ITEM_SIZE.height + 32, CAROUSEL_ITEM_SIZE.minimum + 32],
            [0, CAROUSEL_ITEM_SIZE.minimum + 32]),
            { duration: 100 })
    }))

    const carouselRef = useRef<CustomCarouselRef>(null)

    const renderItem = (item: any, index: number) => {
        if (typeof item === 'boolean') return <View style={{ height: HORIZONTALCARD_SIZE.height }} />

        return (
            <RNAnimated.View
                className={' w-fulloverflow-hidden'}
                style={{
                }}>

                <HorizontalCard

                    style={{
                        backgroundColor: hexToRGBA(colors.background.default, 0.5),
                        padding: 8,
                        width: '100%',
                        height: HORIZONTALCARD_SIZE.height
                    }}
                    title={'Venom Let There Be Carnage'}
                    stats={[
                        {
                            content: 'Keanu Charles Reeves',
                            icon: <UserIcon
                                color={colors.text.default}
                                size={16} />
                        },
                        {
                            content: 'September 2, 1964',
                            icon: <CakeIcon
                                color={colors.text.default}
                                size={16} />
                        },
                        {
                            content: 'London, United Kingdom',
                            icon: <MapPinIcon
                                color={colors.text.default}
                                size={16} />
                        }
                    ]}
                    shortTags={[
                        'Action',
                        'Adventure',
                        'Fantasy',
                        'Action',
                        'Adventure',
                        'Fantasy'
                    ]}
                    image={require('../../assets/images/Image.png')} />
            </RNAnimated.View >
        )
    }

    return (
        <MainWrapper
            HeaderComponent={
                <HomeHeader />
            }>
            {/* location */}

            <LocationTag />

            {/* title & showmore */}
            <Animated.View className='w-full overflow-hidden'
                style={carouselAnimation}>
                <CustomCarousel
                    ref={carouselRef}
                    width={'100%'}
                    data={[1, 2, 3, 4, 5]}
                    title={'Now Showing'} />
            </Animated.View>

            <SectionTitle title='Up Coming' showButton />
            <RNAnimated.FlatList
                showsVerticalScrollIndicator={false}
                indicatorStyle={'white'}
                // snapToInterval={HORIZONTALCARD_SIZE.height}
                // decelerationRate={0}
                decelerationRate={'fast'}
                bounces={false}
                onScroll={e => {
                    const offsetY = e.nativeEvent.contentOffset.y
                    if (offsetY == 0 && carouselHeight.value != CAROUSEL_ITEM_SIZE.height) {
                        carouselRef.current?.expand()
                        setToggle(true)
                        return
                    }
                    if (offsetY > 0 && carouselHeight.value != CAROUSEL_ITEM_SIZE.minimum) {
                        carouselRef.current?.collapse()
                        setToggle(false)
                    }
                }}
                scrollEventThrottle={16}
                data={[1, 2, 3, 4, 5, 6, 7, 8]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => renderItem(item, index)} />

            {/* bottom */}
            <Animated.View className='w-full'
                style={
                    bottomAnimation
                } >
                <SectionTitle title='Hot Combos' />
                <FlatList
                    bounces={false}
                    contentContainerStyle={{
                        columnGap: 8,
                        paddingHorizontal: 8,
                    }}
                    snapToInterval={150 + 8}
                    decelerationRate={0}
                    horizontal
                    data={[0, 1, 2, 3, 4, 5]}
                    renderItem={() => <MinimalCard title={'Hot Combo'} src={{ uri: 'https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2020/072020/KICHI_VOUCHER_350x495.jpg' }} />} />
            </Animated.View>
        </MainWrapper>
    )
}

export default Tab
