import BottomSheet from '@gorhom/bottom-sheet'
import React, { ReactNode, useRef } from 'react'
import { ActivityIndicator, Text, View, ViewStyle } from 'react-native'
import { Image } from 'expo-image'
import { useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCustomTheme } from '../contexts/theme'
import MainBackgroundImageView from './MainBackgroundImage'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

export interface WrapperProps {
    HeaderComponent?: ReactNode
    children: ReactNode,
    style?: ViewStyle,
    BottomSheetComponent?: ReactNode,
    loadingLayer?: boolean,
    color?: string
}

const AdminWrapper = ({
    HeaderComponent: headerComponent,
    children,
    style,
    BottomSheetComponent,
    loadingLayer = true,
    color
}: WrapperProps) => {

    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const { loading } = useSelector((state: RootState) => state.public)

    const renderChildren = () => {
        if (!loadingLayer) return children
        return (loading !== true ?
            children
            :
            <ActivityIndicator className='mt-20' size={40} color={colors.icon.highlight} />)
    }

    return (
        <MainBackgroundImageView>
            <SafeAreaView className='flex-1 z-20'
                style={{
                    backgroundColor: color
                }}>
                {BottomSheetComponent}
                {headerComponent
                    && <View className='w-full'>
                        {headerComponent}
                    </View>}
                <View className='flex-1' style={style}>
                    {renderChildren()}
                </View>
            </SafeAreaView>
            <View className='w-[200px] h-[200px] absolute self-center top-40 opacity-30'>
                <Image
                    source={require('@/assets/images/logo-maintain.png')}
                    style={{
                        width: '100%',
                        height: '100%'
                    }} />
            </View>
        </MainBackgroundImageView>
    )
}

export default AdminWrapper