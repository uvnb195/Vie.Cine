import { DROPDOWN_MENU_HEIGHT, DROPDOWN_MENU_ITEM_HEIGHT } from '@/constants/Size'
import { useCustomTheme } from '@/src/contexts/theme'
import React, { useEffect } from 'react'
import { DimensionValue, Dimensions, KeyboardAvoidingView, Pressable, TextInput, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline'
import { ChevronDownIcon } from 'react-native-heroicons/solid'
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import ThemeText from '../theme/ThemeText'

interface Props {
    placeHolder?: string,
    data: string[],
    width?: DimensionValue,
    height?: number,
    padding?: number,
    disableSearch?: boolean,
    onSelected?: (value: string) => void
}

const DropdownMenu = ({
    data,
    width = 200,
    height = 50,
    placeHolder,
    padding = 8,
    disableSearch,
    onSelected }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const [selected, setSelected] = React.useState<number | null>(placeHolder && data.includes(placeHolder) ? data.indexOf(placeHolder) : null)

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

    const expandedHeight = height
        + (disableSearch ? 0 : DROPDOWN_MENU_ITEM_HEIGHT)
        + (data.length * DROPDOWN_MENU_ITEM_HEIGHT > 200
            ? 200
            : data.length * DROPDOWN_MENU_ITEM_HEIGHT)

    const [show, setShow] = React.useState(false)
    const [disable, setDisable] = React.useState(false)

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
        overflow: 'hidden',
        height: animStyle.value
    }))

    useEffect(() => {
        setDisable(true)
        setTimeout(() => {
            setDisable(false)
        }, 300);
    }, [show])

    useEffect(() => {
        if (selected != null)
            onSelected && onSelected(data[selected])
    }, [selected])

    const renderItems = () => (
        data.map((item, index) => (
            <Pressable
                key={index}
                onPress={() => {
                    setSelected(index)
                    console.log(data[index] === item, index)
                    setShow(false)
                }}
                className='h-10 border-b justify-center px-2 overflow-hidden'
                style={{
                    borderColor: colors.border.disable
                }}>
                <ThemeText
                    numsOfLines={1}
                    fontWeight={(selected !== null && data[selected]) == item ? 'bold' : 'light'}>{item}</ThemeText>
            </Pressable>
        ))
    )

    return (
        <KeyboardAvoidingView behavior='position' style={
            {
                padding: padding,
            }
        }>
            <Animated.View
                style={[animation]}
            // onLayout={e => {
            //     e.target.measureInWindow((x, y) => {
            //         console.log(x, y)
            //         animation.value = { x, y }
            //     })
            // }}
            >
                <Pressable
                    onPress={handleShow}
                    className='z-20 fixed'
                    disabled={disable}
                >
                    {/* content */}
                    <Animated.View
                        className='flex-row-reverse h-[50px] items-center px-4 rounded-2 overflow-hidden self-start border justify-between'
                        style={{
                            backgroundColor: show ? colors.background.bottomSheet : colors.background.default,
                            borderColor: disable
                                ? 'transparent'
                                : colors.border.default,
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
                        <ThemeText numsOfLines={1}>
                            {selected != null ? data[selected] : placeHolder}
                        </ThemeText>
                    </Animated.View>

                </Pressable>
                {show &&

                    // dropdown menu
                    <View className='flex-1 rounded-2 mt-1 overflow-hidden border'
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