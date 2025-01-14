import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, useLocalSearchParams } from 'expo-router'
import Address from './(add)'

const ServiceRoutes = () => {
    const id = useLocalSearchParams().id.toString()
    if (id === 'add') {
        return (<Redirect href={{ pathname: '/routes/admin-routes/form/(service)/(add)' }} />)
    } else {
        return (<Redirect href={{ pathname: '/routes/admin-routes/form/(service)/(add)' }} />)
    }
}

export default ServiceRoutes