import { CAROUSEL_ITEM_SIZE, TAB_BAR_HEIGHT } from '@/constants/Size'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import CustomButton from '@/src/components/button/CustomButton'
import HomeHeader from '@/src/components/header/HomeHeader'
import LocationTag from '@/src/components/LocationTag'
import MainWrapper from '@/src/components/MainWrapper'
import AnimatedHorizontalScroll from '@/src/components/scroll/AnimatedHorizontalScroll'
import HorizontalScroll from '@/src/components/scroll/HorizontalScroll'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { updateListGroupShowing } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ArrowLeftEndOnRectangleIcon } from 'react-native-heroicons/solid'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'

const Tab = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const dispatch = useDispatch<AppDispatch>()
    const { loading, nowShowing, upComing, userInfo: currentUser } = useSelector((state: RootState) => state.public)

    const comboList = [
        { original_title: 'Combo 1', poster_path: 'https://stc.shopiness.vn/deal/2017/09/11/f/d/f/7/1505119515777_540.jpg' },
        { original_title: 'Combo 2', poster_path: 'https://stc.shopiness.vn/deal/2017/09/11/f/d/f/7/1505119515777_540.jpg' },
        { original_title: 'Combo 3', poster_path: 'https://stc.shopiness.vn/deal/2017/09/11/f/d/f/7/1505119515777_540.jpg' },
        { original_title: 'Combo 4', poster_path: 'https://stc.shopiness.vn/deal/2017/09/11/f/d/f/7/1505119515777_540.jpg' },
        { original_title: 'Combo5', poster_path: 'https://stc.shopiness.vn/deal/2017/09/11/f/d/f/7/1505119515777_540.jpg' },
        { original_title: 'Combo 6', poster_path: 'https://stc.shopiness.vn/deal/2017/09/11/f/d/f/7/1505119515777_540.jpg' },
        { original_title: 'Combo7', poster_path: 'https://stc.shopiness.vn/deal/2017/09/11/f/d/f/7/1505119515777_540.jpg' }
    ]

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
        if (currentUser != null) {
            ticketListHeight.value = withDelay(1000, withTiming(CAROUSEL_ITEM_SIZE.minimum + 40, { duration: 500 }))
        }
    }, [currentUser])

    return (
        <MainWrapper
            style={{
                flex: 1,
                marginBottom: TAB_BAR_HEIGHT
            }}
            HeaderComponent={
                <HomeHeader />
            }>

            {/* location */}
            <LocationTag />
            <ScrollView
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
                        list={nowShowing}
                        contentStyle={{
                            showSubTitle: true,
                            height: CAROUSEL_ITEM_SIZE.minimum
                        }}
                        viewableItems={(viewableItems) => {
                            // console.log('viewable:::::::::::::::::::::::::::', viewableItems)
                        }}
                    />
                </Animated.View>

                {/* now showing */}
                <View className='w-full' style={{ height: CAROUSEL_ITEM_SIZE.height + 40 }}>
                    <AnimatedHorizontalScroll
                        directionTo='left'
                        titleSize={24}
                        title='Now Showing'
                        list={nowShowing.slice(0, 10)}
                        showMore={nowShowing.length > 10}
                        contentStyle={{
                            showTitle: true,
                            width: CAROUSEL_ITEM_SIZE.width,
                            height: CAROUSEL_ITEM_SIZE.height
                        }}
                        onShowMore={() => {
                            dispatch(updateListGroupShowing('nowShowing'))
                            router.push({
                                pathname: '/routes/groups/[id]',
                                params: { id: 'trending' }
                            })
                        }}
                    />
                </View>

                {/* upcoming */}
                <View className='w-full' style={{ height: CAROUSEL_ITEM_SIZE.height + 40 }}>
                    <AnimatedHorizontalScroll
                        titleSize={16}
                        title='Upcoming'
                        list={upComing.slice(0, 10)}
                        showMore={upComing.length > 10}
                        onShowMore={() => {
                            dispatch(updateListGroupShowing('upComing'))
                            router.push({
                                pathname: '/routes/groups/[id]',
                                params: { id: 'up coming' }
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
                {loading
                    ? <View className='flex-1 items-center justify-center'>
                        <ActivityIndicator size={40} />
                    </View>
                    :
                    (currentUser == null ?

                        <TouchableOpacity onPress={() =>
                            router.push('/routes/(auth)')}
                        >
                            <View className='flex-1 border-4 items-center justify-around'>

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
                        : <View className='w-full' style={{ height: CAROUSEL_ITEM_SIZE.height + 40 }}>
                            <HorizontalScroll
                                titleSize={16}
                                title='Hot Combos'
                                showMore
                                list={upComing}
                                contentStyle={{
                                    showSubTitle: true,
                                    showTitle: true
                                }}
                            />
                        </View>)
                }


            </ScrollView>
        </MainWrapper>
    )
}

export default Tab
