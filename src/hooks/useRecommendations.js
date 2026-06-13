import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setRecommendations, setRecsStatus } from '../store/recommendationsSlice'
import { computeRecommendations } from '../services/recommendationEngine'
import { saveRecommendations, getUser, getSearchHistory } from '../services/firestoreService'

export const useRecommendations = () => {
  const dispatch = useDispatch()
  const user = useSelector(s => s.auth.user)
  const { items, basis, coldStart, generatedAt, status } = useSelector(s => s.recommendations)
  const { watchHistory, likedMovies, watchlist, ratings } = useSelector(s => s.interactions)

  const recompute = useCallback(async (genresOverride = null) => {
    dispatch(setRecsStatus('loading'))
    try {
      // Fetch favorite genres if not provided
      let favoriteGenres = genresOverride
      let searchHistory = []
      
      if (user) {
        if (!favoriteGenres) {
          const userData = await getUser(user.uid)
          favoriteGenres = userData?.favoriteGenres || []
        }
        searchHistory = await getSearchHistory(user.uid)
      }

      // Merge all interactions into a unified list
      const interactionMap = {}
      watchHistory.forEach(m => { interactionMap[m.movieId] = { ...interactionMap[m.movieId], ...m } })
      likedMovies.forEach(m => { interactionMap[m.movieId] = { ...interactionMap[m.movieId], ...m } })
      watchlist.forEach(m => { interactionMap[m.movieId] = { ...interactionMap[m.movieId], addedToWatchlist: true, ...m } })
      ratings.forEach(m => { interactionMap[m.movieId] = { ...interactionMap[m.movieId], ...m } })
      const interactions = Object.values(interactionMap)

      // AWAIT the new dynamic API-driven engine
      const result = await computeRecommendations(interactions, favoriteGenres, searchHistory)

      dispatch(setRecommendations({ ...result, generatedAt: Date.now() }))

      if (user) {
        await saveRecommendations(user.uid, {
          items: result.items,
          basis: result.basis,
          coldStart: result.coldStart,
        })
      }
    } catch (err) {
      console.error('Recommendation error:', err)
      dispatch(setRecsStatus('error'))
    }
  }, [dispatch, user, watchHistory, likedMovies, watchlist, ratings])

  // Should we recompute? (stale after 24h or never computed)
  const isStale = !generatedAt || (Date.now() - generatedAt) > 86400000

  return { items, basis, coldStart, status, isStale, recompute }
}
