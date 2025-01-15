import { ScheduleType } from '@/constants/types/ScheduleType'
import { StatusType } from '@/constants/types/StatusType'
import { dateConverter } from '@/hooks/convertDate'
import { hexToRGBA } from '@/hooks/hexToRGBA'
import { auth } from '@/src/api/firebase/config'
import CustomButton from '@/src/components/button/CustomButton'
import CustomInput from '@/src/components/input/CustomInput'
import DropdownMenu from '@/src/components/input/DropdownMenu'
import DropDownMultiple from '@/src/components/input/DropDownMenuMultiple'
import PageWrapper from '@/src/components/pages/PageWrapper'
import ThemeText from '@/src/components/theme/ThemeText'
import { useCustomTheme } from '@/src/contexts/theme'
import { addSchedules, checkExitsSchedule, getRoomSchedule } from '@/src/redux/adminAsyncActions'
import { Status } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { Feather, FontAwesome5 } from '@expo/vector-icons'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'

const Detail = () => {
    const { colors } = useCustomTheme()
    const { editRoom, movie, schedule, status, scheduleCheck } = useSelector((state: RootState) => state.admin)
    const { movieInfo } = useSelector((state: RootState) => state.public)
    const [openDialog, setOpenDialog] = useState(false)
    const [rangeDialog, setRangeDialog] = useState(false)
    const [mode, setMode] = useState<'time' | 'date' | null>(null)
    const [timePicker, setTimePicker] = useState<Date | null>(null)
    const [datePicker, setDatePicker] = useState<Date | null>(null)
    const [datePickerMultiple, setDatePickerMultiple] = useState<Date[]>([])
    const [scheduleList, setScheduleList] = useState<ScheduleType[]>([])
    const [rangeState, setRangeState] = useState<'start' | 'end' | null>(null)

    const [optionSelected, setOptionSelected] = useState<0 | 1 | 2 | null>(null)

    const generateDateList = (start: Date, end: Date) => {
        if (!start || !end) return []
        const dateList = []
        let curDate = new Date(start)
        while (curDate.getTime() <= end.getTime()) {
            dateList.push(new Date(curDate))
            curDate.setDate(curDate.getDate() + 1)
        }


        console.log(dateList.map(item => dateConverter(item)))

        return dateList
    }

    const combineDateAndTime = (date1: Date, date2: Date) => {
        const year = date2.getFullYear();
        const month = date2.getMonth();
        const date = date2.getDate();

        const hours = date1.getHours();
        const minutes = date1.getMinutes();
        const seconds = date1.getSeconds();
        const milliseconds = date1.getMilliseconds();
        console.log(year, month, date, hours, minutes, seconds, milliseconds)

        return new Date(year, month, date, hours, minutes, seconds, milliseconds);
    };

    const dispatch = useDispatch<AppDispatch>()

    const renderItem = useCallback((item: ScheduleType, index: number) => {
        return (
            <View style={{
                paddingBottom: index === scheduleList.length - 1 ? 40 : 0
            }}>
                <ThemeText
                    fontSize={18}
                    fontWeight='bold'
                    letterSpacing={1.9}
                    otherProps={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                    }}>
                    {dateConverter(item.timeStart)} - {item.timeStart.toLocaleTimeString()}
                </ThemeText>
            </View>
        )
    }, [scheduleList])

    const handleConfirm = async () => {
        auth.currentUser?.getIdToken().then(token => {
            dispatch(addSchedules({ token, roomId: editRoom._id, schedules: scheduleList }))
        })

        router.push({
            pathname: '/routes/admin-routes/status/[id]',
            params: { id: 'success' }
        })

    }

    useEffect(() => {
        console.log(movie)
    }, [movie])

    useEffect(() => {
        if (status === Status.SUCCESS && scheduleCheck === true) {

        }
    }, [status])

    useEffect(() => {
        if (datePickerMultiple.length > 1) {
            console.log('finish end...')
            auth.currentUser?.getIdToken().then(token => {
                dispatch(getRoomSchedule({ token, roomId: editRoom._id }))
            })
            const dateList = generateDateList(datePickerMultiple[0], datePickerMultiple[1])
            setScheduleList(dateList.map(item => ({
                _id: '',
                theatreId: editRoom.theatreId,
                roomId: editRoom._id,
                movieId: movie._id,
                timeStart: item,
                status: StatusType.AVAILABLE
            } as ScheduleType)))
        }
    }, [datePickerMultiple])

    useEffect(() => {
        if (schedule && datePickerMultiple.length > 1) {
            const dateList = generateDateList(datePickerMultiple[0], datePickerMultiple[1])

            // console.log(
            //     'schedule ><',
            //     dateList.map(item => dateConverter(item))
            // )
        }
    }, [schedule])

    useEffect(() => {
        setDatePickerMultiple([])
    }, [optionSelected])

    useEffect(() => {

    }, [scheduleList])

    return (
        <PageWrapper title={editRoom.roomName + ' - ' + editRoom.roomType}
            subTitle={'Schedule information'}>
            {/* dialog */}
            {openDialog &&
                <RNDateTimePicker
                    mode={mode || undefined}
                    value={mode === 'time' ? timePicker || new Date() : datePicker || new Date()}
                    onChange={(event, date) => {
                        if (event.type === 'dismissed') {
                            setOpenDialog(false)
                        }
                        else if (event.type === 'set') {
                            setOpenDialog(false)
                            if (date) {
                                switch (mode) {
                                    case 'time':
                                        setTimePicker(date)
                                        break
                                    case 'date':
                                        setDatePicker(date)
                                        break
                                }
                            }
                        }
                    }}
                />
            }
            {
                rangeDialog &&
                <RNDateTimePicker
                    mode={'date'}
                    value={datePickerMultiple.length > 0 ? datePickerMultiple[datePickerMultiple.length - 1] : new Date()}
                    onChange={(event, date) => {
                        if (event.type === 'dismissed') {
                            setRangeDialog(false)
                        }
                        else if (event.type === 'set') {
                            setRangeDialog(false)
                            if (date) {
                                if (rangeState === 'start') {
                                    setDatePickerMultiple(prev => [combineDateAndTime(timePicker || new Date(), date), ...prev.slice(1)])
                                } else {
                                    setDatePickerMultiple(prev => [prev[0], combineDateAndTime(timePicker || new Date(), date)])
                                }
                            }
                        }
                    }}
                />

            }

            <ThemeText
                fontSize={18}
                fontWeight='bold'
                letterSpacing={1.9}
                otherProps={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                }}>Movie: {movie.movieName}</ThemeText>
            <View className='p-4 flex-1'>
                <View className='w-full flex-row'>
                    <View className='w-3/5 justify-center'>
                        <ThemeText
                            fontSize={18}
                            fontWeight='bold'
                            letterSpacing={1.9}
                            otherProps={{
                                paddingVertical: 8,
                            }}>
                            Run time
                        </ThemeText>

                        {/* start time picker */}
                        <View className='rounded-2 border' style={{
                            borderColor: timePicker ? colors.border.default : 'transparent',
                        }}>
                            <Pressable onPress={() => {
                                setMode('time')
                                setOpenDialog(true)
                            }}>

                                <CustomInput
                                    disabled
                                    keyboardType='numeric'
                                    LeftIcon={
                                        timePicker ?
                                            <Feather name="check-circle" size={20} color={colors.text.dark} />
                                            : <FontAwesome5 name="circle" size={20} color={colors.text.default} />}
                                    value={timePicker ? timePicker.toLocaleTimeString() : undefined}
                                    style={{
                                        backgroundColor: hexToRGBA(colors.background.highlight, 0.5),
                                    }}
                                    placeHolder='Choose time' />
                            </Pressable>
                        </View>

                        <ThemeText
                            fontSize={18}
                            fontWeight='bold'
                            letterSpacing={1.9}
                            otherProps={{
                                paddingVertical: 8,
                            }}>
                            Option
                        </ThemeText>

                        <View className='pb-2'>
                            <DropdownMenu
                                disableSearch
                                data={[
                                    {
                                        key: '0',
                                        value: 'Add schedule for a day'
                                    },
                                    {
                                        key: '1',
                                        value: 'For specific days'
                                    },
                                    {
                                        key: '2',
                                        value: 'Fill the range (no replace)'
                                    },
                                ]}
                                onSelected={(key) => {
                                    setOptionSelected(key as 0 | 1 | 2)
                                }}
                                style={{
                                    backgroundColor: hexToRGBA(colors.background.highlight, 0.5),
                                }}
                            />
                        </View>
                    </View>
                    <View className='w-2/5 justify-start items-center'>
                        <Image source={{ uri: movie.movieImageUri }} style={{
                            width: '80%',
                            height: 180,
                            borderRadius: 8,
                        }} />
                    </View>
                </View>

                {/* start time picker */}
                <View className='w-full py-4'>
                    {optionSelected == 0 &&
                        <View className='rounded-2 border' style={{
                            borderColor: timePicker ? colors.border.default : 'transparent',
                        }}>
                            <Pressable onPress={() => {
                                setMode('date')
                                setOpenDialog(true)
                            }}>

                                <CustomInput
                                    disabled
                                    keyboardType='numeric'
                                    LeftIcon={
                                        datePicker ?
                                            <Feather name="check-circle" size={20} color={colors.text.dark} />
                                            : <FontAwesome5 name="circle" size={20} color={colors.text.default} />}
                                    value={datePicker ? dateConverter(datePicker) : undefined}
                                    style={{
                                        backgroundColor: hexToRGBA(colors.background.highlight, 0.5),
                                    }} />
                            </Pressable>
                        </View>
                        || optionSelected == 1 &&
                        <View>
                            <DropDownMultiple value={[]} data={generateDateList(new Date(), new Date(movie.endAt || "")).map((item, index) => ({ key: index, value: `${dateConverter(item)} - ${item.toLocaleTimeString()}` }))} />
                        </View>
                        || optionSelected == 2 &&
                        <View className='flex-row justify-between '>
                            {/* start */}
                            <View className='w-1/2 pr-2'>
                                <View className='rounded-2 border' style={{
                                    borderColor: datePickerMultiple ? colors.border.default : 'transparent',
                                }}>
                                    <Pressable onPress={() => {
                                        setRangeState('start')
                                        setRangeDialog(true)
                                    }}>

                                        <CustomInput
                                            placeHolder='Date begin'
                                            disabled
                                            keyboardType='numeric'
                                            LeftIcon={
                                                datePickerMultiple && datePickerMultiple.length > 0 ?
                                                    <Feather name="check-circle" size={20} color={colors.text.dark} />
                                                    : <FontAwesome5 name="circle" size={20} color={colors.text.default} />}
                                            value={datePickerMultiple.length > 0 ? dateConverter(datePickerMultiple[0]) : undefined}
                                            style={{
                                                backgroundColor: hexToRGBA(colors.background.highlight, 0.5),
                                            }} />
                                    </Pressable>
                                </View>
                            </View>
                            {/* end */}
                            <View className='w-1/2 pl-2'>
                                <View className='rounded-2 border' style={{
                                    borderColor: datePickerMultiple && datePickerMultiple.length > 1 ? colors.border.default : 'transparent',
                                }}>
                                    <Pressable onPress={() => {
                                        setRangeState('end')
                                        setRangeDialog(true)
                                    }}>

                                        <CustomInput
                                            placeHolder='Date end'
                                            disabled
                                            keyboardType='numeric'
                                            LeftIcon={
                                                datePickerMultiple && datePickerMultiple.length > 1 ?
                                                    <Feather name="check-circle" size={20} color={colors.text.dark} />
                                                    : <FontAwesome5 name="circle" size={20} color={colors.text.default} />}
                                            value={datePickerMultiple.length > 1 ? dateConverter(datePickerMultiple[1]) : undefined}
                                            style={{
                                                backgroundColor: hexToRGBA(colors.background.highlight, 0.5),
                                            }} />
                                    </Pressable>
                                </View>
                            </View>

                        </View>}
                </View>
                <View className='border-4 flex-1'>
                    <ThemeText
                        fontSize={18}
                        fontWeight='bold'
                        letterSpacing={1.9}
                        otherProps={{
                            paddingVertical: 8,
                        }}>
                        Can set
                    </ThemeText>
                    <FlatList data={scheduleList} renderItem={({ item, index }) => renderItem(item, index)} />
                </View>
            </View>

            <View className='absolute bottom-0 w-full items-end flex-row justify-end p-4'>
                <CustomButton
                    disabled={!timePicker || (optionSelected === 0 ? !datePicker : datePickerMultiple.length === 0)}
                    title='Continue'
                    onPress={handleConfirm} />
            </View>
        </PageWrapper>

    )
}

export default Detail