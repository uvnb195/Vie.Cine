import { ScheduleType } from "@/constants/types/ScheduleType";
import axios from "axios";

class AdminAxiosRepository {
    axiosInstance = axios.create({
        baseURL: (`${process.env.EXPO_PUBLIC_BASE_URL}/admin`),
        timeout: 3000
    })

    async getTheatres(token: string) {
        return this.axiosInstance({
            method: 'GET',
            url: '/theatre',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
    async getTheatreDetail(token: string, id: string) {
        return this.axiosInstance({
            method: 'GET',
            url: `/theatre/${id}`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
    async addTheatre(token: string, data: FormData) {
        return this.axiosInstance({
            method: 'POST',
            url: '/theatre',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data: data
        })
    }

    // room
    async getRooms(token: string, theatreId: string) {
        return this.axiosInstance({
            method: 'GET',
            url: `/room/${theatreId}`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
    }
    async getRoomDetail(token: string, theatreId: string, roomId: string) {
        return this.axiosInstance({
            method: 'GET',
            url: `/room/${theatreId}/${roomId}`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
    async upsertRoom(
        token: string,
        theatreId: string,
        room: FormData) {
        return this.axiosInstance({
            method: 'POST',
            url: `/room/${theatreId}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data: room
        })
    }

    // service
    async getServices(token: string) {
        return this.axiosInstance({
            method: 'GET',
            url: '/service',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
    async addService(token: string, service: FormData) {
        return this.axiosInstance({
            method: 'POST',
            url: '/service',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data: service
        })
    }

    //movie
    async getMovies(token: string) {
        return this.axiosInstance({
            method: 'GET',
            url: '/movie',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
    async addMovie(token: string, movie: FormData) {
        return this.axiosInstance({
            method: 'POST',
            url: '/movie',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data: movie
        })
    }

    //schedule
    async getSchedules(token: string) {
        return this.axiosInstance({
            method: 'GET',
            url: '/schedule',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
    }
    async getDBMovies(token: string) {

    }
    async getRoomSchedule(token: string, roomId: string) {
        return this.axiosInstance({
            method: 'GET',
            url: `/room-schedule/${roomId}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        })
    }
    async checkExitsSchedule(token: string, roomId: string, timeStart: Date, duration: number, date: Date) {
        const form = new FormData()
        form.append('roomId', roomId)
        form.append('timeStart', timeStart.toISOString())
        form.append('duration', duration.toString())
        form.append('date', date.toISOString())
        return this.axiosInstance({
            method: 'GET',
            url: `/room/${roomId}/schedule-check`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data: form
        })
    }
    async addSchedule(token: string, schedule: FormData) {
        return this.axiosInstance({
            method: 'POST',
            url: '/schedule',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data: schedule
        })
    }

    async addSchedules(token: string, roomId: string, schedules: string) {
        return this.axiosInstance({
            method: 'POST',
            url: `/room/${roomId}/add-schedules`,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            data: { schedules: schedules }
        })
    }
}

export default new AdminAxiosRepository();