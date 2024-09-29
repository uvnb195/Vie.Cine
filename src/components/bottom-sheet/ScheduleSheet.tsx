import { hexToRGBA } from '@/hooks/hexToRGBA'
import { useCustomTheme } from '@/src/contexts/theme'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { forwardRef, ReactNode, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { Dimensions, View, ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import ScheduleCard from '../card/ScheduleCard'
import CustomSearchOutLine from '../input/CustomSearchOutLine'
import LocationTag from '../LocationTag'
import { BottomSheetRef } from './PaymentSheet'

interface Props {
    children?: ReactNode,
}

const ScheduleSheet = forwardRef<BottomSheetRef, Props>(({ children }, ref) => {
    const { height: screenHeight } = Dimensions.get('window')
    const snapPoints = useMemo(() => ['60%', '90%'], [])

    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const sheetRef = useRef<BottomSheetModal>(null)

    const contentSize = useSharedValue(screenHeight * 0.6)

    const contentScale = useAnimatedStyle(() => ({
        height: withTiming(contentSize.value),
        width: '100%'
    }))

    const viewableItems = useSharedValue<ViewToken[]>([])

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

    const renderItem = ((item: any) => {
        const isVisible = Boolean(viewableItems.value.filter((viewableItem) => viewableItem.item === item).find((viewableItem) => viewableItem.isViewable))

        // const animation = useAnimatedStyle(() => ({
        //     opacity: withTiming(isVisible ? 1 : 0, {
        //         duration: 500
        //     })
        // }))

        return (
            <ScheduleCard
                viewableItems={viewableItems}
                id={item} />
        )
    })


    return (
        <BottomSheetModal
            contentHeight={400}
            enableDismissOnClose={true}
            ref={sheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backgroundStyle={
                { backgroundColor: hexToRGBA(colors.background.bottomSheet, 0.9) }
            }
            onChange={(index) => {
                contentSize.value = screenHeight * (index === 0 ? 0.6 : 0.9)
            }}
            handleIndicatorStyle={{ backgroundColor: colors.sheetIndicator }}
            backdropComponent={(props) => (
                <BottomSheetBackdrop {...props}
                    enableTouchThrough={true} pressBehavior='collapse' />
            )}
        >
            <Animated.View className={''} style={contentScale}>
                <LocationTag style={{ paddingHorizontal: 8 }} />
                {/* search */}
                <View className='w-full h-[50px]'>
                    <CustomSearchOutLine
                        placeHolder='Search for a schedule'
                        style={{ height: 50, fontSize: 16, paddingHorizontal: 16 }} />
                </View>
                <FlatList
                    decelerationRate={'fast'}
                    contentContainerStyle={{
                        paddingBottom: 24
                    }}
                    data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]}
                    renderItem={({ item, index }) =>
                        renderItem(item)
                    }
                    onViewableItemsChanged={({ viewableItems: vItems }) => {
                        viewableItems.value = vItems
                    }}
                />
            </Animated.View>
        </BottomSheetModal>
    )
})

export default ScheduleSheet