import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import PublicAxios, { PublicURL } from "@/src/api/axios"
import { ListResponse, MovieType } from "@/constants/types"
import { getDeviceLocales } from "@/hooks/permissions"
import { RootState } from "./store"
import { updateListGroupShowing } from "./publicSlice"
import { FETCH_NOW_SHOWING, FETCH_UPCOMING } from "./publicActionType"
import { create } from "react-test-renderer"


export const fetchNowShowing = createAsyncThunk(
    FETCH_NOW_SHOWING,
    async (data: {
        page: number
    }, thunkApi) => {
        try {
            const res = await PublicAxios.getPublicList('/now-showing', data.page)
                .then(res => {
                    return res.data
                })
            return res
        } catch (error: any) {
            return error.message
        }
    }
)

export const fetchUpcoming = createAsyncThunk(
    FETCH_UPCOMING,
    async (data: {
        page: number
    }, thunkApi) => {
        try {
            const res = await PublicAxios.getPublicList('/upcoming', data.page)
                .then(res => {
                    return res.data
                })
            return res
        } catch (error: any) {
            return { msg: error.message }
        }
    }
)

export const fetchMovie = createAsyncThunk(
    'public/fetchMovie',
    async (id: string,) => {
        try {
            const movieResponse = await PublicAxios.getMovie(id).then(res => res.data)
            const castResponse = await PublicAxios.getMovieCast(id).then(res => res.data)
            return { movie: movieResponse, cast: castResponse }
        } catch (error: any) {
            return error.message
        }
    }
)

export const fetchPerson = createAsyncThunk(
    'public/fetchPerson',
    async (id: string,) => {
        try {
            const personResponse = await PublicAxios.getPerson(id).then(res => res.data)
            const castResponse = await PublicAxios.getPersonCast(id).then(res => res.data)
            return { person: personResponse, cast: castResponse }
        } catch (error: any) {
            return error.message
        }
    }
)