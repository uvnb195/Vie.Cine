import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit"
import AdminAxiosRepository from '@/src/api/axios/admin'

export const getTheatres = createAsyncThunk(
    'admin/getTheatres',
    async (token: string) => {
        const response = await AdminAxiosRepository.getTheatres(token)
        return response.data
    }
)
export const getTheatreDetail = createAsyncThunk(
    'admin/getTheatreDetail',
    async (data: { token: string, id: string }) => {
        const response = await AdminAxiosRepository.getTheatreDetail(data.token, data.id)
        return response.data
    })
export const addTheatre = createAsyncThunk(
    'admin/addTheatre',
    async (data: { token: string, data: FormData }) => {
        console.log(data.token)
        try {
            const response = await AdminAxiosRepository.addTheatre(data.token, data.data)

            return response
        } catch (err) {
            return isRejectedWithValue(err)
        }
    }
)

export const getRooms = createAsyncThunk(
    'admin/getRooms',
    async (data: { token: string, theatreId: string }) => {
        const response = await AdminAxiosRepository.getRooms(data.token, data.theatreId)
        return response.data
    }
)

export const addRoom = createAsyncThunk(
    'admin/addRoom',
    async (data: { token: string, theatreId: string, room: FormData }) => {
        try {
            const response = await AdminAxiosRepository.addRoom(data.token, data.theatreId, data.room)
            return response.data
        } catch (err) {
            return isRejectedWithValue(err)
        }
    })

export const getServices = createAsyncThunk(
    'admin/getServices',
    async (token: string) => {
        const response = await AdminAxiosRepository.getServices(token)
        return response.data
    }
)
export const addService = createAsyncThunk(
    'admin/addService',
    async (data: { token: string, service: FormData }) => {
        try {
            const response = await AdminAxiosRepository.addService(data.token, data.service)
            return response.data
        } catch (err) {
            return isRejectedWithValue(err)
        }
    }
)

export const getMovies = createAsyncThunk(
    'admin/getMovies',
    async (token: string) => {
        try {
            const response = await AdminAxiosRepository.getMovies(token)
            return response.data
        } catch (err) {
            return isRejectedWithValue(err)
        }
    }
)
export const addMovie = createAsyncThunk(
    'admin/addMovie',
    async (data: { token: string, movie: FormData }) => {
        try {
            const response = await AdminAxiosRepository.addMovie(data.token, data.movie)
            return response.data
        } catch (err) {
            return isRejectedWithValue(err)
        }
    }
)

export const addSchedule = createAsyncThunk(
    'admin/addSchedule',
    async (data: { token: string, schedule: FormData }) => {
        try {
            const response = await AdminAxiosRepository.addSchedule(data.token, data.schedule)
            return response.data
        } catch (err) {
            return isRejectedWithValue(err)
        }
    }
)
export const getSchedules = createAsyncThunk(
    'admin/getSchedules',
    async (token: string) => {
        try {
            const response = await AdminAxiosRepository.getSchedules(token)
            return response.data
        } catch (err) {
            return isRejectedWithValue(err)
        }
    }
)

