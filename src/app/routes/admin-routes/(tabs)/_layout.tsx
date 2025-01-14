import { View, Text, BackHandler, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { router, Tabs } from 'expo-router'
import { useCustomTheme } from '@/src/contexts/theme'
import { TAB_BAR_HEIGHT } from '@/constants/Values'
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import {
    CalendarDaysIcon as CalendarOutline,
    FilmIcon as FilmOutline,
    UsersIcon as UsersOutline
} from 'react-native-heroicons/outline'
import {
    CalendarDaysIcon as CalendarSolid,
    FilmIcon as FilmSolid,
    UsersIcon as UsersSolid
} from 'react-native-heroicons/solid'

const Layout = () => {
    const themeValue = useCustomTheme()
    const { colors } = themeValue


    const { setIsAdminMode } = useCustomTheme()

    useEffect(() => {
        const backAction = () => {
            Alert.alert('Message', 'Are you sure to Exit Admin Manager Mode?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'YES', onPress: () => {
                        setIsAdminMode(false)
                        router.replace('/')
                    }
                },
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    return (
        <Tabs screenOptions={{
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
            <Tabs.Screen
                name='theatre'
                options={{
                    tabBarIcon: ({ focused }) => <MaterialCommunityIcons name={focused ? 'sofa-single' : 'sofa-single-outline'} size={24} color={focused ? colors.icon.highlight : colors.icon.enable} />
                }} />
            <Tabs.Screen
                name='service'
                options={{
                    tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'fast-food-sharp' : 'fast-food-outline'} size={24} color={focused ? colors.icon.highlight : colors.icon.enable} />
                }} />

            <Tabs.Screen
                name='analysis'
                options={{
                    tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={22} color={focused ? colors.icon.highlight : colors.icon.enable} />
                }} />
            <Tabs.Screen
                name='movie'
                options={{
                    tabBarIcon: ({ focused }) => !focused ? <FilmOutline color={colors.icon.enable} size={24} />
                        : <FilmSolid color={colors.icon.highlight} size={24} />
                }} />
            <Tabs.Screen
                name='user'
                options={{
                    tabBarIcon: ({ focused }) => focused ?
                        <UsersSolid color={colors.icon.highlight} size={24} />
                        : <UsersOutline color={colors.icon.enable} size={24} />
                }} />
        </Tabs>
    )
}

export default Layout