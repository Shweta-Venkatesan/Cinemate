import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import interactionsReducer from './interactionsSlice'
import recommendationsReducer from './recommendationsSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    interactions: interactionsReducer,
    recommendations: recommendationsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})
