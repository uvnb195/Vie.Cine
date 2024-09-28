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
import { ScrollView } from 'react-native-gesture-handler'
import ScrollCreditCard from '@/src/components/scroll/ScrollCreditCard'
import CustomButton from '@/src/components/button/CustomButton'
import { ArrowLeftStartOnRectangleIcon, Cog8ToothIcon } from 'react-native-heroicons/outline'

const Tab = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue


    const shadow = shadowImageStyle(colors.text.light)

    return (
        <MainWrapper
            headerComponent={
                <Header title='Profile' leftIconShown={false} />
            }>
            {/* <ScrollExpandSection width={'100%'} data={[1, 2, 3]} /> */}
            <ScrollView>
                <ImagePicker
                    style={{
                        ...shadow,
                        alignSelf: 'center',
                        width: IMAGE_PICKER_SIZE.default,
                        height: IMAGE_PICKER_SIZE.default
                    }}
                    onImageChange={(base64) => console.log(base64)} />

                {/* infomation */}
                <View className='w-full mt-6 items-center'>
                    <ThemeText
                        otherProps={{
                            textAlign: 'center',
                            marginBottom: 8
                        }}
                        fontWeight='bold'
                        fontSize={24}
                        letterSpacing={4}
                        numsOfLines={2}>Đào Hữu Quân</ThemeText>
                    <ThemeText
                        fontSize={16}
                        fontWeight='light'
                        otherProps={{
                            textAlign: 'center',
                            marginBottom: 8
                        }}
                        numsOfLines={1}
                    >Email: uvnb195@gmail.com</ThemeText>
                    <ThemeText
                        fontSize={16}
                        fontWeight='light'
                        otherProps={{
                            textAlign: 'center',
                            marginBottom: 8
                        }}
                        numsOfLines={1}
                    >Phone No: 0399818565</ThemeText>
                    <ThemeText
                        fontSize={16}
                        fontWeight='light'
                        otherProps={{
                            textAlign: 'center',
                            paddingHorizontal: 24
                        }}
                        numsOfLines={2}
                    >Address: 72376 Francis Mountains, South Altaside, AK 13277</ThemeText>
                </View>

                {/* credit cards */}
                <View className='w-full mt-6'>
                    <ScrollCreditCard />
                </View>

                {/* buttons */}
                <View className='w-full px-4 mt-8 flex-row justify-evenly'>
                    <CustomButton title='Settings'
                        icon={<Cog8ToothIcon color={colors.text.default} />} />
                    <CustomButton title='Log Out'
                        icon={<ArrowLeftStartOnRectangleIcon
                            color={colors.text.default} />} />
                </View>
            </ScrollView>
        </MainWrapper>
    )
}

export default Tab