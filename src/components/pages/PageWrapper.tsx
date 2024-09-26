import { View, Text, ViewStyle } from 'react-native'
import React from 'react'
import ThemeText from '../theme/ThemeText'

interface Props {
    style?: ViewStyle,
    title?: string,
    subTitle?: string,
    children: React.ReactNode
}

const PageWrapper = ({ style, title, subTitle, children }: Props) => {
    return (
        <View className='w-full h-full'>
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