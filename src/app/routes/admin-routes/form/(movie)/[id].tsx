import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, useLocalSearchParams } from 'expo-router'
import Address from './(add)'

const TheatreRoutes = () => {
    const id = useLocalSearchParams().id.toString()
    if (id === 'add') {
        return (<Redirect href={{ pathname: '/routes/admin-routes/form/(movie)/(add)' }} />)
    } else {
        return (<Redirect href={{ pathname: '/routes/admin-routes/form/(movie)/(add)' }} />)
    }
}

export default TheatreRoutes