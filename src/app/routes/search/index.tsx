import { CAROUSEL_ITEM_SIZE } from '@/constants/Values'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import Header from '@/src/components/header'
import CustomInput from '@/src/components/input/CustomInput'
import MainWrapper from '@/src/components/MainWrapper'
import VerticalGridScroll from '@/src/components/scroll/VerticalGridScroll'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { setLoading } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ChevronDoubleDownIcon } from 'react-native-heroicons/outline'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'

const SearchScreen = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const { keyword } = useLocalSearchParams()
    const { search: searchValue } = useSelector((state: RootState) => state.public)
    const dispatch = useDispatch<AppDispatch>()
    const [input, setInput] = useState('')
    const expand = useSharedValue(0)
    const backgroundStyle = {
        backgroundColor: hexToRGBA(colors.background.highlight, 0.5),
        borderColor: colors.border.default
    }
    const personAnimation = useAnimatedStyle(() => ({
        flexGrow: expand.value,
        borderRadius: interpolate(expand.value, [0, 1], [4, 16]),
        marginTop: 16,
        marginBottom: 8,
        ...backgroundStyle
    }))
    const movieAnimation = useAnimatedStyle(() => ({
        borderRadius: interpolate(expand.value, [0, 1], [8, 16]),
        ...backgroundStyle
    }))

    const rotateAnimation = useAnimatedStyle(() => ({
        transform: [{ rotate: `${interpolate(expand.value, [0, 1], [180, 0])}deg` }]
    }))

    useEffect(() => {
        dispatch(setLoading(true))
        if (searchValue.keyword.length > 0) {
            const searchKeyword = Array.isArray(searchValue.keyword) ? searchValue.keyword.join(' ') : searchValue.keyword
            setInput(searchKeyword)
        }
        dispatch(setLoading(false))
    }, [searchValue])

    return (
        <MainWrapper
            HeaderComponent={<Header
                title={"Search"}
                initialState={false}
                backIconPress={() => router.dismiss()} />}>
            <View className='flex-1 px-4'>
                <CustomInput
                    onValueChange={(value) => setInput(value)}
                    value={input}
                    placeHolder={'Search'} />
                <View className='flex-1 mt-2'>
                    {/* content */}
                    {/* movie */}
                    <Animated.View className='flex-1 border'
                        style={movieAnimation}>
                        <View className='w-full h-10 items-center justify-between px-4 flex-row'>
                            <ThemeText letterSpacing={2} fontWeight='bold' color={colors.text.light}>Movie ({searchValue.movie?.total_results})</ThemeText>
                        </View>
                        <View className='flex-1'>
                            <VerticalGridScroll
                                style={{
                                    paddingBottom: 8
                                }}
                                contentStyle={{
                                    showTitle: true,
                                    showSubTitle: true,
                                    width: '100%',
                                    height: CAROUSEL_ITEM_SIZE.height,
                                    paddingHorizontal: 8,
                                }}
                                numColumns={3}
                                list={searchValue.movie?.results || null} />
                        </View>
                    </Animated.View>
                    {/* person */}
                    <Animated.View style={personAnimation} className='border overflow-hidden min-h-[100px]'>
                        <TouchableOpacity className='w-full h-10 items-center justify-between px-4 flex-row' onPress={() => {
                            expand.value = withTiming(expand.value === 0 ? 1 : 0, { duration: 500 })
                        }}>
                            <ThemeText letterSpacing={2} fontWeight='bold' color={colors.text.light}>Person ({searchValue.person?.total_results})</ThemeText>
                            <Animated.View style={rotateAnimation}>
                                <ChevronDoubleDownIcon color={colors.icon.highlight} />
                            </Animated.View>
                        </TouchableOpacity>
                        <VerticalGridScroll
                            style={{
                                paddingBottom: 8
                            }}
                            contentStyle={{
                                showTitle: true,
                                showSubTitle: true
                            }}
                            numColumns={3}
                            list={searchValue.movie?.results || null} />
                    </Animated.View>
                </View>
            </View>
        </MainWrapper>
    )
}

export default SearchScreen