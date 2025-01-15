import { View, Text, ViewStyle, ActivityIndicator } from 'react-native'
import React from 'react'
import ThemeText from '../theme/ThemeText'
import { useSelector } from 'react-redux'
import { RootState } from '@/src/redux/store'
import { useCustomTheme } from '@/src/contexts/theme'

interface Props {
    style?: ViewStyle,
    title?: string,
    subTitle?: string,
    children: React.ReactNode
}

const PageWrapper = ({ style, title, subTitle, children }: Props) => {
    const { loading } = useSelector((state: RootState) => state.public)
    const { colors } = useCustomTheme()

    return (
        <View className='w-full h-full'>
            {loading &&
                <View className='absolute top-0 left-0 w-full h-full bg-black opacity-50 z-20 items-center justify-center'>
                    <ActivityIndicator size={'large'} color={colors.icon.highlight} />
                </View>}
            <View className='w-full px-6 pb-2'>
                <ThemeText
                    fontSize={24}
                    letterSpacing={4}
                    fontWeight='bold'
                    numsOfLines={1}>{title}</ThemeText>
                <ThemeText
                    otherProps={{
                        marginTop: 4,
                    }}
                    fontSize={12}
                    numsOfLines={1} >{subTitle}</ThemeText>
            </View>
            <View className='flex-1'
                style={style}>
                {children}
            </View>
        </View>
    )
}

export default PageWrapper