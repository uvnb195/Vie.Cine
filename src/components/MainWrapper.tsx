import BottomSheet from '@gorhom/bottom-sheet'
import React, { ReactNode, useRef } from 'react'
import { View, ViewStyle } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCustomTheme } from '../contexts/theme'
import MainBackgroundImage from './MainBackgroundImage'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

interface Props {
    headerComponent?: ReactNode
    children: ReactNode,
    style?: ViewStyle,
    bottomSheetComponent?: ReactNode
}

const MainWrapper = ({ headerComponent, children, style, bottomSheetComponent }: Props) => {
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
            <MainBackgroundImage>
                <SafeAreaView className='flex-1' style={style}>
                    {bottomSheetComponent}
                    {headerComponent
                        && <View className='w-full h-14'>
                            {headerComponent}
                        </View>}
                    {children}
                </SafeAreaView>
            </MainBackgroundImage>
        </GestureHandlerRootView>
    )
}

export default MainWrapper