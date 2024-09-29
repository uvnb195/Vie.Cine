import DetailBackgroundWrapper from '@/src/components/DetailBackgroundWrapper'
import Header from '@/src/components/header'
import SearchInput from '@/src/components/input/SearchInput'
import MainWrapper from '@/src/components/MainWrapper'
import { router } from 'expo-router'
import React from 'react'
import { Image, Text, View } from 'react-native'

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
                            <></>
                        )}
                </View>
            </View>

        </MainWrapper>
    )
}

export default SearchScreen