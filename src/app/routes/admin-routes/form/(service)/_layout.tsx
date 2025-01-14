import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { useCustomTheme } from '@/src/contexts/theme'
import { useSelector } from 'react-redux'
import { RootState } from '@/src/redux/store'
import AdminWrapper from '@/src/components/AdminWrapper'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import Header from '@/src/components/header'
import { router, Slot, useLocalSearchParams } from 'expo-router'
import AdminServiceProvider from '@/src/contexts/service'

const _layout = () => {
    const { colors } = useCustomTheme()
    const { loading } = useSelector((state: RootState) => state.public)

    const id = useLocalSearchParams().id.toString()

    return (
        <AdminServiceProvider>
            <AdminWrapper
                color={hexToRGBA(colors.background.default, 0.6)}
                loadingLayer={false}
                HeaderComponent={<Header title={`/${id.toUpperCase()}.SERVICE`} backIconShown={false} />}>
                {/* loading */}

                {(loading == true)
                    &&
                    <View className='absolute z-[50] top-0 bottom-0 left-0 right-0 items-center justify-center flex-1'
                        style={{ backgroundColor: colors.blurBackground }}>
                        <ActivityIndicator color={colors.icon.highlight} size={40} />
                    </View>
                }
                <Slot />
            </AdminWrapper>
        </AdminServiceProvider>

    )
}

export default _layout