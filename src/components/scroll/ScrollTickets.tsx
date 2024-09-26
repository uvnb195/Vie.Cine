import { View, Text } from 'react-native'
import React from 'react'
import SectionTitle from '../button/SectionTitle'
import { FlatList } from 'react-native-gesture-handler'
import Ticket from '../card/Ticket'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useCustomTheme } from '@/src/contexts/theme'
import { ClockIcon, MapPinIcon } from 'react-native-heroicons/solid'

interface Props {
    title?: string,
    data: any[]
}

const ScrollTickets = ({
    title,
    data
}: Props
) => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue
    return (
        <View className='flex-1'>
            {title && <SectionTitle title={title} />}
            <FlatList
                bounces={false}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    rowGap: 16,
                }}
                decelerationRate={'fast'}
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Ticket
                        image={require('../../assets/images/image-2.png')}
                        title={'Venom Let There Be Carnage'}
                        stats={[
                            {
                                content: 'Seat: C4 C3 C2 C1',
                                icon: <MaterialCommunityIcons
                                    name='sofa-single'
                                    color={colors.text.default}
                                    size={16} />
                            },
                            {
                                content: 'Durantion: 1h 47m',
                                icon: <ClockIcon
                                    color={colors.text.default}
                                    size={16} />
                            },
                            {
                                content: 'Hope Threater, 46988 Runolfsdottir Island, West Bryce, WI 62206',
                                icon: <MapPinIcon
                                    color={colors.text.default}
                                    size={16} />
                            }
                        ]}
                        shortTags={[
                            'Action',
                            'Adventure',
                            'Fantasy',
                            'Action',
                            'Adventure',
                            'Fantasy'
                        ]} />)}
            />
        </View>
    )
}

export default ScrollTickets