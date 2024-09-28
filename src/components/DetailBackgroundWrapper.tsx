import { View, Text, ImageBackground } from 'react-native'
import React, { useRef } from 'react'
import { WrapperProps } from './MainWrapper'
import BottomSheet from '@gorhom/bottom-sheet'
import { useCustomTheme } from '../contexts/theme'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MainBackgroundImageView from './MainBackgroundImage'
import { useSharedValue } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props extends WrapperProps {
    sourceUri?: string
}

const DetailBackgroundWrapper = ({ headerComponent, children, style, bottomSheetComponent, sourceUri }: Props) => {
    const index = useSharedValue(0)

    const bottomSheetRef = useRef<BottomSheet>(null)

    const themeValue = useCustomTheme()
    const { colors } = themeValue

    // const renderBackdrop = (backdropProps) => (
    //     <BottomSheetBackdrop
    //         enableTouchThrough={true}
    //         pressBehavior='collapse'
    //         style={{ backgroundColor: colors.background.bottomSheet }} />
    // )

    return (
        <GestureHandlerRootView>
            <ImageBackground
                source={{ uri: sourceUri || 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/WiAEiqelck0NGWplhL5JQR12eg.jpg' }}
                resizeMethod='scale'
                resizeMode='cover'
                className='flex-1'
                blurRadius={2}>
                <LinearGradient
                    colors={[
                        hexToRGBA(colors.background.default, 0.8),
                        hexToRGBA(colors.background.default, 0.2),
                        colors.background.default,
                    ]}
                    locations={[0, 0.25, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    className='flex-1'
                >
                    <SafeAreaView className='flex-1' style={style}>
                        {bottomSheetComponent}
                        {headerComponent
                            && <View className='w-full h-14'>
                                {headerComponent}
                            </View>}
                        {children}
                    </SafeAreaView>
                </LinearGradient>
            </ImageBackground>
        </GestureHandlerRootView>
    )
}

export default DetailBackgroundWrapper