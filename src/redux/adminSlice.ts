import { ServiceType } from "@/constants/types/ServiceType";
import { TheatreType } from "@/constants/types/TheatreType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addMovie, addSchedule, addSchedules, addService, addTheatre, checkExitsSchedule, getMovies, getRoomDetail, getRooms, getRoomSchedule, getSchedules, getServices, getTheatreDetail, getTheatres, upsertRoom } from "./adminAsyncActions";
import { Modify } from "react-native-maps/lib/sharedTypesInternal";
import { Status } from "./publicSlice";
import { RoomType } from "@/constants/types/RoomType";
import { ScheduleType } from "@/constants/types/ScheduleType";
import { MovieProps } from "@/constants/types/MovieType";

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
    movies: [] as MovieProps[],
    movie: {} as Partial<MovieProps>,
    users: [],
    theatreDetail: {} as TheatreResponse,
    schedule: [] as ScheduleType[],
    scheduleCheck: false,
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
            if (Object.keys(action.payload).length === 0) {
                console.log('reset room')
                state.editRoom = {} as RoomType
            }
            else {
                state.editRoom = {
                    ...state.editRoom,
                    ...action.payload
                }
            }
        },
        curMovie: (state, action: PayloadAction<Partial<MovieProps>>) => {
            if (Object.keys(action.payload).length === 0) {
                state.movie = {} as MovieProps
            }
            else {
                state.movie = {
                    ...state.movie,
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

            .addCase(getRoomDetail.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.editRoom = {
                        ...action.payload,
                        map2d: JSON.parse(action.payload.map2d) as SeatProps[][]
                    }
                    state.status = Status.SUCCESS
                }
            )
            .addCase(getRoomDetail.rejected,
                (state, action) => {
                    state.status = Status.FAILED
                })
            .addCase(getRoomDetail.pending,
                (state) => {
                    state.status = Status.PENDING
                })

            .addCase(upsertRoom.fulfilled,
                (state, action: PayloadAction<any>) => {
                    console.log('add room success', action.payload)

                    // add
                    if (!state.rooms.data.map(item => item._id).includes(action.payload._id)) {
                        console.log('is add room')
                        state.rooms.data.push({ ...action.payload, map2d: JSON.parse(action.payload.map2d) as SeatProps[][] })
                        state.editRoom = { ...action.payload, map2d: JSON.parse(action.payload.map2d) as SeatProps[][] }
                    }
                    //update
                    else {
                        console.log('is update room', action.payload)
                        state.rooms.data = state.rooms.data.map(item => item._id === action.payload._id ? ({ ...action.payload, map2d: JSON.parse(action.payload.map2d) as SeatProps[][] }) : item)
                        state.editRoom = { ...action.payload, map2d: JSON.parse(action.payload.map2d) as SeatProps[][] }
                    }
                    state.status = Status.SUCCESS
                }
            )
            .addCase(upsertRoom.rejected,
                (state, action) => {
                    state.status = Status.FAILED
                })
            .addCase(upsertRoom.pending,
                (state) => {
                    state.status = Status.PENDING
                }
            )

            // service
            .addCase(getServices.fulfilled,
                (state, action: PayloadAction<ServiceType[]>) => {
                    state.services = action.payload
                })
            .addCase(addService.fulfilled,
                (state,
                    action: PayloadAction<ServiceType>) => {
                    state.services.push(action.payload)
                })

            // movie
            .addCase(getMovies.fulfilled,
                (state, action: PayloadAction<MovieProps[]>) => {
                    state.movies = action.payload
                    state.status = Status.SUCCESS
                })
            .addCase(getMovies.rejected,
                (state, action) => {
                    state.status = Status.FAILED
                })
            .addCase(getMovies.pending,
                (state) => {
                    state.status = Status.PENDING
                })

            .addCase(addMovie.fulfilled,
                (state, action: PayloadAction<MovieProps>) => {
                    state.movies.push(action.payload)
                })

            //schedule
            .addCase(addSchedules.fulfilled,
                (state, action: PayloadAction<ScheduleType>) => {
                    console.log('add schedule', action.payload)
                    state.schedule = state.schedule.concat(action.payload)
                    state.status = Status.SUCCESS
                }
            )
            .addCase(addSchedules.rejected,
                (state, action) => {
                    state.status = Status.FAILED
                })
            .addCase(addSchedules.pending,
                (state) => {
                    state.status = Status.PENDING
                })

            .addCase(checkExitsSchedule.fulfilled,
                (state, action: PayloadAction<boolean>) => {
                    console.log('check finished', action.payload)
                    state.scheduleCheck = !action.payload
                    state.status = Status.SUCCESS
                })
            .addCase(checkExitsSchedule.rejected,
                (state, action) => {

                    console.log('check reject')
                    state.status = Status.FAILED
                })
            .addCase(checkExitsSchedule.pending,
                (state) => {
                    state.status = Status.PENDING
                })

            .addCase(getSchedules.fulfilled,
                (state, action: PayloadAction<any[]>) => {
                    state.schedule = action.payload
                })
            .addCase(getRoomSchedule.fulfilled,
                (state, action: PayloadAction<any[]>) => {
                    console.log(action.payload, 'get room schedule',)
                    state.schedule = action.payload.map(item => ({
                        ...item,
                        timeStart: new Date(item.timeStart)
                    }))
                    state.status = Status.SUCCESS
                }
            )
            .addCase(getRoomSchedule.rejected,
                (state, action) => {
                    state.status = Status.FAILED
                })
            .addCase(getRoomSchedule.pending,
                (state) => {
                    state.status = Status.PENDING
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
    curMovie
} = adminSlice.actions
export default adminSlice.reducer