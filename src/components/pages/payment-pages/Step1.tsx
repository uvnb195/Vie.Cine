import { getCurrentPositionAsync, requestForegroundPermissionsAsync, reverseGeocodeAsync } from 'expo-location'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useDispatch } from 'react-redux'
import DropdownMenu from '../../input/DropdownMenu'
import PageWrapper from '../PageWrapper'
import { updateAddress } from '@/src/redux/paymentSlice'

interface CinemaLocationType {
    city: string | null,
    district: string | null,
    theater: string | null,
    time: string | null
}

interface Props {
    onChange?: (date: CinemaLocationType) => void
}

const Step1 = () => {
    const scrollRef = React.useRef<ScrollView>(null)

    const dispatch = useDispatch()

    const [data, setData] = React.useState<CinemaLocationType>({
        city: '',
        district: '',
        theater: '',
        time: '',
    })

    const handleUpdateCity = (city: string) => {
        setData({ ...data, city: city })
    }
    const handleUpdateDistrict = (district: string) => {
        setData({ ...data, district: district })
    }

    const handleUpdateTheater = (theater: string) => {
        setData({ ...data, theater: theater })
    }

    const handleUpdateTime = (time: string) => {
        setData({ ...data, time: time })
    }

    const isBlank = () => {
        if (data.city === null || data.district === null || data.theater === null || data.time === null) return true
        return data.city === '' || data.district === '' || data.theater === '' || data.time === ''
    }

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
                await reverseGeocodeAsync(location.coords).then(
                    (value) => {
                        setData({
                            ...data,
                            city: value[0].city || value[0].region,
                            district: value[0].district || value[0].subregion
                        })
                    }
                )
            }
        }
        )()
    }, [])

    useEffect(() => {
        console.log(data)
        if (!isBlank()) {
            const cost = {
                standard: 100,
                vip: 200,
                sweetBox: 300,
            }

            dispatch(updateAddress({
                city: data.city!!,
                district: data.district!!,
                street: '',
                theaterId: data.theater!!,
                cost: cost,
                time: data.time!!
            }))
        }
    }, [data])


    return (
        <PageWrapper
            title='Buy ticket'
            subTitle='Step 1: Select a movie and a cinema'
        >
            <ScrollView
                bounces={false}
                ref={scrollRef}
                className='w-full'
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <View className='flex-1 w-full z-50 items-center justify-start'>
                    <DropdownMenu
                        data={['Le Thuy', 'Quang Binh']}
                        placeHolder={data.city || 'City/Region'}
                        onSelected={handleUpdateCity} />
                    <DropdownMenu
                        data={['Le Thuy', 'Quang Binh', 'District/Subregion']}
                        placeHolder={data.district || 'District/Subregion'}
                        onSelected={handleUpdateDistrict} />
                    <DropdownMenu
                        data={['Le Thuy Theater', 'Hope Theater']}
                        placeHolder='Choose Theater'
                        onSelected={handleUpdateTheater} />
                    <DropdownMenu
                        data={['17 : 00', '21 : 00']}
                        placeHolder='Choose Time'
                        onSelected={handleUpdateTime} />
                </View>
            </ScrollView>
        </PageWrapper>
    )
}

export default Step1