import { configureStore } from '@reduxjs/toolkit'
import publicSlice from './publicSlice'
import privateSlice from './privateSlice'
import adminSlice from './adminSlice'

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    }),
  reducer: {
    public: publicSlice,
    private: privateSlice,
    admin: adminSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch