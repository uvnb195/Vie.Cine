import { DROPDOWN_MENU_HEIGHT } from '@/constants/Values'
import { checkSeatInRange } from '@/hooks/checkSeatInRange'
import BottomSection from '@/src/components/bottom-sheet/BottomSection'
import DropdownMenu from '@/src/components/input/DropdownMenu'
import PageWrapper from '@/src/components/pages/PageWrapper'
import CinemaMapView from '@/src/components/scroll/CinemaMapView'
import ThemeText from '@/src/components/theme/ThemeText'
import { useAdminTheatre } from '@/src/contexts/theatre'
import { useCustomTheme } from '@/src/contexts/theme'
import { SeatProps, SeatType } from '@/src/redux/adminSlice'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

const SeatTypes = () => {
    const { data, handleData } = useAdminTheatre()
    const { colors } = useCustomTheme()
    const [editMap, setEditMap] = useState<SeatProps[][]>(data.map2d.maps || [])

    const [seatTypeMap, setSeatTypeMap] = useState(
        {
            STANDARD: {
                from: '',
                to: '',
            },
            VIP: {
                from: '',
                to: '',
            },
            SWEET_BOX: {
                from: '',
                to: '',
            },
        }
    )

    const handleSeatType = (type: SeatType) => {
        let prevMap = JSON.parse(JSON.stringify(data.map2d.maps)) as SeatProps[][]
        switch (type) {
            case SeatType.STANDARD: {
                const newMap = prevMap.map((eRow) => {
                    return eRow.map((eCol) => {
                        if (checkSeatInRange(eCol, seatTypeMap.STANDARD.from, seatTypeMap.STANDARD.to)) {
                            return ({
                                seatType: SeatType.STANDARD,
                                seatCode: eCol.seatCode
                            })
                        } else return eCol
                    })
                })
                setEditMap(newMap)
                break
            }
            case SeatType.VIP: {
                const newMap = editMap.map((eRow) => {
                    return eRow.map((eCol) => {
                        if (checkSeatInRange(eCol, seatTypeMap.VIP.from, seatTypeMap.VIP.to)) {
                            return ({
                                seatType: SeatType.VIP,
                                seatCode: eCol.seatCode
                            })
                        } else return eCol
                    })
                })
                setEditMap(newMap)
                break
            }
            case SeatType.SWEET_BOX: {
                const newMap = editMap.map((eRow) => {
                    return eRow.map((eCol) => {
                        if (checkSeatInRange(eCol, seatTypeMap.SWEET_BOX.from, seatTypeMap.SWEET_BOX.to)) {
                            return ({
                                seatType: SeatType.SWEET_BOX,
                                seatCode: eCol.seatCode
                            })
                        } else return eCol
                    })
                })
                setEditMap(newMap)
                break
            }
            case SeatType.EMPTY: {

                break
            }
            case SeatType.UNAVAILABLE: {

                break
            }
            default: break
        }
    }

    const handleNext = () => {
        handleData('map2d', { ...data.map2d, maps: editMap })
        router.push('/routes/admin-routes/form/(theatre)/(add)/Confirm')
    }

    useEffect(() => {
        if (seatTypeMap.STANDARD.to.length === 0) {
            setEditMap(data.map2d.maps || [])
            return
        }
        if (seatTypeMap.STANDARD.from.length !== 0 && seatTypeMap.STANDARD.to.length !== 0) {
            handleSeatType(SeatType.STANDARD)
        }
    }, [seatTypeMap.STANDARD])
    useEffect(() => {
        if (seatTypeMap.VIP.from.length !== 0 && seatTypeMap.VIP.to.length !== 0) {
            handleSeatType(SeatType.VIP)
        }
    }, [seatTypeMap.VIP])
    useEffect(() => {
        if (seatTypeMap.SWEET_BOX.from.length !== 0 && seatTypeMap.SWEET_BOX.to.length !== 0) {
            handleSeatType(SeatType.SWEET_BOX)
        }
    }, [seatTypeMap.SWEET_BOX])

    useEffect(() => {
        setEditMap(data.map2d.maps || [])
    }, [])

    return (
        <PageWrapper
            title='Buy ticket'
            subTitle='Step 2: Select a movie and a cinema'
        >
            <View className='w-full h-full'>
                <Animated.View
                    style={{
                        height: DROPDOWN_MENU_HEIGHT
                    }}>
                    <CinemaMapView data={editMap} />
                </Animated.View>
                <ScrollView className='px-4'>
                    {/* standard */}
                    <View className='justify-center w-full flex-row flex-wrap'>
                        <ThemeText
                            fontSize={24}
                            fontWeight='bold' otherProps={{
                                width: '100%',
                                color: colors.text.light
                            }}>Standard:</ThemeText>
                        <DropdownMenu
                            error={seatTypeMap.STANDARD.from.length === 0}
                            placeHolder='From'
                            style={{
                                width: '50%',
                                paddingRight: 10,
                            }}
                            value={seatTypeMap.STANDARD.from}
                            data={data.map2d.maps!!.flat().filter(i => i.seatType === SeatType.UNAVAILABLE).map(i => ({
                                value: i.seatCode,
                                key: i.seatCode
                            }))}
                            onSelected={v =>
                                setSeatTypeMap({
                                    STANDARD: {
                                        from: v,
                                        to: '',
                                    },
                                    VIP: {
                                        from: '',
                                        to: '',
                                    },
                                    SWEET_BOX: {
                                        from: '',
                                        to: '',
                                    }
                                })} />
                        <DropdownMenu
                            error={seatTypeMap.STANDARD.to.length === 0}
                            placeHolder='To'
                            style={{
                                width: '50%',
                                paddingLeft: 10,
                            }}
                            value={seatTypeMap.STANDARD.to}
                            data={editMap.flat().filter(i => i.seatType === SeatType.UNAVAILABLE).map(i => ({
                                value: i.seatCode,
                                key: i.seatCode
                            }))}
                            onSelected={v =>
                                setSeatTypeMap({
                                    STANDARD: {
                                        ...seatTypeMap.STANDARD,
                                        to: v
                                    },
                                    VIP: {
                                        from: '',
                                        to: '',
                                    },
                                    SWEET_BOX: {
                                        from: '',
                                        to: '',
                                    }
                                })} />
                    </View>

                    {/* vip */}
                    <View className='justify-center w-full flex-row flex-wrap pt-4'>
                        <ThemeText
                            fontSize={24}
                            fontWeight='bold' otherProps={{
                                width: '100%',
                                color: colors.text.light
                            }}>VIP:</ThemeText>
                        <DropdownMenu
                            error={seatTypeMap.VIP.from.length === 0}
                            disable={seatTypeMap.STANDARD.from.length === 0 || seatTypeMap.STANDARD.to.length === 0}
                            placeHolder='From'
                            style={{
                                width: '50%',
                                paddingRight: 10,
                            }}
                            value={seatTypeMap.STANDARD.from}
                            data={editMap.flat().filter(i => i.seatType === SeatType.UNAVAILABLE).map(i => ({
                                value: i.seatCode,
                                key: i.seatCode
                            }))}
                            onSelected={v =>
                                setSeatTypeMap({
                                    ...seatTypeMap,
                                    VIP: {
                                        from: v,
                                        to: '',
                                    },
                                    SWEET_BOX: {
                                        from: '',
                                        to: '',
                                    }
                                })} />
                        <DropdownMenu
                            error={seatTypeMap.VIP.to.length === 0}
                            disable={seatTypeMap.STANDARD.from.length === 0 || seatTypeMap.STANDARD.to.length === 0}
                            placeHolder='To'
                            style={{
                                width: '50%',
                                paddingLeft: 10,
                            }}
                            value={seatTypeMap.VIP.to}
                            data={editMap.flat().filter(i => i.seatType === SeatType.UNAVAILABLE).map(i => ({
                                value: i.seatCode,
                                key: i.seatCode
                            }))}
                            onSelected={v =>
                                setSeatTypeMap({
                                    ...seatTypeMap,
                                    VIP: {
                                        ...seatTypeMap.VIP,
                                        to: v
                                    },
                                    SWEET_BOX: {
                                        from: '',
                                        to: '',
                                    }
                                })} />
                    </View>

                    {/* sweet-box optional */}
                    <View className='justify-center w-full flex-row flex-wrap pt-4'>
                        <ThemeText
                            fontSize={24}
                            fontWeight='bold' otherProps={{
                                width: '100%',
                                color: colors.text.light
                            }}>Sweet-Box: <ThemeText fontSize={16} fontWeight='bold' color={colors.text.light}>(optional)</ThemeText></ThemeText>
                        <DropdownMenu
                            disable={seatTypeMap.VIP.from.length === 0 || seatTypeMap.VIP.to.length === 0}
                            placeHolder='From'
                            style={{
                                width: '50%',
                                paddingRight: 10,
                            }}
                            value={seatTypeMap.SWEET_BOX.from}
                            data={editMap.flat().filter(i => i.seatType === SeatType.UNAVAILABLE).map(i => ({
                                value: i.seatCode,
                                key: i.seatCode
                            }))}
                            onSelected={v =>
                                setSeatTypeMap({
                                    ...seatTypeMap,
                                    SWEET_BOX: {
                                        ...seatTypeMap.SWEET_BOX,
                                        from: v
                                    }
                                })} />
                        <DropdownMenu
                            disable={seatTypeMap.VIP.from.length === 0 || seatTypeMap.VIP.to.length === 0}
                            placeHolder='To'
                            style={{
                                width: '50%',
                                paddingLeft: 10,
                            }}
                            value={seatTypeMap.SWEET_BOX.to}
                            data={editMap.flat().filter(i => i.seatType === SeatType.UNAVAILABLE).map(i => ({
                                value: i.seatCode,
                                key: i.seatCode
                            }))}
                            onSelected={v =>
                                setSeatTypeMap({
                                    ...seatTypeMap,
                                    SWEET_BOX: {
                                        ...seatTypeMap.SWEET_BOX,
                                        to: v
                                    }
                                })} />
                    </View>

                </ScrollView>
                <View className='px-6'>
                    <BottomSection
                        disabled={
                            // seatTypeMap.SWEET_BOX.to.length === 0 ||
                            // seatTypeMap.SWEET_BOX.from.length === 0 ||
                            // seatTypeMap.VIP.to.length === 0 ||
                            // seatTypeMap.VIP.from.length === 0 ||
                            // seatTypeMap.STANDARD.to.length === 0 ||
                            // seatTypeMap.STANDARD.from.length === 0
                            false
                        }
                        handlePrev={() => router.dismiss()}
                        handleNext={handleNext}
                        currentIndex={2}
                        totalPage={4} />
                </View>
            </View>
        </PageWrapper>
    )
}

export default SeatTypes