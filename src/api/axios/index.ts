import { getDeviceLocales } from "@/hooks/permissions"
import axios from "axios"

export type PublicURL = '/now-showing' | '/upcoming' | '/trending' | '/search/movie' | '/search/person'

class PublicAxios {
    axiosInstance = axios.create({
        baseURL: process.env.EXPO_PUBLIC_BASEURL,
        timeout: 3000
    })

    regionCode = getDeviceLocales().regionCode || 'VN'

    getPublicList = (url: PublicURL, page: number) => {
        return this.axiosInstance({
            method: "GET",
            url: `${url}?page=${page}&region=${this.regionCode}`,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    // movie
    getMovie = (id: string) => {
        return this.axiosInstance({
            method: "GET",
            url: `/movie/${id}`,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    getMovieCast = (id: string) => {
        return this.axiosInstance({
            method: "GET",
            url: `/movie/${id}/cast`,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    //person
    getPerson = (id: string) => {
        return this.axiosInstance({
            method: "GET",
            url: `/person/${id}`,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    getPersonCast = (id: string) => {
        return this.axiosInstance({
            method: "GET",
            url: `/person/${id}/cast`,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    //search
    search = (keyword: string) => {
        return this.axiosInstance({
            method: "POST",
            url: `/search/${keyword}`,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}

export default new PublicAxios()