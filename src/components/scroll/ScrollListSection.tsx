import { View, Text, DimensionValue, FlatList, Dimensions, Animated } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import ThemeText from '../theme/ThemeText'
import SmallButton from '../button/SmallButton'
import VerticalCard from '../card/VerticalCard'
import { CAROUSEL_ITEM_SIZE, HORIZONTALCARD_SIZE } from '@/constants/Size'
import { CakeIcon, MapPinIcon, UserIcon } from 'react-native-heroicons/solid'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import HorizontalCard from '../card/HorizontalCard'
import { useCustomTheme } from '@/src/contexts/theme'

export interface ScrollListSectionRef {
    expand: () => void,
    collapse: () => void
}

interface Props {
    title?: string,
    width: DimensionValue,
    height?: DimensionValue,
    optionalButton?: boolean,
    data: any[],
    padding?: number,
    itemFloatSpacing?: number
}

const ScrollListSection = forwardRef<ScrollListSectionRef, Props>(({
    title,
    optionalButton,
    width,
    height = 400,
    data,
    itemFloatSpacing = 16,
    padding },
    ref) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const {
        width: windowWidth,
        height: windowHeight } = Dimensions.get('window')

    const [listViewable, setListViewable] = useState([true, ...Array(data.length - 1).fill(false)])
    const [currenIndex, setCurrentIndex] = useState(0)

    const updateViewableItems = (index: number, value: boolean) => {
        let newState = listViewable.slice()
        newState[index] = value
        setListViewable(newState)
    }

    const scrollX = useRef(new Animated.Value(0))

    useImperativeHandle(ref, () => ({
        expand: () => {
            console.log('focus')
        },
        collapse: () => {
            console.log('collapse')
        }
    }))

    useEffect(() => {

        console.log(listViewable)

    }, [listViewable])

    const renderItem = (item: any, index: number) => {
        if (typeof item === 'boolean') return <View style={{ height: HORIZONTALCARD_SIZE.height }} />

        return (
            <Animated.View
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
            </Animated.View >
        )
    }

    return (
        <View style={{
            padding: padding || 0
        }} className='flex-1'>
            {/* title */}
            {title &&
                <View className='mt-4 px-2 items-center justify-between flex-row'>
                    <ThemeText fontSize={16} fontWeight='bold' letterSpacing={3}>{title}</ThemeText>
                    <SmallButton title='See more'
                        onPress={() => { }} />
                </View>}

            <Animated.FlatList
                showsVerticalScrollIndicator={false}
                indicatorStyle={'white'}
                snapToInterval={HORIZONTALCARD_SIZE.height}
                decelerationRate={0}
                bounces={true}
                onScroll={Animated.event(
                    [{
                        nativeEvent: {
                            contentOffset: {
                                // y: scrollX
                            }
                        }
                    }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => renderItem(item, index)} />
        </View>
    )
})

export default ScrollListSection