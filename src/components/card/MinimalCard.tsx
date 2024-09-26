import { View, Text, ViewStyle, Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import { CAROUSEL_ITEM_SIZE } from '@/constants/Size'
import ThemeText from '../theme/ThemeText'

interface Props {
    style?: ViewStyle,
    src: ImageSourcePropType
}

const MinimalCard = ({ style, src }: Props) => {
    return (
        <View className='w-full h-full'
            style={[
                {
                    width: 150,
                    height: CAROUSEL_ITEM_SIZE.minimum,
                },
                style]}>
            <Image className='h-2/3 w-full rounded-2'
                source={src}
                resizeMode='cover' />
            <View className='h-1/3 w-full'>
                <ThemeText
                    fontSize={13}
                    fontWeight='regular'
                    numsOfLines={2}
                    otherProps={{
                        flexGrow: 1
                    }}>Venom Let There Be Carnage</ThemeText>
            </View>
        </View>
    )
}

export default MinimalCard