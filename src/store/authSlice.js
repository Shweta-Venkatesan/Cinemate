import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    authLoading: true,
    authError: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.authLoading = false
      state.authError = null
    },
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload
    },
    setAuthError: (state, action) => {
      state.authError = action.payload
      state.authLoading = false
    },
    clearAuth: (state) => {
      state.user = null
      state.authLoading = false
      state.authError = null
    },
  },
})

export const { setUser, setAuthLoading, setAuthError, clearAuth } = authSlice.actions
export default authSlice.reducer
