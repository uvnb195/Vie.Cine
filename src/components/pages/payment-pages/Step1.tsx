import { View, Text } from 'react-native'
import React from 'react'
import DropdownMenu from '../../input/DropdownMenu'
import { ScrollView } from 'react-native-gesture-handler'
import ScrollCard from '../../scroll/ScrollCard'

const Step1 = () => {
    const scrollRef = React.useRef<ScrollView>(null)

    return (
        <View className='w-full h-full'>
            <ScrollView
                bounces={false}
                ref={scrollRef}
                className='w-full h-full'
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    rowGap: 8,
                }}>
                <DropdownMenu disableSearch
                    placeHolder='City/Province'
                    data={['Quang Binh', 'Le Thuy']}
                />
                <DropdownMenu
                    data={['Quang Binh', 'Le Thuy', 'Viet Nam', 'Ha Noi']}
                    placeHolder='City/Province'
                />
                <DropdownMenu data={['Quang Binh', 'Le Thuy', 'Viet Nam', 'Ha Noi']} />
                {/* <DropdownMenu enableSearch data={[1, 2, 3]} />
                <DropdownMenu enableSearch data={[1, 2, 3]} />
                <DropdownMenu enableSearch data={[1, 2, 3]} /> */}
                <View className='w-full h-[150px]'>

                    <ScrollCard height={150} />
                </View>
            </ScrollView>
        </View>
    )
}

export default Step1