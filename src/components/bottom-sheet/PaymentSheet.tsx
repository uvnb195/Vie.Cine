import { hexToRGBA } from '@/hooks/hexToRGBA'
import { useCustomTheme } from '@/src/contexts/theme'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { forwardRef, ReactNode, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { Dimensions, View } from 'react-native'
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import CustomPagerView from '../pages'
import Step1 from '../pages/payment-pages/Step1'
import Step2 from '../pages/payment-pages/Step2'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { RootState, store } from '@/src/redux/store'
import Step3 from '../pages/payment-pages/Step3'
import { resetState } from '@/src/redux/paymentSlice'
import Step4 from '../pages/payment-pages/Step4'
import Step5 from '../pages/payment-pages/Step5'

export interface BottomSheetRef {
    closeSheet: () => void
    expandSheet: () => void
    collapseSheet: () => void
    openSheet: () => void
}

interface Props {
    children?: ReactNode,
}

const TOTAL_PAGES = 5

const PaymentSheet = forwardRef<BottomSheetRef, Props>(({ children }, ref) => {
    const { height: screenHeight } = Dimensions.get('window')
    const snapPoints = useMemo(() => ['50%', '90%'], [])
    const pageSizes = useMemo(() => [50, 90, 90, 90, 90, 50], [])

    const dispatch = useDispatch()

    const [currentPage, setCurrentPage] = React.useState(0)
    const [currentSize, setCurrentSize] = React.useState(pageSizes[0])

    const animStyle = useDerivedValue(() => {
        return withTiming(Math.floor(currentSize * screenHeight / 100))
    }, [currentPage, currentSize])

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

    const [canGoNext, setCanGoNext] = React.useState(true)

    const state = useSelector((state: RootState) => state.payment)

    useEffect(() => {
        console.log('state', state.services.length)
        switch (currentPage) {
            case 0: {
                if (state.address && state.address.city.length > 0 && state.address.district.length > 0) {
                    setCanGoNext(true)
                }
                break;
            }
            case 1: {
                if (state.seats.length > 0) {
                    setCanGoNext(true)
                }
                break;
            }
            case 2: {
                setCanGoNext(true)
                break
            }
            case 3: {
                setCanGoNext(true)
                break
            }
            case 4: {
                setCanGoNext(true)
                break
            }
            default: {
                // setCanGoNext(false)
            }
        }
    }, [state])

    const handleHideSheet = () => {
        dispatch(resetState())
    }


    return (
        <BottomSheetModal
            contentHeight={200}
            enableDismissOnClose={true}
            ref={sheetRef}
            snapPoints={snapPoints}
            onChange={(index) => {
                console.log(index)
                setCurrentSize(pageSizes[index])
            }}
            enablePanDownToClose={false}
            backgroundStyle={
                { backgroundColor: hexToRGBA(colors.background.bottomSheet, 0.5) }
            }
            handleIndicatorStyle={{ backgroundColor: colors.sheetIndicator }}
            backdropComponent={(props) => (
                <BottomSheetBackdrop {...props}
                    enableTouchThrough={true} pressBehavior='collapse' />
            )}>
            {/* content */}
            <Provider store={store}>
                <Animated.View className='w-full'
                    style={[
                        { maxHeight: screenHeight * 0.9 },
                        animation]}>
                    <CustomPagerView
                        totalPages={TOTAL_PAGES}
                        handleFinish={() => {
                            sheetRef.current?.close()
                            // setCanGoNext(false)
                            setCurrentPage(0)
                            handleHideSheet()
                        }}
                        handleCancel={() => {
                            sheetRef.current?.close()
                            // setCanGoNext(false)
                            setCurrentPage(0)
                            handleHideSheet()

                        }}
                        handleNext={(index) => {
                            setCurrentSize(pageSizes[index])
                            sheetRef.current?.snapToPosition(screenHeight * pageSizes[index] / 100)
                            setCurrentPage(index)
                        }}

                        handlePrev={(index) => {
                            setCurrentSize(pageSizes[index])
                            sheetRef.current?.snapToPosition(screenHeight * pageSizes[index] / 100)
                            setCurrentPage(index)
                            setCanGoNext(true)
                        }}
                        disabled={!canGoNext}>

                        <View className='items-center justify-center' key="1">
                            <Step1 />
                        </View>
                        <View className='items-center justify-center' key="2">
                            <Step2 />
                        </View>
                        <View className='items-center justify-center' key="3">
                            <Step3 />
                        </View>
                        <View className='items-center justify-center' key="4">
                            <Step4 />
                        </View>
                        <View className='items-center justify-center' key="5">
                            <Step5 />
                        </View>
                    </CustomPagerView>
                </Animated.View>
            </Provider>
        </BottomSheetModal>
    )
})

export default PaymentSheet