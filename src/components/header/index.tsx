import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React, { ReactNode, useEffect, useRef } from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import { ArrowLeftIcon, ChevronLeftIcon, EllipsisHorizontalIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { Entypo } from '@expo/vector-icons/'
import ThemeText from '../theme/ThemeText'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import CustomInput from '../input/CustomInput'
import { TextInput } from 'react-native-gesture-handler'
import { router } from 'expo-router'

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
    const searchRef = useRef<TextInput | null>(null)

    const [toggleSearchBox, setToggleSearchBox] = React.useState(initialState || false)
    const [searchValue, setSearchValue] = React.useState('')
    const searchBox = useDerivedValue(() => toggleSearchBox ? 60 : 0)
    const searchBoxAnimation = useAnimatedStyle(() => ({
        height: withTiming(searchBox.value, { duration: 500 }),
        overflow: 'hidden'
    }))



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
                        <TouchableOpacity className='w-[60px] h-[60px] items-center justify-center' onPress={backIconPress}>
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
                    onSubmitEditing={() => {
                        setToggleSearchBox(false)
                        router.push({
                            pathname: '/routes/search',
                            params: {
                                keyword: searchValue
                            }
                        })
                    }} />
            </Animated.View>
        </View >
    )
}

export default Header