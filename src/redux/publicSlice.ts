import { ListResponse, MovieType } from "@/constants/types"
import { Cast } from "@/constants/types/PersonType"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "firebase/auth"
import { fetchList, fetchMovie, fetchPerson, postSearch } from "./publicAsyncAction"
import { PublicURL } from "../api/axios"

interface PublicStates {
    location: {
        city: string,
        district: string
    },
    // undefined: startup, 
    // null: not logged in, 
    // User: logged in as user
    userInfo: User | null | undefined,
    nowShowing: ListResponse<MovieType> | null,
    nowShowingReachingEnd: boolean,
    upComing: ListResponse<MovieType> | null,
    upcomingReachingEnd: boolean,
    longList: ListResponse<MovieType | Cast> | null,
    loading: boolean,
    fetching: boolean,
    imageUri: string,
    movieInfo: { movie?: MovieType, cast?: Cast[] },
    personInfo: { person?: Cast, cast?: MovieType[] },
    phoneRegion: string,
    search: {
        keyword: string | string[],
        movie: ListResponse<MovieType> | null,
        person: ListResponse<Cast> | null
    }
}

const initValue: PublicStates = {
    location: {
        city: '',
        district: ''
    },
    userInfo: undefined,
    nowShowing: null,
    nowShowingReachingEnd: false,
    upComing: null,
    upcomingReachingEnd: false,
    longList: null,
    loading: false,
    fetching: false,
    imageUri: '',
    movieInfo: {},
    personInfo: {},
    phoneRegion: '',
    search: {
        keyword: '',
        movie: null,
        person: null
    }
}

export const publicSlice = createSlice({
    name: 'public',
    initialState: initValue,
    reducers: {
        setLoading: (
            state,
            action: PayloadAction<boolean>) => {
            state.loading = action.payload
            if (action.payload === true) {
                state.movieInfo = {}
                state.personInfo = {}
            }
        },
        setUser: (
            state,
            action: PayloadAction<User | null>) => {
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
        updateLongList: (
            state,
            action: PayloadAction<PublicURL | null>) => {
            switch (action.payload) {
                case "/now-showing":
                    state.longList = state.nowShowing
                    break
                case "/upcoming":
                    state.longList = state.upComing
                    break
                case "/trending": break;
                case "/search/movie": break;
                case "/search/person": break;
                default: state.longList = null
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch  list
            .addCase(fetchList.fulfilled, (state, action) => {
                const page = action.meta.arg.page
                const url = action.meta.arg.url
                if (page == 1) state.longList = null
                switch (url) {
                    case "/now-showing":
                        if (page == 1) {
                            state.nowShowing = action.payload
                        } else {
                            const newResults = action.payload.results
                            state.longList = {
                                ...action.payload,
                                results: state.longList?.results?.concat(newResults),
                            }
                        }
                        break
                    case "/upcoming": {
                        if (page == 1) {
                            state.upComing = action.payload
                        } else
                            state.upComing = {
                                ...action.payload, result: state.upComing?.results + action.payload.results,
                                page: page,
                            }
                        break
                    }
                    case "/trending": break
                    case "/search/movie": break
                    case "/search/person": break
                }
                state.fetching = false
            })
            .addCase(fetchList.pending, (state, action) => {
                const page = action.meta.arg.page
                state.fetching = true
            })
            .addCase(fetchList.rejected, (state, action) => {
                state.fetching = false
            })
            // fetch movie detail
            .addCase(fetchMovie.pending,
                (state, action) => {
                })
            .addCase(
                fetchMovie.fulfilled,
                (state,
                    action) => {
                    state.movieInfo = {
                        movie: action.payload.movie,
                        cast: action.payload.cast
                    }
                })
            .addCase(fetchMovie.rejected,
                (state, action) => {
                })
            //fetch person detail
            .addCase(fetchPerson.pending,
                (state, action) => {
                })
            .addCase(fetchPerson.fulfilled,
                (state, action) => {
                    state.personInfo = {
                        person: action.payload.person,
                        cast: action.payload.cast
                    }
                })
            .addCase(fetchPerson.rejected,
                (state, action) => {
                })
            //search
            .addCase(postSearch.fulfilled, (state, action) => {
                state.search = {
                    keyword: action.meta.arg.keyword,
                    movie: action.payload.movie,
                    person: action.payload.person
                }
            })
            .addCase(postSearch.pending, (state, action) => {
            })
            .addCase(postSearch.rejected, (state, action) => {
            })
    }
})

export const selectPublic = (state: { public: PublicStates }) => state.public

export const { setLoading,
    setPhoneRegion,
    resetDetail,
    setUser,
    resetPersonDetail,
    updateLongList } = publicSlice.actions
export default publicSlice.reducer