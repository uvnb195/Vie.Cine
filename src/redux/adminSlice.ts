import { ServiceType } from "@/constants/types/ServiceType";
import { TheatreType } from "@/constants/types/TheatreType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminMovieType } from "../contexts/movie";
import { addMovie, addRoom, addSchedule, addService, addTheatre, getMovies, getRooms, getSchedules, getServices, getTheatreDetail, getTheatres } from "./adminAsyncActions";
import { Modify } from "react-native-maps/lib/sharedTypesInternal";
import { Status } from "./publicSlice";
import { RoomType } from "@/constants/types/RoomType";

export enum SeatType {
    VIP,
    SWEET_BOX,
    STANDARD,
    EMPTY,
    UNAVAILABLE
}

export interface SeatProps {
    seatType: SeatType,
    seatCode: string | null
}

export interface TheatreResponse extends Modify<TheatreType, {
    location: {
        address: string,
        lat: number,
        lng: number
    }
}> { }

const initValue = {
    status: Status.IDLE as Status,
    theatres: [] as TheatreType[],
    rooms: {
        theatreId: '',
        data: [] as RoomType[]
    },
    editRoom: {} as RoomType,
    services: [] as ServiceType[],
    movies: [] as AdminMovieType[],
    users: [],
    theatreDetail: {} as TheatreResponse,
    schedule: [] as any[]
}

export const adminSlice = createSlice({
    name: 'admin',
    initialState: initValue,
    reducers: {
        resetDetail: (state) => {
            state.theatreDetail = {} as TheatreResponse
        },
        updateStatus: (state, action: PayloadAction<Status>) => {
            state.status = action.payload
        },
        addRooms: (state, action: PayloadAction<{ theatreId: string }>) => {
            state.rooms = {
                theatreId: action.payload.theatreId,
                data: [] as RoomType[]
            }
        },
        curRoom: (state, action: PayloadAction<Partial<RoomType>>) => {
            if (action.payload === {} as RoomType) {
                state.editRoom = {} as RoomType
            }
            else {
                state.editRoom = {
                    ...state.editRoom,
                    ...action.payload
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // theatre
            .addCase(getTheatres.fulfilled,
                (state, action: PayloadAction<TheatreType[]>) => {
                    state.theatres = action.payload
                })
            .addCase(getTheatreDetail.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const address = `${action.payload.location.street},\n${action.payload.location.district.name}, ${action.payload.location.province.name}`
                    state.theatreDetail = {
                        ...action.payload,
                        map2d: JSON.parse(action.payload.map2d),
                        location: {
                            address,
                            lat: action.payload.location.lat,
                            lng: action.payload.location.lng
                        }
                    }
                }
            )
            .addCase(addTheatre.fulfilled,
                (state, action: any) => {
                    if (action.payload === false) {
                        state.status = Status.FAILED
                        return
                    }
                    const { data, status } = action.payload
                    console.log('status<>', status)
                    state.theatres.push(action.payload.data)
                    state.status = Status.SUCCESS
                })
            .addCase(addTheatre.rejected,
                (state, action) => {
                    state.status = Status.FAILED
                })
            .addCase(addTheatre.pending,
                (state) => {
                    state.status = Status.PENDING
                })

            //room
            .addCase(getRooms.fulfilled,
                (state, action: PayloadAction<any[]>) => {
                    state.rooms.data = action.payload
                    state.status = Status.SUCCESS
                })
            .addCase(addRoom.fulfilled,
                (state, action: PayloadAction<any>) => {
                    console.log('add room success', action.payload)
                    state.rooms.data.push(action.payload)
                    state.status = Status.SUCCESS
                }
            )
            .addCase(addRoom.rejected,
                (state, action) => {
                    state.status = Status.FAILED
                })
            .addCase(addRoom.pending,
                (state) => {
                    state.status = Status.PENDING
                }
            )

            // service
            .addCase(getServices.fulfilled,
                (state, action: PayloadAction<ServiceType[]>) => {
                    console.log('fetch', action.payload)
                    state.services = action.payload
                })
            .addCase(addService.fulfilled,
                (state,
                    action: PayloadAction<ServiceType>) => {
                    state.services.push(action.payload)
                })

            // movie
            .addCase(getMovies.fulfilled,
                (state, action: PayloadAction<any[]>) => {
                    state.movies = action.payload
                })
            .addCase(addMovie.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.movies.push(action.payload)
                })

            //schedule
            .addCase(getSchedules.fulfilled,
                (state, action: PayloadAction<any[]>) => {
                    state.schedule = action.payload
                })
            .addCase(addSchedule.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.schedule.push(action.payload)
                }
            )
    }
})

export const {
    resetDetail,
    updateStatus,
    addRooms,
    curRoom,
} = adminSlice.actions
export default adminSlice.reducer