import { configureStore } from '@reduxjs/toolkit'
import paymentSlice from './paymentSlice'
import publicSlice from './publicSlice'
import privateSlice from './privateSlice'

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    }),
  reducer: {
    payment: paymentSlice,
    public: publicSlice,
    private: privateSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch