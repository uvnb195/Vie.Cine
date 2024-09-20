import BottomSheet from '@gorhom/bottom-sheet'
import React, { ReactNode, useRef } from 'react'
import { View, ViewStyle } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCustomTheme } from '../contexts/theme'
import MainBackgroundImage from './MainBackgroundImage'

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
        <MainBackgroundImage>
            <SafeAreaView className='flex-1' style={style}>
                {bottomSheetComponent}
                {headerComponent
                    && <View className='w-full h-14'>
                        {headerComponent}
                    </View>}
                {children}
            </SafeAreaView>
            {/* <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose
                // backdropComponent={() =>
                // }
                backgroundStyle={
                    { backgroundColor: hexToRGBA(colors.background.bottomSheet, 0.5) }
                }
                handleIndicatorStyle={{ backgroundColor: colors.sheetIndicator }}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop {...props} enableTouchThrough={true} pressBehavior='collapse' />
                )}>
                <BottomSheetView>
                    <Text>Awesome 🎉</Text>
                </BottomSheetView>
            </BottomSheet> */}
        </MainBackgroundImage>
    )
}

export default MainWrapper