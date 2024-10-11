import { TAB_BAR_HEIGHT } from '@/constants/Size'
import { UserInfo } from '@/constants/types/UserType'
import { getDeviceLocales } from '@/hooks/permissions'
import { auth } from '@/src/api/firebase/config'
import AuthProvider from '@/src/contexts/auth'
import { useCustomTheme } from '@/src/contexts/theme'
import { fetchUserInfo } from '@/src/redux/privateAsyncActions'
import { clearUser } from '@/src/redux/privateSlice'
import { fetchList } from '@/src/redux/publicAsyncActions'
import { setLoading, setPhoneRegion } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { Redirect, Tabs } from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
import { Dimensions, View } from 'react-native'
import {
  HeartIcon as HeartIconOutline,
  HomeIcon as HomeIconOutline,
  TicketIcon as TicketIconOutline,
  UserIcon as UserIconOutline
} from 'react-native-heroicons/outline'
import {
  HeartIcon as HeartIconSolid,
  HomeIcon as HomeIconSolid,
  TicketIcon as TicketIconSolid,
  UserIcon as UserIconSolid
} from 'react-native-heroicons/solid'
import { useDispatch, useSelector } from 'react-redux'

const _layout = () => {
  const value = useCustomTheme()
  const { colors } = value
  const { loading,
    nowShowing,
  } = useSelector((state: RootState) => state.public)
  const { userInfo } = useSelector((state: RootState) => state.private)
  const { height: windowHeight } = Dimensions.get('window')
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(setLoading(true))
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then(token =>
          dispatch(fetchUserInfo({ token }))
        )
      } else dispatch(clearUser())
    })
    const deviceInfo = getDeviceLocales()
    if (deviceInfo.regionCode) {
      dispatch(setPhoneRegion(deviceInfo.regionCode))
    }
    dispatch(fetchList({ page: 1, url: '/now-showing' }))
    dispatch(fetchList({ page: 1, url: '/upcoming' }))
    dispatch(setLoading(false))
  }, [])

  useEffect(() => {
    console.log(auth.currentUser)
  }, [auth.currentUser])

  return (
    <View className='flex-1'>
      <Tabs
        screenOptions={{
          lazy: true,
          tabBarStyle: [{
            // Remove border top on both android & ios
            borderTopWidth: 0,
            elevation: 0,
            shadowColor: '#5bc4ff',
            shadowOpacity: 0,
            shadowRadius: 0,
            height: TAB_BAR_HEIGHT,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            zIndex: 1000,
          }],
          headerShown: false,
          tabBarShowLabel: false,
          tabBarBackground: (() => <View className='h-full w-full' style={{ backgroundColor: colors.background.default }}></View>)
        }}>
        <Tabs.Screen name='index'
          options={{
            // title:'Home',
            tabBarIcon: ({ focused }) => focused
              ? <HomeIconSolid color={colors.icon.highlight} size={24} />
              : <HomeIconOutline color={colors.icon.enable} size={24} />
          }} />
        <Tabs.Screen name='tickets'
          options={{
            tabBarIcon: ({ focused }) => focused
              ? <TicketIconSolid color={colors.icon.highlight} size={24} />
              : <TicketIconOutline color={colors.icon.enable} size={24} />
          }} />
        <Tabs.Screen name='favorites'
          options={{
            tabBarIcon: ({ focused }) => focused
              ? <HeartIconSolid color={colors.icon.highlight} size={24} />
              : <HeartIconOutline color={colors.icon.enable} size={24} />
          }} />
        <Tabs.Screen name='profile'
          options={{
            tabBarIcon: ({ focused }) => focused
              ? <UserIconSolid color={colors.icon.highlight} size={24} />
              : <UserIconOutline color={colors.icon.enable} size={24} />
          }} />

      </Tabs>

    </View>
  )
}

export default _layout