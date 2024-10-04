import { TAB_BAR_HEIGHT } from '@/constants/Size'
import { getDeviceLocales } from '@/hooks/permissions'
import { auth } from '@/src/api/firebase/config'
import { useCustomTheme } from '@/src/contexts/theme'
import { fetchNowShowing, fetchUpcoming } from '@/src/redux/publicAsyncAction'
import { setLoading, setPhoneRegion, setUser } from '@/src/redux/publicSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import { Redirect, router, Tabs } from 'expo-router'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import React, { useEffect } from 'react'
import { View } from 'react-native'
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
  const { loading, userInfo: currentUser } = useSelector((state: RootState) => state.public)
  const dispatch = useDispatch<AppDispatch>()

  const signInAsGuest = async () => {
    try {
      await signInAnonymously(auth);
      console.log('Đăng nhập khách thành công', auth.currentUser);
    } catch (error) {
      router.replace('/routes/(auth)')
    }
  };

  useEffect(() => {
    dispatch(setLoading(true))

    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user))
      }
    })
    const deviceInfo = getDeviceLocales()
    if (deviceInfo.regionCode) {
      dispatch(setPhoneRegion(deviceInfo.regionCode))
    }
    dispatch(fetchNowShowing({ page: 1 }))
    dispatch(fetchUpcoming({ page: 1 }))
    dispatch(setLoading(false))
  }, []);
  return (
    <View className='flex-1'>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            // Remove border top on both android & ios
            borderTopWidth: 0,
            elevation: 0,
            shadowColor: '#5bc4ff',
            shadowOpacity: 0,
            shadowRadius: 0,
            height: TAB_BAR_HEIGHT,
          },
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