import BottomSheet from '@gorhom/bottom-sheet'
import React, { ReactNode, useRef } from 'react'
import { ActivityIndicator, Text, View, ViewStyle } from 'react-native'
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
    loadingLayer?: boolean
}

const MainWrapper = ({
    HeaderComponent: headerComponent,
    children,
    style,
    BottomSheetComponent,
    loadingLayer = true
}: WrapperProps) => {

    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const { loading } = useSelector((state: RootState) => state.public)

    const renderChildren = () => {
        if (!loadingLayer) return children
        return loading !== true ?
            children
            :
            <ActivityIndicator className='mt-20' size={40} color={colors.icon.highlight} />
    }


    // const renderBackdrop = (backdropProps) => (
    //     <BottomSheetBackdrop
    //         enableTouchThrough={true}
    //         pressBehavior='collapse'
    //         style={{ backgroundColor: colors.background.bottomSheet }} />
    // )

    return (
        <MainBackgroundImageView>
            <SafeAreaView className='flex-1' style={style}>
                {BottomSheetComponent}
                {headerComponent
                    && <View className='w-full'>
                        {headerComponent}
                    </View>}
                <View className='flex-1 mb-[20px]'>
                    {renderChildren()}
                </View>
            </SafeAreaView>
        </MainBackgroundImageView>
    )
}

export default MainWrapper