import { getByGenre, getMovieRecommendations, searchByKeyword } from './tmdbService'

/**
 * Dynamic API-Driven Recommendation Engine
 * Analyzes interactions in real-time and queries TMDB directly.
 */
export async function computeRecommendations(interactions, favoriteGenres = [], searchHistory = []) {
  try {
    let topGenres = favoriteGenres
    let seedMovieIds = []
    
    // 1. Analyze interactions to find implicit taste
    if (interactions && interactions.length > 0) {
      const genreCounts = {}
      const movieScores = []
      
      interactions.forEach(i => {
        let weight = 0
        if (i.reaction === 'like') weight += 2
        if (i.reaction === 'dislike') weight -= 2
        if (i.rating) weight += (i.rating - 3)
        if (i.completed) weight += 1
        
        if (weight > 0) {
          movieScores.push({ id: i.movieId, weight, date: i.lastViewedAt?.toMillis?.() || Date.now() })
          if (i.genreIds) {
            i.genreIds.forEach(g => {
              genreCounts[g] = (genreCounts[g] || 0) + weight
            })
          }
        }
      })
      
      const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])
      if (sortedGenres.length > 0) {
        topGenres = sortedGenres.slice(0, 2).map(([id]) => Number(id))
      }
      
      seedMovieIds = movieScores
        .sort((a, b) => b.weight - a.weight || b.date - a.date)
        .slice(0, 2)
        .map(m => m.id)
    }

    // 2. Build API Promises
    const promises = []
    
    // Fetch by Top Genres (OR combined)
    if (topGenres && topGenres.length > 0) {
      promises.push(
        getByGenre(topGenres.join(',')).then(d => d.results.map(m => ({ ...m, reason: 'genre' })))
      )
    } else if (favoriteGenres && favoriteGenres.length > 0) {
      promises.push(
        getByGenre(favoriteGenres.join(',')).then(d => d.results.map(m => ({ ...m, reason: 'genre' })))
      )
    }

    // Fetch from Seed Movies
    seedMovieIds.forEach(id => {
      promises.push(
        getMovieRecommendations(id).then(d => d.results.map(m => ({ ...m, reason: 'similar' })))
      )
    })

    // Fetch from recent search
    if (searchHistory && searchHistory.length > 0) {
      const recentSearch = searchHistory[0].query
      promises.push(
        searchByKeyword(recentSearch).catch(() => []) // if keyword search fails, ignore
      )
    }

    // 3. Execute all parallel requests
    const resultsArray = await Promise.allSettled(promises)
    
    // 4. Merge and Deduplicate
    const seen = new Set(
      (interactions || [])
        .filter(i => i.completed || i.reaction === 'dislike')
        .map(i => i.movieId)
    )
    const finalItems = []
    
    resultsArray.forEach(res => {
      if (res.status === 'fulfilled' && res.value) {
        res.value.forEach(movie => {
          // Filter out movies without posters and movies the user already watched/disliked
          if (!seen.has(movie.id) && movie.poster_path) {
            seen.add(movie.id)
            finalItems.push(movie)
          }
        })
      }
    })

    // Shuffle final results for serendipity, then take top 24
    const shuffled = finalItems.sort(() => 0.5 - Math.random()).slice(0, 24)

    return {
      items: shuffled,
      basis: { topGenres, seedMovieIds },
      coldStart: !interactions || interactions.length === 0
    }
  } catch (error) {
    console.error("Dynamic Engine Error:", error)
    return { items: [], basis: { topGenres: [], seedMovieIds: [] }, coldStart: true }
  }
}
