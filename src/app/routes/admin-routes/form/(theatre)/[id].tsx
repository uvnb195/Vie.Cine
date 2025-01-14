import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect, useLocalSearchParams } from 'expo-router'
import Address from './(add)'
import { useAdminTheatre } from '@/src/contexts/theatre'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/redux/store'
import { fetchAllProvince } from '@/src/redux/publicAsyncActions'

const TheatreRoutes = () => {
    const id = useLocalSearchParams().id.toString()
    const { data } = useAdminTheatre()
    const { provinces } = useSelector((state: RootState) => state.public)
    const dispatch = useDispatch<AppDispatch>()


    useEffect(() => {
        if (data.location.lat !== null && data.location.lng !== null && provinces.length === 0) {
            dispatch(fetchAllProvince())
        } else {
            setDisableNext(true)
        }
    }, [data.location])

    if (id === 'add') {
        return (<Redirect href={{ pathname: '/routes/admin-routes/form/(theatre)/(add)' }} />)
    } else {
        return (<Redirect href={{ pathname: '/routes/admin-routes/form/(theatre)/(detail)' }} />)
    }
}

export default TheatreRoutes

function setDisableNext(arg0: boolean) {
    throw new Error('Function not implemented.')
}
