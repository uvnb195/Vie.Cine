import { CAROUSEL_ITEM_SIZE, TAB_BAR_HEIGHT } from '@/constants/Values'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import CustomButton from '@/src/components/button/CustomButton'
import HomeHeader from '@/src/components/header/HomeHeader'
import LocationTag from '@/src/components/LocationTag'
import MainWrapper from '@/src/components/MainWrapper'
import AnimatedHorizontalScroll from '@/src/components/scroll/AnimatedMovieHorizontalScroll'
import TabContentWrapper from '@/src/components/TabContentWrapper'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { setLoading } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import { Redirect, router } from 'expo-router'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ArrowLeftEndOnRectangleIcon } from 'react-native-heroicons/solid'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'

const Tab = () => {
    const { colors, isAdminMode, setIsAdminMode } = useCustomTheme()
    const dispatch = useDispatch<AppDispatch>()
    const { loading, nowShowing, upComing } = useSelector((state: RootState) => state.public)
    const { userInfo } = useSelector((state: RootState) => state.private)

    const ticketListHeight = useSharedValue(0)
    const ticketListAnimation = useAnimatedStyle(() => ({
        height: ticketListHeight.value,
        opacity: ticketListHeight.value > 0 ? withTiming(1, { duration: 1000 }) : 0
    }))

    const [toggleSearchBox, setToggleSearchBox] = React.useState(false)
    const searchBox = useDerivedValue(() => toggleSearchBox ? 60 : 0)
    const searchBoxAnimation = useAnimatedStyle(() => ({
        height: withTiming(searchBox.value, { duration: 500 }),
        overflow: 'hidden'
    }))
    const bgColors = ['transparent', hexToRGBA(colors.background.highlight, 0.5), colors.background.highlight,]

    useEffect(() => {
        if (userInfo !== null && userInfo !== undefined) {
            ticketListHeight.value = withDelay(1000, withTiming(CAROUSEL_ITEM_SIZE.minimum + 40, { duration: 500 }))
        } else {
            ticketListHeight.value = 0
        }
    }, [userInfo])

    useEffect(() => {
        // console.log(isAdminMode)
        if (isAdminMode)
            setTimeout(() => {
                router.replace('/routes/admin-routes')
            }, 0);
    }, [isAdminMode])
    return (
        <MainWrapper
            style={{
                flex: 1,
                marginBottom: TAB_BAR_HEIGHT
            }}
            HeaderComponent={
                <HomeHeader />
            }>
            <TabContentWrapper>

                {/* location */}
                <LocationTag />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    decelerationRate={'fast'}>
                    {/* ticket booked */}
                    <Animated.View
                        className='w-full' style={[
                            {
                                height: CAROUSEL_ITEM_SIZE.minimum
                            },
                            ticketListAnimation
                        ]}>
                        <AnimatedHorizontalScroll
                            titleSize={16}
                            title='Booked Tickets'
                            list={nowShowing?.results || null}
                            totalPages={nowShowing?.total_pages}
                            contentStyle={{
                                showSubTitle: true,
                                height: CAROUSEL_ITEM_SIZE.minimum
                            }}
                            viewableItems={(viewableItems) => { }}
                        />
                    </Animated.View>

                    {/* now showing */}
                    <View className='w-full' style={{ height: CAROUSEL_ITEM_SIZE.height + 40 }}>
                        <AnimatedHorizontalScroll
                            directionTo='left'
                            titleSize={24}
                            title='Now Showing'
                            list={nowShowing?.results || null}
                            totalPages={nowShowing?.total_pages}
                            showMore={nowShowing && nowShowing?.total_results > 10 || false}
                            contentStyle={{
                                showTitle: true,
                                width: CAROUSEL_ITEM_SIZE.width,
                                height: CAROUSEL_ITEM_SIZE.height
                            }}
                            onShowMore={() => {
                                dispatch(setLoading(true))
                                router.push({
                                    pathname: '/routes/groups/[id]',
                                    params: { id: '/now-showing' }
                                })
                            }}
                        />
                    </View>

                    {/* upcoming */}
                    <View className='w-full' style={{ height: CAROUSEL_ITEM_SIZE.height + 40 }}>
                        <AnimatedHorizontalScroll
                            titleSize={16}
                            title='Upcoming'
                            list={upComing?.results || null}
                            totalPages={upComing?.total_pages}
                            showMore={upComing && upComing?.total_results > 10 || false}
                            onShowMore={() => {
                                dispatch(setLoading(true))
                                router.push({
                                    pathname: '/routes/groups/[id]',
                                    params: { id: '/upcoming' }
                                })
                            }}
                            contentStyle={{
                                showTitle: true,
                                showSubTitle: true,
                                width: CAROUSEL_ITEM_SIZE.width,
                                height: CAROUSEL_ITEM_SIZE.height
                            }}
                        />
                    </View>
                    {userInfo === null ?
                        <TouchableOpacity onPress={() =>
                            router.push('/routes/(auth)/')}
                        >
                            <View className='flex-1 items-center justify-around mt-6'>

                                <ThemeText
                                    fontSize={20}
                                    fontWeight='light'
                                    letterSpacing={4}
                                    otherProps={{
                                        textAlign: 'center'
                                    }}>Login for more features</ThemeText>
                                <CustomButton
                                    style={{
                                        alignSelf: 'center',
                                        marginVertical: 16,
                                    }} title='Login'
                                    Icon={<ArrowLeftEndOnRectangleIcon color={colors.smallButton.textDefault} />} />
                            </View>
                        </TouchableOpacity>
                        :
                        (userInfo !== undefined
                            && <View className='w-full' style={{ height: CAROUSEL_ITEM_SIZE.height + 40 }}>
                                <AnimatedHorizontalScroll
                                    directionTo='left'
                                    titleSize={16}
                                    title='Hot Combos'
                                    showMore
                                    list={upComing?.results || null}
                                    totalPages={upComing?.total_pages}
                                    contentStyle={{
                                        showSubTitle: true,
                                        showTitle: true,
                                        height: CAROUSEL_ITEM_SIZE.height
                                    }}
                                    style={{
                                        height: CAROUSEL_ITEM_SIZE.height + 40,
                                    }}
                                />
                            </View>)
                    }
                </ScrollView>
            </TabContentWrapper>
        </MainWrapper>
    )
}

export default Tab
