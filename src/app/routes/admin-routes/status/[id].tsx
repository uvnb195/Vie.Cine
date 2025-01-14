
import { View, Text, useAnimatedValue, Dimensions, Alert, BackHandler } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import LottieView from 'lottie-react-native'
import AdminTheatreProvider from '@/src/contexts/theatre'
import AdminWrapper from '@/src/components/AdminWrapper'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { useCustomTheme } from '@/src/contexts/theme'
import Header from '@/src/components/header'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import ThemeText from '@/src/components/theme/ThemeText'
import { router, useLocalSearchParams } from 'expo-router'
import CustomButton from '@/src/components/button/CustomButton'
import { useDispatch } from 'react-redux'
import { Status, updateStatus as updatePublicStatus } from '@/src/redux/publicSlice'
import { updateStatus as updateAdminStatus } from '@/src/redux/adminSlice'
import { AppDispatch } from '@/src/redux/store'

const FinishScreen = () => {
    const { id, message, nextTo } = useLocalSearchParams()
    const seconds = 20
    const { colors } = useCustomTheme()
    const SCREEN_WIDTH = Math.round(Dimensions.get('window').width)
    const animation = useRef<LottieView>(null)
    const currentWidth = useSharedValue(SCREEN_WIDTH)
    const timeAnimation = useAnimatedStyle(() => ({
        width: currentWidth.value,
    }))
    const [currentSeconds, setCurrentSeconds] = useState(0)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        const timer = setInterval(() => {
            if (currentWidth.value <= 0) {
                clearInterval(timer)
                return
            }
            setCurrentSeconds(prev => prev + 0.5)
            currentWidth.value = withTiming(currentWidth.value - (SCREEN_WIDTH / seconds / 2))
        }, 500)
        setTimeout(() => {
            animation.current?.play()
        }, 500);

        return () => clearInterval(timer)
    }, [])

    // useEffect(() => {
    //     const backAction = () => {
    //         // do nothing
    //         return true;
    //     };

    //     const backHandler = BackHandler.addEventListener(
    //         'hardwareBackPress',
    //         backAction,
    //     );

    //     return () => {
    //         backHandler.remove()
    //         dispatch(updatePublicStatus(Status.IDLE))
    //         dispatch(updateAdminStatus(Status.IDLE))
    //     }
    // }, []);



    useEffect(() => {
        if (currentSeconds === seconds) {
            router.back()
        }
    }, [currentSeconds])

    return (
        <AdminTheatreProvider>
            <AdminWrapper
                color={hexToRGBA(colors.background.default, 0.6)}
                loadingLayer={false}
                HeaderComponent={<Header
                    title={`/SUCCESS`}
                    backIconShown={false} />}>
                <Animated.View style={timeAnimation} className='w-full h-[2px] bg-red-500' />
                <View className='flex-grow items-center'>
                    <ThemeText
                        fontWeight='bold'
                        fontSize={36}
                        letterSpacing={4}
                        color={id == 'failed' ? colors.text.highlight : colors.text.dark}
                        otherProps={{
                            textAlign: 'center',
                            marginVertical: 40
                        }}
                    >{message}</ThemeText>
                    <LottieView
                        ref={animation}
                        loop={id == 'failed' ? true : false}
                        style={{
                            width: 120,
                            height: 120,
                        }}
                        source={id == 'failed' ? require('@/assets/images/lotties/fail.json') : require('@/assets/images/lotties/success.json')} />
                </View>
                <View className='justify-center items-center'>
                    <CustomButton
                        onPress={() => router.back()}
                        title='OK'
                        style={{
                            width: 80,
                            alignSelf: 'center',
                            marginVertical: 20,
                        }} />
                    {currentSeconds > 3 && <ThemeText
                        fontWeight='light'
                        fontSize={13}>
                        {`Redirecting in ${currentSeconds % 1 == 0 ? seconds - currentSeconds : seconds - Math.round(currentSeconds)} seconds`}
                    </ThemeText>}
                </View>
            </AdminWrapper>
        </AdminTheatreProvider>

    )
}

export default FinishScreen