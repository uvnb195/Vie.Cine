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
}

export default new PrivateAxiosRepository()