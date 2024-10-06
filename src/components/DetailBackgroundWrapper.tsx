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

    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const { loading } = useSelector((state: RootState) => state.public)

    const renderChildren = () => {
        return loading !== true ?
            children
            :
            <ActivityIndicator className='mt-20' size={40} color={colors.icon.highlight} />
    }

    return (
        <View className='flex-1' style={{
            backgroundColor: colors.background.default,
        }}>
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
                        {renderChildren()}
                    </SafeAreaView>
                </LinearGradient>
            </ImageBackground>
        </View>
    )
}

export default DetailBackgroundWrapper