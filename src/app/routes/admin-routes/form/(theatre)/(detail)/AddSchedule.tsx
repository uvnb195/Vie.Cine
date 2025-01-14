import { View, Text, Image, Pressable, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/redux/store'
import { FlatList } from 'react-native-gesture-handler'
import ThemeText from '@/src/components/theme/ThemeText'
import { auth } from '@/src/api/firebase/config'
import { addSchedule, getMovies, getTheatreDetail } from '@/src/redux/adminAsyncActions'
import CustomInput from '@/src/components/input/CustomInput'
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { useCustomTheme } from '@/src/contexts/theme'
import BottomSection from '@/src/components/bottom-sheet/BottomSection'
import { router } from 'expo-router'
import moment from 'moment'
import { resetDetail } from '@/src/redux/adminSlice'

const AddSchedule = () => {
    const { colors } = useCustomTheme()
    const { movies, theatreDetail } = useSelector((state: RootState) => state.admin)
    const dispatch = useDispatch<AppDispatch>()
    const [selected, setSelected] = React.useState<string | null>(null)
    const showTimeInput = useDerivedValue(() => selected !== null)
    const anim = useAnimatedStyle(() => ({
        height: withTiming(showTimeInput.value ? 150 : 0),
        opacity: withTiming(showTimeInput.value ? 1 : 0),
        transform: [{ translateY: withTiming(showTimeInput.value ? 0 : -100) }]
    }))
    const [input, setInput] = useState({
        time: '',
        date: ''
    })

    const handleFinish = () => {
        console.log('check theatreDetail:::::::::::', theatreDetail._id)
        const formData = new FormData()
        formData.append('theatreId', theatreDetail._id)
        formData.append('movieId', selected!!)
        formData.append('runDate', moment(input.date, 'DD.MM.YYYY').toString())
        formData.append('runTime', moment(input.time, 'HH.mm').toString())
        formData.append('price', '100000')
        auth.currentUser?.getIdToken().then(token => {
            dispatch(addSchedule({ token, schedule: formData }))
        })
        router.dismissAll()
    }

    useEffect(() => {
        if (theatreDetail._id === undefined) {
            console.log('first')
            router.back()
        }
        auth.currentUser?.getIdToken().then(token => {
            dispatch(getMovies(token))
        })
    }, [])

    return (
        <View className='flex-1 justify-between  flex-col-reverse'>
            <BottomSection
                currentIndex={0}
                totalPage={1}
                disabled={
                    selected === null
                    || input.date.length === 0
                    || input.time.length === 0
                    || moment(
                        `${input.date} ${input.time}`,
                        'DD.MM.YYYY HH.mm').isBefore(movies.find(movie => movie._id === selected)?.createAt)
                    || moment(
                        `${input.date} ${input.time}`,
                        'DD.MM.YYYY HH.mm').isAfter(movies.find(movie => movie._id === selected)?.endAt)}
                handleCancel={() => {
                    router.back()
                }}
                handleNext={handleFinish} />
            <View className='flex-grow py-2 px-2'>
                <FlatList
                    data={movies}
                    renderItem={({ item }) =>
                        <Pressable
                            onPress={() => {
                                if (selected == item._id)
                                    setSelected(null)
                                else setSelected(item._id)
                            }} >
                            <View className='flex-row justify-between items-center py-2 px-2'
                                style={{
                                    backgroundColor: selected === item._id ? hexToRGBA(colors.background.bottomSheet, 0.7) : undefined,
                                    borderWidth: selected === item._id ? 1 : 0,
                                    borderRadius: selected === item._id ? 8 : 0,
                                    borderColor: colors.border.default
                                }}>
                                <ThemeText>{item.movieName}</ThemeText>
                                <Image
                                    style={{
                                        width: 100,
                                        height: 50,
                                        borderRadius: 4,
                                    }}
                                    source={{ uri: item.movieImageUri }} />
                            </View>
                        </Pressable>} />
            </View>
            <Animated.View className={'overflow-hidden py-4 px-4'}
                style={anim}>
                <CustomInput
                    value={input.time}
                    onValueChange={(value) =>
                        setInput({ ...input, time: value })}
                    placeHolder='Time'
                    keyboardType='number-pad' />
                <CustomInput
                    value={input.date}
                    onValueChange={(value) =>
                        setInput({ ...input, date: value })}
                    style={{
                        marginTop: 8,
                    }}
                    placeHolder='Date'
                    keyboardType='number-pad' />
            </Animated.View>
        </View>
    )
}

export default AddSchedule