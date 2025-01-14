import { UserInfo } from "@/constants/types/UserType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addBooking, fetchUserInfo, getBooking, getMovieSchedule, getServices, updateAvatar, updateProfile } from "./privateAsyncActions";
import { ScheduleType } from "@/constants/types/ScheduleType";
import { TheatreResponse } from "./adminSlice";
import { getTheatreDetail } from "./adminAsyncActions";
import { TheatreType } from "@/constants/types/TheatreType";
import { Modify } from "react-native-maps/lib/sharedTypesInternal";
import { AdminTheatreType } from "../contexts/theatre";
import { ServiceType } from "@/constants/types/ServiceType";
import { BookingType } from "@/constants/types/BookingType";

export interface UserTheatreList extends Modify<TheatreType, {
    location: {
        address: string,
        lat: number,
        lng: number
    },
    map2d: null,
}> { }

interface NowBooking extends Pick<BookingType,
    '_id'
    | 'price'
    | 'movieScheduleId'
    | 'selectedTime'> { }

interface PrivateStates {
    //undefined: initState state
    //null: user not logged in
    userInfo: UserInfo | null | undefined,
    schedules: ScheduleType[],
    theatres: UserTheatreList[],
    services: ServiceType[],
    theatreDetail: TheatreResponse | null,
    bookedList: BookingType[],
    booking: NowBooking | null
}

const initialState: PrivateStates = {
    userInfo: undefined,
    schedules: [],
    theatres: [],
    services: [],
    theatreDetail: null,
    bookedList: [],
    booking: null
}

export const privateSlice = createSlice({
    name: 'private',
    initialState,
    reducers: {
        updateEmailVerify: (
            state,
            action: PayloadAction<boolean>) => {
            if (state.userInfo)
                state.userInfo.emailVerified = action.payload
        },
        clearUser: (state) => {
            state.userInfo = null
        },
        resetSchedules: (state) => {
            state.schedules = []
            state.theatres = []
        },
        resetTheatres: (state) => {
            state.theatres = []
        },
        addBookingTicket: (state, action: PayloadAction<NowBooking | null>) => {
            state.booking = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchUserInfo.fulfilled,
                (state, action) => {
                    const date = new Date(action.payload.birthday)
                    const birthday = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                    state.userInfo = {
                        ...action.payload,
                        birthday
                    }
                }
            )
            .addCase(
                updateProfile.fulfilled,
                (state, action) => {
                    const date = new Date(action.payload.birthday)
                    const birthday = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                    state.userInfo = {
                        ...action.payload,
                        birthday
                    }
                }
            )
            .addCase(
                updateAvatar.fulfilled,
                (state, action) => {
                    const date = new Date(action.payload.birthday)
                    const birthday = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                    state.userInfo = {
                        ...action.payload,
                        birthday
                    }
                }
            )
            .addCase(getMovieSchedule.fulfilled, (state, action) => {
                state.schedules = action.payload
            })
            .addCase(getTheatreDetail.fulfilled, (state, action) => {
                let maps = JSON.parse(action.payload.map2d)
                const address = `${action.payload.location.street},\n${action.payload.location.district.name}, ${action.payload.location.province.name}`
                state.theatres.push({
                    ...action.payload,
                    map2d: null,
                    location: {
                        address,
                        lat: action.payload.location.lat,
                        lng: action.payload.location.lng
                    }
                })

                state.theatreDetail = { ...action.payload, map2d: maps }
            })
            .addCase(getServices.fulfilled, (state, action) => {
                state.services = action.payload
            })
            .addCase(addBooking.fulfilled, (state, action) => {
                state.bookedList.push(action.payload)
            })
            .addCase(getBooking.fulfilled, (state, action) => {
                state.bookedList = action.payload
            })

    }
})

export const {
    updateEmailVerify,
    clearUser,
    resetSchedules,
    resetTheatres,
    addBookingTicket
} = privateSlice.actions
export default privateSlice.reducer