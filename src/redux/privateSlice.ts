import { UserInfo } from "@/constants/types/UserType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserInfo, updateAvatar, updateProfile } from "./privateAsyncActions";

interface PrivateStates {
    //undefined: initState state
    //null: user not logged in
    userInfo: UserInfo | null | undefined
}

const initialState: PrivateStates = {
    userInfo: undefined
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

    }
})

export const {
    updateEmailVerify,
    clearUser
} = privateSlice.actions
export default privateSlice.reducer