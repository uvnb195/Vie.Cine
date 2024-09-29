import { useCustomTheme } from '@/src/contexts/theme'
import React, { memo } from 'react'
import { View, ViewStyle, ViewToken } from 'react-native'
import { MapPinIcon } from 'react-native-heroicons/solid'
import Animated, { SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import ThemeText from '../theme/ThemeText'
interface Props {
    style?: ViewStyle
    selected?: boolean
    id: string,
    viewableItems: SharedValue<ViewToken[]>
}

const ScheduleCard = ({ style, selected, id, viewableItems }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const animation = useAnimatedStyle(() => {
        const isVisible = Boolean(viewableItems.value.filter((item) => item.isViewable).find((viewable) => viewable.item == id))

        return ({
            opacity: withTiming(isVisible ? 1 : 0, { duration: 300 }),
            transform: [

                { translateX: withTiming(isVisible ? 0 : 200, { duration: 500 }) }
            ],
            transformOrigin: 'top right'
        })
        // isVisible ? withTiming(1, { duration: 300 }) : withTiming(0, { duration: 300 })
    })

    return (
        <Animated.View
            className='border-t flex-row items-center mx-2 py-2' style={[
                {
                    borderColor: colors.textHighLight.background
                },
                animation,
                style]}>
            {/* time */}
            <View className='mx-2 px-2 py-1 items-center rounded-4 self-center' style={{
                backgroundColor: colors.icon.highlight
            }}>
                <ThemeText fontWeight='bold' letterSpacing={-0.5}>12 : 30</ThemeText>

            </View>
            {/* info */}
            <View className='px-2 flex-1 h-full'>
                <ThemeText fontWeight='bold'>Hope Thearter</ThemeText>
                <ThemeText fontSize={12}>72376 Francis Mountains, South Altaside, AK 13277</ThemeText>
            </View>

            {/* icon pin */}
            <View className='w-6 h-6 self-end'>
                <MapPinIcon color={selected
                    ? colors.icon.highlight
                    : colors.icon.enable} />
            </View>
        </Animated.View>
    )
}

export default memo(ScheduleCard)