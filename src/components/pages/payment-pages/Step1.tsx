import { View, Text } from 'react-native'
import React from 'react'
import DropdownMenu from '../../input/DropdownMenu'
import { ScrollView } from 'react-native-gesture-handler'
import ScrollCard from '../../scroll/ScrollCard'
import ZoomView from '../../scroll/ZoomView'
import CinemaMapView from '../../scroll/CinemaMapView'
import ThemeText from '../../theme/ThemeText'

const Step1 = () => {
    const scrollRef = React.useRef<ScrollView>(null)

    return (
        <View className='w-full h-full'>
            <View className='w-full h-20'>
                <ThemeText>Buy ticket</ThemeText>
                <ThemeText>Step 1</ThemeText>
            </View>
            <ScrollView
                bounces={false}
                ref={scrollRef}
                className='w-full'
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <View className='flex-1 w-[250px] z-50'>
                    <CinemaMapView />
                </View>
                <Text>assssssssdsad</Text>
            </ScrollView>
        </View>
    )
}

export default Step1