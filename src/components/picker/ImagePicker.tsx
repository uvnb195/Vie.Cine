import { View, Text, ViewStyle, Image, ImageSourcePropType, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styled } from 'nativewind'
import { IMAGE_PICKER_SIZE } from '@/constants/Size'
import { useCustomTheme } from '@/src/contexts/theme'
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import { PhotoIcon } from 'react-native-heroicons/outline'
import ThemeText from '../theme/ThemeText'
import { hexToRGBA } from '@/hooks/hexToRGBA'

interface Props {
    style?: ViewStyle,
    defaultUri?: string
    onImageChange: (base64: string) => void
}

const ImagePicker = ({ style, defaultUri, onImageChange }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [image, setImage] = useState<string | null>(defaultUri || null)
    const [showEdit, setShowEdit] = useState<boolean>(false)

    const opacity = useDerivedValue(() => {
        return withTiming(showEdit ? 1 : 0)
    }, [showEdit])

    const animation = useAnimatedStyle(() => ({
        opacity: opacity.value,
        zIndex: showEdit ? 20 : 0
    }))

    const pickImage = async () => {
        await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
            base64: true
        })
            .catch(err => console.log(err))
            .then(result => {
                if (result && !result.canceled) {
                    setImage(result.assets[0].uri)
                }
            })
    }

    const handlePress = () => {
        if (showEdit) {
            pickImage()
        } else {
            setShowEdit(true)
        }
    }

    useEffect(() => {
        console.log(showEdit)
        if (showEdit == true)
            setTimeout(() => {
                setShowEdit(false)
            }, 1000);
    }, [showEdit])

    return (
        <View className='rounded-full items-center justify-center overflow-hidden border'
            style={[
                {
                    backgroundColor: colors.background.bottomSheet,
                    borderColor: colors.text.light
                },
                style]}>
            <Pressable onPress={handlePress}
                className=' w-full h-full'>
                <Image
                    source={image != null
                        ? { uri: image }
                        : require('../../assets/images/default-avatar.png')}
                    className='w-[200px] h-[200px] border-4 rounded-full'
                    resizeMode={image == null ? 'contain' : 'cover'}
                    tintColor={image == null
                        ? colors.text.dark : undefined} />
                <Animated.View
                    className=' absolute top-0 bottom-0 left-0 right-0 items-center justify-center'
                    style={[
                        {
                            backgroundColor: hexToRGBA(colors.background.default, 0.8)
                        },
                        animation
                    ]} >
                    <PhotoIcon
                        color={colors.text.default}
                        size={40} />
                    <ThemeText fontWeight='light' fontSize={13}>Choose new Avatar</ThemeText>
                </Animated.View>

            </Pressable>
        </View>
    )
}

export default ImagePicker