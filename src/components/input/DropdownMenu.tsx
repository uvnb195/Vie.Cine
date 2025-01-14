import { useCustomTheme } from '@/src/contexts/theme'
import { AppDispatch, RootState } from '@/src/redux/store'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, View, ViewStyle } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { ChevronDownIcon } from 'react-native-heroicons/solid'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import ThemeText from '../theme/ThemeText'

export interface DropDownProps {
    style?: ViewStyle,
    placeHolder?: string,
    data: DropDownItemType[],
    value?: number | string | null,
    disableSearch?: boolean,
    onSelected?: (value: any) => void,
    loading?: boolean,
    hasBorder?: boolean,
    disable?: boolean,
    error?: boolean,
    mode?: 'dropdown' | 'dialog'
}

export interface DropDownItemType {
    key: any,
    value: string
}

const DropdownMenu = ({
    style,
    data,
    value = null,
    placeHolder,
    disableSearch,
    loading,
    onSelected,
    disable,
    error,
    mode
}: DropDownProps) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const [searchList, setSearchList] = useState(data)

    const [show, setShow] = useState(false)
    const [input, setInput] = useState(value)

    const handleSearchDebounce = useCallback(
        debounce((value: string) => {
            if (value === '') { setSearchList(data) }
            else {
                setSearchList(data.filter(item => item.key.toString().toLocaleLowerCase().includes(value.toLocaleLowerCase())))
            }
        }, 500), [data])

    const opacity = useSharedValue(0)
    const placeHolderTextAnim = useAnimatedStyle(() => ({
        flexDirection: 'row',
        alignSelf: 'flex-start',
        fontSize: 12,
        opacity: withTiming(opacity.value),
        width: '100%'
    }))

    useEffect(() => {
        if (input)
            onSelected && onSelected(input)
    }, [input])

    return (
        <Animated.View
            style={[{
                minHeight: 55,
            }, style]}
        >
            <KeyboardAvoidingView behavior='position' >
                {/* disable overlay */}
                {disable ? <View className='absolute top-0 bottom-0 left-0 right-0 z-[100]' /> : null}

                {/* placeholder */}
                {placeHolder ?
                    <Animated.View
                        className='pl-4 self-start absolute top-0 left-0 justify-center rounded-2 z-50'>
                        <ThemeText
                            color={error && !value ? colors.error : colors.text.default}
                            fontWeight={value ? 'light' : 'regular'}
                            otherProps={placeHolderTextAnim}
                        >
                            {placeHolder}
                        </ThemeText>
                    </Animated.View>
                    : null}

                <SelectList
                    search={!disableSearch}
                    placeholder={placeHolder}
                    boxStyles={{
                        minHeight: 55,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: disable ? colors.border.disable : error && !value ? colors.error : colors.border.default,
                        backgroundColor: show ? colors.background.bottomSheet : colors.background.default,
                        paddingTop: 16,
                    }}
                    onSelect={() => {
                        opacity.value = 1
                        setInput(null)
                    }}
                    arrowicon={
                        <ChevronDownIcon
                            size={16}
                            color={disable ? colors.icon.disable : colors.icon.highlight} />}
                    setSelected={setInput}
                    data={data.map(item => ({
                        key: item.key,
                        value: item.value
                    }))}
                    save="key" />
            </KeyboardAvoidingView>
        </Animated.View>
    )
}

export default DropdownMenu