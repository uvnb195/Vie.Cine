// import { hexToRGBA } from '@/hooks/hexToRGBA'
// import AdminWrapper from '@/src/components/AdminWrapper'
// import Header from '@/src/components/header'
// import AdminTheatreProvider from '@/src/contexts/theatre'
// import { useCustomTheme } from '@/src/contexts/theme'
// import { resetDetail } from '@/src/redux/adminSlice'
// import { fetchAllProvince } from '@/src/redux/publicAsyncActions'
// import { setLoading } from '@/src/redux/publicSlice'
// import { AppDispatch, RootState } from '@/src/redux/store'
// import { Slot, useLocalSearchParams } from 'expo-router'
// import React, { useEffect, useState } from 'react'
// import { ActivityIndicator, View } from 'react-native'
// import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
// import { useDispatch, useSelector } from 'react-redux'

// const Form = () => {
//     const { colors } = useCustomTheme()
//     const dispatch = useDispatch<AppDispatch>()
//     const { fetching, loading, provinces } = useSelector((state: RootState) => state.public)

//     const [disableNext, setDisableNext] = useState(true)
//     useEffect(() => {
//         console.log('disableNext', disableNext)
//     }, [disableNext])

//     const zoomHeight = useSharedValue(0)
//     const zoomExpand = useAnimatedStyle(() => ({
//         height: withTiming(zoomHeight.value, { duration: 500 }),
//     }))

//     return (
//         <AdminWrapper
//             color={hexToRGBA(colors.background.default, 0.6)}
//             loadingLayer={false}
//             HeaderComponent={<Header
//                 title={`/ROOMS.THEATRE`}
//                 backIconShown={false} />}>
//             {/* loading */}

//             {(loading == true)
//                 &&
//                 <View className='absolute z-[50] top-0 bottom-0 left-0 right-0 items-center justify-center flex-1'
//                     style={{ backgroundColor: colors.blurBackground }}>
//                     <ActivityIndicator color={colors.icon.highlight} size={40} />
//                 </View>
//             }
//             <Slot />
//         </AdminWrapper>
//     )
// }

// export default Form 