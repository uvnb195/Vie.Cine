import PublicAxios, { PublicURL } from "@/src/api/axios"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { FETCH_LIST } from "./publicActionType"


export const fetchList = createAsyncThunk(
    FETCH_LIST,
    async (data: {
        page: number,
        url: PublicURL
    }, thunkApi) => {
        try {
            const res = await PublicAxios.getPublicList(data.url, data.page)
                .then(res => {
                    return res.data
                })
            return res
        } catch (error: any) {
            return error.message
        }
    }
)

export const fetchMovie = createAsyncThunk(
    'public/fetchMovie',
    async (data: { id: string }, thunkApi) => {
        try {
            const movieResponse = await PublicAxios.getMovie(data.id).then(res => res.data)
            const castResponse = await PublicAxios.getMovieCast(data.id).then(res => res.data)
            return { movie: movieResponse, cast: castResponse }
        } catch (error: any) {
            return error.message
        }
    }
)

export const fetchPerson = createAsyncThunk(
    'public/fetchPerson',
    async (data: { id: string }, thunkApi) => {
        try {
            const personResponse = await PublicAxios.getPerson(data.id).then(res => res.data)
            const castResponse = await PublicAxios.getPersonCast(data.id).then(res => res.data)
            return { person: personResponse, cast: castResponse }
        } catch (error: any) {
            return error.message
        }
    }
)

export const postSearch = createAsyncThunk(
    'public/postSearch',
    async (data: { keyword: string | string[] }, thunkApi) => {
        try {
            const decodedKeyword = (Array.isArray(data.keyword)) ? data.keyword.join('+') : data.keyword
            const res = await PublicAxios.search(decodedKeyword).then(res => res.data)
            return { ...res, keyword: data.keyword }
        } catch (error: any) {
            return null
        }
    }
)