// import { SeatData } from '@/constants/types/TheatreType'
// import BottomSection from '@/src/components/bottom-sheet/BottomSection'
// import CustomInput from '@/src/components/input/CustomInput'
// import DropdownMenu from '@/src/components/input/DropdownMenu'
// import DropDownMultiple from '@/src/components/input/DropDownMenuMultiple'
// import PageWrapper from '@/src/components/pages/PageWrapper'
// import CinemaMapView from '@/src/components/scroll/CinemaMapView'
// import ThemeText from '@/src/components/theme/ThemeText'
// import { useAdminTheatre } from '@/src/contexts/theatre'
// import { useCustomTheme } from '@/src/contexts/theme'
// import { SeatProps, SeatType } from '@/src/redux/adminSlice'
// import { setLoading } from '@/src/redux/publicSlice'
// import { AppDispatch, RootState } from '@/src/redux/store'
// import { router } from 'expo-router'
// import React, { useEffect, useState } from 'react'
// import { Dimensions, View } from 'react-native'
// import { ScrollView } from 'react-native-gesture-handler'
// import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
// import { useDispatch, useSelector } from 'react-redux'

// const Information = () => {
//     const { height: SCREEN_HEIGHT } = Dimensions.get('window')
//     const { colors } = useCustomTheme()

//     const zoomHeight = useSharedValue(0)
//     const zoomExpand = useAnimatedStyle(() => ({
//         height: withTiming(zoomHeight.value, { duration: 500 }),
//     }))
//     const { data, dataError, handleData } = useAdminTheatre()
//     const dispatch = useDispatch<AppDispatch>()
//     const { loading } = useSelector((state: RootState) => state.public)
//     const [editMap, setEditMap] = useState<SeatProps[][]>([])
//     const [prevMap, setPrevMap] = useState<SeatProps[][] | null>(null)
//     const [total, setTotal] = useState<{
//         row: number | null,
//         col: number | null
//     }>({ row: null, col: null })
//     const [pathIndex, setPathIndex] = useState({
//         col: -1,
//         row: -1
//     })
//     const seatTypesHeight = useSharedValue(0)
//     const [selectedEmptySeats, setSelectedEmptySeats] = useState<SeatData[]>([])
//     const blankItem = {
//         seatCode: '',
//         seatType: SeatType.EMPTY
//     }

//     // const handleInsetPath = (row: number, col: number, map: SeatProps[][]) => {
//     //     if (row !== -1 && col !== -1) {
//     //         let newMap = [
//     //             ...map.slice(0, row),
//     //             new Array(data.map2d.cols || 0).fill(blankItem),
//     //             ...map.slice(row, map.length - 1)
//     //         ]
//     //         newMap.forEach((eRow, i) => {
//     //             const newRow = [
//     //                 ...eRow.slice(0, col),
//     //                 blankItem,
//     //                 ...eRow.slice(col, eRow.length - 1)
//     //             ]
//     //             newMap[i] = newRow
//     //         })
//     //         return newMap
//     //     } else {
//     //         if (row !== -1) {
//     //             let newMap = [
//     //                 ...map.slice(0, row),
//     //                 new Array(total.col || 0).fill(blankItem),
//     //                 ...map.slice(row, map.length - 1)
//     //             ]
//     //             return newMap
//     //         }
//     //         if (col !== -1) {
//     //             let newMap = map.map((eRow, i) => {
//     //                 const newRow = [
//     //                     ...eRow.slice(0, col),
//     //                     blankItem,
//     //                     ...eRow.slice(col, eRow.length - 1)
//     //                 ]
//     //                 return newRow
//     //             })
//     //             return newMap
//     //         }
//     //         return map || []
//     //     }
//     // }

//     const handleSpecificEmptySeats = (value: SeatData[]) => {
//         if (value.length > 0 && prevMap === null) {
//             setPrevMap(editMap)
//         }
//         if (!value || value.length === 0) {
//             setSelectedEmptySeats([])
//             return
//         }
//         if (value !== selectedEmptySeats) {
//             setSelectedEmptySeats(value)
//         }
//     }

//     useEffect(() => {
//         console.log(loading)
//     }, [loading])

