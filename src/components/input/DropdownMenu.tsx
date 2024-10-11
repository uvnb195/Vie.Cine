import { DROPDOWN_MENU_HEIGHT, DROPDOWN_MENU_ITEM_HEIGHT } from '@/constants/Size'
import { useCustomTheme } from '@/src/contexts/theme'
import React, { useCallback, useEffect, useState } from 'react'
import { DimensionValue, Dimensions, KeyboardAvoidingView, Pressable, TextInput, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline'
import { ChevronDownIcon } from 'react-native-heroicons/solid'
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import ThemeText from '../theme/ThemeText'
import debounce from 'lodash.debounce'

interface Props {
    placeHolder?: string,
    data: string[],
    value?: string,
    width?: DimensionValue,
    height?: number,
    disableSearch?: boolean,
    onSelected?: (value: string) => void,
    hasBorder?: boolean,
    disable?: boolean,
}

const DropdownMenu = ({
    data,
    value,
    width = 200,
    height = 50,
    placeHolder,
    disableSearch,
    onSelected,
    hasBorder = true,
    disable,
}: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [searchList, setSearchList] = useState(data)
    const [selected, setSelected] = useState<string>(value || "")

    const expandedHeight = height
        + (disableSearch ? 0 : DROPDOWN_MENU_ITEM_HEIGHT)
        + (data.length * DROPDOWN_MENU_ITEM_HEIGHT > 300
            ? 300
            : data.length * DROPDOWN_MENU_ITEM_HEIGHT)

    const [show, setShow] = useState(false)
    const [search, setSearch] = useState('')

    const opacity = useDerivedValue(() => {
        return selected.length > 0 ? 1 : 0
    }, [value])

    const placeholderAnim = useAnimatedStyle(() => ({
        left: 8,
        opacity: opacity.value
    }))

    const handleSelected = useCallback((value: string) => {
        setSelected(value)
    }, [])

    const handleSearchDebounce = useCallback(
        debounce((value: string) => {
            if (value === '') { setSearchList(data) }
            else {
                setSearchList(data.filter(item => item.toLocaleLowerCase().includes(value.toLocaleLowerCase())))
            }
        }, 500), [data])

    const handleShow = () => {
        setShow(!show)
    }

    const animStyle = useDerivedValue(() => {
        if (show == true) {
            return withTiming(expandedHeight)
        } else {
            return withTiming(height)
        }
    }, [show])

    const animation = useAnimatedStyle(() => ({
        height: animStyle.value
    }))

    useEffect(() => {
        if (search === '') {
            handleSearchDebounce(''); return
        } else
            handleSearchDebounce(search)
        return () => {
            handleSearchDebounce.cancel()
        }
    }, [search])

    useEffect(() => {
        if (data.length > 0) {
            setSearchList(data)
        }
    }, [data])

    useEffect(() => {
        console.log(value)
        if (value && value.length > 0)
            handleSelected(value)
        else handleSelected(placeHolder || "")
    }, [value])

    const renderItems = () => {
        const showingList = searchList.length > 0 ? searchList : data
        return (
            showingList.map((item, index) => (
                <Pressable
                    key={index}
                    onPress={() => {
                        setShow(false)
                        handleSelected(item)
                        onSelected && onSelected(item)
                    }}
                    className='h-10 border-b justify-center px-2 overflow-hidden'
                    style={{
                        borderColor: colors.border.disable
                    }}>
                    <ThemeText
                        numsOfLines={1}
                        fontWeight={(value !== null && value == item) ? 'bold' : 'light'}>{item}</ThemeText>
                </Pressable>
            ))
        )
    }

    return (
        <KeyboardAvoidingView behavior='position' >
            <Animated.View
                style={[animation]}
            >
                {/* placeholder */}
                <Animated.View
                    className='absolute top-0 bg-black z-[25] rounded-2'
                    style={[placeholderAnim]}>
                    <ThemeText
                        fontSize={12}
                        letterSpacing={1}
                        otherProps={{
                            backgroundColor: colors.background.default,
                            paddingHorizontal: 2,
                            borderRadius: 4,
                        }}>{placeHolder}</ThemeText>
                </Animated.View>
                <TouchableOpacity
                    onPress={handleShow}
                    className='z-20 fixed'
                    disabled={disable}
                >
                    {/* content */}
                    <Animated.View
                        className='flex-row-reverse h-[50px] items-center px-4 rounded-2 self-start border justify-between mt-2'
                        style={{
                            backgroundColor: show ? colors.background.bottomSheet : colors.background.default,
                            borderColor: hasBorder
                                ? (disable
                                    ? colors.border.disable
                                    : colors.border.default)
                                : 'transparent',
                            width: width,
                            height: height
                        }}>
                        {/* drop down icon */}
                        {
                            show
                                ? <XMarkIcon className='w-6 h-6'
                                    color={colors.icon.highlight} />
                                : <ChevronDownIcon className='w-6 h-6'
                                    color={colors.icon.enable} />
                        }
                        <ThemeText numsOfLines={1}
                            color={disable ? colors.text.light : colors.text.default}>{selected.length > 0 ? selected : placeHolder}
                        </ThemeText>
                    </Animated.View>

                </TouchableOpacity>
                {show &&

                    // dropdown menu
                    <View className='flex-1 rounded-2 mt-1 border'
                        style={{
                            width: width,
                            height: DROPDOWN_MENU_HEIGHT,
                            backgroundColor: colors.background.default,
                            borderColor: colors.border.disable
                        }}>
                        {/* search */}
                        {!disableSearch &&
                            <View className='h-10 w-full items-center flex-row-reverse justify-center' >
                                {/* icon */}
                                <View className='w-10 h-10 justify-center items-center'>
                                    <MagnifyingGlassIcon color={colors.icon.enable} />
                                </View>

                                {/* input */}
                                <View className='flex-1 h-full p-2 max-w'>
                                    <TextInput
                                        value={search}
                                        onChangeText={setSearch}
                                        placeholder='Search'
                                        placeholderTextColor={colors.text.light}
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            fontFamily: 'Roboto',
                                            letterSpacing: 1,
                                            color: colors.text.default
                                        }} />
                                </View>

                            </View>}

                        {/* list */}
                        <View className='flex-grow'>
                            <ScrollView
                                className='flex-1'>
                                {renderItems()}
                            </ScrollView>
                        </View>

                    </View>}
            </Animated.View>
        </KeyboardAvoidingView>
    )
}

export default DropdownMenu