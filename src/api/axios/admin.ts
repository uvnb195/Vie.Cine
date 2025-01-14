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

    async addRoom(
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
            }
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
}

export default new AdminAxiosRepository();