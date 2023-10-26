// dependencies
import { configureStore } from '@reduxjs/toolkit'

// slice
import loaderSlice from './feature/loaderSlice'

export const store = configureStore({ reducer: { loader: loaderSlice } })

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch