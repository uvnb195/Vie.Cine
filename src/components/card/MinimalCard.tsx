import { View, Text, ViewStyle, Image, ImageSourcePropType, ViewToken } from 'react-native'
import React, { memo } from 'react'
import { CAROUSEL_ITEM_SIZE } from '@/constants/Size'
import ThemeText from '../theme/ThemeText'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { StarIcon } from 'react-native-heroicons/solid'
import { useCustomTheme } from '@/src/contexts/theme'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { MovieType } from '@/constants/types'
import { ExclamationTriangleIcon } from 'react-native-heroicons/outline'

export interface CardProps {
    style?: ViewStyle,
    src: string,
    title?: string,
    subTitle?: string,
    onPress?: () => void
}

const MinimalCard = ({ style, src, title, subTitle, onPress }: CardProps) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const [showDefault, setShowDefault] = React.useState(false)

    return (
        <TouchableOpacity onPress={onPress} >
            <View className='flex-col-reverse h-full w-full'
                style={[
                    {
                        width: CAROUSEL_ITEM_SIZE.minimum,
                        height: CAROUSEL_ITEM_SIZE.minimum,
                    },
                    style]}>

                {/* subtitle */}
                {subTitle &&
                    <View className='h-6 absolute top-[8px] left-[8px] right-[8px] z-50 items-center justify-around flex-row rounded-2'
                        style={{
                            backgroundColor: hexToRGBA(colors.textHighLight.background, 0.5),
                        }}>
                        <StarIcon size={12}
                            fill='white'
                            color={colors.textHighLight.text} />
                        <ThemeText color={colors.textHighLight.text} fontSize={12}>{subTitle}</ThemeText>
                    </View>}

                {/* title */}
                {title &&
                    <ThemeText
                        otherProps={{
                            paddingVertical: 2,
                            paddingHorizontal: 4,
                            maxWidth: CAROUSEL_ITEM_SIZE.width,
                            overflow: 'hidden'
                        }}
                        fontSize={12}
                        fontWeight={subTitle ? 'bold' : 'regular'}
                        numsOfLines={2}>{title + "\n"}</ThemeText>}


                <View className='flex-1'>
                    <Image
                        onError={() => setShowDefault(true)}
                        loadingIndicatorSource={require('@/assets/images/icon.png')}
                        className='flex-1 w-full rounded-2'
                        source={{ uri: src }}
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