//     // useEffect(() => {
//     //     const { cols, rows } = data.map2d
//     //     if (cols !== null && rows !== null) {
//     //         seatTypesHeight.value = 300
//     //         setSelectedEmptySeats([])
//     //         setPathIndex({ col: -1, row: -1 })
//     //         const newMap = new Array(rows).fill(0).map((eR, iR) => new Array(cols).fill(0).map((eC, iC) => ({ seatType: SeatType.UNAVAILABLE, seatCode: `${String.fromCharCode(iR + 65)}${iC + 1}` } as SeatProps)))
//     //         setEditMap(newMap)
//     //         zoomHeight.value = SCREEN_HEIGHT * 0.3
//     //     } else if (cols === 0 && rows === 0) {
//     //         zoomHeight.value = 0
//     //     } else {
//     //         seatTypesHeight.value = 0
//     //         zoomHeight.value = SCREEN_HEIGHT * 0.2
//     //     }
//     // }, [data.map2d])
//     useEffect(() => {
//         if (selectedEmptySeats.length === 0 && prevMap) {
//             setEditMap(prevMap)
//             setPrevMap(null)
//             return
//         }
//         dispatch(setLoading(true))
//         if (selectedEmptySeats.length > 0) {
//             let newMap = JSON.parse(JSON.stringify(editMap)) as SeatProps[][]
//             selectedEmptySeats.forEach(e => {
//                 let { row, col } = e
//                 newMap.forEach((eRow, iRow) => {
//                     eRow.forEach((eCol, iCol) => {
//                         if (eCol.seatCode === `${String.fromCharCode(row + 65)}${col + 1}`) {
//                             newMap[iRow][iCol].seatType = SeatType.EMPTY
//                         }
//                     })
//                 })
//             })
//             setEditMap(newMap)
//         }
//         setTimeout(() => {
//             dispatch(setLoading(false))
//         }, 0);
//     }, [selectedEmptySeats])
//     // useEffect(() => {
//     //     if (!data.map2d.maps) return
//     //     const newMap = handleInsetPath(pathIndex.row, pathIndex.col, data.map2d.maps)
//     //     if (newMap.length > 0) {
//     //         setEditMap(newMap)
//     //     }
//     // }, [pathIndex])

//     useEffect(() => {
//         setPathIndex({
//             col: -1,
//             row: -1
//         })
//         if (total.col && total.row) {
//             seatTypesHeight.value = 300
//             setSelectedEmptySeats([])
//             const newMap = new Array(total.row).fill(0).map((eR, iR) => new Array(total.col).fill(0).map((eC, iC) => ({ seatType: SeatType.UNAVAILABLE, seatCode: `${String.fromCharCode(iR + 65)}${iC + 1}` } as SeatProps)))
//             setEditMap(newMap)
//             zoomHeight.value = SCREEN_HEIGHT * 0.3
//         } else if (total.col === null || total.row === null) {
//             handleData('map2d', {
//                 rows: null,
//                 cols: null,
//                 maps: []
//             })
//             zoomHeight.value = 0
//         } else {
//             seatTypesHeight.value = 0
//             zoomHeight.value = SCREEN_HEIGHT * 0.2
//         }
//     }, [total])

//     return (
//         <PageWrapper
//             title='Buy ticket'
//             subTitle='Step 1: Select a movie and a cinema'
//         >
//             <View className='w-full h-full'>
//                 <Animated.View style={zoomExpand}>
//                     <CinemaMapView data={editMap} />
//                 </Animated.View>
//                 <ScrollView >

//                     {/* information */}
//                     <Animated.View
//                         className='flex-row flex-wrap px-6 pt-4 flex-1 pb-4'>
//                         <ThemeText
//                             otherProps={{
//                                 width: '100%',
//                                 paddingTop: 16,
//                             }}
//                             fontWeight='bold'
//                             fontSize={18}
//                             color={colors.text.light}>Information: </ThemeText>
//                         {/* total row */}
//                         <View className='w-1/2 pr-2'>
//                             <CustomInput
//                                 errorMsg={dataError.map2d.rows}
//                                 selectOnFocus
//                                 // ref={inputRef}
//                                 textCount={2}
//                                 keyboardType='number-pad'
//                                 placeHolder='Total Row'
//                                 value={data.map2d.rows ? data.map2d.rows.toString() : ''}
//                                 onValueChange={(v) => {
//                                     if (v === '' || v === '0') {
//                                         setTotal({
//                                             ...total,
//                                             row: null
//                                         })
//                                     } else {
//                                         setTotal({
//                                             ...total,
//                                             row: parseInt(v)
//                                         })
//                                     }
//                                 }} />
//                         </View>

