import { useCustomTheme } from '@/src/contexts/theme'
import { RootState } from '@/src/redux/store'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, View } from 'react-native'
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { ScrollView } from 'react-native-gesture-handler'
import { ChevronDownIcon } from 'react-native-heroicons/solid'
import Animated, { useSharedValue } from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { DropDownProps } from './DropdownMenu'
import debounce from 'lodash.debounce'

interface DropDownMultipleProps extends Omit<DropDownProps, 'onSelected' | 'value'> {
    onSelected?: (selected: any[]) => void,
    value: any[]
}

const DropDownMultiple = ({
    style,
    data,
    placeHolder,
    disableSearch,
    onSelected,
    hasBorder = true,
    disable
}: DropDownMultipleProps) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    const [selected, setSelected] = useState<any[]>([])
    const { loading } = useSelector((state: RootState) => state.public)

    const handleSelectedDebounce = useCallback(debounce((value: any) => {
        onSelected && onSelected(value)
    }, 1000), [onSelected])

    useEffect(() => {
        handleSelectedDebounce(selected)
    }, [selected])

    return (
        <Animated.View
            style={[style]}
        >
            <KeyboardAvoidingView behavior='padding' >
                {/* disable overlay */}
                {disable ? <View className='absolute top-0 bottom-0 left-0 right-0 z-[100]' /> : null}

                <MultipleSelectList
                    placeholder={placeHolder}
                    search={!disableSearch}
                    data={data.map(i => ({
                        key: i.key,
                        value: i.value,
                        selected: selected?.includes(i.key)
                    }))}
                    save='key'
                    setSelected={setSelected}
                    dropdownStyles={{
                        height: 'auto',
                    }}
                    dropdownShown={false}
                    // boxStyles={{
                    //     minHeight: 55,
                    //     borderRadius: 8,
                    //     borderWidth: 1,
                    //     borderColor: !disable ? colors.border.default : colors.border.disable,
                    //     backgroundColor: colors.background.default,
                    //     paddingTop: 16,
                    // }}
                    arrowicon={
                        <ChevronDownIcon
                            size={16}
                            color={disable ? colors.icon.disable : colors.icon.highlight} />}

                    label={placeHolder}
                />
            </KeyboardAvoidingView>
        </Animated.View>
    )
}

export default DropDownMultiple