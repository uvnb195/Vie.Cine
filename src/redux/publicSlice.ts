import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { fetchMovie, fetchNowShowing, fetchPerson, fetchUpcoming } from "./publicAsyncAction"
import { ListResponse, MovieType } from "@/constants/types"
import { User } from "firebase/auth"
import { Cast } from "@/constants/types/PersonType"

interface PublicStates {
    location: {
        city: string,
        district: string
    },
    userInfo: User | undefined,
    nowShowing: MovieType[],
    nowShowingReachingEnd: boolean,
    upComing: MovieType[],
    upcomingReachingEnd: boolean,
    listGroupShowing: MovieType[],
    loading: boolean,
    fetching: boolean,
    imageUri: string,
    movieInfo: { movie?: MovieType, cast?: Cast[] },
    personInfo: { person?: Cast, cast?: MovieType[] },
    phoneRegion: string
}

type UpdateType = 'nowShowing' | 'upComing' | 'reset'

const initValue: PublicStates = {
    location: {
        city: '',
        district: ''
    },
    userInfo: undefined,
    nowShowing: [],
    nowShowingReachingEnd: false,
    upComing: [],
    upcomingReachingEnd: false,
    listGroupShowing: [],
    loading: true,
    fetching: false,
    imageUri: '',
    movieInfo: {},
    personInfo: {},
    phoneRegion: ''
}

export const publicSlice = createSlice({
    name: 'public',
    initialState: initValue,
    reducers: {
        setLoading: (
            state,
            action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setUser: (
            state,
            action: PayloadAction<User>) => {
            state.userInfo = action.payload
        },
        setPhoneRegion: (
            state,
            action: PayloadAction<string>) => {
            state.phoneRegion = action.payload
        },
        resetDetail: (state) => {
            state.movieInfo = {}
        },
        resetPersonDetail: (state) => {
            state.personInfo = {}
        },
        updateListGroupShowing: (state, action: PayloadAction<UpdateType>) => {
            switch (action.payload) {
                case 'nowShowing':
                    state.listGroupShowing = state.nowShowing
                    break
                case 'upComing':
                    state.listGroupShowing = state.upComing
                    break
                default:
                    state.listGroupShowing = []
            }
        }
    },
    extraReducers: (builder) => {
        // fetch now showing list
        builder
            .addCase(fetchNowShowing.fulfilled, (state, action) => {
                state.loading = false
                state.fetching = false
                const page = action.meta.arg.page
                if (page > 1) {
                    if (action.payload.length < 20) {
                        state.nowShowingReachingEnd = true
                        return
                    }
                    state.listGroupShowing = state.listGroupShowing.concat(action.payload)
                } else {
                    state.nowShowing = action.payload
                }
            })
            .addCase(fetchNowShowing.pending, (state, action) => {
                state.loading = true
                if (!state.nowShowingReachingEnd)
                    state.fetching = true
            })
            .addCase(fetchNowShowing.rejected, (state, action) => {
                state.loading = false
                state.fetching = false
            }),
            // fetch upcoming list
            builder
                .addCase(fetchUpcoming.fulfilled, (state, action) => {
                    state.loading = false
                    state.fetching = false
                    const page = action.meta.arg.page
                    if (page > 1) {
                        if (action.payload.length < 20) {
                            state.upcomingReachingEnd = true
                            return
                        }
                        state.listGroupShowing = state.listGroupShowing.concat(action.payload)
                    } else {
                        state.upComing = action.payload
                    }
                })
                .addCase(fetchUpcoming.pending, (state, action) => {
                    if (!state.upcomingReachingEnd)
                        state.fetching = true
                    state.loading = true
                })
                .addCase(fetchUpcoming.rejected, (state, action) => {
                    state.loading = false
                    state.fetching = false
                }),
            // fetch movie detail
            builder.addCase(fetchMovie.fulfilled, (state, action) => {
                state.fetching = false
                state.loading = false
                state.movieInfo = {
                    movie: action.payload.movie,
                    cast: action.payload.cast
                }
            })
                .addCase(fetchMovie.pending, (state, action) => {
                    state.fetching = true
                    state.loading = true
                })
                .addCase(fetchMovie.rejected, (state, action) => {
                    state.fetching = false
                    state.loading = false
                }),
            //fetch person detail
            builder.addCase(fetchPerson.fulfilled, (state, action) => {
                state.fetching = false
                state.loading = false
                state.personInfo = {
                    person: action.payload.person,
                    cast: action.payload.cast
                }
            })
                .addCase(fetchPerson.pending, (state, action) => {
                    state.fetching = true
                    state.loading = true
                })
                .addCase(fetchPerson.rejected, (state, action) => {
                    state.loading = false
                    state.fetching = false
                })
    }
})

export const selectPublic = (state: { public: PublicStates }) => state.public

export const { setLoading,
    setPhoneRegion,
    resetDetail,
    setUser,
    resetPersonDetail,
    updateListGroupShowing } = publicSlice.actions
export default publicSlice.reducer