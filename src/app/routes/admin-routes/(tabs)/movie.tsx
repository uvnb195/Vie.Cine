import { TAB_BAR_HEIGHT } from '@/constants/Values'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { auth } from '@/src/api/firebase/config'
import AdminWrapper from '@/src/components/AdminWrapper'
import CustomButton from '@/src/components/button/CustomButton'
import HomeHeader from '@/src/components/header/HomeHeader'
import SearchInput from '@/src/components/input/SearchInput'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { getMovies } from '@/src/redux/adminAsyncActions'
import { AppDispatch, RootState } from '@/src/redux/store'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Animated, Image, Pressable, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { ArrowRightIcon, PlusIcon, UserIcon } from 'react-native-heroicons/outline'
import { useDispatch, useSelector } from 'react-redux'

const movie = () => {
    const { colors } = useCustomTheme()
    const { movies } = useSelector((state: RootState) => state.admin)
    const dispatch = useDispatch<AppDispatch>()
    const [selected, setSelected] = React.useState<number | null>(null)

    const renderItem = (
        id: string,
        title: string,
        imageUri: string,
    ) => {
        return (
            <Pressable onPress={() => {

                // setSelected(id)
            }}>
                <View className='flex-row-reverse items-center justify-between px-4 border-b-2 w-full'
                // style={{
                //     backgroundColor: selected === id ? hexToRGBA(colors.background.bottomSheet, 0.7) : colors.background.default
                // }}

                >
                    <View className='w-[100px] h-[55px] rounded-2 overflow-hidden'>
                        <Image
                            style={{
                                width: '100%',
                                height: '100%'
                            }}
                            source={{ uri: imageUri }} resizeMode='cover' />
                    </View>
                    <View className='w-2' />
                    <View className='flex-1'>
                        <ThemeText numsOfLines={2} otherProps={{
                        }} fontSize={24}>{title}</ThemeText>
                    </View>
                </View>
            </Pressable>
        )
    }

    useEffect(() => {
        auth.currentUser?.getIdToken().then(token => {
            dispatch(getMovies(token))
        })
        console.log(movies)
    }, [])

    return (
        <AdminWrapper
            style={{
                flex: 1,
                marginBottom: TAB_BAR_HEIGHT
            }}
            HeaderComponent={
                <HomeHeader />
            }>
            {/* search & buttons */}
            <View className='px-4 flex-row-reverse py-2'
                style={
                    {
                        backgroundColor: hexToRGBA(colors.background.default, 0.7),
                    }
                }>
                <Animated.View>
                    <CustomButton
                        title='Detail'
                        style={{
                            height: 40
                        }}
                        Icon={<ArrowRightIcon color={colors.icon.enable} size={20} />} />
                </Animated.View>
                <View className='w-2' />
                <CustomButton
                    onPress={() => {
                        router.push({
                            pathname: '/routes/admin-routes/form/(movie)/(add)',
                            params: { id: 'movie' }
                        })
                    }}
                    style={{
                        width: 50,
                        height: 40
                    }}
                    Icon={<PlusIcon color={colors.icon.enable} size={20} />} />
                <View className='flex-1 pr-2'>
                    <SearchInput style={{ height: 40 }} />
                </View>
            </View>
            <View className='flex-1'>
                <FlatList data={movies}
                    renderItem={({ item }) =>
                        renderItem(
                            item.movieId,
                            item.movieName,
                            item.movieImageUri)} />
            </View>
        </AdminWrapper>
    )
}

export default movie