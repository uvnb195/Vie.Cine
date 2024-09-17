import { View, Text, StyleProp, ViewProps, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import BackgroundMain from './BackgroundMain'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
    headerComponent?: ReactNode
    children: ReactNode,
    style?: ViewStyle
}

const MainWrapper = ({ headerComponent, children, style }: Props) => {
    return (
        <BackgroundMain>
            <SafeAreaView className='flex-1' style={style}>
                {headerComponent
                    && <View className='w-full h-14'>
                        {headerComponent}
                    </View>}

                {children}
            </SafeAreaView>
        </BackgroundMain>
    )
}

export default MainWrapper