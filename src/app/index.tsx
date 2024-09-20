import { BottomSheetModal, BottomSheetModalProvider, TouchableOpacity } from '@gorhom/bottom-sheet'
import React, { useRef } from 'react'
import { Button, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import CustomBottomSheetModal, { BottomSheetRef } from '../components/bottom-sheet/CustomBottomSheetModal'
import DropdownMenu from '../components/input/DropdownMenu'
import MainWrapper from '../components/MainWrapper'
import { useCustomTheme } from '../contexts/theme'
import PaymentPages from '../components/pages'
import Step1 from '../components/pages/payment-pages/Step1'
import SmallButton from '../components/button/SmallButton'
import ExpandInput from '../components/input/ExpandInput'
import ExpandedInputScrollView from '../components/scroll/ExpandedInputScrollView'
import { DROPDOWN_MENU_ITEM_HEIGHT } from '@/constants/Size'
import ScrollCard from '../components/scroll/ScrollCard'
import CustomInput from '../components/input/CustomInput'
import SearchInput from '../components/input/SearchInput'

const RootLayout = () => {
    const value = useCustomTheme()
    const { colors } = value

    // const handleClosePress = () => bottomSheetRef.current?.closeSheet()

    // const handleExpandPress = () => bottomSheetRef.current?.expandSheet()

    // const handleOpenPress = () => bottomSheetRef.current?.openSheet()

    // const handleCollapsePress = () => bottomSheetRef.current?.collapseSheet()

    const bottomSheetRef = useRef<BottomSheetRef>(null)

    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <MainWrapper
                    bottomSheetComponent={
                        <CustomBottomSheetModal ref={bottomSheetRef}>
                            <Text>BottomSheetModal</Text>
                        </CustomBottomSheetModal>
                    }
                // headerComponent={
                //     <Header
                //         leftIcon={
                //             <ChevronLeftIcon
                //                 color={colors.text.default}
                //                 size={24} />}
                //         leftIconPress={() => console.log('back')}
                //         rightIcon={
                //             <Entypo
                //                 name="dots-three-vertical"
                //                 size={24}
                //                 color={colors.text.default} />}
                //         rightIconPress={() => console.log('right')}
                //         title='Ticket DetailTicket DetailTicket DetailTicket DetailTicket DetailTicket DetailTicket DetailTicket Detail' />
                // }
                >
                    <Button title='Press meaaa' onPress={() => {
                        bottomSheetRef.current?.openSheet()
                    }} />
                    {/* <ExpandInput title='B3'
                        onPress={() => { }}
                        disabled={true}
                        width={40}
                        height={40} />
                    <ExpandInput
                        width={40}
                        height={40}
                        title='A1'
                    /> */}

                    {/* <ExpandedInputScrollView
                        itemSize={DROPDOWN_MENU_ITEM_HEIGHT} /> */}

                    <CustomInput
                        placeHolder='asdsadsa'
                        blockText={true} />
                    <SearchInput />

                    {/* <DropdownMenu data={[1, 2, 3]} /> */}

                    <View className='w-full h-[250px]'>
                        {/* <View className=' w-full flex-row h-[50px] items-center justify-evenly'>
                            <TouchableOpacity>
                                <Text className='text-xl text-white'>Prev</Text></TouchableOpacity>
                            <TouchableOpacity>
                                <Text className='text-xl text-white'>Next</Text></TouchableOpacity>
                        </View> */}
                    </View>

                    {/* <ScrollView className='gap-y-4'>
                <HorizontalCard
                    className='w-full min-h-[140px]'
                    style={{
                        backgroundColor: hexToRGBA(colors.background.default, 0.5),
                        padding: 8
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
                    image={require('../assets/images/Image.png')} />

                <HorizontalCard
                    hasBorder
                    className='w-full min-h-[140px]'
                    style={{
                        backgroundColor: hexToRGBA(colors.background.default, 0.5),
                        padding: 8
                    }}
                    title={'Venom Let There Be Carnage'}
                    stats={[
                        {
                            content: 'Released: 25/09/2024',
                            icon: <CalendarIcon
                                color={colors.text.default}
                                size={24} />
                        },
                        {
                            content: '1h 47m',
                            icon: <ClockIcon
                                color={colors.text.default}
                                size={24} />
                        },
                        {
                            content: '6.4/10 IMDb',
                            icon: <StarIcon
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
                    image={require('../assets/images/image-2.png')} />

            </ScrollView> */}
                    <>
                        {/* <View className='w-full h-[250px]'>
                    <ScrollView horizontal className='w-full'>
                        <VerticalCard title={'Spiderman: No Way HomeSpiderman: No Way HomeSpiderman: No Way Home'}
                            subtitle='9.5/10 IMDb'
                            imageSoure={require('../assets/images/image-2.png')} />
                        <VerticalCard title={'Eternals'}
                            subtitle='9.5/10 IMDb'
                            imageSoure={require('../assets/images/image-2.png')} />
                    </ScrollView>
                </View> */}

                        {/* button */}
                        {/* <View className='flex-1 gap-2 items-center px-5'>

                    <SmallButton title='See more'
                        onPress={() => { console.log('clicked') }} />
                    <CustomButton
                        title='Watcasdasdash Trailer'
                        icon={<PlayIcon size={24} color={colors.text.light} />} />

                    <CustomButton
                        title='Watcasdasdash Trailer'
                        onPress={() => console.log("clicked")} />
                    <CustomButton
                        disabled
                        title='Watcasdasdash Trailer'
                        onPress={() => console.log("clicked")} />
                    <CustomButton
                        hasBorder={false}
                        disabled
                        title='Watcasdasdash Trailer'
                        onPress={() => console.log("clicked")} />
                    <CustomButton
                        hasBorder={false}
                        title='Watcasdasdash Trailer'
                        onPress={() => console.log("clicked")} />
                    <CustomButton
                        disabled
                        icon={<HomeIcon size={24} color={colors.text.light} />} />
                </View> */}

                        {/* <CustomCarousel
                    width={'100%'}
                    height={CAROUSEL_ITEM_SIZE.height}
                    data={[1, 2, 3, 4, 5, 6]} />

                <ScrollListSection
                    width={'100%'}
                    data={[1, 2, 3, 4, 5, 6]}
                    padding={24} /> */}
                    </>

                </MainWrapper>
            </BottomSheetModalProvider>
        </GestureHandlerRootView >

    )
}

export default RootLayout