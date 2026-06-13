import { createSlice } from '@reduxjs/toolkit'

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState: {
    items: [],
    basis: { topGenres: [], seedMovieIds: [] },
    generatedAt: null,
    coldStart: true,
    status: 'idle',
  },
  reducers: {
    setRecommendations: (state, action) => {
      const { items, basis, coldStart, generatedAt } = action.payload
      state.items = items || []
      state.basis = basis || { topGenres: [], seedMovieIds: [] }
      state.coldStart = coldStart ?? true
      state.generatedAt = generatedAt || Date.now()
      state.status = 'loaded'
    },
    setRecsStatus: (state, action) => {
      state.status = action.payload
    },
    clearRecommendations: (state) => {
      state.items = []
      state.basis = { topGenres: [], seedMovieIds: [] }
      state.generatedAt = null
      state.coldStart = true
      state.status = 'idle'
    },
  },
})

export const { setRecommendations, setRecsStatus, clearRecommendations } = recommendationsSlice.actions
export default recommendationsSlice.reducer
