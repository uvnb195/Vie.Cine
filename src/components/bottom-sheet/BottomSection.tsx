import React, { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import CustomButton from '../button/CustomButton'
import { useCustomTheme } from '@/src/contexts/theme'

interface Props {
    currentIndex: number,
    totalPage: number,
    handleNext?: () => void,
    handlePrev?: () => void,
    handleCancel?: () => void,
    disabled: boolean
}

const BottomSection = ({
    handleNext,
    handlePrev,
    handleCancel,
    disabled,
    currentIndex,
    totalPage }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const renderItems = () => {
        return Array.from({ length: totalPage }, (_, i) => (
            i == currentIndex ?
                <View
                    key={i}
                    className=' w-5 h-2 mx-1 rounded-full'
                    style={{
                        backgroundColor: colors.text.dark
                    }} />
                : <View
                    key={i}
                    className='bg-red-500 w-2 h-2 mx-1 rounded-full'
                    style={{
                        backgroundColor: colors.text.light
                    }} />
        ))
    }

    return (
        <View className='w-full flex-row items-center justify-between px-4'>
            {currentIndex != 0 && currentIndex != totalPage - 1
                ? <CustomButton
                    title='Prev'
                    hasBorder={false}
                    onPress={handlePrev} />
                : <CustomButton
                    hasBorder={false}
                    title='Cancel'
                    onPress={handleCancel} />}
            <View className='flex-grow justify-center items-center flex-row h-full '>
                {currentIndex != totalPage - 1 && renderItems()}
            </View>

            {totalPage - 1 == currentIndex
                ? <CustomButton
                    title='Finish'
                    onPress={handleNext} />
                : <CustomButton
                    title='Next'
                    disabled={disabled}
                    onPress={handleNext} />}
        </View>
    )
}

export default BottomSection