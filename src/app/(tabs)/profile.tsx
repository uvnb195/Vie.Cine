import { View, Text, Button, Image } from 'react-native'
import React, { useState } from 'react'
import MainWrapper from '@/src/components/MainWrapper'
import ThemeText from '@/src/components/theme/ThemeText'
import Header from '@/src/components/header'
import ScrollExpandSection from '@/src/components/scroll/ScrollExpandSection'
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import ImagePicker from '@/src/components/picker/ImagePicker'
import { IMAGE_PICKER_SIZE } from '@/constants/Size'
import { useCustomTheme } from '@/src/contexts/theme'
import { shadowImageStyle } from '@/constants/Styles'

const Tab = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue


    const shadow = shadowImageStyle(colors.text.light)

    return (
        <MainWrapper
            headerComponent={
                <Header title='Profile' />
            }>
            {/* <ScrollExpandSection width={'100%'} data={[1, 2, 3]} /> */}
            <ImagePicker
                style={{
                    ...shadow,
                    alignSelf: 'center',
                    width: IMAGE_PICKER_SIZE.default,
                    height: IMAGE_PICKER_SIZE.default
                }}
                onImageChange={(base64) => console.log(base64)} />
        </MainWrapper>
    )
}

export default Tab