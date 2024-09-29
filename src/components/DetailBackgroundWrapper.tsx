import { View, Text, ImageBackground, Dimensions } from 'react-native'
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

const DetailBackgroundWrapper = ({ HeaderComponent, children, style, BottomSheetComponent, sourceUri }: Props) => {
    const { height: screenHeight } = Dimensions.get('screen')
    const index = useSharedValue(0)

    const bottomSheetRef = useRef<BottomSheet>(null)

    const themeValue = useCustomTheme()
    const { colors } = themeValue

    return (
        <ImageBackground
            source={{ uri: sourceUri || 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/WiAEiqelck0NGWplhL5JQR12eg.jpg' }}
            resizeMethod='scale'
            resizeMode='cover'
            style={{
                width: '100%',
                height: screenHeight
            }}
            blurRadius={2}>
            <LinearGradient
                colors={[
                    colors.background.default,
                    hexToRGBA(colors.background.default, 0.5),
                    colors.background.default,
                ]}
                locations={[0, 0.25, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                    width: '100%',
                    height: screenHeight,
                }}
            >
                <SafeAreaView className='flex-1' style={style}>
                    {BottomSheetComponent}
                    {HeaderComponent
                        && <View className='w-full h-14'>
                            {HeaderComponent}
                        </View>}
                    {children}
                </SafeAreaView>
            </LinearGradient>
        </ImageBackground>
    )
}

export default DetailBackgroundWrapper