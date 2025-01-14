import { View, Text } from 'react-native'
import React from 'react'
import { TAB_BAR_HEIGHT } from '@/constants/Values'

interface Props {
    children?: React.ReactNode
}

const TabContentWrapper = ({ children }: Props) => {
    return (
        <View className='flex-1'
            style={{ marginBottom: TAB_BAR_HEIGHT }}>
            {children}
        </View>
    )
}

export default TabContentWrapper