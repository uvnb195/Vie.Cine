import { Cast } from "@/constants/types/PersonType"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "firebase/auth"
import { fetchAllProvince, fetchDistricts, fetchList, fetchMovie, fetchPerson, fetchWards, postSearch } from "./publicAsyncActions"
import { PublicURL } from "../api/axios/public"
import { Address, ListResponse } from "@/constants/types/index"
import { MovieType } from "@/constants/types/MovieType"

export enum Status {
    IDLE,
    PENDING,
    SUCCESS,
    FAILED,
}

interface PublicStates {
    status: Status,
    location: {
        city: string,
        district: string
    },
    // undefined: startup, 
    // null: not logged in, 
    // User: logged in as user
    nowShowing: ListResponse<MovieType> | null,
    upComing: ListResponse<MovieType> | null,
    longList: ListResponse<MovieType> | null,
    loading: boolean,
    fetching: boolean,
    imageUri: string,
    movieInfo: { movie?: MovieType, cast?: ListResponse<Cast> },
    personInfo: { person?: Cast, cast?: MovieType[] },
    phoneRegion: string,
    search: {
        keyword: string | string[],
        movie: ListResponse<MovieType> | null,
        person: ListResponse<Cast> | null
    },
    provinces: Address<'Province'>[],
    districts: Address<'District'>[],
    wards: Address<'Ward'>[],
    local: {
        province: string | null,
        district: string | null,
        latitude: number,
        longitude: number,
    }
}
const initValue: PublicStates = {
    status: Status.IDLE,
    location: {
        city: '',
        district: ''
    },
    nowShowing: null,
    upComing: null,
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
    },
    provinces: [],
    districts: [],
    wards: [],
    local: {
        province: '',
        district: '',
        latitude: 0,
        longitude: 0
    }
}

export const publicSlice = createSlice({
    name: 'public',
    initialState: initValue,
    reducers: {
        updateStatus: (
            state,
            action: PayloadAction<Status>) => {
            state.status = action.payload
        },
        setLoading: (
            state,
            action: PayloadAction<boolean>) => {
            state.loading = action.payload
            if (action.payload === true) {
                state.movieInfo = {}
                state.personInfo = {}
            }
        },
        setPhoneRegion: (
            state,
            action: PayloadAction<string>) => {
            state.phoneRegion = action.payload
        },
        resetPersonDetail: (state) => {
            state.personInfo = {}
        },
        resetMovieDetail: (state) => {
            state.movieInfo = {}
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
        resetDistricts: (state) => {
            state.districts = []
        },
        resetWards: (state) => {
            state.wards = []
        },

        // update only city and district of address
        updateLocation: (
            state,
            action: PayloadAction<{
                province: string,
                district: string,
                latitude: number,
                longitude: number
            }>) => {
            state.local = {
                ...state.local,
                province: action.payload.province || null,
                district: action.payload.district || null,
                latitude: action.payload.latitude,
                longitude: action.payload.longitude,
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
            .addCase(fetchAllProvince.fulfilled, (
                state,
                action) => {
                state.fetching = false
                state.provinces = action.payload
            })
            .addCase(fetchAllProvince.rejected, (
                state,
                _) => {
                state.fetching = false
            })
            .addCase(fetchAllProvince.pending, (
                state,
                _) => {
                state.fetching = true
            }
            )
            .addCase(fetchDistricts.pending, (state, _) => {
                state.fetching = true
            })
            .addCase(
                fetchDistricts.fulfilled,
                (state, action) => {
                    state.districts = action.payload
                    state.fetching = false
                })
            .addCase(fetchWards.pending, (state, _) => {
                state.fetching = true
            })
            .addCase(
                fetchWards.fulfilled,
                (state, action) => {
                    state.wards = action.payload
                    state.fetching = false
                })
    }
})

export const selectPublic = (state: { public: PublicStates }) => state.public

export const {
    updateStatus,
    setLoading,
    setPhoneRegion,
    resetPersonDetail,
    resetMovieDetail,
    updateLongList,
    resetDistricts,
    resetWards,
    updateLocation } = publicSlice.actions
export default publicSlice.reducer