//                         {/* total col */}
//                         <View className='w-1/2 pl-2'>
//                             <CustomInput
//                                 errorMsg={dataError.map2d.cols}
//                                 selectOnFocus
//                                 // ref={inputRef}
//                                 debounceValue={500}
//                                 textCount={2}
//                                 keyboardType='number-pad'
//                                 placeHolder='Total Column'
//                                 value={data.map2d.cols ? data.map2d.cols.toString() : ''}
//                                 onValueChange={(v) => {
//                                     if (v === '' || v === '0') {
//                                         setTotal({
//                                             ...total,
//                                             col: null
//                                         })
//                                     } else {
//                                         setTotal({
//                                             ...total,
//                                             col: parseInt(v)
//                                         })
//                                     }
//                                 }} />

//                         </View>

//                         {/* insert path */}
//                         {/* col path */}
//                         <View className='w-full flex-row items-center justify-between py-2'>
//                             <ThemeText>Path at:</ThemeText>
//                             <DropdownMenu
//                                 disableSearch
//                                 mode='dropdown'
//                                 style={{
//                                     width: 100,
//                                     marginLeft: 24,
//                                 }}
//                                 disable={total.col === null || total.row === null}
//                                 placeHolder='Col'
//                                 data={
//                                     editMap.length > 0
//                                         ? [{ key: -1, value: 'None' }, ...editMap[0]
//                                             .filter(i => i.seatType !== SeatType.EMPTY)
//                                             .map((i, index) => ({
//                                                 value: i.seatCode.slice(1),
//                                                 key: index,
//                                             }))]
//                                         : []}
//                                 value={pathIndex.col != -1 ? pathIndex.col : null}
//                                 onSelected={(v) => {
//                                     if (v)
//                                         setPathIndex({
//                                             ...pathIndex,
//                                             col: v
//                                         })
//                                 }}
//                             />
//                         </View>
//                         {/* row path */}
//                         <View className='w-full flex-row items-center justify-between'>
//                             <ThemeText>Row path:</ThemeText>
//                             <DropdownMenu
//                                 disableSearch
//                                 mode='dropdown'
//                                 style={{
//                                     width: 100,
//                                     marginLeft: 24,
//                                 }}
//                                 disable={total.col === null || total.row === null}
//                                 placeHolder='Row'
//                                 data={editMap.length > 0
//                                     ? [{ key: -1, value: 'None' }, ...editMap.filter(i => i.length > 0 && i[0].seatType !== SeatType.EMPTY).map((e, i) => ({
//                                         key: i,
//                                         value: String.fromCharCode(i + 65)
//                                     }))]
//                                     : []}
//                                 value={pathIndex.row != -1 ? pathIndex.row : null}
//                                 onSelected={(v) => {
//                                     setPathIndex({
//                                         ...pathIndex,
//                                         row: v
//                                     })
//                                 }} />
//                         </View>

//                         {/* specific empty seats */}
//                         <View className='w-full flex-row items-center justify-between'>
//                             <DropDownMultiple
//                                 style={{
//                                     width: '100%',
//                                     paddingTop: 8,
//                                 }}
//                                 disable={total.col === null || total.row === null} placeHolder='Specific empty seats'
//                                 value={selectedEmptySeats}
//                                 data={
//                                     editMap.filter((_, i) =>
//                                         i != pathIndex.row)
//                                         .map((eRow) => eRow.filter((_, iCol) => iCol != pathIndex.col)).flat().map((e) => ({
//                                             key: {
//                                                 row: e.seatCode.charCodeAt(0) - 65,
//                                                 col: parseInt(e.seatCode.slice(1)) - 1
//                                             },
//                                             value: e.seatCode
//                                         }))}
//                                 onSelected={handleSpecificEmptySeats}
//                             />
//                         </View>
//                     </Animated.View>
//                 </ScrollView>
//                 <View className='px-6'>
//                     <BottomSection
//                         handlePrev={() => router.dismiss()}
//                         handleNext={() => {
//                             handleData('map2d', {
//                                 ...data.map2d,
//                                 maps: editMap
//                             })
//                             router.push('/routes/admin-routes/form/(theatre)/(add)/SeatTypes')
//                         }}
//                         currentIndex={1}
//                         totalPage={4}
//                         disabled={total.col === null || total.row === null} />
//                 </View>
//             </View>
//         </PageWrapper>
//     )
// }

// export default Information