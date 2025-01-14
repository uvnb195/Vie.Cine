import { View, Text } from 'react-native'
import React from 'react'
import PageWrapper from '@/src/components/pages/PageWrapper'
import Animated from 'react-native-reanimated'
import CinemaMapView from '@/src/components/scroll/CinemaMapView'
import { DROPDOWN_MENU_HEIGHT } from '@/constants/Values'
import { useAdminTheatre } from '@/src/contexts/theatre'
import { ScrollView } from 'react-native-gesture-handler'
import BottomSection from '@/src/components/bottom-sheet/BottomSection'
import { router } from 'expo-router'
import ThemeText from '@/src/components/theme/ThemeText'
import TagLine from '@/src/components/card/TagLine'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/src/redux/store'
import { addTheatre } from '@/src/redux/adminAsyncActions'
import { auth } from '@/src/api/firebase/config'

const Confirm = () => {
    const { data, handleData } = useAdminTheatre()
    const address = (data.location.street || '') + ', ' + (data.location.district?.name || '') + ', ' + (data.location.province?.name || '')

    const dispatch = useDispatch<AppDispatch>()

    const handleFinish = async () => {
        console.log(data.location)
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('location', JSON.stringify(data.location))
        formData.append('totalSeats', data.totalSeats.toString())
        // formData.append('map2d', JSON.stringify(data.map2d.maps))

        await auth.currentUser?.getIdToken().then(token => {
            dispatch(addTheatre({ token, data: formData }))
        })

        router.dismissAll()
    }
    return (
        <PageWrapper
            title='Buy ticket'
            subTitle='Step 2: Select a movie and a cinema'
        >
            <View className='w-full h-full'>
                <Animated.View
                    style={{
                        height: DROPDOWN_MENU_HEIGHT
                    }}>
                    {/* <CinemaMapView data={data.map2d.maps || []} /> */}
                </Animated.View>
                <ScrollView className='px-4'>
                    <TagLine
                        title={'Name'}
                        value={data.name} />
                    <TagLine
                        title={'Address'}
                        value={address} />
                    <TagLine
                        title={'Coords:'}
                        value={`Lat: ${data.location.lat} \n Lng: ${data.location.lng}`} />
                </ScrollView>
                <View className='px-6'>
                    <BottomSection
                        disabled={
                            // seatTypeMap.SWEET_BOX.to.length === 0 ||
                            // seatTypeMap.SWEET_BOX.from.length === 0 ||
                            // seatTypeMap.VIP.to.length === 0 ||
                            // seatTypeMap.VIP.from.length === 0 ||
                            // seatTypeMap.STANDARD.to.length === 0 ||
                            // seatTypeMap.STANDARD.from.length === 0
                            false
                        }
                        handleCancel={() => {
                            // handleData('map2d', {
                            //     ...data.map2d,
                            //     maps: null
                            // })
                            router.dismissAll()
                        }}
                        handleNext={handleFinish}
                        currentIndex={3}
                        totalPage={4} />
                </View>
            </View>
        </PageWrapper>
    )
}

export default Confirm