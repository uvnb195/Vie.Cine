import { View, Text } from 'react-native'
import React from 'react'
import { Slot, Tabs } from 'expo-router'
import { useCustomTheme } from '@/src/contexts/theme'
import {
  HomeIcon as HomeIconOutline,
  TicketIcon as TicketIconOutline,
  HeartIcon as HeartIconOutline,
  UserIcon as UserIconOutline
} from 'react-native-heroicons/outline'
import {
  HomeIcon as HomeIconSolid,
  TicketIcon as TicketIconSolid,
  HeartIcon as HeartIconSolid,
  UserIcon as UserIconSolid
} from 'react-native-heroicons/solid'
import { Provider } from 'react-redux'
import { store } from '@/src/redux/store'

const _layout = () => {
  const value = useCustomTheme()
  const { colors } = value

  return (
    <Provider store={store}>
      <Tabs screenOptions={{
        tabBarStyle: {
          // Remove border top on both android & ios
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#5bc4ff',
          shadowOpacity: 0,
          shadowRadius: 0,
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
    </Provider>
  )
};

export default _layout