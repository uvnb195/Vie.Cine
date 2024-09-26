import { View, Text, Animated as RNAnimated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import PaymentSheet, { BottomSheetRef } from '@/src/components/bottom-sheet/PaymentSheet'
import ScheduleSheet from '@/src/components/bottom-sheet/ScheduleSheet'
import MainWrapper from '@/src/components/MainWrapper'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { RootState, store } from '@/src/redux/store'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { SafeAreaView } from 'react-native-safe-area-context'
import HomeHeader from '@/src/components/header/HomeHeader'
import { CAROUSEL_ITEM_SIZE, HORIZONTALCARD_SIZE } from '@/constants/Size'
import CustomCarousel, { CustomCarouselRef } from '@/src/components/scroll/CustomCarousel'
import ScrollListSection from '@/src/components/scroll/ScrollListSection'
import { getCurrentPositionAsync, requestForegroundPermissionsAsync, reverseGeocodeAsync } from 'expo-location'
import { updateLocation } from '@/src/redux/paymentSlice'
import { CakeIcon, MapPinIcon, UserIcon } from 'react-native-heroicons/solid'
import { useCustomTheme } from '@/src/contexts/theme'
import ThemeText from '@/src/components/theme/ThemeText'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import HorizontalCard from '@/src/components/card/HorizontalCard'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { styled } from 'nativewind'
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import MinimalCard from '@/src/components/card/MinimalCard'
import SmallButton from '@/src/components/button/SmallButton'
import SectionTitle from '@/src/components/button/SectionTitle'

const Tab = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const { address } = useSelector((state: RootState) => state.payment)
    const dispatch = useDispatch()

    const bottomSheetRef = useRef<BottomSheetRef>(null)

    const [toggle, setToggle] = React.useState(true)

    const locationHeight = useRef(new RNAnimated.Value(0)).current

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

    useEffect(() => {
        if (address.city.length > 0) {
            setTimeout(() => {
                RNAnimated.timing(locationHeight, {
                    toValue: 30,
                    duration: 500,
                    useNativeDriver: false
                }).start()
            }, 1000)
        }
    }, [address])

    useEffect(() => {
        (async () => {
            let { status } = await requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                console.log('Permission to access location was denied')
                return
            }
            let location = await getCurrentPositionAsync({}).catch((err) => {
                console.log("Oopss!! Turn on your location")
            })
            if (location) {
                await reverseGeocodeAsync(location.coords)
                    .then(
                        (value) => {
                            dispatch(updateLocation({
                                city: value[0].city || value[0].region!!,
                                district: value[0].district || value[0].subregion!!
                            }))
                        }
                    )
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }
        )()
    }, [])

    const test = () => {
    }

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
                                size={24} />
                        },
                        {
                            content: 'September 2, 1964',
                            icon: <CakeIcon
                                color={colors.text.default}
                                size={24} />
                        },
                        {
                            content: 'London, United Kingdom',
                            icon: <MapPinIcon
                                color={colors.text.default}
                                size={24} />
                        }
                    ]}
                    sortTag={[
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
            headerComponent={
                <HomeHeader />
            }>
            {/* location */}
            <RNAnimated.View className='w-full flex-row items-center overflow-hidden m-0 p-0'
                style={{
                    height: locationHeight,
                }}>
                <MapPinIcon size={16} color={colors.text.highlight} style={{
                    marginRight: 8
                }} />
                <ThemeText otherProps={{
                }}>{`${address.district}, ${address.city}`}</ThemeText>
            </RNAnimated.View>

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
                    renderItem={() => <MinimalCard src={{ uri: 'https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2020/072020/KICHI_VOUCHER_350x495.jpg' }} />} />
            </Animated.View>
        </MainWrapper>
        // <BottomSheetModalProvider>
        //     <Provider store={store}>
        //         <MainWrapper
        //             bottomSheetComponent={
        //                 toggle ? <PaymentSheet
        //                     ref={bottomSheetRef} />
        //                     : <ScheduleSheet ref={bottomSheetRef} />
        //             }
        //         // headerComponent={
        //         //     <Header
        //         //         leftIcon={
        //         //             <ChevronLeftIcon
        //         //                 color={colors.text.default}
        //         //                 size={24} />}
        //         //         leftIconPress={() => console.log('back')}
        //         //         rightIcon={
        //         //             <Entypo
        //         //                 name="dots-three-vertical"
        //         //                 size={24}
        //         //                 color={colors.text.default} />}
        //         //         rightIconPress={() => console.log('right')}
        //         //         title='Ticket DetailTicket DetailTicket DetailTicket DetailTicket DetailTicket DetailTicket DetailTicket Detail' />
        //         // }
        //         >
        //             {/* <ExpandInput title='B3'
        //             onPress={() => { }}
        //             disabled={true}
        //             width={40}
        //             height={40} />
        //         <ExpandInput
        //             width={40}
        //             height={40}
        //             title='A1'
        //         /> */}

        //             {/* <ExpandedInputScrollView
        //             itemSize={DROPDOWN_MENU_ITEM_HEIGHT} /> */}

        //             <View className='w-full h-[250px] '>
        //                 {/* <CinemaMapView
        //                     onChange={function (selecteds: string[]): void {
        //                         throw new Error('Function not implemented.')
        //                     }} /> */}
        //             </View>
        //             {/* 
        //         <CustomInput
        //             placeHolder='asdsadsa'
        //             blockText={true} />
        //         <SearchInput /> */}

        //             {/* <DropdownMenu data={[1, 2, 3]} /> */}

        //             <View className='w-full h-[250px]'>
        //                 {/* <View className=' w-full flex-row h-[50px] items-center justify-evenly'>
        //                 <TouchableOpacity>
        //                     <Text className='text-xl text-white'>Prev</Text></TouchableOpacity>
        //                 <TouchableOpacity>
        //                     <Text className='text-xl text-white'>Next</Text></TouchableOpacity>
        //             </View> */}
        //             </View>

        //             {/* <ScrollView className='gap-y-4'>
        //     <HorizontalCard
        //         className='w-full min-h-[140px]'
        //         style={{
        //             backgroundColor: hexToRGBA(colors.background.default, 0.5),
        //             padding: 8
        //         }}
        //         title={'Venom Let There Be Carnage'}
        //         stats={[
        //             {
        //                 content: 'Keanu Charles Reeves',
        //                 icon: <UserIcon
        //                     color={colors.text.default}
        //                     size={24} />
        //             },
        //             {
        //                 content: 'September 2, 1964',
        //                 icon: <CakeIcon
        //                     color={colors.text.default}
        //                     size={24} />
        //             },
        //             {
        //                 content: 'London, United Kingdom',
        //                 icon: <MapPinIcon
        //                     color={colors.text.default}
        //                     size={24} />
        //             }
        //         ]}
        //         sortTag={[
        //             'Action',
        //             'Adventure',
        //             'Fantasy',
        //             'Action',
        //             'Adventure',
        //             'Fantasy'
        //         ]}
        //         image={require('../assets/images/Image.png')} />

        //     <HorizontalCard
        //         hasBorder
        //         className='w-full min-h-[140px]'
        //         style={{
        //             backgroundColor: hexToRGBA(colors.background.default, 0.5),
        //             padding: 8
        //         }}
        //         title={'Venom Let There Be Carnage'}
        //         stats={[
        //             {
        //                 content: 'Released: 25/09/2024',
        //                 icon: <CalendarIcon
        //                     color={colors.text.default}
        //                     size={24} />
        //             },
        //             {
        //                 content: '1h 47m',
        //                 icon: <ClockIcon
        //                     color={colors.text.default}
        //                     size={24} />
        //             },
        //             {
        //                 content: '6.4/10 IMDb',
        //                 icon: <StarIcon
        //                     color={colors.text.default}
        //                     size={24} />
        //             }
        //         ]}
        //         sortTag={[
        //             'Action',
        //             'Adventure',
        //             'Fantasy',
        //             'Action',
        //             'Adventure',
        //             'Fantasy'
        //         ]}
        //         image={require('../assets/images/image-2.png')} />

        // </ScrollView> */}
        //             <>
        //                 {/* <View className='w-full h-[250px]'>
        //         <ScrollView horizontal className='w-full'>
        //             <VerticalCard title={'Spiderman: No Way HomeSpiderman: No Way HomeSpiderman: No Way Home'}
        //                 subtitle='9.5/10 IMDb'
        //                 imageSoure={require('../assets/images/image-2.png')} />
        //             <VerticalCard title={'Eternals'}
        //                 subtitle='9.5/10 IMDb'
        //                 imageSoure={require('../assets/images/image-2.png')} />
        //         </ScrollView>
        //     </View> */}

        //                 {/* button */}
        //                 {/* <View className='flex-1 gap-2 items-center px-5'>

        //         <SmallButton title='See more'
        //             onPress={() => { console.log('clicked') }} />
        //         <CustomButton
        //             title='Watcasdasdash Trailer'
        //             icon={<PlayIcon size={24} color={colors.text.light} />} />

        //         <CustomButton
        //             title='Watcasdasdash Trailer'
        //             onPress={() => console.log("clicked")} />
        //         <CustomButton
        //             disabled
        //             title='Watcasdasdash Trailer'
        //             onPress={() => console.log("clicked")} />
        //         <CustomButton
        //             hasBorder={false}
        //             disabled
        //             title='Watcasdasdash Trailer'
        //             onPress={() => console.log("clicked")} />
        //         <CustomButton
        //             hasBorder={false}
        //             title='Watcasdasdash Trailer'
        //             onPress={() => console.log("clicked")} />
        //         <CustomButton
        //             disabled
        //             icon={<HomeIcon size={24} color={colors.text.light} />} />
        //     </View> */}

        //     <ScrollListSection
        //         width={'100%'}
        //         data={[1, 2, 3, 4, 5, 6]}
        //         padding={24} /> */}
        //             </>

        //         </MainWrapper>
        //     </Provider>
        // </BottomSheetModalProvider>
    )
}

export default Tab
