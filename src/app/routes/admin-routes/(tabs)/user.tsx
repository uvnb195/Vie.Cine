import { TAB_BAR_HEIGHT } from '@/constants/Values'
import AdminWrapper from '@/src/components/AdminWrapper'
import React from 'react'
import { Text } from 'react-native'

const user = () => {
    return (
        <AdminWrapper
            style={{
                flex: 1,
                marginBottom: TAB_BAR_HEIGHT
            }}>
            <Text>user</Text>
        </AdminWrapper>
    )
}

export default user