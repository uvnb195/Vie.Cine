import { View, Text } from 'react-native'
import React from 'react'
import PageWrapper from '../PageWrapper'
import TextHighLight from '../../card/TextHighLight'
import { useSelector } from 'react-redux'
import { RootState } from '@/src/redux/store'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { SeatProps } from '@/src/redux/paymentSlice'
import ThemeText from '../../theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import ServiceCard from '../../card/ServiceCard'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { getService } from '@/src/api'
import CreditCard from '../../card/CreditCard'
import ScrollCard from '../../scroll/ScrollCard'

const Step4 = () => {
    const { seats, time, totalAmount, address, services } = useSelector((state: RootState) => state.payment)

    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const renderServiceItem = (item: {
        id: string;
        cost: number;
        quantity: number;
    }) => {
        return (
            <View className='w-[250px]'>
                <ServiceCard
                    descLines={3}
                    editabled={false}
                    quantity={item.quantity}
                    style={{
                        // backgroundColor: colors.background.default,
                        padding: 8,
                        width: '100%',
                        backgroundColor: hexToRGBA(colors.background.default, 0.7),
                    }}
                    data={getService(item.id)!}
                    onIncrease={(value) => {
                        console.log('onIncrease', value)
                    }}
                    onDecrease={(value) => {
                        console.log('onDecrease', value)
                    }}
                />
            </View>
        )
    }

    const renderSeatItem = (item: SeatProps, index: number) => {
        return (
            <TextHighLight
                marginX={4}
                key={index}
            >
                {item.seatCode}
            </TextHighLight>
        )
    }
    return (
        <PageWrapper
            title='Buy Ticket'
            subTitle='Step 3 : Confirm & Choose Payment Method'>

            {/* seats selected */}
            <View className='w-full h-6 flex-row mt-6'>
                <FlatList
                    contentContainerStyle={{
                        marginHorizontal: 16
                    }}
                    horizontal
                    data={seats}
                    renderItem={({ item, index }) => renderSeatItem(item, index)} />
            </View>

            {/* time */}
            <View className='w-full h-6 px-4 mt-2 justify-center'>

                <ThemeText fontWeight='light' >Time:{' '}
                    <ThemeText fontWeight='bold'>{time}</ThemeText>
                </ThemeText>
            </View>

            {/* total amout */}
            <View className='w-full h-6 px-4 mt-2 justify-center'>
                <ThemeText fontWeight='light' >Total:{' '}
                    <ThemeText fontWeight='bold'>{totalAmount} VNĐ</ThemeText>
                </ThemeText>
            </View>

            {/* theater address */}
            <View className='w-full px-4 mt-2 justify-center'>
                {/* name */}
                <ThemeText fontWeight='bold'>{address?.theaterId + ","}</ThemeText>
                {/* address */}
                <ThemeText fontWeight='light'  >
                    {`${(address?.street.length == 0
                        ? ""
                        : address?.street + ",") || ""} ${(address?.district.length == 0
                            ? ""
                            : address?.district + ",") || ""} ${address?.city}`}
                </ThemeText>
            </View>
            <View className=' w-full px-4 my-6 justify-center'>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        rowGap: 16,
                        columnGap: 16
                    }}
                    bounces={false}
                    data={services}
                    renderItem={({ item }) => renderServiceItem(item)}
                    keyExtractor={(_, index) => index.toString()} />
            </View>
            <View className='w-full'>
                <ScrollCard />
            </View>
        </PageWrapper>
    )
}

export default Step4