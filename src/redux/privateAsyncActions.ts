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