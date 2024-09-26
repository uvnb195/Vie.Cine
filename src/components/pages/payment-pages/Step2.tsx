import { useCustomTheme } from '@/src/contexts/theme'
import { RootState } from '@/src/redux/store'
import React from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import TextHighLight from '../../card/TextHighLight'
import ThemeText from '../../theme/ThemeText'
import PageWrapper from '../PageWrapper'
import CinemaMapView from '../../scroll/CinemaMapView'

const NoteTag = ({
    color,
    text,
    borderColor }: {
        color?: string,
        text: string,
        borderColor?: string
    }) => {
    const themeValue = useCustomTheme()
    const unavailableIconColor = themeValue.colors.text.light

    return (
        <View className='flex-row items-center'>
            <View
                className='w-10 h-6 items-center justify-center rounded-1 border-2'
                style={{
                    backgroundColor: color || 'transparent',
                    borderColor: borderColor || 'transparent'
                }}>
                {text === 'UNAVAILABLE' &&
                    <ThemeText
                        color={unavailableIconColor}
                        fontSize={16}
                        fontWeight='bold'
                    >X</ThemeText>}
            </View>
            <ThemeText otherProps={{ paddingLeft: 4 }} fontWeight='light' fontSize={12}>{text}</ThemeText>
        </View>
    )
}

const Step2 = () => {
    const { seats: selected, totalAmount } = useSelector((state: RootState) => state.payment)
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const renderSelected = () => {
        if (selected.length == 0) return null
        return selected.map((item, index) =>
            <TextHighLight key={index}
                marginX={4}>
                {item.seatCode}
            </TextHighLight>
        )
    }

    return (
        <PageWrapper
            title='Buy ticket'
            subTitle='Step 2: Choose you Seats'
        >
            <ScrollView
                bounces={false}
                className='w-full'
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <View className='flex-1 w-full z-50 items-center justify-start' key={0}>
                    <CinemaMapView />
                </View>

                {/* note section */}
                <View className='flex-1 w-full items-center flex-row justify-evenly flex-wrap px-2 py-1' key={1}>
                    <NoteTag
                        color={colors.zoomView.seats.standard}
                        text='STANDARD' />
                    <NoteTag
                        color={colors.zoomView.seats.vip}
                        text='VIP' />
                    <NoteTag
                        color={colors.zoomView.seats['sweet-box']}
                        text='SWEET-BOX' />
                </View>
                <View className='flex-1 w-full items-center flex-row justify-evenly flex-wrap px-2 py-1'
                    key={2}>
                    <NoteTag
                        text='SELECTED'
                        borderColor={colors.text.default} />
                    <NoteTag
                        color={colors.zoomView.seats.unavailable}
                        text='UNAVAILABLE' />
                </View>

                {/* selected */}
                <View className='w-full items-start justify-center'>
                    <ThemeText
                        otherProps={{
                            paddingBottom: 16,
                            paddingLeft: 8,
                            paddingTop: 8
                        }}
                        color={colors.text.light}
                        fontSize={12}
                        fontWeight='light'
                    >*Note: You can select more than 1</ThemeText>
                    <ThemeText
                        otherProps={{
                            paddingBottom: 16,
                            paddingLeft: 8,
                            paddingTop: 8
                        }}
                        fontSize={16}
                        letterSpacing={2}
                        numsOfLines={1} fontWeight='bold'>{`Selected (${selected.length})`}</ThemeText>
                    <View className='w-full h-10'>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            className='w-full'>
                            <View className='flex-row items-start justify-start px-2'>
                                {renderSelected()}
                            </View>
                        </ScrollView>
                    </View>

                    {/* estimated  amount */}
                    <View className='w-full items-end'>
                        <ThemeText
                            letterSpacing={0.5}
                            numsOfLines={1}
                            otherProps={{
                                paddingHorizontal: 8
                            }}>Estimated amount:{' '}
                            <ThemeText
                                fontWeight='bold'
                                letterSpacing={2}
                            >{totalAmount} VNĐ</ThemeText>
                        </ThemeText>
                    </View>
                </View>
            </ScrollView>
        </PageWrapper>
    )
}

export default Step2