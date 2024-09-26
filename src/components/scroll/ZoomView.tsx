import { hexToRGBA } from '@/hooks/hexToRGBA'
import { useCustomTheme } from '@/src/contexts/theme'
import React from 'react'
import { Dimensions, DimensionValue, Pressable, Text, View, ViewStyle } from 'react-native'
import { Gesture, GestureDetector, TouchableOpacity } from 'react-native-gesture-handler'
import { CheckIcon, MagnifyingGlassIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, XMarkIcon } from 'react-native-heroicons/outline'
import Animated, { Extrapolation, interpolate, interpolateColor, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import ThemeText from '../theme/ThemeText'

interface Props {
    width?: DimensionValue,
    height?: DimensionValue,
    children: React.ReactNode,
    style?: ViewStyle,
    onHide?: () => void,
    accepted?: boolean,

}

const ZoomView = ({
    width,
    height,
    children,
    style,
    onHide,
    accepted
}: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const { height: screenHeight, width: screenWidth }
        = Dimensions.get('window')

    const translateY = useSharedValue(0)
    const translateX = useSharedValue(0)
    const scale = useSharedValue(1)
    const [toggle, setToggle] = React.useState(false)

    // zoom
    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            if (!toggle) return
            if (event.scale <= 2 && event.scale >= 0.5) {
                scale.value = event.scale
            }
        })

    //doubletap to reset
    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            if (!toggle) return
            if (scale.value !== 1) {
                scale.value = withSpring(1)
            } else {
                scale.value = withSpring(1.5)
            }
            translateX.value = withSpring(0)
            translateY.value = withSpring(0)
        })

    // drag
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (!toggle) return
            translateX.value = event.translationX * scale.value
            translateY.value = event.translationY * scale.value
        })
        .onEnd((event) => {
            if (event.velocityY > 1000 || event.velocityX > 1000
            ) {
                scale.value = withSpring(1)
                translateX.value = withSpring(0)
                translateY.value = withSpring(0)
            }
        })


    const animationStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
            { scale: scale.value }
        ]
    }))

    const closeAnimation = useDerivedValue(() => {
        return toggle ? withSpring(1, { duration: 350 }) : withTiming(0.5)
    }, [toggle])

    const closeIconStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: closeAnimation.value }
        ]
    }))

    const doneScaleValue = useDerivedValue(() => {
        return accepted ? withSpring(1, { duration: 350 }) : withTiming(1.5)
    }, [accepted])

    const doneOpacity = interpolate(
        doneScaleValue.value,
        [1, 1.5], [1, 0],
        Extrapolation.CLAMP)

    const doneIconStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: doneScaleValue.value }
        ],
        opacity: doneOpacity
    }))

    const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture, doubleTapGesture)

    const handlePressIcon = () => {
        setToggle(!toggle)
        scale.value = toggle ? withSpring(1) : withSpring(2)
        translateY.value = withSpring(0)
        translateX.value = withSpring(0)
        if (toggle) onHide && onHide()
    }

    return (
        <Animated.View className='w-full h-full items-center'
            style={{
                overflow: toggle ? 'visible' : "hidden",
                maxHeight: screenHeight / 2
            }}>
            {/* icon */}
            {!toggle ?
                <Animated.View
                    style={
                        [{
                            borderColor: 'white',
                            // borderColor: colors.border.default,
                            backgroundColor: colors.blurBackground,
                        }
                        ]}
                    className='items-center justify-center border rounded-1 z-[100] absolute top-0 right-0 left-0 bottom-0'
                >
                    <TouchableOpacity
                        className='items-center justify-center w-full h-full'
                        onPress={() => handlePressIcon()} >
                        {toggle ?
                            <XMarkIcon
                                color={colors.zoomView.text}
                                size={40} />
                            : <MagnifyingGlassPlusIcon
                                color={colors.zoomView.text}
                                size={40}
                            />
                        }
                        <ThemeText
                            color={colors.zoomView.text}>Click to show</ThemeText>
                    </TouchableOpacity>
                </Animated.View>
                :
                <Animated.View
                    style={
                        [{
                            width: 40,
                            height: 40,
                            marginLeft: 5,
                            marginTop: 5,
                            borderColor: colors.border.default,
                            backgroundColor: colors.blurBackground,
                        },
                            closeIconStyle
                        ]}
                    className='items-center justify-center rounded-full absolute z-[100]'
                >
                    <TouchableOpacity
                        className='items-center justify-center'
                        onPress={() => handlePressIcon()}
                        style={{
                            alignSelf: 'flex-start'
                        }} >
                        {toggle ?
                            (accepted ? <CheckIcon
                                color={colors.zoomView.text}
                                size={24} />
                                : <XMarkIcon
                                    color={colors.zoomView.text}
                                    size={40} />
                            )
                            : <MagnifyingGlassPlusIcon
                                color={colors.zoomView.text}
                                size={40}
                            />
                        }
                    </TouchableOpacity>
                </Animated.View>}

            <Animated.View className='w-full h-full z-50'
                style={[{
                    height: height,
                    width: width
                },
                    animationStyle
                ]}>
                <GestureDetector
                    gesture={composedGesture} >
                    <View
                        style={[
                            {
                                width: screenWidth,
                                backgroundColor: colors.background.default
                            },
                            style
                        ]}>
                        {children}
                    </View>
                </GestureDetector >
            </Animated.View >
        </Animated.View >
    )
}

export default ZoomView