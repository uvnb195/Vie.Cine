import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import PageWrapper from '../PageWrapper'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import ThemeText from '../../theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/src/redux/store'
import ServiceCard from '../../card/ServiceCard'
import { LinearGradient } from 'expo-linear-gradient'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { updateServices } from '@/src/redux/paymentSlice'

const Step3 = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const { address, totalAmount, services: selected } = useSelector((state: RootState) => state.payment)
    const dispatch = useDispatch()

    // const [services, setServices] = React.useState([])
    const services = [
        {
            id: 'Combo 1',
            title: 'CGV COMBO 1',
            desc: `01 Baby Shark 2024 Cup (includes soft drink)\n- Add 29,000 VND to get a large sweet popcorn\n- Character cup design may vary at certain cinemas\n- Pick up on the day of your movie (when purchased with a ticket) or on the selected day (when purchased at the CGV Store)`,
            cost: 100,
            imageUri: 'https://iguov8nhvyobj.vcdn.cloud/media/concession/web/651711ff95995_1696010752.png',
            remaining: 10,
        },
        {
            id: 'Combo 2',
            title: 'CGV COMBO 2',
            desc: `1 Large Popcorn + 2 Jumbo Drinks. Redeem on showing date.
* Free upgrade flavor for Caramel *
**Surcharge when upgrade Cheese popcorn**`,
            cost: 200,
            imageUri: 'https://iguov8nhvyobj.vcdn.cloud/media/concession/web/6465deb2716d7_1684397746.png',
            remaining: 10,
        },
        {
            id: 'Combo 3',
            title: 'CGV COMBO 3',
            desc: `01 Baby Shark 2024 Cup (includes soft drink)
            - Add 29,000 VND to get a large sweet popcorn 
            - Character cup design may vary at certain cinemas
            - Pick up on the day of your movie (when purchased with a ticket) or on the selected day (when purchased at the CGV Store)`,
            cost: 100,
            imageUri: 'https://www.cgv.vn/media/wysiwyg/2021/Combo/Combo_BabyShark_2024_01.jpg',
            remaining: 10,
        },
        {
            id: 'Combo 4',
            title: 'CGV COMBO 4',
            desc: `1 Large Popcorn + 2 Jumbo Drinks. Redeem on showing date.
* Free upgrade flavor for Caramel *
**Surcharge when upgrade Cheese popcorn**`,
            cost: 200,
            imageUri: 'https://iguov8nhvyobj.vcdn.cloud/media/concession/web/6465deb2716d7_1684397746.png',
            remaining: 10,
        },
    ]


    const renderItem = (item: {
        id: string;
        title: string;
        desc: string;
        cost: number;
        imageUri: string;
        remaining: number;
    }) => {
        return (
            <ServiceCard
                style={{
                    // backgroundColor: colors.background.default,
                    padding: 8,
                    width: '100%',
                    backgroundColor: hexToRGBA(colors.background.default, 0.7),
                }}
                data={item}
                onIncrease={(value) => {
                    console.log('onIncrease', value)
                    dispatch(updateServices({ ...item, quantity: value }))
                }}
                onDecrease={(value) => {
                    console.log('onDecrease', value)
                    dispatch(updateServices({ ...item, quantity: value }))
                }}
            />
        )
    }
    return (
        <PageWrapper
            title='Buy ticket'
            subTitle='Step 3: Choose Combo!!'>
            {/* <ThemeText
                otherProps={{
                    paddingBottom: 16,
                    paddingLeft: 24,
                    paddingTop: 8
                }}
                color={colors.text.default}
                fontSize={12}
                letterSpacing={0.5}
                fontWeight='bold'
            >*Important: Choosing the Combo requires payment.</ThemeText> */}
            <FlatList
                contentContainerStyle={{
                    paddingHorizontal: 8,
                    rowGap: 16,
                }}
                data={services}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(_, index) => index.toString()} />
            <LinearGradient
                locations={[0.3, 0.8]}
                start={{ x: -1, y: 0 }}
                end={{ x: 1, y: 0.7 }}
                className=' w-[200px] absolute bottom-0 left-0 items-center justify-start'
                colors={[colors.background.default, 'transparent']}
            >
                <ThemeText
                    letterSpacing={0.5}
                    numsOfLines={1}
                    otherProps={{
                        paddingHorizontal: 8
                    }}>Estimated amount:
                </ThemeText>
                <ThemeText
                    fontWeight='bold'
                    letterSpacing={2}
                >{totalAmount} VNĐ</ThemeText>
            </LinearGradient>
        </PageWrapper>
    )
}

export default Step3