import { View, Text, ViewStyle } from 'react-native'
import React from 'react'
import SectionTitle from '../button/SectionTitle'
import { FlatList } from 'react-native-gesture-handler'
import HorizontalCard from '../card/HorizontalCard'
import { CalendarIcon, ClockIcon, StarIcon } from 'react-native-heroicons/solid'
import { useCustomTheme } from '@/src/contexts/theme'

interface Props {
    data: any,
    title?: string,
    showMore?: boolean,
    style?: ViewStyle
}

const CustomScroll = ({
    data,
    title,
    showMore,
    style
}: Props) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue

    const renderItem = (item: any) => {
        return (
            <HorizontalCard
                style={{
                    paddingVertical: 8,
                    paddingHorizontal: 8
                }}
                hasBorder
                image={require('../../assets/images/image-2.png')}
                title={'Venom Let There Be Carnage'}
                stats={[
                    {
                        content: 'Release date: 25/09/2024',
                        icon: <CalendarIcon size={16}
                            color={colors.text.default} />
                    },
                    {
                        content: '1h 47m',
                        icon: <ClockIcon size={16}
                            color={colors.text.default} />
                    },
                    {
                        content: '6.4/10 IMDb',
                        icon: <StarIcon size={16}
                            color={colors.text.default} />
                    }
                ]}
                shortTags={[
                    'Horror',
                    'Mystery',
                    "Thriller"
                ]} />
        )
    }
    return (
        <View className='flex-1' style={style}>
            {title && <SectionTitle title={title} showButton={showMore} />}
            <View className='flex-1'>
                <FlatList
                    contentContainerStyle={{
                        paddingVertical: 8,
                        rowGap: 16,
                        paddingHorizontal: 16
                    }}
                    data={data}
                    renderItem={({ item }) => renderItem(item)}
                />
            </View>
        </View>
    )
}

export default CustomScroll