import DetailBackgroundWrapper from '@/src/components/DetailBackgroundWrapper'
import Header from '@/src/components/header'
import SearchInput from '@/src/components/input/SearchInput'
import MainWrapper from '@/src/components/MainWrapper'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Image, Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import WebView from 'react-native-webview'

const SearchScreen = () => {
    const [search, setSearch] = React.useState<{ movies: string[], people: string[] }>({
        movies: [],
        people: [],
    })

    const handleSearch = (text: string) => {
        setSearch({
            movies: ['movie1', 'movie2', 'movie3'],
            people: ['person1', 'person2', 'person3'],
        })
    }

    const [mapLat, setMapLat] = useState(6.841776681);
    const [mapLong, setMapLong] = useState(79.869319);
    const locationData = [
        { latitude: 6.841776681, longitude: 79.869319 },
        { latitude: 6.84076664, longitude: 79.871323 },
    ];

    return (
        <MainWrapper
            HeaderComponent={<Header
                leftIconPress={() => router.dismiss()} />}>
            <View className='flex-1 px-4'>
                <SearchInput onTextChange={handleSearch} />

                {/* content */}
                <View className='flex-1'>
                    {search.movies.length == 0 && search.people.length == 0
                        ? (
                            <View className='flex-1 items-center justify-start pt-6'>
                                <Image
                                    resizeMode='contain'
                                    style={{
                                        width: '70%',
                                        height: 200,
                                        opacity: 0.3
                                    }}
                                    source={require('@/assets/images/logo-maintain.png')} />
                            </View>
                        )
                        : (
                            <View className='w-full border-2 h-[500px]'>
                                <MapView
                                    style={{ flex: 1 }}
                                    initialRegion={{
                                        latitude: mapLat,
                                        longitude: mapLong,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                >
                                    {locationData.map((data, index) => (


                                        <Marker
                                            pinColor={'blue'}
                                            key={index}
                                            coordinate={{
                                                latitude: data.latitude,
                                                longitude: data.longitude,
                                            }}
                                            title={`Marker ${index + 1}`}
                                            description={`Weight:`}
                                        />
                                    ))}
                                </MapView>
                            </View>
                        )}
                </View>
            </View>

        </MainWrapper>
    )
}

export default SearchScreen