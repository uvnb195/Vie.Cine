import { BookingType } from "@/constants/types/BookingType";
import { fetchUserInfo } from "@/src/redux/privateAsyncActions";
import axios from "axios";


class PrivateAxiosRepository {
    axiosInstance = axios.create({
        baseURL: (`${process.env.EXPO_PUBLIC_BASE_URL}/user`),
        timeout: 3000
    })

    async getUserInfo(token: string) {
        return this.axiosInstance({
            method: 'GET',
            url: '/',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
    async updateProfile(data: FormData, token: string) {
        return this.axiosInstance({
            method: 'POST',
            url: '/update-profile',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data: data
        })
    }
    async updateAvatar(data: FormData, token: string) {
        return this.axiosInstance({
            method: 'PATCH',
            url: '/update-avatar',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data: data
        })
    }

    async getMovieSchedule(token: string, movieId: number) {
        return this.axiosInstance({
            method: 'GET',
            url: `/schedule/${movieId}`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
    async getTheatreDetail(token: string, theatreId: string) {
        return this.axiosInstance({
            method: 'GET',
            url: `/theatre/${theatreId}`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
    async getServices(token: string) {
        return this.axiosInstance({
            method: 'GET',
            url: '/service',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    async getBooking(token: string) {
        return this.axiosInstance({
            method: 'GET',
            url: '/booking',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
    async addBooking(token: string, data: FormData) {
        return this.axiosInstance({
            method: 'POST',
            url: '/booking',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data: data
        })
    }
}

export default new PrivateAxiosRepository()