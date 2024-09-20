import { CREDIT_CARD_SIZE, PADDING_VALUE } from '@/constants/Size'
import { useCustomTheme } from '@/src/contexts/theme'
import React from 'react'
import { Animated, Dimensions, View } from 'react-native'
import CreditCard from '../card/CreditCard'
import { FlatList } from 'react-native-gesture-handler'

interface Props {
    width?: number,
    height?: number,
}

const ScrollCard = ({ width, height }: Props) => {
    const { width: screenWidth } = Dimensions.get('window')

    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const scrollX = React.useRef(new Animated.Value(0)).current

    const renderItem = (item: any, index: number) => {
        const inputRange = [
            (index - 1) * CREDIT_CARD_SIZE.default.width,
            index * CREDIT_CARD_SIZE.default.width,
            (index + 1) * CREDIT_CARD_SIZE.default.width,
        ]

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.5]
        })

        // if (typeof item === 'boolean')
        //     return (
        //         <Animated.View
        //             style={{ transform: [{ scale }] }}>
        //             <TouchableOpacity
        //                 className='border rounded-4 ml-2'
        //                 style={{
        //                     borderColor: colors.border.default,
        //                     width: CREDIT_CARD_SIZE.default.width / 2,
        //                     height: CREDIT_CARD_SIZE.default.height
        //                 }}>

        //             </TouchableOpacity>
        //         </Animated.View>
        //     )

        return (
            <Animated.View
                className={'overflow-hidden'}
                style={{
                    transform: [{ scale }],
                    opacity: scale.interpolate({
                        inputRange: [0.5, 0.9, 1],
                        outputRange: [0.5, 0.5, 1]
                    })
                }}>
                <CreditCard
                    width={CREDIT_CARD_SIZE.default.width}
                    height={CREDIT_CARD_SIZE.default.height}
                    name='Dao Huu QUan'
                    lastFourDigits='1905'
                    expired='12/39'
                    src={require('../../assets/images/vcb2.png')}
                    isActived={false}
                />
            </Animated.View>
        )
    }

    // useEffect(() => {
    //     console.log(scrollY)
    // }, [scrollY])


    return (
        <View className='w-full h-full '
            style={{
                width: width,
                height: height
            }}>
            {/* <CreditCard
                width={250}
                height={150}
                name='Dao Huu QUan'
                lastFourDigits='1905'
                expired='12/39'
                src={require('../../assets/images/vcb2.png')}
                isActived={false}
            /> */}
            <FlatList
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                decelerationRate={0}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: PADDING_VALUE.md,
                }}
                snapToInterval={CREDIT_CARD_SIZE.default.width}
                horizontal
                bounces={false}
                data={[1, 2, false]}
                renderItem={({ item, index }) =>
                    renderItem(item, index)}
                keyExtractor={(index) => index.toString()} />
        </View>
    )
}

export default ScrollCard