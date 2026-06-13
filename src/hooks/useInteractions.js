import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import {
  upsertWatchHistory as upsertWH, setWatched,
  setReaction as setRxn, addToWatchlist as addWL,
  removeFromWatchlist as removeWL, setRating as setRtg,
} from '../store/interactionsSlice'
import * as fs from '../services/firestoreService'
import { addToast } from '../store/uiSlice'

export const useInteractions = () => {
  const dispatch = useDispatch()
  const { watchHistory, likedMovies, watchlist, ratings } = useSelector(s => s.interactions)
  const user = useSelector(s => s.auth.user)

  const moviePayload = (movie) => ({
    movieId: movie.id || movie.movieId,
    title: movie.title,
    posterPath: movie.poster_path || movie.posterPath || null,
    genreIds: movie.genre_ids || movie.genreIds || [],
    lastViewedAt: Date.now(),
  })

  // ── Watch history ────────────────────────────────────────────────────────────
  const recordView = useCallback(async (movie) => {
    if (!user) return
    const payload = moviePayload(movie)
    dispatch(upsertWH(payload))
    try { await fs.upsertWatchHistory(user.uid, payload) } catch (_) {}
  }, [user, dispatch])

  const markWatched = useCallback(async (movie) => {
    if (!user) return
    const movieId = movie.id || movie.movieId
    dispatch(setWatched({ movieId }))
    try {
      await fs.markAsWatched(user.uid, movieId)
      dispatch(addToast({ type: 'success', message: `"${movie.title}" marked as watched! ✅` }))
    } catch (_) {
      dispatch(addToast({ type: 'error', message: 'Failed to mark as watched' }))
    }
  }, [user, dispatch])

  // ── Like / Dislike ───────────────────────────────────────────────────────────
  const toggleReaction = useCallback(async (movie, reaction) => {
    if (!user) return
    const movieId = movie.id || movie.movieId
    const current = likedMovies.find(m => m.movieId === movieId)
    const newReaction = current?.reaction === reaction ? null : reaction
    const payload = { ...moviePayload(movie), reaction: newReaction }
    dispatch(setRxn(payload))
    try { await fs.setReaction(user.uid, { ...moviePayload(movie) }, newReaction) } catch (_) {}
  }, [user, dispatch, likedMovies])

  // ── Watchlist ────────────────────────────────────────────────────────────────
  const toggleWatchlist = useCallback(async (movie) => {
    if (!user) return
    const movieId = movie.id || movie.movieId
    const inList = watchlist.find(m => m.movieId === movieId)
    if (inList) {
      dispatch(removeWL(movieId))
      try { await fs.removeFromWatchlist(user.uid, movieId) } catch (_) {}
      dispatch(addToast({ type: 'info', message: 'Removed from My List' }))
    } else {
      const payload = moviePayload(movie)
      dispatch(addWL(payload))
      try { await fs.addToWatchlist(user.uid, payload) } catch (_) {}
      dispatch(addToast({ type: 'success', message: 'Added to My List ✨' }))
    }
  }, [user, dispatch, watchlist])

  // ── Rating ──────────────────────────────────────────────────────────────────
  const rateMovie = useCallback(async (movie, rating) => {
    if (!user) return
    const payload = { ...moviePayload(movie), rating }
    dispatch(setRtg(payload))
    try { await fs.setRating(user.uid, moviePayload(movie), rating) } catch (_) {}
  }, [user, dispatch])

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const getReaction = (movieId) => likedMovies.find(m => m.movieId === movieId)?.reaction || null
  const inWatchlist = (movieId) => !!watchlist.find(m => m.movieId === movieId)
  const getRating = (movieId) => ratings.find(m => m.movieId === movieId)?.rating || 0
  const isWatched = (movieId) => !!watchHistory.find(m => m.movieId === movieId && m.completed)
  const continueWatching = watchHistory.filter(m => !m.completed).slice(0, 20)

  return {
    watchHistory, likedMovies, watchlist, ratings,
    recordView, markWatched, toggleReaction, toggleWatchlist, rateMovie,
    getReaction, inWatchlist, getRating, isWatched, continueWatching,
  }
}
