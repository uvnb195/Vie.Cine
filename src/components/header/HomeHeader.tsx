import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useCustomTheme } from '@/src/contexts/theme'
import { BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import ThemeText from '../theme/ThemeText'

const HomeHeader = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    return (
        <View className='h-[60px] w-full flex-row items-center px-4'>

            {/* left button */}
            <TouchableOpacity className='w-[60px] h-full items-center justify-center'>
                <View className='w-8 h-8'>
                    <BellIcon
                        color={colors.icon.highlight}
                        size={32} />

                    {/* status */}
                    <View className='w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1 border'
                        style={{
                            borderColor: colors.background.default
                        }}></View>
                </View>
            </TouchableOpacity>

            {/* text */}
            <View className='flex-grow h-full items-center justify-center'>
                <ThemeText
                    numsOfLines={1}
                    letterSpacing={4}
                    color={colors.icon.highlight}
                    fontWeight='bold'>VIE.CINE</ThemeText>
            </View>

            {/* right button */}
            <TouchableOpacity className='w-[60px] h-full items-center justify-center'>
                <MagnifyingGlassIcon
                    color={colors.icon.highlight}
                    size={32} />
            </TouchableOpacity>
        </View>
    )
}

export default HomeHeader