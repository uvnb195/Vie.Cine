import { MovieType } from '@/constants/types/MovieType'
import { RoomType } from '@/constants/types/RoomType'
import { CAROUSEL_ITEM_SIZE } from '@/constants/Values'
import { addressToString } from '@/hooks/convertAddress'
import { dateConverter } from '@/hooks/convertDate'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { auth } from '@/src/api/firebase/config'
import BottomSection from '@/src/components/bottom-sheet/BottomSection'
import MinimalCard from '@/src/components/card/MinimalCard'
import PageWrapper from '@/src/components/pages/PageWrapper'
import ThemeText from '@/src/components/theme/ThemeText'
import { useAdminMovie } from '@/src/contexts/movie'
import { useCustomTheme } from '@/src/contexts/theme'
import { getMovies, getRooms } from '@/src/redux/adminAsyncActions'
import { fetchList } from '@/src/redux/publicAsyncActions'
import { updateLongList } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { PlusCircleIcon } from 'react-native-heroicons/outline'
import { useDispatch, useSelector } from 'react-redux'

const index = () => {
    const { fetching, nowShowing, longList } = useSelector((state: RootState) => state.public)
    const dispatch = useDispatch<AppDispatch>()
    const { theatres, rooms } = useSelector((state: RootState) => state.admin)
    const { colors } = useCustomTheme()

    useEffect(() => {
        auth.currentUser?.getIdToken().then(token => {
            dispatch(getRooms({ token, theatreId: rooms.theatreId }))
        })
    }, [])

    useEffect(() => {
        console.log('rooms::::', rooms)
    }, [rooms])

    const renderItem = (item: RoomType, index: number) => {
        if (item._id === 'add') {
            return renderAddCard()
        }
        return (
            <View className="items-center justify-center" style={{
                width: `${100 / 3}%`,
            }}>
                <MinimalCard
                    title={`${item.roomType}  - ${item.roomName}`}
                    subTitle={`${item.status}`}
                    titleStyle={{
                        textAlign: 'center'
                    }}
                    centerMessage={item.totalSeats.toString()}
                    src={require('@/assets/images/room-background.jpg')}
                    style={{
                        width: '100%',
                        height: CAROUSEL_ITEM_SIZE.height,
                        paddingHorizontal: 4,
                        paddingVertical: 8,
                        borderColor: colors.border.default
                    }} />
            </View >)
    }

    const renderAddCard = () => {
        return (
            <Pressable
                className='justify-center'
                style={{
                    width: `${100 / 3}%`,
                    height: CAROUSEL_ITEM_SIZE.height,
                }} onPress={handleAddRoom}>
                <View className="self-center items-center justify-center">
                    <View
                        className='items-center justify-center border rounded-1  px-2  py-2'
                        style={{
                            width: '100%',
                            backgroundColor: hexToRGBA(colors.background.bottomSheet, 0.7),
                        }}>
                        <PlusCircleIcon size={60} color={colors.icon.enable} />
                        <View className='pt-1 px-2'>
                            <ThemeText
                                fontSize={13}
                                otherProps={{
                                    textAlign: 'center'
                                }}>Add new room</ThemeText>
                        </View>
                    </View>
                </View >
            </Pressable>
        )
    }

    const handleAddRoom = () => {
        router.push({ pathname: '/routes/admin-routes/form/(theatre)/(room)/(add)' })
    }
    // useEffect(() => {
    //     dispatch(updateLongList('/now-showing'))

    //     return () => {
    //         dispatch(updateLongList(null))
    //     }
    // }, [])

    return (
        <View className='flex-1'>
            <PageWrapper
                style={{
                    paddingHorizontal: 16
                }}
                title={theatres.filter(data => data._id === rooms.theatreId)[0]?.name || ''}
                subTitle={addressToString(theatres.filter(data => data._id === rooms.theatreId)[0]?.location) || ""}
            >
                <View className='flex-1'>
                    <FlatList
                        windowSize={50}
                        ListFooterComponent={() =>
                            fetching &&
                            <View className="py-4">
                                <ActivityIndicator size={40} color={colors.icon.highlight} />
                            </View>}
                        onEndReachedThreshold={0.5}
                        numColumns={3}
                        contentContainerStyle={{
                            columnGap: 8
                        }}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        data={[{ _id: 'add' } as RoomType, ...rooms.data]}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => renderItem(item, index)} />
                </View>

                <View>
                    <BottomSection
                        handleNext={() => { }}
                        handleCancel={() => router.back()}
                        currentIndex={0}
                        totalPage={2}
                        disabled={false}
                    />
                </View>
            </PageWrapper>

        </View>
    )
}

export default index