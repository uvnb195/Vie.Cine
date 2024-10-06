import { useCustomTheme } from '@/src/contexts/theme'
import { router } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { ArrowLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import CustomInput from '../input/CustomInput'
import ThemeText from '../theme/ThemeText'
import { AppDispatch } from '@/src/redux/store'
import { useDispatch } from 'react-redux'
import { postSearch } from '@/src/redux/publicAsyncAction'
import { setLoading } from '@/src/redux/publicSlice'

interface Props {
    backIconShown?: boolean,
    searchIconShown?: boolean,
    backIconPress?: () => void,
    searchIconPress?: () => void,
    title?: string,
    hasBackground?: string,
    initialState?: boolean
}

const Header = ({
    backIconShown = true,
    searchIconShown = false,
    title,
    backIconPress,
    searchIconPress: rightIconPress,
    hasBackground,
    initialState }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const dispatch = useDispatch<AppDispatch>()
    const searchRef = useRef<TextInput | null>(null)

    const [toggleSearchBox, setToggleSearchBox] = React.useState(initialState || false)
    const [searchValue, setSearchValue] = React.useState('')
    const searchBox = useDerivedValue(() => toggleSearchBox ? 60 : 0)
    const searchBoxAnimation = useAnimatedStyle(() => ({
        height: withTiming(searchBox.value, { duration: 500 }),
        overflow: 'hidden'
    }))

    const handleBackPress = () => {
        dispatch(setLoading(false))
        backIconPress && backIconPress()
    }

    const onSubmitSearch = () => {
        setToggleSearchBox(false)
        const dispatchValue = searchValue.includes(" ") ? searchValue.split(" ") : searchValue
        console.log(dispatchValue)
        dispatch(postSearch({ keyword: dispatchValue }))
        router.push({
            pathname: '/routes/search',
            params: {
                keyword: searchValue
            }
        })
    }

    // const searchDebounce = useRef(debounce((value: string) => {
    //     console.log(value)
    // }, 500))

    // useEffect(() => {
    //     searchDebounce.current(searchValue)
    //     return () => {
    //         searchDebounce.current.cancel()
    //         if (searchValue.length != 0) {
    //             searchDebounce.current(searchValue)
    //         }
    //     }

    // }, [searchValue])

    useEffect(() => {
        if (toggleSearchBox) {
            searchRef.current?.focus()
        }
    }, [])

    return (
        <View>
            <View className='h-[60px] w-full flex-row items-center px-4'>

                {/* left button */}
                <View className='w-[60px] h-[60px] items-center justify-center'>
                    {backIconShown &&
                        <TouchableOpacity className='w-[60px] h-[60px] items-center justify-center' onPress={handleBackPress}>
                            <View className='w-8 h-8 items-center justify-center'>
                                <ArrowLeftIcon
                                    color={colors.icon.enable}
                                    size={24} />
                            </View>
                        </TouchableOpacity>}
                </View>


                {/* text */}
                <View className='flex-1 h-full items-center justify-center'>
                    <ThemeText
                        otherProps={{
                            textAlign: 'center'
                        }}
                        numsOfLines={1}
                        letterSpacing={4}
                        color={colors.icon.highlight}
                        fontWeight='bold'>{toggleSearchBox ? 'Search' : title}</ThemeText>
                </View>

                {/* right button */}
                <View className='w-[60px] h-full items-center justify-center'>
                    {
                        searchIconShown &&
                        <TouchableOpacity className='w-[60px] h-[60px] items-center justify-center'
                            onPress={() => {
                                if (toggleSearchBox == false) {
                                    setToggleSearchBox(true)
                                    searchRef.current?.focus()
                                } else {
                                    setToggleSearchBox(false)
                                }
                            }}>
                            <MagnifyingGlassIcon color={toggleSearchBox ? colors.icon.highlight : colors.icon.enable} size={24} />
                        </TouchableOpacity>
                    }
                </View>
            </View>

            <Animated.View className='w-full px-4'
                style={searchBoxAnimation}>

                <CustomInput
                    ref={searchRef}
                    onValueChange={setSearchValue}
                    placeHolder={'Search'}
                    onSubmitEditing={onSubmitSearch} />
            </Animated.View>
        </View >
    )
}

export default Header