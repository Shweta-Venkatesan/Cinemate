import { createSlice } from '@reduxjs/toolkit'

const interactionsSlice = createSlice({
  name: 'interactions',
  initialState: {
    watchHistory: [],   // [{ movieId, title, posterPath, genreIds, completed, lastViewedAt, ... }]
    likedMovies: [],    // [{ movieId, reaction, ... }]
    watchlist: [],      // [{ movieId, addedAt, ... }]
    ratings: [],        // [{ movieId, rating, ... }]
    status: 'idle',     // idle | loading | loaded | error
  },
  reducers: {
    setInteractions: (state, action) => {
      const { watchHistory, likedMovies, watchlist, ratings } = action.payload
      state.watchHistory = watchHistory || []
      state.likedMovies = likedMovies || []
      state.watchlist = watchlist || []
      state.ratings = ratings || []
      state.status = 'loaded'
    },
    setStatus: (state, action) => {
      state.status = action.payload
    },
    // Optimistic updates
    upsertWatchHistory: (state, action) => {
      const movie = action.payload
      const idx = state.watchHistory.findIndex(m => m.movieId === movie.movieId)
      if (idx >= 0) {
        state.watchHistory[idx] = { ...state.watchHistory[idx], ...movie }
      } else {
        state.watchHistory.unshift(movie)
      }
    },
    setWatched: (state, action) => {
      const { movieId } = action.payload
      const idx = state.watchHistory.findIndex(m => m.movieId === movieId)
      if (idx >= 0) state.watchHistory[idx].completed = true
    },
    setReaction: (state, action) => {
      const { movieId, reaction } = action.payload
      const idx = state.likedMovies.findIndex(m => m.movieId === movieId)
      if (reaction === null) {
        if (idx >= 0) state.likedMovies.splice(idx, 1)
      } else if (idx >= 0) {
        state.likedMovies[idx].reaction = reaction
      } else {
        state.likedMovies.unshift(action.payload)
      }
    },
    addToWatchlist: (state, action) => {
      if (!state.watchlist.find(m => m.movieId === action.payload.movieId)) {
        state.watchlist.unshift(action.payload)
      }
    },
    removeFromWatchlist: (state, action) => {
      state.watchlist = state.watchlist.filter(m => m.movieId !== action.payload)
    },
    setRating: (state, action) => {
      const { movieId, rating } = action.payload
      const idx = state.ratings.findIndex(m => m.movieId === movieId)
      if (idx >= 0) {
        state.ratings[idx].rating = rating
      } else {
        state.ratings.unshift(action.payload)
      }
    },
    clearInteractions: (state) => {
      state.watchHistory = []
      state.likedMovies = []
      state.watchlist = []
      state.ratings = []
      state.status = 'idle'
    },
  },
})

export const {
  setInteractions, setStatus,
  upsertWatchHistory, setWatched,
  setReaction, addToWatchlist, removeFromWatchlist,
  setRating, clearInteractions,
} = interactionsSlice.actions

export default interactionsSlice.reducer
