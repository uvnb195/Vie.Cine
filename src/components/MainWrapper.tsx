import BottomSheet from '@gorhom/bottom-sheet'
import React, { ReactNode, useRef } from 'react'
import { Text, View, ViewStyle } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCustomTheme } from '../contexts/theme'
import MainBackgroundImageView from './MainBackgroundImage'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export interface WrapperProps {
    HeaderComponent?: ReactNode
    children: ReactNode,
    style?: ViewStyle,
    BottomSheetComponent?: ReactNode
}

const MainWrapper = ({ HeaderComponent: headerComponent, children, style, BottomSheetComponent: bottomSheetComponent }: WrapperProps) => {
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
        <MainBackgroundImageView>
            <SafeAreaView className='flex-1' style={style}>
                {bottomSheetComponent}
                {headerComponent
                    && <View className='w-full'>
                        {headerComponent}
                    </View>}
                <View className='flex-1'>
                    {children}
                </View>
            </SafeAreaView>
        </MainBackgroundImageView>
    )
}

export default MainWrapper