import PublicAxiosRepository, { PublicURL } from "@/src/api/axios/public"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { FETCH_LIST } from "./publicActionType"


export const fetchList = createAsyncThunk(
    FETCH_LIST,
    async (data: {
        page: number,
        url: PublicURL
    }) => {
        try {
            const res = await PublicAxiosRepository
                .getPublicList(data.url, data.page)
                .then(res => res.data)
            return res
        } catch (error: any) {
            return error.message
        }
    }
)

export const fetchMovie = createAsyncThunk(
    'public/fetchMovie',
    async (data: { id: string }) => {
        try {
            const movieResponse = await PublicAxiosRepository
                .getMovie(data.id)
                .then(res => res.data)
            const castResponse = await PublicAxiosRepository
                .getMovieCast(data.id)
                .then(res => res.data)
            return { movie: movieResponse, cast: castResponse }
        } catch (error: any) {
            return error.message
        }
    }
)

export const fetchPerson = createAsyncThunk(
    'public/fetchPerson',
    async (data: { id: string }) => {
        try {
            const personResponse = await PublicAxiosRepository
                .getPerson(data.id)
                .then(res => res.data)
            const castResponse = await PublicAxiosRepository
                .getPersonCast(data.id)
                .then(res => res.data)
            return { person: personResponse, cast: castResponse }
        } catch (error: any) {
            return error.message
        }
    }
)

export const postSearch = createAsyncThunk(
    'public/postSearch',
    async (data: { keyword: string | string[] }) => {
        try {
            const decodedKeyword = (Array.isArray(data.keyword)) ? data.keyword.join('+') : data.keyword
            const res = await PublicAxiosRepository.search(decodedKeyword).then(res => res.data)
            return { ...res, keyword: data.keyword }
        } catch (error: any) {
            return null
        }
    }
)

export const fetchAllProvince = createAsyncThunk(
    'public/fetchAllProvince',
    async (_, thunkApi) => {
        try {
            const res = await PublicAxiosRepository.getProvinces().then(res => {
                if (res.status === 500 || !res.data) return []
                else return res.data
            })
            return res
        } catch (error: any) {
            thunkApi.rejectWithValue([])
            return []
        }
    }
)

export const fetchDistricts = createAsyncThunk(
    'public/fetchDistricts',
    async (data: {
        provinceCode: number
    }, thunkApi) => {
        try {
            const res = await PublicAxiosRepository.getDistricts(data.provinceCode).then(res => {
                if (res.status === 500 || !res.data) return { data: [] }
                else
                    return res.data
            })
            return res
        } catch (error: any) {
            thunkApi.rejectWithValue([])
            return []
        }
    })

export const fetchWards = createAsyncThunk(
    'public/fetchWards',
    async (data: {
        districtCode: number
    }, thunkApi) => {
        try {
            const res = await PublicAxiosRepository.getWards(data.districtCode).then(res => res.data)
            return res
        } catch (error: any) {
            console.log(error.message)
            thunkApi.rejectWithValue([])
            return []
        }
    })