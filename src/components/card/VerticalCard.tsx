import { shadowImageStyle } from '@/constants/Styles'
import { dateConverter } from '@/hooks/convertDate'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { useCustomTheme } from '@/src/contexts/theme'
import { RootState } from '@/src/redux/store'
import React from 'react'
import { Image, View, ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'
import ThemeText from '../theme/ThemeText'
import { MovieType } from '@/constants/types/index'

interface Props {
    data: MovieType,
    hasBorder?: boolean,
    style?: ViewStyle
}

//size default 150x250
const VerticalCard = ({
    data,
    hasBorder,
    style }: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const { fetching: loadingImage, imageUri } = useSelector((state: RootState) => state.public)

    const date = dateConverter(data.release_date)

    return (
        <View
            style={[
                {
                    minWidth: 150,
                    minHeight: '100%',
                    padding: 0,
                },
                style,
                // { borderColor: hasBorder ? 'red' : 'transparent' }
            ]}
            className='items-center flex-col justify-between rounded-4 overflow-hidden flex-1'>

            {/* image */}
            <View className='w-full h-4/5 items-center justify-center rounded-2'
                style={shadowImageStyle(hexToRGBA(colors.text.dark, 0.3))}>
                <Image
                    source={{ uri: data.poster_path }}
                    className='w-full h-full rounded-1'
                    resizeMode='cover' />
            </View>

            <View className='flex-1 w-full'>
                {/* title */}
                <View className='w-full h-2/3 justify-center items-start'>
                    <ThemeText
                        otherProps={{
                            paddingHorizontal: 8
                        }}
                        fontSize={14}
                        fontWeight='bold'
                        color={colors.text.dark}
                        letterSpacing={2}
                        numsOfLines={2}
                    >
                        {data.original_title}
                    </ThemeText>
                </View>


                {/* subtitle */}
                {data.release_date &&
                    <View className='flex-row items-center overflow-hidden justify-start px-2'>
                        <ThemeText
                            color={colors.text.light}
                            otherProps={{ width: '100%' }}
                            fontSize={14}
                            numsOfLines={1}>Release: {date}</ThemeText>
                    </View>
                }
            </View>
        </View>
    )
}

export default VerticalCard