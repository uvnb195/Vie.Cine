import { View, Text, ViewStyle, Image, ImageSourcePropType, ViewToken, TextStyle } from 'react-native'
import React, { memo } from 'react'
import { CAROUSEL_ITEM_SIZE } from '@/constants/Values'
import ThemeText from '../theme/ThemeText'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { StarIcon } from 'react-native-heroicons/solid'
import { useCustomTheme } from '@/src/contexts/theme'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { ExclamationTriangleIcon } from 'react-native-heroicons/outline'

export interface CardProps {
    style?: ViewStyle,
    src: string | ImageSourcePropType,
    title?: string,
    titleStyle?: TextStyle,
    subTitle?: string,
    subTitleStyle?: TextStyle,
    centerMessage?: string,
    onPress?: () => void
}

const MinimalCard = ({ style, src, title, subTitle, titleStyle,
    subTitleStyle, centerMessage, onPress }: CardProps) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [showDefault, setShowDefault] = React.useState(false)

    return (
        <TouchableOpacity onPress={onPress} >
            <View className='flex-col-reverse h-full w-full'
                style={[
                    {
                        minHeight: CAROUSEL_ITEM_SIZE.minimum,
                        minWidth: CAROUSEL_ITEM_SIZE.minimum,
                    },
                    style]}>

                {/* subtitle */}
                {subTitle &&
                    <View className='h-6 absolute top-[8px] self-center z-50 items-center justify-around flex-row rounded-2'
                        style={{
                            backgroundColor: hexToRGBA(colors.textHighLight.background, 0.5),
                        }}>
                        <ThemeText
                            color={colors.textHighLight.text} fontSize={12}
                            otherProps={subTitleStyle}>{subTitle}</ThemeText>
                    </View>}

                {/* title */}
                {title &&
                    <ThemeText
                        otherProps={{
                            paddingVertical: 2,
                            paddingHorizontal: 4,
                            maxWidth: CAROUSEL_ITEM_SIZE.width,
                            overflow: 'hidden',
                            ...titleStyle
                        }}
                        fontSize={12}
                        fontWeight={subTitle ? 'bold' : 'regular'}
                        numsOfLines={2}>{title + "\n"}</ThemeText>}


                <View className='flex-1 relative'>
                    {/* center message */}
                    <View className='absolute top-0 left-0 right-0 bottom-0 z-10 items-center justify-center bg-opacity-50' style={{
                    }}>
                        <ThemeText otherProps={{
                            borderRadius: 100,
                            padding: 4,
                            backgroundColor: hexToRGBA(colors.background.default, 0.7),
                        }}>{centerMessage}</ThemeText>
                    </View>
                    <Image
                        onError={() => setShowDefault(true)}
                        loadingIndicatorSource={require('@/assets/images/icon.png')}
                        className='w-full h-full rounded-2'
                        source={typeof src === 'string' ? { uri: src } : src}
                        resizeMode='cover' />
                    {showDefault &&
                        <View className='items-center justify-center absolute top-0 left-0 right-0 bottom-0 z-20 overflow-hidden rounded-2 border'
                            style={{
                                backgroundColor: hexToRGBA(colors.background.default, 0.7),
                                borderColor: colors.border.disable,
                            }}>
                            <ExclamationTriangleIcon size={24} color={colors.icon.disable} />
                            <ThemeText fontSize={10}
                                color={colors.text.disable}
                                fontWeight='light' letterSpacing={2}>No Image</ThemeText>
                        </View>}
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default memo(MinimalCard)