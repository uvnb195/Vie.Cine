import { hexToRGBA } from '@/hooks/hexToRGBA'
import { useCustomTheme } from '@/src/contexts/theme'
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import React, { useEffect, useState } from 'react'
import { Image, Pressable, View, ViewStyle } from 'react-native'
import { PhotoIcon } from 'react-native-heroicons/outline'
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import ThemeText from '../theme/ThemeText'

interface Props {
    disabled?: boolean,
    style?: ViewStyle,
    defaultUri?: string,
    shape?: 'circle' | 'square',
    mode?: 'avatar' | 'image',
    required?: boolean,
    onImageChange?: (uri: string) => void
}

const ImagePicker = ({ disabled,
    style,
    defaultUri,
    shape = 'circle',
    mode = 'avatar',
    required,
    onImageChange }: Props) => {
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
            aspect: mode == 'avatar' ? [3, 4] : undefined,
            quality: 0.5,
            base64: true,
        })
            .catch(err => console.log(err))
            .then(result => {
                if (result && !result.canceled) {
                    const imageType = result.assets[0].mimeType
                    const imageBase64 = `data:${imageType};base64,${result.assets[0].base64}`
                    setImage(imageBase64)
                    onImageChange && onImageChange(imageBase64)
                }
            })
    }

    const errorAnim = useAnimatedStyle(() => ({
        height: image == null ? withTiming(20) : withTiming(0),
    }))

    const handlePress = () => {
        if (showEdit) {
            pickImage()
        } else {
            setShowEdit(true)
        }
    }

    useEffect(() => {
        if (showEdit == true)
            setTimeout(() => {
                setShowEdit(false)
            }, 1000);
    }, [showEdit])

    useEffect(() => {
        if (defaultUri && defaultUri.length > 0)
            setImage(defaultUri)
    }, [defaultUri])

    return (
        <View>
            <View className='items-center justify-center overflow-hidden'
                style={[
                    {
                        backgroundColor: colors.background.bottomSheet,
                        borderColor: required ? colors.error : colors.border.default,
                        borderRadius: shape == 'circle' ? 999 : 8,
                        borderWidth: required ? 2 : 1,
                    },
                    style]}>
                <Pressable
                    onPress={handlePress}
                    disabled={disabled}
                    className='w-full h-full items-center justify-center'>
                    <Image
                        className='w-full h-full'
                        source={image != null
                            ? { uri: image }
                            : mode == 'avatar' ? require('../../assets/images/default-avatar.png') : require('../../assets/images/add-image.png')}
                        style={{
                            width: image == null ? mode == 'avatar' ? '100%' : '50%' : '100%',
                            height: image == null ? mode == 'avatar' ? '100%' : '50%' : '100%',
                        }}
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

            {/* error */}
            {required &&
                <Animated.View
                    style={errorAnim}
                    className='w-full'>
                    <ThemeText
                        color={colors.error}
                        fontSize={12}
                        fontWeight='bold'>
                        {image === null ? 'Please select image' : ''}
                    </ThemeText>
                </Animated.View>}
        </View>
    )
}

export default ImagePicker