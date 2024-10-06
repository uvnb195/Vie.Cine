import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useCustomTheme } from '@/src/contexts/theme'
import { BellIcon, MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline'
import ThemeText from '../theme/ThemeText'
import { router, useLocalSearchParams } from 'expo-router'
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import CustomInput from '../input/CustomInput'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/src/redux/store'
import { postSearch } from '@/src/redux/publicAsyncAction'

interface Props {
    onLeftPress?: () => void,
    onRightPress?: () => void,
    initialState?: boolean
}

const HomeHeader = ({ onLeftPress, onRightPress, initialState }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [toggleSearchBox, setToggleSearchBox] = React.useState(initialState || false)
    const [searchValue, setSearchValue] = React.useState('')
    const searchBox = useDerivedValue(() => toggleSearchBox ? 60 : 0)
    const dispatch = useDispatch<AppDispatch>()
    const searchBoxAnimation = useAnimatedStyle(() => ({
        height: withTiming(searchBox.value, { duration: 500 }),
        overflow: 'hidden'
    }))
    const searchRef = React.useRef<TextInput>(null)

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

    return (
        <View>
            <View className=' w-full flex-row items-center px-4  justify-between'>

                {/* left button */}
                <TouchableOpacity className='w-[60px] h-[60px] items-center justify-center '
                    onPress={onLeftPress}>
                    <View className='w-8 h-8 items-center justify-center'>
                        <BellIcon
                            color={colors.icon.enable}
                            size={24} />

                        {/* status */}
                        <View className='w-2 h-2 bg-red-500 rounded-full absolute top-1 right-2 border'
                            style={{
                                borderColor: colors.background.default
                            }}></View>
                    </View>
                </TouchableOpacity>

                {/* text */}
                <View className='items-center justify-center'>
                    <ThemeText
                        otherProps={{
                            textAlign: 'center'
                        }}
                        numsOfLines={1}
                        letterSpacing={4}
                        color={colors.icon.highlight}
                        fontWeight='bold'>VIE.CINE</ThemeText>
                </View>

                {/* right button */}
                <TouchableOpacity className='w-[60px] h-[60px] items-center justify-center'
                    onPress={() => {
                        setToggleSearchBox(!toggleSearchBox)
                    }}>
                    <MagnifyingGlassIcon color={toggleSearchBox ? colors.icon.highlight : colors.icon.enable} size={24} />
                </TouchableOpacity>
            </View>
            <Animated.View className='w-full px-4'
                style={searchBoxAnimation}>

                <CustomInput
                    ref={searchRef}
                    placeHolder={'Search'}
                    onValueChange={setSearchValue}
                    onSubmitEditing={onSubmitSearch} />
            </Animated.View>
        </View>
    )
}

export default HomeHeader