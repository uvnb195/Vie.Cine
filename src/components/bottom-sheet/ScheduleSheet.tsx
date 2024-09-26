import { View, Text, Dimensions } from 'react-native'
import React, { forwardRef, ReactNode, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { useCustomTheme } from '@/src/contexts/theme'
import DropdownMenu from '../input/DropdownMenu'
import { ScrollView } from 'react-native-gesture-handler'
import CustomPagerView from '../pages'
import Step1 from '../pages/payment-pages/Step1'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'

export interface BottomSheetRef {
    closeSheet: () => void
    expandSheet: () => void
    collapseSheet: () => void
    openSheet: () => void
}

interface Props {
    children?: ReactNode,
}

const ScheduleSheet = forwardRef<BottomSheetRef, Props>(({ children }, ref) => {
    const { height: screenHeight } = Dimensions.get('window')
    const snapPoints = useMemo(() => ['40%', '90%'], [])
    const pageSizes = useMemo(() => [40, 90, 60, 40], [])

    const [currentSize, setCurrentSize] = React.useState(pageSizes[0])

    useEffect(() => {
        console.log(currentSize)
    }, [currentSize])

    const animStyle = useDerivedValue(() => {
        return withTiming(Math.floor(currentSize * screenHeight / 100))
    }, [currentSize])

    const animation = useAnimatedStyle(() => ({
        height: animStyle.value
    }))

    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const sheetRef = useRef<BottomSheetModal>(null)

    useImperativeHandle(ref, () => ({
        closeSheet: () => {
            return sheetRef.current?.close()
        },
        expandSheet: () => {
            sheetRef.current?.expand()
        },
        collapseSheet: () => {
            sheetRef.current?.collapse()
        },
        openSheet: () => {
            sheetRef.current?.present()
        }
    }), [])


    return (
        <BottomSheetModal
            contentHeight={200}
            enableDismissOnClose={true}
            ref={sheetRef}
            snapPoints={snapPoints}
            onChange={(index) => {
                setCurrentSize(index == 0 ? 40 : 90)
            }}
            enablePanDownToClose={false}
            backgroundStyle={
                { backgroundColor: hexToRGBA(colors.background.bottomSheet, 0.5) }
            }
            handleIndicatorStyle={{ backgroundColor: colors.sheetIndicator }}
            backdropComponent={(props) => (
                <BottomSheetBackdrop {...props} enableTouchThrough={true} pressBehavior='collapse' />
            )}>
            {/* content */}
            <Animated.View className='w-full'
                style={[
                    { maxHeight: screenHeight * 0.9 },
                    animation]}>

                <CustomPagerView
                    totalPages={3}
                    handleFinish={() => {
                        sheetRef.current?.close()
                    }}
                    handleCancel={() => {
                        console.log('clicked')
                        sheetRef.current?.close()
                    }}
                    handleNext={(index) => {
                        setCurrentSize(pageSizes[index])
                        sheetRef.current?.snapToPosition(screenHeight * pageSizes[index] / 100)
                    }}

                    handlePrev={(index) => {
                        setCurrentSize(pageSizes[index])
                        sheetRef.current?.snapToPosition(screenHeight * pageSizes[index] / 100)
                    }}>

                    <View className='border-indigo-500' key="1">
                        <Text>Other Bottom Sheet</Text>
                    </View>
                </CustomPagerView>
            </Animated.View>
            {/* <View className='w-full h-full p-4'>
                <ScrollView>
                    <DropdownMenu data={[1, 2, 3]}
                        padding={4}
                        placeHolder='City/Province' />
                    <DropdownMenu data={[1, 2, 3]}
                        padding={4}
                        placeHolder='City/Province' />
                    <DropdownMenu data={[1, 2, 3]}
                        padding={4}
                        placeHolder='City/Province' />
                    <DropdownMenu data={[1, 2, 3]}
                        padding={4}
                        placeHolder='City/Province' />
                </ScrollView>
            </View> */}

        </BottomSheetModal>
    )
})

export default ScheduleSheet