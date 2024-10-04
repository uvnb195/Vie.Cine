import { hexToRGBA } from '@/hooks/hexToRGBA'
import BottomSheet from '@gorhom/bottom-sheet'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useRef } from 'react'
import { ActivityIndicator, Dimensions, ImageBackground, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { useCustomTheme } from '../contexts/theme'
import { RootState } from '../redux/store'
import MainWrapper, { WrapperProps } from './MainWrapper'

interface Props extends WrapperProps {
    sourceUri?: string
}

const DetailBackgroundWrapper = ({ HeaderComponent, children, style, BottomSheetComponent, sourceUri }: Props) => {
    const { height: screenHeight } = Dimensions.get('screen')
    const index = useSharedValue(0)

    const bottomSheetRef = useRef<BottomSheet>(null)

    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const { loading } = useSelector((state: RootState) => state.public)

    return (
        <View className='flex-1' style={{
            backgroundColor: colors.background.default,
        }}>
            {loading === true
                ?
                <MainWrapper>
                    <View className='flex-1 items-center pt-40'>
                        <ActivityIndicator size={40} color={colors.icon.highlight} />
                    </View>
                </MainWrapper>
                :
                <ImageBackground
                    source={{ uri: sourceUri }}
                    resizeMethod='scale'
                    resizeMode='cover'
                    style={{
                        flex: 1
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
                            flex: 1,
                        }}
                    >
                        <SafeAreaView className='flex-1' style={style}>
                            {BottomSheetComponent}
                            {HeaderComponent
                                && <View className='w-full'>
                                    {HeaderComponent}
                                </View>}
                            {children}
                        </SafeAreaView>
                    </LinearGradient>
                </ImageBackground>
            }
        </View>
    )
}

export default DetailBackgroundWrapper