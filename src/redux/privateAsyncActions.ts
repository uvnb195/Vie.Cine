import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import PrivateAxiosRepository from '@/src/api/axios/private'

export const updateProfile = createAsyncThunk(
    'private/updateInfo',
    async (data: {
        formData: FormData,
        token?: string
    }) => {
        try {
            if (!data.token) return isRejectedWithValue('Token is required')
            const res = await PrivateAxiosRepository.updateProfile(data.formData, data.token).then(res => res.data)
            return res
        } catch (err) {
            return isRejectedWithValue(err)
        }
    }
)

export const fetchUserInfo = createAsyncThunk(
    'private/getUserInfo',
    async (data: { token: string }) => {
        try {
            const res = await PrivateAxiosRepository.getUserInfo(data.token).then(res => res.data)
            return res
        } catch (err) {
            return isRejectedWithValue(err)
        }
    })

export const updateAvatar = createAsyncThunk(
    'private/updateAvatar',
    async (data: { formImage: FormData, token: string }) => {
        try {
            const res = await PrivateAxiosRepository.updateAvatar(data.formImage, data.token).then(res => res.data)
            return res
        } catch (err) {
            return isRejectedWithValue(err)
        }
    })

export const getMovieSchedule = createAsyncThunk(
    'private/getMovieSchedule',
    async (data: {
        token: string,
        movieId: number
    }) => {
        try {
            const res = await PrivateAxiosRepository.getMovieSchedule(data.token, data.movieId).then(res => res.data)
            return res
        } catch (err) {
            return isRejectedWithValue(err)
        }
    })
export const getTheatreDetail = createAsyncThunk(
    'private/getTheatreDetail',
    async (data: {
        token: string,
        theatreId: string
    }) => {
        try {
            const res = await PrivateAxiosRepository.getTheatreDetail(data.token, data.theatreId).then(res => res.data)
            return res
        } catch (err) {
            return isRejectedWithValue(err)
        }
    })

export const getServices = createAsyncThunk(
    'private/getServices',
    async (token: string) => {
        try {
            const res = await PrivateAxiosRepository.getServices(token).then(res => res.data)
            return res
        } catch (err) {
            return isRejectedWithValue(err)
        }
    })

export const getBooking = createAsyncThunk(
    'private/getBooking',
    async (token: string) => {
        try {
            const res = await PrivateAxiosRepository.getBooking(token).then(res => res.data)
            return res
        } catch (err) {
            return isRejectedWithValue(err)
        }
    })
export const addBooking = createAsyncThunk(
    'private/addBooking',
    async (data: {
        token: string,
        booking: FormData
    }) => {
        try {
            const res = await PrivateAxiosRepository.addBooking(data.token, data.booking).then(res => res.data)
            return res
        } catch (err) {
            return isRejectedWithValue(err)
        }
    })
