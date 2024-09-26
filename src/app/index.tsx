import { Stack } from 'expo-router'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useCustomTheme } from '../contexts/theme'

const RootLayout = () => {
    const value = useCustomTheme()
    const { colors } = value

    return (
        <GestureHandlerRootView>
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }} />
            </Stack>
        </GestureHandlerRootView >
    )
}

export default RootLayout