import { View, Text } from 'react-native'
import React from 'react'
import AuthProvider from '@/src/contexts/auth'
import { Slot } from 'expo-router'

const _layout = () => {
    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    )
}

export default _layout